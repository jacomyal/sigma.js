/**
 * Sigma.js Node Image Layer
 * =========================
 *
 * Fragment layer for rendering images inside nodes.
 * Works with any SDF shape from the node program system.
 *
 * Supports lifecycle management for automatic texture handling when used
 * with createNodeProgram().
 *
 * @module
 */
import {
  AttributeSpecification,
  FragmentLayer,
  LayerLifecycleContext,
  LayerLifecycleHooks,
  UniformSpecification,
  numberToGLSLFloat,
} from "sigma/rendering";

import { Atlas, DEFAULT_TEXTURE_MANAGER_OPTIONS, TextureManager } from "./texture";
import { DEFAULT_LAYER_IMAGE_OPTIONS, LayerImageOptions, ResolvedSchemaOptions } from "./types";

/**
 * Computes a deterministic texture unit offset based on layer name.
 * Allows multiple image layers in the same program to use different
 * texture units without conflicting with each other or sigma's internal textures.
 *
 * Layout (WebGL2 guarantees at least 32 texture units):
 * - Units 0-5: Reserved for sigma (node data, edge data, layer attributes)
 * - Units 6-11: Default "image" layer (6 textures max)
 * - Units 12-17: Slot 1
 * - Units 18-23: Slot 2
 * - Units 24-29: Slot 3
 */
function getTextureUnitOffset(name: string): number {
  const SIGMA_RESERVED_UNITS = 6;
  const UNITS_PER_LAYER = 6; // 6 textures per layer allows 4 slots

  // Default "image" layer gets the first slot after reserved units
  if (name === "image") return SIGMA_RESERVED_UNITS;

  // Hash name to deterministic slot (1, 2, or 3)
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
  }
  const slot = 1 + (Math.abs(hash) % 3);
  return SIGMA_RESERVED_UNITS + slot * UNITS_PER_LAYER;
}

/**
 * Generates the GLSL code for the image layer function.
 * Uses the global `context` struct for context (sdf, uv, etc.).
 *
 * Note: The u_atlas uniform is declared directly in the GLSL code because
 * the shader generator doesn't support sampler2D array uniforms properly.
 */
function generateImageGLSL(options: ResolvedSchemaOptions, texturesCount: number): string {
  const { name, drawingMode, padding } = options;
  const paddingRatio = numberToGLSLFloat(1.0 + 2.0 * padding);
  const effectiveTexturesCount = Math.max(1, texturesCount);

  // Use layer name for unique identifiers
  const uniformName = `u_atlas_${name}`;
  const functionName = `layer_${name}`;
  const textureVaryingName = `v_texture_${name}`;
  const indexVaryingName = `v_textureIndex_${name}`;
  const colorVaryingName = `v_color_${name}`;

  // Generate texture sampling code
  const textureSampling = [...new Array(effectiveTexturesCount)].map(
    (_, i) =>
      `if (index == ${i}) texel = texture(${uniformName}[${i}], (${textureVaryingName}.xy + coordinateInTexture * ${textureVaryingName}.zw), -1.0);`,
  ).join(`
    else `);

  const fallbackSampling = `else {
      texel = texture(${uniformName}[0], (${textureVaryingName}.xy + coordinateInTexture * ${textureVaryingName}.zw), -1.0);
      noTextureFound = true;
    }`;

  // Build function signature - add color parameter only for "color" mode
  const functionParams =
    drawingMode === "color"
      ? `vec4 ${textureVaryingName}, float ${indexVaryingName}, vec4 ${colorVaryingName}`
      : `vec4 ${textureVaryingName}, float ${indexVaryingName}`;

  // language=GLSL
  const glsl = /*glsl*/ `
// Texture atlas uniform - declared here because generator doesn't support sampler2D arrays
uniform sampler2D ${uniformName}[${effectiveTexturesCount}];

vec4 ${functionName}(${functionParams}) {
  const float bias = 255.0 / 254.0;
  const float paddingRatio = ${paddingRatio};

  vec4 color = vec4(0.0);

  // Calculate coordinate within the texture
  // The UV is in [-1, 1] range, convert to [0, 1] for texture sampling
  // Note: Camera rotation is handled at the program level (vertex shader)
  vec2 coordinateInTexture = context.uv * vec2(paddingRatio, -paddingRatio) * 0.5 + vec2(0.5, 0.5);
  int index = int(${indexVaryingName} + 0.5); // +0.5 to avoid rounding errors

  bool noTextureFound = false;
  vec4 texel = vec4(0.0);

  // No image to display - return transparent
  if (${textureVaryingName}.w <= 0.0) {
    // Return transparent when no image
  }
  // Image loaded into the texture
  else {
    ${textureSampling}
    ${fallbackSampling}

    if (!noTextureFound) {
      ${
        drawingMode === "color"
          ? `// Colorize all visible image pixels with the specified color attribute
      color = mix(vec4(0.0), ${colorVaryingName}, texel.a);`
          : `// Image mode: render image pixels as-is
      color = texel;`
      }

      // Erase pixels "in the padding"
      // context.uv is in [-1, 1], so we check against 1.0 / paddingRatio
      float maxUV = 1.0 / paddingRatio;
      if (abs(context.uv.x) > maxUV || abs(context.uv.y) > maxUV) {
        color = vec4(0.0);
      }
    }
  }

  color.a *= bias;
  return color;
}
`;

  return glsl;
}

