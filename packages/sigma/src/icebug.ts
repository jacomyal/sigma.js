import { EventEmitter } from "events";
import { tableFromArrays, type Table } from "apache-arrow";
import { GraphR, type GraphR as IcebugGraphR } from "@ladybugmem/icebug";

import { Attributes, SigmaGraph } from "./graph";

type NodeInput<N extends Attributes> = { key: string; attributes: N };
type EdgeInput<E extends Attributes> = { key?: string; source: string; target: string; attributes?: E };

type EdgeRecord<E extends Attributes> = {
  key: string;
  source: string;
  target: string;
  attributes: E;
};

export type IcebugSigmaGraphOptions<N extends Attributes, E extends Attributes> = {
  directed?: boolean;
  nodes?: Array<NodeInput<N>>;
  edges?: Array<EdgeInput<E>>;
};

function toBigUint64Array(values: number[]): BigUint64Array {
  const result = new BigUint64Array(values.length);
  for (let i = 0; i < values.length; i++) result[i] = BigInt(values[i]);
  return result;
}

function getColumn<T>(rows: Attributes[], key: string, fallback: T): T[] {
  return rows.map((row) => (row[key] === undefined ? fallback : (row[key] as T)));
}

function buildTable(rows: Attributes[], columns: Record<string, unknown[]>): Table {
  return tableFromArrays(columnsForRows(rows, columns));
}

function columnsForRows(rows: Attributes[], columns: Record<string, unknown[]>): Record<string, unknown[]> {
  const result = { ...columns };
  const keys = new Set<string>();
  rows.forEach((row) => Object.keys(row).forEach((key) => keys.add(key)));
  keys.forEach((key) => {
    if (!result[key]) result[key] = getColumn(rows, key, null);
  });
  return result;
}

/**
 * Sigma-compatible graph backed by Icebug's Arrow CSR graph for algorithms and
 * Apache Arrow tables for visualization data exchange.
 */
export class IcebugSigmaGraph<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> extends EventEmitter implements SigmaGraph<N, E, G> {
  attributes?: G;

  readonly directed: boolean;
  private nodeOrder: string[] = [];
  private nodeIndex: Map<string, number> = new Map();
  private nodeAttributes: Map<string, N> = new Map();
  private edgeOrder: string[] = [];
  private edgeRecords: Map<string, EdgeRecord<E>> = new Map();
  private edgePairIndex: Map<string, string> = new Map();

  nodeTable: Table = tableFromArrays({ key: [] });
  edgeTable: Table = tableFromArrays({ key: [], source: [], target: [], sourceIndex: [], targetIndex: [] });
  icebugGraph: IcebugGraphR = new GraphR(0, true, new BigUint64Array(), new BigUint64Array([0n]), new BigUint64Array(), new BigUint64Array([0n]));

  constructor(options: IcebugSigmaGraphOptions<N, E> = {}) {
    super();
    this.directed = options.directed ?? true;
    options.nodes?.forEach(({ key, attributes }) => this.addNode(key, attributes, false));
    options.edges?.forEach(({ key, source, target, attributes }) => this.addEdge(key ?? `${source}->${target}`, source, target, attributes ?? ({} as E), false));
    this.rebuildColumnarData();
  }

  get order(): number {
    return this.nodeOrder.length;
  }

  get size(): number {
    return this.edgeOrder.length;
  }

  nodes(): string[] {
    return this.nodeOrder.slice();
  }

  edges(): string[] {
    return this.edgeOrder.slice();
  }

  forEachNode(callback: (node: string, attributes: N) => void): void {
    this.nodeOrder.forEach((node) => callback(node, this.getNodeAttributes(node)));
  }

  forEachEdge(callback: (edge: string, attributes: E, source: string, target: string, sourceAttributes: N, targetAttributes: N) => void): void {
    this.edgeOrder.forEach((edge) => {
      const record = this.getEdgeRecord(edge);
      callback(edge, record.attributes, record.source, record.target, this.getNodeAttributes(record.source), this.getNodeAttributes(record.target));
    });
  }

  filterNodes(callback: (node: string, attributes: N) => boolean): string[] {
    return this.nodeOrder.filter((node) => callback(node, this.getNodeAttributes(node)));
  }

  hasNode(node: string): boolean {
    return this.nodeIndex.has(node);
  }

  hasEdge(edge: string): boolean {
    return this.edgeRecords.has(edge);
  }

  source(edge: string): string {
    return this.getEdgeRecord(edge).source;
  }

  target(edge: string): string {
    return this.getEdgeRecord(edge).target;
  }

  extremities(edge: string): [string, string] {
    const record = this.getEdgeRecord(edge);
    return [record.source, record.target];
  }

  getNodeAttributes(node: string): N {
    const attributes = this.nodeAttributes.get(node);
    if (!attributes) throw new Error(`IcebugSigmaGraph: node "${node}" not found.`);
    return attributes;
  }

  getNodeAttribute(node: string, name: string): unknown {
    return this.getNodeAttributes(node)[name];
  }

  getEdgeAttributes(edge: string): E {
    return this.getEdgeRecord(edge).attributes;
  }

