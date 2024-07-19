import { Attributes } from "graphology-types";
import { ProgramInfo } from "sigma/rendering";
import Sigma from "sigma/src";
import { RenderParams } from "sigma/types";
import { colorToArray } from "sigma/utils";

import { WebGLLayerDefinition, WebGLLayerProgram, WebGLLayerProgramType } from "../webgl-layer-program";
import getFragmentShader from "./shader-frag";
import { ContourLineOptions, DEFAULT_CONTOUR_LINE_OPTIONS } from "./types";

export function createContourLineProgram<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
>(nodes: string[], options?: Partial<ContourLineOptions>): WebGLLayerProgramType<N, E, G> {
  const { radius, zoomToRadiusRatioFunction, threshold, lineWidth, feather, backgroundColor, contourColor } = {
    ...DEFAULT_CONTOUR_LINE_OPTIONS,
    ...(options || {}),
  };

  return class ContourLineProgramClass<
    N extends Attributes = Attributes,
    E extends Attributes = Attributes,
    G extends Attributes = Attributes,
  > extends WebGLLayerProgram<N, E, G> {
    constructor(
      gl: WebGLRenderingContext | WebGL2RenderingContext,
      pickingBuffer: WebGLFramebuffer | null,
      renderer: Sigma<N, E, G>,
    ) {
      if (!(gl instanceof WebGL2RenderingContext)) throw new Error("createContourLineProgram only works with WebGL2");
      super(gl, pickingBuffer, renderer);
    }

    private getNodesPositionArray(): Float32Array {
      const res = new Float32Array(nodes.length * 2);
      nodes.forEach((n, i) => {
        const nodePosition = this.renderer.getNodeDisplayData(n);
        if (!nodePosition) throw new Error(`ContourLineProgramClass: Node ${n} not found`);

        res[2 * i] = nodePosition.x;
        res[2 * i + 1] = nodePosition.y;
      });
      return res;
    }

    getCustomLayerDefinition(): WebGLLayerDefinition {
      return {
        FRAGMENT_SHADER_SOURCE: getFragmentShader({ nodesCount: nodes.length }),
        CAMERA_UNIFORMS: ["u_invMatrix", "u_width", "u_height", "u_correctionRatio", "u_zoomModifier"],
        DATA_UNIFORMS: [
          "u_nodesPosition",
          "u_radius",
          "u_threshold",
          "u_lineWidth",
          "u_feather",
          "u_backgroundColor",
          "u_contourColor",
        ],
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
      const { u_radius, u_nodesPosition, u_threshold, u_lineWidth, u_feather, u_backgroundColor, u_contourColor } =
        uniformLocations;

      gl.uniform1f(u_radius, radius);
      gl.uniform2fv(u_nodesPosition, this.getNodesPositionArray());
      gl.uniform1f(u_threshold, threshold);
      gl.uniform1f(u_lineWidth, lineWidth);
      gl.uniform1f(u_feather, feather);

      const [ecR, ecG, ecB, ecA] = colorToArray(backgroundColor);
      gl.uniform4f(u_backgroundColor, ecR / 255, ecG / 255, ecB / 255, ecA / 255);
      const [scR, scG, scB, scA] = colorToArray(contourColor);
      gl.uniform4f(u_contourColor, scR / 255, scG / 255, scB / 255, scA / 255);
    }
  };
}
