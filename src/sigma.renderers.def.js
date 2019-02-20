import isWebGLAvailable from "./domain/utils/webgl/isAvailable";

export default function configure(sigma, global = window) {
  if (typeof sigma === "undefined") throw new Error("sigma is not declared");

  // Copy the good renderer:
  sigma.register(
    "sigma.renderers.def",
    isWebGLAvailable(global) ? sigma.renderers.webgl : sigma.renderers.canvas
  );
}
