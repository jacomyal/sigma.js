/**
 * Sigma.js Rendering Utils
 * ===========================
 *
 * Helpers used by most renderers.
 */

import { Coordinates } from "../captors/utils";

/**
 * Function used to create DOM elements easily.
 *
 * @param  {string} tag        - Tag name of the element to create.
 * @param  {object} attributes - Attributes map.
 * @return {HTMLElement}
 */
export function createElement<T extends HTMLElement>(tag: string, attributes: { [key: string]: any }): T {
  const element: T = document.createElement(tag) as T;

  Object.keys(attributes).forEach((attrName: string) => {
    if (attrName === "style") {
      const styleAttributes: { [key: string]: string } = attributes[attrName];
      element.setAttribute(
        "style",
        Object.keys(styleAttributes)
          .map((attrKey: string) => `${attrKey}: ${styleAttributes[attrKey]}`)
          .join(";"),
      );
    } else {
      element.setAttribute(attrName, attributes[attrName]);
    }
  });

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
export function createNormalizationFunction(extent: { x: [number, number]; y: [number, number] }): any {
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
