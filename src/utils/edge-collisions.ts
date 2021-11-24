/**
 * This helper returns true is the pixel at (x,y) in the given WebGL context is
 * colored, and false else.
 */
export function isPixelColored(gl: WebGLRenderingContext, x: number, y: number): boolean {
  const pixels = new Uint8Array(4);
  gl.readPixels(x, gl.drawingBufferHeight - y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  return pixels[3] > 0;
}

/**
 * This helper checks whether or not a point (x, y) collides with an
 * edge, connecting a source (xS, yS) to a target (xT, yT) with a thickness in
 * pixels.
 */
export function doEdgeCollideWithPoint(
  x: number,
  y: number,
  xS: number,
  yS: number,
  xT: number,
  yT: number,
  thickness: number,
): boolean {
  // Check first if point is out of the rectangle which opposite corners are the
  // source and the target, rectangle we expand by `thickness` in every
  // directions:
  if (x < xS - thickness && x < xT - thickness) return false;
  if (y < yS - thickness && y < yT - thickness) return false;
  if (x > xS + thickness && x > xT + thickness) return false;
  if (y > yS + thickness && y > yT + thickness) return false;

  // Check actual collision now: Since we now the point is in this big rectangle
  // we "just" need to check that the distance between the point and the line
  // connecting the source and the target is less than `thickness`:
  // https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
  const distance =
    Math.abs((xT - xS) * (yS - y) - (xS - x) * (yT - yS)) / Math.sqrt(Math.pow(xT - xS, 2) + Math.pow(yT - yS, 2));

  return distance < thickness / 2;
}
