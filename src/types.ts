/**
 * Sigma.js Types
 * ==============
 *
 * Classes representing nodes & edges display data aiming at facilitating
 * the engine's memory representation and keep them in a pool to avoid
 * requiring to allocate memory too often.
 *
 * NOTE: it's possible to optimize this further by maintaining display data
 * in byte arrays but this would prove more tedious for the rendering logic
 * afterwards.
 * @module
 */
import { NodeKey, EdgeKey } from "graphology-types";
import { Settings } from "./settings";

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
  label: string;
}

export interface NodeWithKey extends NodeAttributes {
  key: NodeKey;
}

export class Node implements NodeAttributes {
  index: number;
  x: number;
  y: number;
  size: number;
  color: string;
  hidden: boolean;
  label: string;

  constructor(index: number, settings: Settings) {
    this.index = index;
    this.x = 0;
    this.y = 0;
    this.size = 2;
    this.color = settings.defaultNodeColor;
    this.hidden = false;
    this.label = "";
  }

  assign(data: Partial<Node>): void {
    Object.assign(this, data);
  }
}

export interface EdgeAttributes {
  size: number;
  color: string;
  hidden: boolean;
  label: string;
}

export interface EdgeWithKey extends EdgeAttributes {
  key: EdgeKey;
}

export class Edge implements EdgeAttributes {
  index: number;
  size: number;
  color: string;
  hidden: boolean;
  label: string;

  constructor(index: number, settings: Settings) {
    this.index = index;
    this.size = 1;
    this.color = settings.defaultEdgeColor;
    this.hidden = false;
    this.label = "";
  }

  assign(data: Partial<Edge>): void {
    Object.assign(this, data);
  }
}
