export function getPixelColor(
  gl: WebGLRenderingContext,
  frameBuffer: WebGLBuffer | null,
  x: number,
  y: number,
  downSizingRatio = 1,
): [number, number, number, number] {
  const pixel = new Uint8Array(4);
  gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
  gl.readPixels(
    x / downSizingRatio,
    gl.drawingBufferHeight / downSizingRatio - y / downSizingRatio,
    1,
    1,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    pixel,
  );
  const [r, g, b, a] = pixel;
  return [r, g, b, a];
}
