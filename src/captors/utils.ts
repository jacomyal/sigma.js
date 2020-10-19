/**
 * Sigma.js Captor Utils
 * ======================
 *
 * Miscellenous helper functions related to the captors.
 */
import { Coordinates } from "../types";

export interface MouseCoords extends Coordinates {
  clientX: number;
  clientY: number;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
  preventDefault(): void;
  original: MouseEvent;
}

/**
 * Extract the local X position from a mouse or touch event.
 *
 * @param  {event}  e - A mouse or touch event.
 * @return {number}     The local X value of the mouse.
 */
export function getX(e: MouseEvent): number {
  if (typeof e.offsetX !== "undefined") return e.offsetX;

  if (typeof e.clientX !== "undefined") return e.clientX;

  throw new Error("sigma/captors/utils.getX: could not extract x from event.");
}

/**
 * Extract the local Y position from a mouse or touch event.
 *
 * @param  {event}  e - A mouse or touch event.
 * @return {number}     The local Y value of the mouse.
 */
export function getY(e: MouseEvent): number {
  if (typeof e.offsetY !== "undefined") return e.offsetY;

  if (typeof e.clientY !== "undefined") return e.clientY;

  throw new Error("sigma/captors/utils.getY: could not extract y from event.");
}

/**
 * Convert mouse coords to sigma coords.
 *
 * @param  {event}   e   - A mouse or touch event.
 * @param  {number}  [x] - The x coord to convert
 * @param  {number}  [y] - The y coord to convert
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

/**
 * Extract the wheel delta from a mouse or touch event.
 *
 * @param  {event}  e - A mouse or touch event.
 * @return {number}     The wheel delta of the mouse.
 */
export function getWheelDelta(e: WheelEvent): number {
  // TODO: check those ratios again to ensure a clean Chrome/Firefox compat
  if (typeof e.deltaY !== "undefined") return (e.deltaY * -3) / 360;

  if (typeof e.detail !== "undefined") return e.detail / -9;

  throw new Error("sigma/captors/utils.getDelta: could not extract delta from event.");
}
