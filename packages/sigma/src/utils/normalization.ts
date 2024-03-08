import { Coordinates, Extent } from "../types";

/**
 * Factory returning a function normalizing the given node's position & size.
 */
export interface NormalizationFunction {
  (data: Coordinates): Coordinates;
  ratio: number;
  inverse(data: Coordinates): Coordinates;
  applyTo(data: Coordinates): void;
}
export function createNormalizationFunction(extent: { x: Extent; y: Extent }): NormalizationFunction {
  const {
    x: [minX, maxX],
    y: [minY, maxY],
  } = extent;

  let ratio = Math.max(maxX - minX, maxY - minY),
    dX = (maxX + minX) / 2,
    dY = (maxY + minY) / 2;

  if (ratio === 0 || Math.abs(ratio) === Infinity || isNaN(ratio)) ratio = 1;
  if (isNaN(dX)) dX = 0;
  if (isNaN(dY)) dY = 0;

  const fn = (data: Coordinates): Coordinates => {
    return {
      x: 0.5 + (data.x - dX) / ratio,
      y: 0.5 + (data.y - dY) / ratio,
    };
  };

  // TODO: possibility to apply this in batch over array of indices
  fn.applyTo = (data: Coordinates): void => {
    data.x = 0.5 + (data.x - dX) / ratio;
    data.y = 0.5 + (data.y - dY) / ratio;
  };

  fn.inverse = (data: Coordinates): Coordinates => {
    return {
      x: dX + ratio * (data.x - 0.5),
      y: dY + ratio * (data.y - 0.5),
    };
  };

  fn.ratio = ratio;

  return fn;
}
