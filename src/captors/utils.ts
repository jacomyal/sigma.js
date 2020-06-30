/**
 * Sigma.js Captor Utils
 * ======================
 *
 * Miscellenous helper functions related to the captors.
 */
import { getPixelRatio } from "../renderers/utils";

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
 * Extract the width from a mouse or touch event.
 *
 * @param  {event}  e - A mouse or touch event.
 * @return {number}     The width of the event's target.
 */
export function getWidth(e: MouseEvent): number {
  const w = (e.target as HTMLCanvasElement).width;

  if (typeof w === "number") return w;

  throw new Error("sigma/captors/utils.getWidth: could not extract width from event.");
}

/**
 * Extract the height from a mouse or touch event.
 *
 * @param  {event}  e - A mouse or touch event.
 * @return {number}     The height of the event's target.
 */
export function getHeight(e: MouseEvent): number {
  const w = (e.target as HTMLCanvasElement).height;

  if (typeof w === "number") return w;

  throw new Error("sigma/captors/utils.getHeight: could not extract height from event.");
}

/**
 * Extract the center from a mouse or touch event.
 *
 * @param  {event}  e - A mouse or touch event.
 * @return {object}     The center of the event's target.
 */
export function getCenter(e: MouseEvent | WheelEvent): { x: number; y: number } {
  const ratio = getPixelRatio();

  return {
    x: getWidth(e) / (2 * ratio),
    y: getHeight(e) / (2 * ratio),
  };
}

export interface MouseCoords {
  x: number;
  y: number;
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
