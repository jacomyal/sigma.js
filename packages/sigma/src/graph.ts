import { EventEmitter } from "events";

export type Attributes = Record<string, unknown>;

export type GraphEventPayload = {
  key: string;
  attributes?: Attributes;
  source?: string;
  target?: string;
  hints?: { attributes?: string[] };
};

export type GraphEvent =
  | "nodeAdded"
  | "nodeDropped"
  | "nodeAttributesUpdated"
  | "eachNodeAttributesUpdated"
  | "edgeAdded"
  | "edgeDropped"
  | "edgeAttributesUpdated"
  | "eachEdgeAttributesUpdated"
  | "edgesCleared"
  | "cleared";

export interface SigmaGraph<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> extends Pick<EventEmitter, "on" | "removeListener"> {
  order: number;
  size: number;
  attributes?: G;

  nodes(): string[];
  edges(): string[];
  forEachNode(callback: (node: string, attributes: N) => void): void;
  forEachEdge(callback: (edge: string, attributes: E, source: string, target: string, sourceAttributes: N, targetAttributes: N) => void): void;
  filterNodes(callback: (node: string, attributes: N) => boolean): string[];

  hasNode(node: string): boolean;
  hasEdge(edge: string): boolean;
  source(edge: string): string;
  target(edge: string): string;
  extremities(edge: string): [string, string];
  getNodeAttributes(node: string): N;
  getNodeAttribute(node: string, name: string): unknown;
  setNodeAttribute(node: string, name: string, value: unknown): void;
  getEdgeAttributes(edge: string): E;
}
