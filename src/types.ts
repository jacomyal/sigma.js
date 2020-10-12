/**
 * Sigma.js Display Data Classes
 * ==============================
 *
 * Classes representing nodes & edges display data aiming at facilitating
 * the engine's memory representation and keep them in a pool to avoid
 * requiring to allocate memory too often.
 *
 * NOTE: it's possible to optimize this further by maintaining display data
 * in byte arrays but this would prove more tedious for the rendering logic
 * afterwards.
 */
import { NodeKey, EdgeKey } from "graphology-types";
import { WebGLSettings } from "./renderers/webgl/settings";

export interface Coordinates {
  x: number;
  y: number;
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

  constructor(index: number, settings: WebGLSettings) {
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

  constructor(index: number, settings: WebGLSettings) {
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
