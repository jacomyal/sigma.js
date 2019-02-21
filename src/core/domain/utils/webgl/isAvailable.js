export default function isWebGLAvailable(global = window) {
  // Check if WebGL is enabled:
  let canvas;
  const webgl = !!global.WebGLRenderingContext;
  if (webgl) {
    canvas = document.createElement("canvas");
    try {
      return !!(
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
      );
    } catch (e) {
      return false;
    }
  }
  return false;
}
