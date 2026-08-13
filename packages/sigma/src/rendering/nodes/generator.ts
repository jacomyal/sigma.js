/**
 * Sigma.js Shader Generator
 * ==========================
 *
 * Generates optimized GLSL shaders from SDF shapes and fragment layers.
 *
 * @module
 */
import { computeAttributeLayout, generateAttributeTextureFetch } from "../data-texture";
import { GLSL_READ_NODE_DATA, GLSL_READ_NODE_FLAGS } from "../glsl";
import { generateNodeShapeSelectorGLSL, getShapeGLSLForShapes } from "../shapes";
import { AttributeSpecification, FragmentLayer, SDFShape } from "./types";

export interface GeneratedShaders {
  vertexShader: string;
  fragmentShader: string;
  uniforms: string[];
  attributes: AttributeSpecification[];
}

export interface ShaderGenerationOptions {
  /**
   * Array of SDF shapes this program supports.
   * For single-shape programs, pass an array with one element.
   */
  shapes: SDFShape[];
  layers: FragmentLayer[];
  /**
   * Array mapping local shape index to global shape ID.
   * Required for multi-shape programs to convert global IDs from node data texture
   * to local indices for the queryNodeSDF switch statement.
   */
  shapeGlobalIds?: number[];
}

/**
 * Generates vertex shader for a quad with UV coordinates.
 * Always renders a single quad (4 vertices) per node using instanced rendering.
 *
 * @param shapes - Array of SDF shapes this program supports
 * @param layers - Array of fragment layers
 *
 * Whether a node's shape stays screen-upright or turns with the camera is a
 * per-node value (the `nodeRotation` flag in the node-data texture), read here.
 */
