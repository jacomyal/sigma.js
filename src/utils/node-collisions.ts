export type NodeCollisionDetectionFunction = (
  pointX: number,
  pointY: number,
  nodeX: number,
  nodeY: number,
  size: number,
) => boolean;

/**
 * This helper checks whether a point collides with a square node. All arguments
 * must be coordinates and sizes on the stage, in pixels.
 */
export function checkSquareNodeCollision(
  pointX: number,
  pointY: number,
  nodeX: number,
  nodeY: number,
  size: number,
): boolean {
  return pointX > nodeX - size && pointX < nodeX + size && pointY > nodeY - size && pointY < nodeY + size;
}

/**
 * This helper checks whether a point collides with a disc node. All arguments
 * must be coordinates and sizes on the stage, in pixels.
 */
export function checkDiscNodeCollision(
  pointX: number,
  pointY: number,
  nodeX: number,
  nodeY: number,
  size: number,
): boolean {
  return (
    // Check first the circumscribed square, because it's way cheaper, and
    // should discriminate most cases:
    checkSquareNodeCollision(pointX, pointY, nodeX, nodeY, size) &&
    Math.sqrt(Math.pow(pointX - nodeX, 2) + Math.pow(pointY - nodeY, 2)) < size
  );
}
