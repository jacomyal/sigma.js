import { Attributes } from "graphology-types";
import { ProgramInfo } from "sigma/rendering";
import { RenderParams } from "sigma/types";
import { colorToArray } from "sigma/utils";

import { WebGLLayerDefinition, WebGLLayerProgram, WebGLLayerProgramType } from "../webgl-layer-program";
import getFragmentShader from "./shader-frag.ts";

export type MetaballsOptions = {
  color: string;
  radius: number;
  threshold: number;
  feather: number;
};

export const DEFAULT_METABALLS_OPTIONS: MetaballsOptions = {
  color: "#cccccc",
  radius: 50,
  threshold: 0.5,
  feather: 0.1,
};

export function createMetaballsProgram<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
>(nodes: string[], options?: Partial<MetaballsOptions>): WebGLLayerProgramType<N, E, G> {
  const { color, radius, threshold, feather } = {
    ...DEFAULT_METABALLS_OPTIONS,
    ...(options || {}),
  };

  return class MetaballsProgramClass<
    N extends Attributes = Attributes,
    E extends Attributes = Attributes,
    G extends Attributes = Attributes,
  > extends WebGLLayerProgram<N, E, G> {
    private getNodesPositionArray(): Float32Array {
      const res = new Float32Array(nodes.length * 2);
      nodes.forEach((n, i) => {
        const nodePosition = this.renderer.getNodeDisplayData(n);
        if (!nodePosition) throw new Error(`MetaballsProgramClass: Node ${n} not found`);

        res[2 * i] = nodePosition.x;
        res[2 * i + 1] = nodePosition.y;
      });
      return res;
    }

    getCustomLayerDefinition(): WebGLLayerDefinition {
      return {
        FRAGMENT_SHADER_SOURCE: getFragmentShader({ nodesCount: nodes.length }),
        DATA_UNIFORMS: ["u_nodesPosition", "u_color", "u_radius", "u_threshold", "u_feather"],
        CAMERA_UNIFORMS: ["u_matrix", "u_width", "u_height", "u_correctionRatio"],
      };
    }
    setCameraUniforms(
      { matrix, correctionRatio }: RenderParams,
      { gl, uniformLocations: { u_matrix, u_width, u_height, u_correctionRatio } }: ProgramInfo,
    ) {
      gl.uniform1f(u_width, gl.canvas.width);
      gl.uniform1f(u_height, gl.canvas.height);
      gl.uniform1f(u_correctionRatio, correctionRatio);
      gl.uniformMatrix3fv(u_matrix, false, matrix);
    }
    cacheDataUniforms({
      gl,
      uniformLocations: { u_nodesPosition, u_color, u_radius, u_threshold, u_feather },
    }: ProgramInfo) {
      gl.uniform2fv(u_nodesPosition, this.getNodesPositionArray());
      gl.uniform1f(u_radius, radius);
      gl.uniform1f(u_threshold, threshold);
      gl.uniform1f(u_feather, feather);

      const [r, g, b, a] = colorToArray(color);
      gl.uniform4f(u_color, r / 255, g / 255, b / 255, a / 255);
    }
  };
}