export function generateVertexShader(shapes: SDFShape[], layers: FragmentLayer[]): string {
  // Standard uniforms that are always declared (to avoid redefinition)
  const standardUniforms = new Set([
    "u_matrix",
    "u_sizeRatio",
    "u_correctionRatio",
    "u_cameraAngle",
    "u_pickingPadding",
    "u_nodeDataTexture",
    "u_layerAttributeTexture",
  ]);

  // Collect all uniforms from shapes and layers, excluding standard ones and with deduplication
  const seenUniforms = new Set<string>();
  const shapeUniforms = shapes
    .flatMap((shape) => shape.uniforms)
    .filter((u) => {
      if (standardUniforms.has(u.name) || seenUniforms.has(u.name)) return false;
      seenUniforms.add(u.name);
      return true;
    })
    .map((u) => `uniform ${u.type} ${u.name};`)
    .join("\n");
  const layerUniforms = layers
    .flatMap((layer) => layer.uniforms)
    .filter((u) => {
      if (standardUniforms.has(u.name) || seenUniforms.has(u.name)) return false;
      seenUniforms.add(u.name);
      return true;
    })
    .map((u) => `uniform ${u.type} ${u.name};`)
    .join("\n");

  // Collect all layer varyings as outputs (with deduplication)
  const seenVaryings = new Set<string>();
  const layerVaryings = layers
    .flatMap((layer) => layer.attributes)
    .filter((a) => {
      const name = a.name.replace(/^a_/, "");
      if (seenVaryings.has(name)) return false;
      seenVaryings.add(name);
      return true;
    })
    .map((a) => {
      const name = a.name.replace(/^a_/, "");
      const glslType = a.size === 1 ? "float" : `vec${a.size}`;
      return `out ${glslType} v_${name};`;
    })
    .join("\n");

  // Generate texture fetch code for layer attributes
  const { fetchCode, varyingAssignments } = generateAttributeTextureFetch(computeAttributeLayout(layers), {
    varPrefix: "layer",
    baseTexelExpr: "nodeIdx * u_layerAttributeTexelsPerNode",
    textureWidthUniform: "u_layerAttributeTextureWidth",
    textureSamplerUniform: "u_layerAttributeTexture",
  });

  // language=GLSL
  const glsl = /*glsl*/ `#version 300 es

// Standard node attributes (per instance) - minimal buffer usage
in float a_nodeIndex;  // Index into node data texture AND layer attribute texture
in vec4 a_id;          // Node ID for picking

// Constant attributes (per vertex, same for all instances)
in vec2 a_quadCorner;  // (-1,-1), (1,-1), (1,1), (-1,1) for quad corners

// Standard uniforms
uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_correctionRatio;
uniform float u_cameraAngle;
#ifdef PICKING_MODE
uniform float u_pickingPadding;
#endif
uniform sampler2D u_nodeDataTexture;
uniform int u_nodeDataTextureWidth;

// Layer attribute texture uniforms
uniform sampler2D u_layerAttributeTexture;
uniform int u_layerAttributeTextureWidth;
uniform int u_layerAttributeTexelsPerNode;

${shapeUniforms}
${layerUniforms}

// Standard varyings
out vec2 v_uv;                    // Normalized coordinates [-1, 1]
out vec4 v_id;
out float v_antialiasingWidth;    // Width for antialiasing in UV space
out float v_pixelSize;            // Node size in pixels (for pixel-mode borders)
out float v_pixelToUV;            // Conversion factor: multiply by this to convert screen pixels to UV units
out float v_shapeId;              // Shape ID for multi-shape programs

// Layer varyings
${layerVaryings}

// Node-data fetch helpers (geometry texel + rotation-flags texel)
${GLSL_READ_NODE_DATA}
${GLSL_READ_NODE_FLAGS}

void main() {
  // Fetch node geometry: vec4(x, y, size, shapeId).
  int nodeIdx = int(a_nodeIndex);

  // Hidden nodes are flagged with a negative row by NodeProgram.process(). Push
  // the whole quad outside the clip volume: every vertex lands at the same
  // out-of-range position, so the primitive is fully clipped and rasterizes
  // nothing — neither to the frame buffer nor to the picking buffer.
  if (nodeIdx < 0) {
    gl_Position = vec4(2.0, 0.0, 0.0, 1.0);
    v_id = vec4(0.0);
    return;
  }

  vec4 nodeData = readNodeData(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx);
  vec2 a_position = nodeData.xy;
  float a_size = nodeData.z;
  v_shapeId = nodeData.w;  // Pass shape ID to fragment shader

  // Per-node rotation alignment: 0 = viewport (screen-upright), 1 = graph.
  float nodeRotation = readNodeFlags(u_nodeDataTexture, u_nodeDataTextureWidth, nodeIdx).r;

${fetchCode}

  // Calculate the actual size in pixels
  float size = a_size * u_correctionRatio / u_sizeRatio * 2.0;

  // In PICKING_MODE, inflate the quad by nodePickingPadding pixels on each side
  #ifdef PICKING_MODE
    float paddedSize = size + u_pickingPadding * u_correctionRatio;
    vec2 offset = a_quadCorner * paddedSize;
  #else
    vec2 offset = a_quadCorner * size;
  #endif
  // Counter-rotate the quad offset so viewport-aligned nodes stay upright as the
  // camera turns. Graph-aligned nodes (nodeRotation=1) skip it and turn with the
  // camera. The angle scales by (1 - nodeRotation) so both fall out of one path.
  {
    float ca = u_cameraAngle * (1.0 - nodeRotation);
    float c = cos(ca);
    float s = sin(ca);
    offset = mat2(c, s, -s, c) * offset;
  }
  vec2 position = a_position + offset;

  gl_Position = vec4(
    (u_matrix * vec3(position, 1)).xy,
    0,
    1
  );

  // In PICKING_MODE, UV is scaled beyond [-1, 1] to match the inflated quad
  #ifdef PICKING_MODE
    v_uv = a_quadCorner * (paddedSize / size);
  #else
    v_uv = a_quadCorner;
  #endif

  // Pass ID to fragment shader
  v_id = a_id;

  // Pass pixel size for layers that need pixel-mode calculations
  // Multiply by 2 because 'size' is half-width (offset from center), not full diameter
  v_pixelSize = size * 2.0;

  // Conversion factor from screen pixels to UV units
  // Same derivation as v_antialiasingWidth which represents ~1 pixel in UV space
  // P pixels in UV space = P * u_correctionRatio / size
  v_pixelToUV = u_correctionRatio / size;

  // We use an antialiasing width of 1px (so v_pixelToUV)
  v_antialiasingWidth = v_pixelToUV;

  // Pass layer attributes to fragment shader (fetched from texture)
${varyingAssignments}
}
`;

  return glsl;
}

/**
 * Generates fragment shader that applies SDF shape and layers.
 *
 * @param shapes - Array of SDF shapes this program supports
 * @param layers - Array of fragment layers
 * @param shapeGlobalIds - Optional array mapping local shape index to global ID (for multi-shape programs)
 *
 * The node's shape rotation is applied by the vertex shader (quad geometry), so
 * the fragment SDF query (`queryNodeSDF`) is rotation-agnostic.
 */
