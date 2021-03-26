/**
 * Sigma.js Captor Class
 * ======================
 * @module
 */
import { EventEmitter } from "events";
import { Coordinates, MouseCoords, TouchCoords } from "../../types";
import Camera from "../camera";

/**
 * Captor utils functions
 * ======================
 */

/**
 * Extract the local X position from a mouse event or touch object.
 *
 * @param  {event}  e - A mouse event or touch object.
 * @return {number}     The local X value of the mouse.
 */
export function getX(e: MouseEvent | Touch): number {
  if (typeof (e as MouseEvent).offsetX !== "undefined") return (e as MouseEvent).offsetX;

  if (typeof e.clientX !== "undefined") return e.clientX;

  throw new Error("Captor: could not extract x from event.");
}

/**
 * Extract the local Y position from a mouse event or touch object.
 *
 * @param  {event}  e - A mouse event or touch object.
 * @return {number}     The local Y value of the mouse.
 */
export function getY(e: MouseEvent | Touch): number {
  if (typeof (e as MouseEvent).offsetY !== "undefined") return (e as MouseEvent).offsetY;

  if (typeof e.clientY !== "undefined") return e.clientY;

  throw new Error("Captor: could not extract y from event.");
}

/**
 * Extract the local X and Y coordinates from a mouse event or touch object.
 *
 * @param  {event}  e - A mouse event or touch object.
 * @return {number}     The local Y value of the mouse.
 */
export function getPosition(e: MouseEvent | Touch): Coordinates {
  return {
    x: getX(e),
    y: getY(e),
  };
}

/**
 * Convert mouse coords to sigma coords.
 *
 * @param  {event}   e   - A mouse event or touch object.
 *
 * @return {object}
 */
export function getMouseCoords(e: MouseEvent): MouseCoords {
  return {
    x: getX(e),
    y: getY(e),
    clientX: e.clientX,
    clientY: e.clientY,
    ctrlKey: e.ctrlKey,
    metaKey: e.metaKey,
    altKey: e.altKey,
    shiftKey: e.shiftKey,

    // TODO: this is not ideal... But I am wondering why we don't just pass the event through
    preventDefault: e.preventDefault.bind(e),
    original: e,
  };
}

const MAX_TOUCHES = 2;
export function getTouchesArray(touches: TouchList): Touch[] {
  const arr = [];
  for (let i = 0, l = Math.min(touches.length, MAX_TOUCHES); i < l; i++) arr.push(touches[i]);
  return arr;
}

/**
 * Convert touch coords to sigma coords.
 */
export function getTouchCoords(e: TouchEvent): TouchCoords {
  return {
    touches: getTouchesArray(e.touches).map(getPosition),
    ctrlKey: e.ctrlKey,
    metaKey: e.metaKey,
    altKey: e.altKey,
    shiftKey: e.shiftKey,

    // TODO: same as for getMouseCoords
    preventDefault: e.preventDefault.bind(e),
    original: e,
  };
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
export default abstract class Captor extends EventEmitter {
  container: HTMLElement;
  camera: Camera;

  constructor(container: HTMLElement, camera: Camera) {
    super();
    // Properties
    this.container = container;
    this.camera = camera;
  }

  abstract kill(): void;
}
