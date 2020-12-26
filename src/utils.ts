/**
 * Sigma.js Utils
 * ===============
 *
 * Various helper functions & classes used throughout the library.
 */

/**
 * Util type to represent maps of typed elements, but implemented with
 * JavaScript objects.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PlainObject<T = any> = { [k: string]: T };

/**
 * Returns a type similar to T, but with the the K set of properties of the type
 * T optional.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>> & { [others: string]: any };

/**
 * Returns a type similar to T, but with the the K set of properties of the type
 * T *required*, and the rest optional.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PartialButFor<T, K extends keyof T> = Pick<T, K> & Partial<Omit<T, K>> & { [others: string]: any };

/**
 * Checks whether the given value is a plain object.
 *
 * @param  {mixed}   value - Target value.
 * @return {boolean}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function isPlainObject(value: any): boolean {
  return typeof value === "object" && value !== null && value.constructor === Object;
}

/**
 * Very simple recursive Object.assign-like function.
 *
 * @param  {object} target       - First object.
 * @param  {object} [...objects] - Objects to merge.
 * @return {object}
 */
export function assign<T>(target: Partial<T> | undefined, ...objects: Array<Partial<T | undefined>>): T {
  target = target || {};

  for (let i = 0, l = objects.length; i < l; i++) {
    const o = objects[i];

    if (!o) continue;

    for (const k in o) {
      if (isPlainObject(o[k])) {
        target[k] = assign(target[k], o[k]);
      } else {
        target[k] = o[k];
      }
    }
  }

  return target as T;
}

/**
 * Just some dirty trick to make requestAnimationFrame and cancelAnimationFrame "work" in Node.js, for unit tests:
 */
export const requestFrame =
  typeof requestAnimationFrame !== "undefined"
    ? (callback: FrameRequestCallback) => requestAnimationFrame(callback)
    : (callback: FrameRequestCallback) => setTimeout(callback, 0);
export const cancelFrame =
  typeof cancelAnimationFrame !== "undefined"
    ? (requestID: number) => cancelAnimationFrame(requestID)
    : (requestID: number) => clearTimeout(requestID);
