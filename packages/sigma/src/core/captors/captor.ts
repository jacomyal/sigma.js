/**
 * Sigma.js Captor Class
 * ======================
 * @module
 */
import { Attributes } from "graphology-types";

import Sigma from "../../sigma";
import { Coordinates, EventsMapping, MouseCoords, TouchCoords, TypedEventEmitter, WheelCoords } from "../../types";

/**
 * Captor utils functions
 * ======================
 */

/**
 * Extract the local X and Y coordinates from a mouse event or touch object. If
 * a DOM element is given, it uses this element's offset to compute the position
 * (this allows using events that are not bound to the container itself and
 * still have a proper position).
 *
 * @param  {event}       e - A mouse event or touch object.
 * @param  {HTMLElement} dom - A DOM element to compute offset relatively to.
 * @return {number}      The local Y value of the mouse.
 */
export function getPosition(e: MouseEvent | Touch, dom: HTMLElement): Coordinates {
  const bbox = dom.getBoundingClientRect();

  return {
    x: e.clientX - bbox.left,
    y: e.clientY - bbox.top,
  };
}

/**
 * Convert mouse coords to sigma coords.
 *
 * @param  {event}       e   - A mouse event or touch object.
 * @param  {HTMLElement} dom - A DOM element to compute offset relatively to.
 * @return {object}
 */
export function getMouseCoords(e: MouseEvent, dom: HTMLElement): MouseCoords {
  const res: MouseCoords = {
    ...getPosition(e, dom),
    sigmaDefaultPrevented: false,
    preventSigmaDefault(): void {
      res.sigmaDefaultPrevented = true;
    },
    original: e,
  };

  return res;
}

/**
 * Takes a touch coords or a mouse coords, and always returns a clean mouse coords object.
 */
export function cleanMouseCoords(e: MouseCoords | TouchCoords): MouseCoords {
  const res: MouseCoords =
    "x" in e
      ? e
      : {
          ...(e.touches[0] || e.previousTouches[0]),
          original: e.original,
          sigmaDefaultPrevented: e.sigmaDefaultPrevented,
          preventSigmaDefault: () => {
            e.sigmaDefaultPrevented = true;
            res.sigmaDefaultPrevented = true;
          },
        };

  return res;
}

/**
 * Convert mouse wheel event coords to sigma coords.
 *
 * @param  {event}       e   - A wheel mouse event.
 * @param  {HTMLElement} dom - A DOM element to compute offset relatively to.
 * @return {object}
 */
export function getWheelCoords(e: WheelEvent, dom: HTMLElement): WheelCoords {
  return {
    ...getMouseCoords(e, dom),
    delta: getWheelDelta(e),
  };
}

const MAX_TOUCHES = 2;
export function getTouchesArray(touches: TouchList): Touch[] {
  const arr: Touch[] = [];
  for (let i = 0, l = Math.min(touches.length, MAX_TOUCHES); i < l; i++) arr.push(touches[i]);
  return arr;
}

/**
 * Convert touch coords to sigma coords.
 *
 * @param  {event}       e               - A touch event.
 * @param  {Touch[]}     previousTouches - An array of the previously stored touches.
 * @param  {HTMLElement} dom             - A DOM element to compute offset relatively to.
 * @return {object}
 */
export function getTouchCoords(e: TouchEvent, previousTouches: Touch[], dom: HTMLElement): TouchCoords {
  const res: TouchCoords = {
    touches: getTouchesArray(e.touches).map((touch) => getPosition(touch, dom)),
    previousTouches: previousTouches.map((touch) => getPosition(touch, dom)),
    sigmaDefaultPrevented: false,
    preventSigmaDefault(): void {
      res.sigmaDefaultPrevented = true;
    },
    original: e,
  };

  return res;
}

/**
 * Extract the wheel delta from a mouse event or touch object.
 *
 * @param  {event}  e - A mouse event or touch object.
 * @return {number}     The wheel delta of the mouse.
 */
export function getWheelDelta(e: WheelEvent): number {
  // TODO: check those ratios again to ensure a clean Chrome/Firefox compat
  if (typeof e.deltaY !== "undefined") return (e.deltaY * -3) / 360;

  if (typeof e.detail !== "undefined") return e.detail / -9;

  throw new Error("Captor: could not extract delta from event.");
}

/**
 * Abstract class representing a captor like the user's mouse or touch controls.
 */
export default abstract class Captor<
  Events extends EventsMapping,
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> extends TypedEventEmitter<Events> {
  container: HTMLElement;
  renderer: Sigma<N, E, G>;

  constructor(container: HTMLElement, renderer: Sigma<N, E, G>) {
    super();
    // Properties
    this.container = container;
    this.renderer = renderer;
  }

  abstract kill(): void;
}
