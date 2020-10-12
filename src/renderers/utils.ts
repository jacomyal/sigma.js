/**
 * Sigma.js Rendering Utils
 * ===========================
 *
 * Helpers used by most renderers.
 */

import { Coordinates, Extent } from "../types";
import { PlainObject } from "../utils";

/**
 * Function used to create DOM elements easily.
 *
 * @param  {string} tag        - Tag name of the element to create.
 * @param  {object} style      - Styles map.
 * @param  {object} attributes - Attributes map.
 * @return {HTMLElement}
 */
export function createElement<T extends HTMLElement>(
  tag: string,
  style?: Partial<CSSStyleDeclaration>,
  attributes?: PlainObject<string>,
): T {
  const element: T = document.createElement(tag) as T;

  if (style) {
    for (const k in style) {
      element.style[k] = style[k] as string;
    }
  }

  if (attributes) {
    for (const k in attributes) {
      element.setAttribute(k, attributes[k]);
    }
  }

  return element;
}

/**
 * Function returning the browser's pixel ratio.
 *
 * @return {number}
 */
export function getPixelRatio(): number {
  if (typeof window.devicePixelRatio !== "undefined") return window.devicePixelRatio;

  return 1;
}

/**
 * Factory returning a function normalizing the given node's position & size.
 *
 * @param  {object}   extent  - Extent of the graph.
 * @return {function}
 */
export interface NormalizationFunction {
  (data: Coordinates): Coordinates;
  inverse(data: Coordinates): Coordinates;
  applyTo(data: Coordinates): void;
}
export function createNormalizationFunction(extent: { x: Extent; y: Extent }): NormalizationFunction {
  const {
    x: [minX, maxX],
    y: [minY, maxY],
  } = extent;

  let ratio = Math.max(maxX - minX, maxY - minY);

  if (ratio === 0) ratio = 1;

  const dX = (maxX + minX) / 2,
    dY = (maxY + minY) / 2;

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
