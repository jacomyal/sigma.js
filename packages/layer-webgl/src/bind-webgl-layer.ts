import Sigma from "sigma";

import { WebGLLayerProgramType } from "./webgl-layer-program";

/**
 * This function helps to bind a custom layer program to a Sigma instance. It returns a cleanup function.
 */
export default function bindWebGLLayer(id: string, renderer: Sigma, ProgramClass: WebGLLayerProgramType): () => void {
  let isCleaned = false;

  const canvas = renderer.createCanvas(id, { beforeLayer: "edges" });
  const gl = renderer.createWebGLContext(id, { canvas });
  const program = new ProgramClass(gl, null, renderer);

  // Bind lifecycle:
  const _afterProcess = () => {
    if (isCleaned) return;
    gl.useProgram(program.normalProgram.program);
    program.cacheDataUniforms(program.normalProgram);
  };
  const _afterRender = () => {
    if (isCleaned) return;
    program.render(renderer.getRenderParams());
  };
  const _afterClear = () => {
    if (isCleaned) return;
    gl.clear(gl.COLOR_BUFFER_BIT);
  };
  renderer.addListener("afterProcess", _afterProcess);
  renderer.addListener("afterRender", _afterRender);
  renderer.addListener("afterClear", _afterClear);

  // Cleaning:
  const _clean = () => {
    if (isCleaned) return;

    renderer.removeListener("afterProcess", _afterProcess);
    renderer.removeListener("afterRender", _afterRender);
    renderer.removeListener("afterClear", _afterClear);
    renderer.removeListener("kill", _clean);

    program.kill();
    renderer.killLayer(id);

    isCleaned = true;
  };
  renderer.addListener("kill", _clean);

  renderer.resize(true);
  renderer.refresh();

  return _clean;
}
