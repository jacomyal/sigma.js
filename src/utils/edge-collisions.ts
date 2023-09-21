export type EdgeCollisionDetectionFunction = (
  pointX: number,
  pointY: number,
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  thickness: number,
) => boolean;

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
 * This helper checks whether a point collides with a straight edge. All
 * arguments must be coordinates and sizes on the stage, in pixels.
 */
export function checkStraightEdgeCollision(
  pointX: number,
  pointY: number,
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  thickness: number,
): boolean {
  // Check first if point is out of the rectangle which opposite corners are the
  // source and the target, rectangle we expand by `thickness` in every
  // direction:
  if (pointX < sourceX - thickness && pointX < targetX - thickness) return false;
  if (pointY < sourceY - thickness && pointY < targetY - thickness) return false;
  if (pointX > sourceX + thickness && pointX > targetX + thickness) return false;
  if (pointY > sourceY + thickness && pointY > targetY + thickness) return false;

  // Check actual collision now: Since we now the point is in this big rectangle
  // we "just" need to check that the distance between the point and the line
  // connecting the source and the target is less than `thickness`:
  // https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
  const distance =
    Math.abs((targetX - sourceX) * (sourceY - pointY) - (sourceX - pointX) * (targetY - sourceY)) /
    Math.sqrt(Math.pow(targetX - sourceX, 2) + Math.pow(targetY - sourceY, 2));

  return distance < thickness / 2;
}