  addNode(key: string, attributes = {} as N, emit = true): void {
    if (this.hasNode(key)) throw new Error(`IcebugSigmaGraph: node "${key}" already exists.`);
    this.nodeIndex.set(key, this.nodeOrder.length);
    this.nodeOrder.push(key);
    this.nodeAttributes.set(key, attributes);
    if (emit) {
      this.rebuildColumnarData();
      this.emit("nodeAdded", { key, attributes });
    }
  }

  addEdge(key: string, source: string, target: string, attributes = {} as E, emit = true): void {
    if (!this.hasNode(source)) this.addNode(source, {} as N, false);
    if (!this.hasNode(target)) this.addNode(target, {} as N, false);
    if (this.hasEdge(key)) throw new Error(`IcebugSigmaGraph: edge "${key}" already exists.`);

    const record = { key, source, target, attributes };
    this.edgeOrder.push(key);
    this.edgeRecords.set(key, record);
    this.edgePairIndex.set(`${source}\u0000${target}`, key);
    if (!this.directed) this.edgePairIndex.set(`${target}\u0000${source}`, key);

    if (emit) {
      this.rebuildColumnarData();
      this.emit("edgeAdded", { key, source, target, attributes });
    }
  }

  setNodeAttribute(node: string, name: string, value: unknown): void {
    const attributes = { ...this.getNodeAttributes(node), [name]: value } as N;
    this.nodeAttributes.set(node, attributes);
    this.rebuildNodeTable();
    this.emit("nodeAttributesUpdated", { key: node, attributes, hints: { attributes: [name] } });
  }

  setEdgeAttribute(edge: string, name: string, value: unknown): void {
    const record = this.getEdgeRecord(edge);
    record.attributes = { ...record.attributes, [name]: value } as E;
    this.edgeRecords.set(edge, record);
    this.rebuildEdgeTable();
    this.emit("edgeAttributesUpdated", { key: edge, attributes: record.attributes, hints: { attributes: [name] } });
  }

  degree(node: string): number {
    const index = this.nodeIndex.get(node);
    if (index === undefined) return 0;
    return this.icebugGraph.degree(index);
  }

  neighbors(node: string): string[] {
    const index = this.nodeIndex.get(node);
    if (index === undefined) return [];
    return this.icebugGraph.neighbors(index).map((neighbor) => this.nodeOrder[neighbor]);
  }

  private getEdgeRecord(edge: string): EdgeRecord<E> {
    const record = this.edgeRecords.get(edge);
    if (!record) throw new Error(`IcebugSigmaGraph: edge "${edge}" not found.`);
    return record;
  }

  private rebuildColumnarData(): void {
    this.rebuildNodeTable();
    this.rebuildEdgeTable();
    this.rebuildIcebugGraph();
  }

  private rebuildNodeTable(): void {
    const rows = this.nodeOrder.map((key) => this.getNodeAttributes(key));
    this.nodeTable = buildTable(rows, {
      key: this.nodeOrder,
      x: getColumn(rows, "x", null),
      y: getColumn(rows, "y", null),
      size: getColumn(rows, "size", null),
      color: getColumn(rows, "color", null),
      label: getColumn(rows, "label", null),
    });
  }

  private rebuildEdgeTable(): void {
    const records = this.edgeOrder.map((edge) => this.getEdgeRecord(edge));
    const rows = records.map((record) => record.attributes);
    this.edgeTable = buildTable(rows, {
      key: records.map((record) => record.key),
      source: records.map((record) => record.source),
      target: records.map((record) => record.target),
      sourceIndex: records.map((record) => this.nodeIndex.get(record.source) ?? -1),
      targetIndex: records.map((record) => this.nodeIndex.get(record.target) ?? -1),
      size: getColumn(rows, "size", null),
      color: getColumn(rows, "color", null),
      label: getColumn(rows, "label", null),
    });
  }

  private rebuildIcebugGraph(): void {
    const n = this.nodeOrder.length;
    const out: number[][] = Array.from({ length: n }, () => []);
    const incoming: number[][] = Array.from({ length: n }, () => []);

    this.edgeOrder.forEach((edge) => {
      const { source, target } = this.getEdgeRecord(edge);
      const sourceIndex = this.nodeIndex.get(source);
      const targetIndex = this.nodeIndex.get(target);
      if (sourceIndex === undefined || targetIndex === undefined) return;
      out[sourceIndex].push(targetIndex);
      incoming[targetIndex].push(sourceIndex);
      if (!this.directed) {
        out[targetIndex].push(sourceIndex);
        incoming[sourceIndex].push(targetIndex);
      }
    });

    const outIndices: number[] = [];
    const outIndptr = [0];
    out.forEach((neighbors) => {
      outIndices.push(...neighbors);
      outIndptr.push(outIndices.length);
    });

    const inIndices: number[] = [];
    const inIndptr = [0];
    incoming.forEach((neighbors) => {
      inIndices.push(...neighbors);
      inIndptr.push(inIndices.length);
    });

    this.icebugGraph = new GraphR(
      n,
      this.directed,
      toBigUint64Array(outIndices),
      toBigUint64Array(outIndptr),
      toBigUint64Array(inIndices),
      toBigUint64Array(inIndptr),
    );
  }
}

export default IcebugSigmaGraph;