export function generateFragmentShader(shapes: SDFShape[], layers: FragmentLayer[], shapeGlobalIds?: number[]): string {
  // Generate layer function calls with "over" compositing
  const layerCalls = layers
    .map((layer, index) => {
      const layerFunctionName = `layer_${layer.name}`;
      // Collect only layer-specific parameters (attributes + uniforms)
      const layerParams = [
        ...layer.attributes.map((a) => `v_${a.name.replace(/^a_/, "")}`),
        ...layer.uniforms.map((u) => u.name),
      ].join(", ");

      // Layer signature: vec4 layer_name(...layerParams) - context accessed via global ctx
      return `  // Layer ${index + 1}: ${layer.name}
  color = blendOver(color, ${layerFunctionName}(${layerParams}));`;
    })
    .join("\n\n");

  // Standard uniforms that are already declared in the fragment shader
  const standardFragmentUniforms = new Set(["u_correctionRatio"]);

  // Collect all uniforms from shapes and layers, with deduplication
  const seenUniforms = new Set<string>();
  const shapeUniforms = shapes
    .flatMap((shape) => shape.uniforms)
    .filter((u) => {
      if (standardFragmentUniforms.has(u.name) || seenUniforms.has(u.name)) return false;
      seenUniforms.add(u.name);
      return true;
    })
    .map((u) => `uniform ${u.type} ${u.name};`)
    .join("\n");
  const layerUniforms = layers
    .flatMap((layer) => layer.uniforms)
    .filter((u) => {
      if (standardFragmentUniforms.has(u.name) || seenUniforms.has(u.name)) return false;
      seenUniforms.add(u.name);
      return true;
    })
    .map((u) => `uniform ${u.type} ${u.name};`)
    .join("\n");

  // Collect all varyings from layers (with deduplication)
  const seenVaryings = new Set<string>();
  const layerVaryings = layers
    .flatMap((layer) => layer.attributes)
    .filter((a) => {
      const name = a.name.replace(/^a_/, "");
      if (seenVaryings.has(name)) return false;
      seenVaryings.add(name);
      return true;
    })
    .map((a) => {
      const name = a.name.replace(/^a_/, "");
      const glslType = a.size === 1 ? "float" : `vec${a.size}`;
      return `in ${glslType} v_${name};`;
    })
    .join("\n");

  // Get all shape SDF functions (deduplicated)
  const shapeGLSL = getShapeGLSLForShapes(shapes);

  // Generate queryNodeSDF() function for shape selection
  // Pass shapeGlobalIds for multi-shape programs to generate global→local conversion
  const shapeSelectorGLSL = generateNodeShapeSelectorGLSL(shapes, shapeGlobalIds);

  // language=GLSL
  const glsl = /*glsl*/ `#version 300 es
precision highp float;

// Standard varyings
in vec2 v_uv;
in vec4 v_id;
in float v_antialiasingWidth;
in float v_pixelSize;
in float v_pixelToUV;
in float v_shapeId;  // Shape ID for multi-shape programs

// Standard uniforms (needed for some layer calculations like pixel-mode borders)
uniform float u_correctionRatio;
#ifdef PICKING_MODE
uniform float u_pickingPadding;
#endif

// Shape uniforms
${shapeUniforms}

// Layer uniforms
${layerUniforms}

// Layer varyings
${layerVaryings}

// Fragment output (single target - picking handled via separate pass)
out vec4 fragColor;

// LayerContext struct - provides rendering context to all layers
struct LayerContext {
  float sdf;             // Signed distance from shape boundary (negative inside)
  vec2 uv;               // UV coordinates [-1, 1], center at (0,0)
  float shapeSize;       // Effective shape size (~diameter) in UV space (1.0 - aaWidth)
  float shapeHalfSize;   // Effective shape half size (~radius) in UV space
  float pixelSize;       // Node full size (~diameter) in screen pixels
  float aaWidth;         // Anti-aliasing width for smooth transitions
  float correctionRatio; // Scaling factor for consistent rendering across zoom levels
  float pixelToUV;       // Conversion factor: multiply screen pixels by this to get UV units
  float inradiusFactor;  // Ratio of inradius to circumradius (shape depth factor)
};

LayerContext context;  // Global instance, populated before layer calls

// Alpha "over" compositing for layer blending
vec4 blendOver(vec4 bg, vec4 fg) {
  float a = fg.a;
  return vec4(mix(bg.rgb, fg.rgb, a), bg.a + a * (1.0 - bg.a));
}

// SDF shape functions
${shapeGLSL}

// Shape selector function (sets context.sdf and context.inradiusFactor)
${shapeSelectorGLSL}

// Layer functions
${layers.map((layer) => layer.glsl).join("\n\n")}

void main() {
  // 1. Setup LayerContext (available to all layer functions)
  context.shapeSize = 1.0 - v_antialiasingWidth;
  context.shapeHalfSize = context.shapeSize * 0.5;
  context.pixelSize = v_pixelSize;
  context.uv = v_uv;
  context.aaWidth = v_antialiasingWidth;
  context.correctionRatio = u_correctionRatio;
  context.pixelToUV = v_pixelToUV;

  // Query shape SDF based on shapeId (sets context.sdf and context.inradiusFactor)
  queryNodeSDF(int(v_shapeId), v_uv, context.shapeSize);

  // 2. Early discard for pixels fully outside the shape (with AA margin)
  // In PICKING_MODE, allow extra fragments up to the picking padding distance
  #ifdef PICKING_MODE
    if (context.sdf > u_pickingPadding * v_pixelToUV + context.aaWidth) discard;
  #else
    if (context.sdf > context.aaWidth) discard;
  #endif

  // 3. Apply layers sequentially with "over" compositing
  vec4 color = vec4(0.0);

${layerCalls}

  #ifdef PICKING_MODE
    // Picking pass: output node ID for pixels within the picking area.
    if (context.sdf > u_pickingPadding * v_pixelToUV) discard;
    fragColor = v_id;
  #else
    // Visual pass: apply antialiasing at shape boundary
    // smoothstep provides smooth transition from opaque to transparent
    float alpha = smoothstep(context.aaWidth, -context.aaWidth, context.sdf);
    // Mix with transparent to fade both color AND alpha together (avoids bright halo)
    fragColor = mix(vec4(0.0), color, alpha);
  #endif
}
`;

  return glsl;
}