/**
 * Creates the static layer definition (uniforms, attributes, glsl).
 */
function createLayerDefinition(
  options: ResolvedSchemaOptions,
  texturesCount: number,
): Omit<FragmentLayer, "lifecycle"> {
  const { name, drawingMode, colorAttribute } = options;
  const { FLOAT, UNSIGNED_BYTE } = WebGL2RenderingContext;

  // Ensure minimum of 1 texture
  const effectiveTexturesCount = Math.max(1, texturesCount);

  // Uniforms for the image layer
  // Note: We don't declare u_atlas here as it requires special handling
  // (array syntax that the generator doesn't support). The lifecycle
  // handles this uniform manually.
  const uniforms: UniformSpecification[] = [];

  // Attributes for the image layer - use unique names based on layer name
  const attributes: AttributeSpecification[] = [
    // Texture coordinates in atlas (x, y, width, height)
    {
      name: `texture_${name}`,
      size: 4 as const,
      type: FLOAT,
      source: "__texture__", // Special marker - handled by lifecycle
    },
    // Texture atlas index
    {
      name: `textureIndex_${name}`,
      size: 1 as const,
      type: FLOAT,
      source: "__textureIndex__", // Special marker - handled by lifecycle
    },
  ];

  // Add color attribute only for "color" drawing mode
  if (drawingMode === "color") {
    attributes.push({
      name: `color_${name}`,
      size: 4 as const,
      type: UNSIGNED_BYTE,
      normalized: true,
      source: colorAttribute,
    });
  }

  return {
    name,
    uniforms,
    attributes,
    glsl: generateImageGLSL(options, effectiveTexturesCount),
  };
}

/**
 * Creates an image layer that renders images inside nodes.
 *
 * This layer includes lifecycle management for automatic texture handling.
 * When used with createNodeProgram(), the layer will:
 * - Create/use a TextureManager to load and manage images
 * - Automatically bind textures before rendering
 * - Regenerate shaders when texture count changes
 * - Trigger re-renders when images finish loading
 *
 * @param inputOptions - Image layer configuration options
 * @returns FragmentLayer definition with lifecycle
 *
 * @example
 * ```typescript
 * // Simple usage - TextureManager created automatically
 * const Program = createNodeProgram({
 *   shapes: [sdfCircle()],
 *   layers: [layerImage({ drawingMode: "image", padding: 0.1 })],
 * });
 *
 * // Shared TextureManager across multiple programs
 * const sharedTM = new TextureManager();
 * const Program1 = createNodeProgram({
 *   shapes: [sdfCircle()],
 *   layers: [layerImage({ textureManager: sharedTM })],
 * });
 * ```
 */
