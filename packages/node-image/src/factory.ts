import { Attributes } from "graphology-types";
import Sigma from "sigma";
import {
  NodeHoverDrawingFunction,
  NodeLabelDrawingFunction,
  NodeProgram,
  NodeProgramType,
  ProgramInfo,
} from "sigma/rendering";
import { NodeDisplayData, RenderParams } from "sigma/types";
import { floatColor } from "sigma/utils";

import getFragmentShader from "./shader-frag";
import VERTEX_SHADER_SOURCE from "./shader-vert";
import { Atlas, DEFAULT_TEXTURE_MANAGER_OPTIONS, TextureManager, TextureManagerOptions } from "./texture";

const { UNSIGNED_BYTE, FLOAT } = WebGLRenderingContext;

interface CreateNodeImageProgramOptions<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> extends TextureManagerOptions {
  // - If "background", color will be used to color full node behind the image.
  // - If "color", color will be used to color image pixels (for pictograms)
  drawingMode: "background" | "color";
  // If true, the images are always cropped to the circle
  keepWithinCircle: boolean;
  // Allows overriding drawLabel and drawHover returned class methods.
  drawLabel: NodeLabelDrawingFunction<N, E, G> | undefined;
  drawHover: NodeHoverDrawingFunction<N, E, G> | undefined;
  // The padding should be expressed as a [0, 1] percentage.
  // A padding of 0.05 will always be 5% of the diameter of a node.
  padding: number;
  // Allows using a different color attribute name.
  colorAttribute: string;
  // Allows using a different image attribute name.
  imageAttribute: string;
}

const DEFAULT_CREATE_NODE_IMAGE_OPTIONS: CreateNodeImageProgramOptions<Attributes, Attributes, Attributes> = {
  ...DEFAULT_TEXTURE_MANAGER_OPTIONS,
  drawingMode: "background",
  keepWithinCircle: true,
  drawLabel: undefined,
  drawHover: undefined,
  padding: 0,
  colorAttribute: "color",
  imageAttribute: "image",
};

const UNIFORMS = [
  "u_sizeRatio",
  "u_correctionRatio",
  "u_cameraAngle",
  "u_percentagePadding",
  "u_matrix",
  "u_colorizeImages",
  "u_keepWithinCircle",
  "u_atlas",
] as const;

/**
 * To share the texture between the program instances of the graph and the
 * hovered nodes (to prevent some flickering, mostly), this program must be
 * "built" for each sigma instance:
 */