/**
 * Collects all uniforms from shapes and layers, with deduplication.
 */
export function collectUniforms(shapes: SDFShape[], layers: FragmentLayer[]): string[] {
  const uniformNames = new Set<string>();

  // Standard uniforms (always present)
  uniformNames.add("u_matrix");
  uniformNames.add("u_sizeRatio");
  uniformNames.add("u_correctionRatio");
  uniformNames.add("u_cameraAngle");
  uniformNames.add("u_pickingPadding");
  uniformNames.add("u_nodeDataTexture");
  uniformNames.add("u_nodeDataTextureWidth");

  // Layer attribute texture uniforms
  uniformNames.add("u_layerAttributeTexture");
  uniformNames.add("u_layerAttributeTextureWidth");
  uniformNames.add("u_layerAttributeTexelsPerNode");

  // Shape uniforms (from all shapes)
  shapes.forEach((shape) => {
    shape.uniforms.forEach((u) => uniformNames.add(u.name));
  });

  // Layer uniforms
  layers.forEach((layer) => {
    layer.uniforms.forEach((u) => uniformNames.add(u.name));
  });

  return Array.from(uniformNames);
}

/**
 * Collects all attributes for the buffer.
 * Note: Position, size, and layer attributes are fetched from textures,
 * so only nodeIndex and id are needed as per-instance buffer attributes.
 */
export function collectAttributes(_layers: FragmentLayer[]): AttributeSpecification[] {
  const { UNSIGNED_BYTE, FLOAT } = WebGL2RenderingContext;

  // Only nodeIndex and id remain in the buffer
  // - a_nodeIndex: index into both node data texture and layer attribute texture
  // - a_id: node ID for picking (must stay in buffer for immediate access)
  return [
    { name: "a_nodeIndex", size: 1, type: FLOAT },
    { name: "a_id", size: 4, type: UNSIGNED_BYTE, normalized: true },
  ];
}

/**
 * Main generator function that produces complete shader code and metadata.
 */
export function generateShaders(options: ShaderGenerationOptions): GeneratedShaders {
  const { shapes, layers, shapeGlobalIds } = options;

  return {
    vertexShader: generateVertexShader(shapes, layers),
    fragmentShader: generateFragmentShader(shapes, layers, shapeGlobalIds),
    uniforms: collectUniforms(shapes, layers),
    attributes: collectAttributes(layers),
  };
}
