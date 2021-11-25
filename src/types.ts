/**
 * Sigma.js Types
 * ===============
 *
 * Various type declarations used throughout the library.
 * @module
 */
import { EventEmitter } from "events";

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

export interface Coordinates {
  x: number;
  y: number;
}

export interface CameraState extends Coordinates {
  angle: number;
  ratio: number;
}

export type MouseInteraction = "click" | "doubleClick" | "rightClick" | "wheel" | "down";

export interface MouseCoords extends Coordinates {
  clientX: number;
  clientY: number;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
  sigmaDefaultPrevented: boolean;
  preventSigmaDefault(): void;
  original: MouseEvent;
}

export interface WheelCoords extends MouseCoords {
  deltaY: number; // This will store the `deltaY` from the original event
  delta: number; // This will store the delta actually used by sigma
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

export interface DisplayData {
  label: string | null;
  size: number;
  color: string;
  hidden: boolean;
  zIndex: number;
  type: string;
}

export interface NodeDisplayData extends Coordinates, DisplayData {
  highlighted: boolean;
}

export interface EdgeDisplayData extends DisplayData {}

/**
 * Custom event emitter types.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Listener = (...args: any[]) => void;

export declare class TypedEventEmitter<Events extends Record<string, Listener>> {
  rawEmitter: EventEmitter;

  eventNames<Event extends keyof Events>(): Array<Event>;
  setMaxListeners(n: number): this;
  getMaxListeners(): number;
  emit<Event extends keyof Events>(type: Event, ...args: Parameters<Events[Event]>): boolean;
  addListener<Event extends keyof Events>(type: Event, listener: Events[Event]): this;
  on<Event extends keyof Events>(type: Event, listener: Events[Event]): this;
  once<Event extends keyof Events>(type: Event, listener: Events[Event]): this;
  prependListener<Event extends keyof Events>(type: Event, listener: Events[Event]): this;
  prependOnceListener<Event extends keyof Events>(type: Event, listener: Events[Event]): this;
  removeListener<Event extends keyof Events>(type: Event, listener: Events[Event]): this;
  off<Event extends keyof Events>(type: Event, listener: Events[Event]): this;
  removeAllListeners<Event extends keyof Events>(type?: Event): this;
  listeners<Event extends keyof Events>(type: Event): Events[Event][];
  listenerCount<Event extends keyof Events>(type: Event): number;
  rawListeners<Event extends keyof Events>(type: Event): Events[Event][];
}
