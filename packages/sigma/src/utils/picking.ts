export function getPixelColor(
  gl: WebGLRenderingContext,
  frameBuffer: WebGLBuffer | null,
  x: number,
  y: number,
  pixelRatio: number,
  downSizingRatio: number,
): [number, number, number, number] {
  const bufferX = Math.floor((x / downSizingRatio) * pixelRatio);
  const bufferY = Math.floor(gl.drawingBufferHeight / downSizingRatio - (y / downSizingRatio) * pixelRatio);

  const pixel = new Uint8Array(4);
  gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
  gl.readPixels(bufferX, bufferY, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);

  const [r, g, b, a] = pixel;
  return [r, g, b, a];
}
