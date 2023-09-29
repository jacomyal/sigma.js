export function getPixelColor(gl: WebGLRenderingContext, x: number, y: number): [number, number, number, number] {
  const pixel = new Uint8Array(4);
  gl.readPixels(x, gl.drawingBufferHeight - y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
  const [r, g, b, a] = pixel;
  return [r, g, b, a];
}
