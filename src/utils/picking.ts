export function getPixelColor(
  gl: WebGLRenderingContext,
  frameBuffer: WebGLBuffer | null,
  x: number,
  y: number,
): [number, number, number, number] {
  const pixel = new Uint8Array(4);
  gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
  gl.readPixels(x, gl.drawingBufferHeight - y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
  const [r, g, b, a] = pixel;
  return [r, g, b, a];
}