export default function createNodeImageProgram<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
>(options?: Partial<CreateNodeImageProgramOptions<N, E, G>>): NodeProgramType<N, E, G> {
  // Compute effective MAX_TEXTURE_SIZE from the current WebGL context:
  const gl = document.createElement("canvas").getContext("webgl") as WebGLRenderingContext;
  const defaultMaxTextureSize = Math.min(
    gl.getParameter(gl.MAX_TEXTURE_SIZE),
    DEFAULT_TEXTURE_MANAGER_OPTIONS.maxTextureSize,
  );
  (gl.canvas as HTMLCanvasElement).remove();

  const {
    drawHover,
    drawLabel,
    drawingMode,
    keepWithinCircle,
    padding,
    colorAttribute,
    imageAttribute,
    ...textureManagerOptions
  }: CreateNodeImageProgramOptions<N, E, G> = {
    ...(DEFAULT_CREATE_NODE_IMAGE_OPTIONS as CreateNodeImageProgramOptions<N, E, G>),
    ...{ maxTextureSize: defaultMaxTextureSize },
    ...(options || {}),
  };

  /**
   * This texture manager is shared between all instances of this exact class,
   * returned by this call to createNodeProgramImage. This means that
   * remounting the sigma instance will not reload the images and regenerate
   * the texture.
   */
  const textureManager = new TextureManager(textureManagerOptions);

  return class NodeImageProgram extends NodeProgram<(typeof UNIFORMS)[number], N, E, G> {
    static readonly ANGLE_1 = 0;
    static readonly ANGLE_2 = (2 * Math.PI) / 3;
    static readonly ANGLE_3 = (4 * Math.PI) / 3;
    drawLabel = drawLabel;
    drawHover = drawHover;

    static textureManager = textureManager;

    getDefinition() {
      return {
        VERTICES: 3,
        VERTEX_SHADER_SOURCE,
        FRAGMENT_SHADER_SOURCE: getFragmentShader({ texturesCount: textureManager.getTextures().length }),
        METHOD: WebGLRenderingContext.TRIANGLES,
        UNIFORMS,
        ATTRIBUTES: [
          { name: "a_position", size: 2, type: FLOAT },
          { name: "a_size", size: 1, type: FLOAT },
          { name: "a_color", size: 4, type: UNSIGNED_BYTE, normalized: true },
          { name: "a_id", size: 4, type: UNSIGNED_BYTE, normalized: true },
          { name: "a_texture", size: 4, type: FLOAT },
          { name: "a_textureIndex", size: 1, type: FLOAT },
        ],
        CONSTANT_ATTRIBUTES: [{ name: "a_angle", size: 1, type: FLOAT }],
        CONSTANT_DATA: [[NodeImageProgram.ANGLE_1], [NodeImageProgram.ANGLE_2], [NodeImageProgram.ANGLE_3]],
      };
    }

    atlas: Atlas;
    textures: WebGLTexture[];
    textureImages: ImageData[];
    latestRenderParams?: RenderParams;
    textureManagerCallback: null | ((newAtlasData: { atlas: Atlas; textures: ImageData[] }) => void) = null;

    constructor(gl: WebGLRenderingContext, pickingBuffer: WebGLFramebuffer | null, renderer: Sigma<N, E, G>) {
      super(gl, pickingBuffer, renderer);

      this.textureManagerCallback = ({ atlas, textures }: { atlas: Atlas; textures: ImageData[] }) => {
        const shouldUpgradeShaders = textures.length !== this.textures.length;
        this.atlas = atlas;
        this.textureImages = textures;

        if (shouldUpgradeShaders) this.upgradeShaders();
        this.bindTextures();

        if (this.latestRenderParams) this.render(this.latestRenderParams);

        if (this.renderer && this.renderer.refresh) this.renderer.refresh();
      };
      textureManager.on(TextureManager.NEW_TEXTURE_EVENT, this.textureManagerCallback);

      this.atlas = textureManager.getAtlas();
      this.textureImages = textureManager.getTextures();
      this.textures = this.textureImages.map(() => gl.createTexture() as WebGLTexture);
      this.bindTextures();
    }

    private upgradeShaders() {
      const def = this.getDefinition();
      const { program, buffer, vertexShader, fragmentShader, gl } = this.normalProgram;
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      this.normalProgram = this.getProgramInfo(
        "normal",
        gl,
        def.VERTEX_SHADER_SOURCE,
        def.FRAGMENT_SHADER_SOURCE,
        null,
      );
    }

    kill() {
      const gl = this.normalProgram?.gl;
      if (gl) {
        for (let i = 0; i < this.textures.length; i++) {
          gl.deleteTexture(this.textures[i]);
        }
      }

      if (this.textureManagerCallback) {
        textureManager.off(TextureManager.NEW_TEXTURE_EVENT, this.textureManagerCallback);
        this.textureManagerCallback = null;
      }

      super.kill();
    }

    protected bindTextures() {
      const gl = this.normalProgram.gl;

      for (let i = 0; i < this.textureImages.length; i++) {
        if (i >= this.textures.length) {
          const texture = gl.createTexture();
          if (texture) this.textures.push(texture);
        }

        gl.activeTexture(gl.TEXTURE0 + i);
        gl.bindTexture(gl.TEXTURE_2D, this.textures[i]);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.textureImages[i]);
        gl.generateMipmap(gl.TEXTURE_2D);
      }
    }

    protected renderProgram(params: RenderParams, programInfo: ProgramInfo) {
      if (!programInfo.isPicking) {
        // Rebind texture (since it's been just unbound by picking):
        const gl = programInfo.gl;

        for (let i = 0; i < this.textureImages.length; i++) {
          gl.activeTexture(gl.TEXTURE0 + i);
          gl.bindTexture(gl.TEXTURE_2D, this.textures[i]);
        }
      }
      super.renderProgram(params, programInfo);
    }

    processVisibleItem(nodeIndex: number, startIndex: number, data: NodeDisplayData & { image?: string }): void {
      const array = this.array;
      const color = floatColor(data[colorAttribute as "color"]);

      const imageSource = data[imageAttribute as "image"];
      const imagePosition = imageSource ? this.atlas[imageSource] : undefined;

      if (typeof imageSource === "string" && !imagePosition) textureManager.registerImage(imageSource);

      array[startIndex++] = data.x;
      array[startIndex++] = data.y;
      array[startIndex++] = data.size;
      array[startIndex++] = color;
      array[startIndex++] = nodeIndex;

      // Reference texture:
      if (imagePosition && typeof imagePosition.textureIndex === "number") {
        const { width, height } = this.textureImages[imagePosition.textureIndex];
        array[startIndex++] = imagePosition.x / width;
        array[startIndex++] = imagePosition.y / height;
        array[startIndex++] = imagePosition.size / width;
        array[startIndex++] = imagePosition.size / height;
        array[startIndex++] = imagePosition.textureIndex;
      } else {
        array[startIndex++] = 0;
        array[startIndex++] = 0;
        array[startIndex++] = 0;
        array[startIndex++] = 0;
        array[startIndex++] = 0;
      }
    }

    setUniforms(params: RenderParams, { gl, uniformLocations }: ProgramInfo): void {
      const {
        u_sizeRatio,
        u_correctionRatio,
        u_matrix,
        u_atlas,
        u_colorizeImages,
        u_keepWithinCircle,
        u_cameraAngle,
        u_percentagePadding,
      } = uniformLocations;
      this.latestRenderParams = params;

      gl.uniform1f(u_correctionRatio, params.correctionRatio);
      gl.uniform1f(u_sizeRatio, keepWithinCircle ? params.sizeRatio : params.sizeRatio / Math.SQRT2);
      gl.uniform1f(u_cameraAngle, params.cameraAngle);
      gl.uniform1f(u_percentagePadding, padding);
      gl.uniformMatrix3fv(u_matrix, false, params.matrix);
      gl.uniform1iv(
        u_atlas,
        [...new Array(this.textureImages.length)].map((_, i) => i),
      );
      gl.uniform1i(u_colorizeImages, drawingMode === "color" ? 1 : 0);
      gl.uniform1i(u_keepWithinCircle, keepWithinCircle ? 1 : 0);
    }
  };
}
