import { Attributes } from "graphology-types";
import { ProgramInfo } from "sigma/rendering";
import { RenderParams } from "sigma/types";
import { colorToArray } from "sigma/utils";

import { WebGLLayerDefinition, WebGLLayerProgram, WebGLLayerProgramType } from "../webgl-layer-program";
import getFragmentShader from "./shader-frag";
import { DEFAULT_METABALLS_OPTIONS, MetaballsOptions } from "./types";

export function createMetaballsProgram<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
>(nodes: string[], options?: Partial<MetaballsOptions>): WebGLLayerProgramType<N, E, G> {
  const { halos, radius, zoomToRadiusRatioFunction } = {
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
        FRAGMENT_SHADER_SOURCE: getFragmentShader({ halos, nodesCount: nodes.length }),
        DATA_UNIFORMS: ["u_nodesPosition", "u_radius", ...halos.map((_, i) => `u_borderColor_${i + 1}`)],
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
      const { u_radius, u_nodesPosition } = uniformLocations;

      gl.uniform1f(u_radius, radius);
      gl.uniform2fv(u_nodesPosition, this.getNodesPositionArray());

      halos.forEach(({ color }, i) => {
        const location = uniformLocations[`u_borderColor_${i + 1}`];
        const [r, g, b, a] = colorToArray(color || "#0000");
        gl.uniform4f(location, r / 255, g / 255, b / 255, a / 255);
      });
    }
  };
}
