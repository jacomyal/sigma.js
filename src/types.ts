/**
 * Sigma.js Types
 * ===============
 *
 * Various type declarations used throughout the library.
 * @module
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Listener = (...args: any[]) => void;

export interface CameraState extends Coordinates {
  angle: number;
  ratio: number;
}

export interface Coordinates {
  x: number;
  y: number;
}

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

export interface TouchCoords {
  touches: Coordinates[];
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
  preventDefault(): void;
  original: TouchEvent;
}

export interface Dimensions {
  width: number;
  height: number;
}

export type Extent = [number, number];

export interface NodeAttributes extends Coordinates {
  size: number;
  color: string;
  hidden: boolean;
  highlighted: boolean;
  label: string;
}

export interface EdgeAttributes {
  size: number;
  color: string;
  hidden: boolean;
  label: string;
}
