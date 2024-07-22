import { Attributes } from "graphology-types";
import Sigma from "sigma";
import { ProgramInfo } from "sigma/rendering";
import { RenderParams } from "sigma/types";
import { colorToArray } from "sigma/utils";

import { WebGLLayerDefinition, WebGLLayerProgram, WebGLLayerProgramType } from "../webgl-layer-program";
import getFragmentShader from "./shader-frag";
import { ContoursOptions, DEFAULT_CONTOURS_OPTIONS } from "./types";

export * from "./types";
export { default as getContoursFragmentShader } from "./shader-frag";

export function createContoursProgram<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
>(nodes: string[], options?: Partial<ContoursOptions>): WebGLLayerProgramType<N, E, G> {
  const { levels, radius, zoomToRadiusRatioFunction, border, feather } = {
    ...DEFAULT_CONTOURS_OPTIONS,
    ...(options || {}),
  };

  return class ContoursProgramClass<
    N extends Attributes = Attributes,
    E extends Attributes = Attributes,
    G extends Attributes = Attributes,
  > extends WebGLLayerProgram<N, E, G> {
    nodesTexture: WebGLTexture;

    constructor(
      gl: WebGLRenderingContext | WebGL2RenderingContext,
      pickingBuffer: WebGLFramebuffer | null,
      renderer: Sigma<N, E, G>,
    ) {
      if (!(gl instanceof WebGL2RenderingContext)) throw new Error("createContoursProgram only works with WebGL2");
      super(gl, pickingBuffer, renderer);

      this.nodesTexture = gl.createTexture() as WebGLTexture;
      gl.bindTexture(gl.TEXTURE_2D, this.nodesTexture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    }

    private getNodesPositionArray(): Float32Array {
      const res = new Float32Array(nodes.length * 2);
      nodes.forEach((n, i) => {
        const nodePosition = this.renderer.getNodeDisplayData(n);
        if (!nodePosition) throw new Error(`createContoursProgram: Node ${n} not found`);

        res[2 * i] = nodePosition.x;
        res[2 * i + 1] = nodePosition.y;
      });
      return res;
    }

    protected renderProgram(params: RenderParams, programInfo: ProgramInfo) {
      const gl = programInfo.gl;
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.nodesTexture);
      super.renderProgram(params, programInfo);
    }

    getCustomLayerDefinition(): WebGLLayerDefinition {
      return {
        FRAGMENT_SHADER_SOURCE: getFragmentShader({ levels, border, feather, nodesCount: nodes.length }),
        DATA_UNIFORMS: [
          "u_nodesPosition",
          "u_radius",
          ...levels.map((_, i) => `u_levelColor_${i + 1}`),
          ...(border ? ["u_borderColor"] : []),
        ],
        CAMERA_UNIFORMS: ["u_invMatrix", "u_width", "u_height", "u_correctionRatio", "u_zoomModifier"],
      };
    }
    setCameraUniforms(
      { invMatrix, correctionRatio, zoomRatio }: RenderParams,
      { gl, uniformLocations: { u_invMatrix, u_width, u_height, u_correctionRatio, u_zoomModifier } }: ProgramInfo,
    ) {
      gl.uniform1f(u_width, gl.canvas.width);
      gl.uniform1f(u_height, gl.canvas.height);
      gl.uniform1f(u_correctionRatio, correctionRatio);
      gl.uniform1f(u_zoomModifier, 1 / zoomToRadiusRatioFunction(zoomRatio));
      gl.uniformMatrix3fv(u_invMatrix, false, invMatrix);
    }
    cacheDataUniforms({ gl, uniformLocations }: ProgramInfo) {
      const { u_radius } = uniformLocations;

      gl.uniform1f(u_radius, radius);

      gl.bindTexture(gl.TEXTURE_2D, this.nodesTexture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        WebGL2RenderingContext.RG32F,
        nodes.length,
        1,
        0,
        WebGL2RenderingContext.RG,
        gl.FLOAT,
        this.getNodesPositionArray(),
      );

      levels.forEach(({ color }, i) => {
        const location = uniformLocations[`u_levelColor_${i + 1}`];
        const [r, g, b, a] = colorToArray(color || "#0000");
        gl.uniform4f(location, r / 255, g / 255, b / 255, a / 255);
      });

      if (border) {
        const [r, g, b, a] = colorToArray(border.color);
        gl.uniform4f(uniformLocations.u_borderColor, r / 255, g / 255, b / 255, a / 255);
      }
    }
  };
}