export function layerImage(inputOptions?: Partial<LayerImageOptions>): FragmentLayer {
  const options = {
    ...DEFAULT_LAYER_IMAGE_OPTIONS,
    ...(inputOptions || {}),
  };

  const { textureManager: providedTextureManager, textureManagerOptions, ...layerOptions } = options;
  // After merging with defaults, schema properties are guaranteed to be defined
  const resolvedLayerOptions = layerOptions as ResolvedSchemaOptions;

  // Initial texture count (will be updated dynamically)
  let currentTexturesCount = 1;

  // Create initial layer definition
  const initialDefinition = createLayerDefinition(resolvedLayerOptions, currentTexturesCount);

  // Create or use provided TextureManager (shared across all program instances using this layer)
  const textureManager =
    providedTextureManager ??
    new TextureManager({
      ...DEFAULT_TEXTURE_MANAGER_OPTIONS,
      ...textureManagerOptions,
    });

  return {
    ...initialDefinition,

    lifecycle: (context: LayerLifecycleContext): LayerLifecycleHooks => {
      const { gl, requestShaderRegeneration, requestRefresh } = context;

      // WebGL textures
      let textures: WebGLTexture[] = [];
      let textureImages: ImageData[] = [];
      let atlas: Atlas = {};

      // Get texture unit offset for this layer (prevents conflicts with other image layers)
      const textureUnitOffset = getTextureUnitOffset(resolvedLayerOptions.name);

      /**
       * Bind texture data to WebGL.
       * Uses the layer-specific texture unit offset to prevent conflicts
       * when multiple image layers are present.
       */
      const bindTextures = () => {
        // Ensure we have enough WebGL texture objects
        while (textures.length < textureImages.length) {
          const texture = gl.createTexture();
          if (texture) textures.push(texture);
        }

        // Upload texture data to layer-specific texture units
        for (let i = 0; i < textureImages.length; i++) {
          gl.activeTexture(gl.TEXTURE0 + textureUnitOffset + i);
          gl.bindTexture(gl.TEXTURE_2D, textures[i]);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureImages[i]);
          gl.generateMipmap(gl.TEXTURE_2D);
        }
      };

      /**
       * Handler for when new textures are available.
       */
      const onNewTexture = ({
        atlas: newAtlas,
        textures: newTextureImages,
      }: {
        atlas: Atlas;
        textures: ImageData[];
      }) => {
        const shouldUpgradeShaders = newTextureImages.length !== textureImages.length;

        atlas = newAtlas;
        textureImages = newTextureImages;

        if (shouldUpgradeShaders) {
          currentTexturesCount = newTextureImages.length || 1;
          requestShaderRegeneration();
        }

        bindTextures();
        requestRefresh();
      };

      return {
        init: () => {
          // Listen first, so a redraw triggered by the clamp reaches this layer
          textureManager.on(TextureManager.NEW_TEXTURE_EVENT, onNewTexture);
          textureManager.clampMaxTextureSize(gl.getParameter(gl.MAX_TEXTURE_SIZE));

          atlas = textureManager.getAtlas();
          textureImages = textureManager.getTextures();
          bindTextures();
        },

        beforeRender: () => {
          // Rebind textures before each render (using pre-computed offset)
          for (let i = 0; i < textureImages.length; i++) {
            gl.activeTexture(gl.TEXTURE0 + textureUnitOffset + i);
            gl.bindTexture(gl.TEXTURE_2D, textures[i]);
          }

          // Set texture atlas uniform (using layer-specific name and offset)
          const atlasLocation = context.getUniformLocation(`u_atlas_${resolvedLayerOptions.name}`);
          if (atlasLocation) {
            gl.uniform1iv(
              atlasLocation,
              [...new Array(textureImages.length || 1)].map((_, i) => textureUnitOffset + i),
            );
          }
        },

        regenerate: (): FragmentLayer => {
          // Return new layer definition with updated texture count
          // Don't include lifecycle - the factory preserves it from the original
          return createLayerDefinition(resolvedLayerOptions, currentTexturesCount);
        },

        getAttributeData: (data: Record<string, unknown>, attributeSource: string): number | number[] | null => {
          const imageSource = data[resolvedLayerOptions.imageAttribute] as string | undefined;

          if (attributeSource === "__texture__") {
            const imagePosition = imageSource ? atlas[imageSource] : undefined;
            if (imagePosition && typeof imagePosition.textureIndex === "number") {
              const { width, height } = textureImages[imagePosition.textureIndex];
              return [
                imagePosition.x / width,
                imagePosition.y / height,
                imagePosition.size / width,
                imagePosition.size / height,
              ];
            }
            return [0, 0, 0, 0];
          }

          if (attributeSource === "__textureIndex__") {
            // Register image if not already in atlas
            if (typeof imageSource === "string" && !atlas[imageSource]) {
              textureManager.registerImage(imageSource);
            }
            const imagePosition = imageSource ? atlas[imageSource] : undefined;
            return imagePosition?.textureIndex ?? 0;
          }

          return null;
        },

        kill: () => {
          // Remove listener
          textureManager.off(TextureManager.NEW_TEXTURE_EVENT, onNewTexture);

          // Delete WebGL textures
          for (const texture of textures) {
            gl.deleteTexture(texture);
          }
          textures = [];
        },
      };
    },
  };
}
