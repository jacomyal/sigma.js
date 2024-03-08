import { Extent, PlainObject } from "../types";

/**
 * Function used to create DOM elements easily.
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
 */
export function getPixelRatio(): number {
  if (typeof window.devicePixelRatio !== "undefined") return window.devicePixelRatio;

  return 1;
}

/**
 * Function ordering the given elements in reverse z-order so they drawn
 * the correct way.
 */
export function zIndexOrdering<T>(_extent: Extent, getter: (e: T) => number, elements: Array<T>): Array<T> {
  // If k is > n, we'll use a standard sort
  return elements.sort(function (a, b) {
    const zA = getter(a) || 0,
      zB = getter(b) || 0;

    if (zA < zB) return -1;
    if (zA > zB) return 1;

    return 0;
  });

  // TODO: counting sort optimization
}
