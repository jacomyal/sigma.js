/**
 * Sigma.js Captor Utils
 * ======================
 *
 * Miscellenous helper functions related to the captors.
 */
import {getPixelRatio} from '../renderers/utils';

/**
 * Extract the local X position from a mouse or touch event.
 *
 * @param  {event}  e - A mouse or touch event.
 * @return {number}     The local X value of the mouse.
 */
export function getX(e) {
  if (typeof e.offsetX !== 'undefined')
    return e.offsetX;

  if (typeof e.layerX !== 'undefined')
    return e.layerX;

  if (typeof e.clientX !== 'undefined')
    return e.clientX;

  throw new Error('sigma/captors/utils.getX: could not extract x from event.');
}

/**
 * Extract the local Y position from a mouse or touch event.
 *
 * @param  {event}  e - A mouse or touch event.
 * @return {number}     The local Y value of the mouse.
 */
export function getY(e) {
  if (typeof e.offsetY !== 'undefined')
    return e.offsetY;

  if (typeof e.layerY !== 'undefined')
    return e.layerY;

  if (typeof e.clientY !== 'undefined')
    return e.clientY;

  throw new Error('sigma/captors/utils.getY: could not extract y from event.');
}

/**
 * Extract the width from a mouse or touch event.
 *
 * @param  {event}  e - A mouse or touch event.
 * @return {number}     The width of the event's target.
 */
export function getWidth(e) {
  const w = !e.target.ownerSVGElement ?
    e.target.width :
    e.target.ownerSVGElement.width;

  if (typeof w === 'number')
    return w;

  if (w !== undefined && w.baseVal !== undefined)
    return w.baseVal.value;

  throw new Error('sigma/captors/utils.getWidth: could not extract width from event.');
}

/**
 * Extract the height from a mouse or touch event.
 *
 * @param  {event}  e - A mouse or touch event.
 * @return {number}     The height of the event's target.
 */
export function getHeight(e) {
  const w = !e.target.ownerSVGElement ?
    e.target.height :
    e.target.ownerSVGElement.height;

  if (typeof w === 'number')
    return w;

  if (w !== undefined && w.baseVal !== undefined)
    return w.baseVal.value;

  throw new Error('sigma/captors/utils.getHeight: could not extract height from event.');
}

/**
 * Extract the center from a mouse or touch event.
 *
 * @param  {event}  e - A mouse or touch event.
 * @return {object}     The center of the event's target.
 */
export function getCenter(e) {
  const ratio = e.target.namespaceURI.indexOf('svg') !== -1 ?
    1 :
    getPixelRatio();

  return {
    x: getWidth(e) / (2 * ratio),
    y: getHeight(e) / (2 * ratio)
  };
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
export function getMouseCoords(e) {
  return {
    x: getX(e),
    y: getY(e),
    clientX: e.clientX,
    clientY: e.clientY,
    ctrlKey: e.ctrlKey,
    metaKey: e.metaKey,
    altKey: e.altKey,
    shiftKey: e.shiftKey
  };
}

/**
 * Extract the wheel delta from a mouse or touch event.
 *
 * @param  {event}  e - A mouse or touch event.
 * @return {number}     The wheel delta of the mouse.
 */
export function getWheelDelta(e) {
  if (typeof e.wheelDelta !== 'undefined')
    return e.wheelDelta / 360;

  if (typeof e.detail !== 'undefined')
    return e.detail / -9;

  throw new Error('sigma/captors/utils.getDelta: could not extract delta from event.');
}
