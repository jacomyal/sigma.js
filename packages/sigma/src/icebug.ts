import { EventEmitter } from "events";
import { tableFromArrays, type Table } from "apache-arrow";

import { Attributes, SigmaGraph } from "./graph";

type CSRArray = number[] | Uint32Array | BigUint64Array;
type NodeInput<N extends Attributes> = { key: string; attributes: N };
type EdgeInput<E extends Attributes> = { key?: string; source: string; target: string; attributes?: E };

export type IcebugSigmaGraphCSROptions<N extends Attributes, E extends Attributes> = {
  directed?: boolean;
  nodes: Array<NodeInput<N>>;
  csr: {
    indptr: CSRArray;
    indices: CSRArray;
    edgeIds?: CSRArray | null;
  };
  edgeAttributes?: E[];
  edgeKeys?: string[];
};

export type IcebugSigmaGraphEdgeListOptions<N extends Attributes, E extends Attributes> = {
  directed?: boolean;
  nodes?: Array<NodeInput<N>>;
  edges?: Array<EdgeInput<E>>;
};

export type IcebugSigmaGraphOptions<N extends Attributes, E extends Attributes> =
  | IcebugSigmaGraphCSROptions<N, E>
  | IcebugSigmaGraphEdgeListOptions<N, E>;

function toNumber(value: number | bigint): number {
  if (typeof value === "bigint") return Number(value);
  return value;
}

function readCSRValue(values: CSRArray, index: number): number {
  return toNumber(values[index] as number | bigint);
}

function getColumn<T>(rows: Attributes[], key: string, fallback: T): T[] {
  return rows.map((row) => (row[key] === undefined ? fallback : (row[key] as T)));
}

function buildTable(rows: Attributes[], columns: Record<string, unknown[]>): Table {
  const result = { ...columns };
  const keys = new Set<string>();
  rows.forEach((row) => Object.keys(row).forEach((key) => keys.add(key)));
  keys.forEach((key) => {
    if (!result[key]) result[key] = getColumn(rows, key, null);
  });
  return tableFromArrays(result);
}

function isCSROptions<N extends Attributes, E extends Attributes>(
  options: IcebugSigmaGraphOptions<N, E>,
): options is IcebugSigmaGraphCSROptions<N, E> {
  return "csr" in options;
}

function edgeListToCSR<N extends Attributes, E extends Attributes>(
  nodes: Array<NodeInput<N>>,
  edges: Array<EdgeInput<E>>,
  directed: boolean,
): IcebugSigmaGraphCSROptions<N, E> {
  const nodeIndex = new Map(nodes.map((node, index) => [node.key, index]));
  const outgoing: Array<Array<{ target: number; edgeIndex: number }>> = Array.from({ length: nodes.length }, () => []);

  edges.forEach((edge, edgeIndex) => {
    const source = nodeIndex.get(edge.source);
    const target = nodeIndex.get(edge.target);
    if (source === undefined || target === undefined) return;
    outgoing[source].push({ target, edgeIndex });
    if (!directed) outgoing[target].push({ target: source, edgeIndex });
  });

  const indptr = new BigUint64Array(nodes.length + 1);
  const indices: bigint[] = [];
  const edgeIds: bigint[] = [];
  outgoing.forEach((neighbors, sourceIndex) => {
    indptr[sourceIndex] = BigInt(indices.length);
    neighbors.forEach(({ target, edgeIndex }) => {
      indices.push(BigInt(target));
      edgeIds.push(BigInt(edgeIndex));
    });
  });
  indptr[nodes.length] = BigInt(indices.length);

  return {
    directed,
    nodes,
    csr: {
      indptr,
      indices: new BigUint64Array(indices),
      edgeIds: new BigUint64Array(edgeIds),
    },
    edgeAttributes: edges.map((edge) => edge.attributes ?? ({} as E)),
    edgeKeys: edges.map((edge, index) => edge.key ?? `${edge.source}->${edge.target}#${index}`),
  };
}

/**
 * Sigma-compatible, browser-safe graph backed by CSR arrays and columnar
 * metadata. This intentionally does not import @ladybugmem/icebug because that
 * package is a Node native addon and cannot execute inside a Tauri WebView.
 */
export class IcebugSigmaGraph<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> extends EventEmitter implements SigmaGraph<N, E, G> {
  attributes?: G;

  readonly directed: boolean;
  readonly nodeTable: Table;
  readonly edgeTable: Table;

  private nodeOrder: string[];
  private nodeIndex: Map<string, number>;
  private nodeAttributes: N[];
  private edgeOrder: string[];
  private edgeIndex: Map<string, number>;
  private edgeAttributes: E[];
  private edgeSources: Uint32Array;
  private edgeTargets: Uint32Array;
  private outIndptr: CSRArray;
  private outIndices: CSRArray;

  constructor(options: IcebugSigmaGraphOptions<N, E> = {}) {
    super();
    const directed = options.directed ?? true;
    const csrOptions = isCSROptions(options)
      ? options
      : edgeListToCSR(options.nodes ?? [], options.edges ?? [], directed);

    this.directed = csrOptions.directed ?? true;
    this.nodeOrder = csrOptions.nodes.map((node) => node.key);
    this.nodeIndex = new Map(this.nodeOrder.map((key, index) => [key, index]));
    this.nodeAttributes = csrOptions.nodes.map((node) => node.attributes ?? ({} as N));
    this.outIndptr = csrOptions.csr.indptr;
    this.outIndices = csrOptions.csr.indices;

    const edgeCount = this.outIndices.length;
    this.edgeSources = new Uint32Array(edgeCount);
    this.edgeTargets = new Uint32Array(edgeCount);
    this.edgeAttributes = Array.from({ length: edgeCount }, (_, index) => {
      const edgeId = csrOptions.csr.edgeIds ? readCSRValue(csrOptions.csr.edgeIds, index) : index;
      return csrOptions.edgeAttributes?.[edgeId] ?? ({} as E);
    });
    this.edgeOrder = Array.from({ length: edgeCount }, (_, index) => {
      const edgeId = csrOptions.csr.edgeIds ? readCSRValue(csrOptions.csr.edgeIds, index) : index;
      return csrOptions.edgeKeys?.[edgeId] ?? String(edgeId);
    });

    for (let source = 0; source < this.nodeOrder.length; source++) {
      const start = readCSRValue(this.outIndptr, source);
      const end = readCSRValue(this.outIndptr, source + 1);
      for (let ptr = start; ptr < end; ptr++) {
        this.edgeSources[ptr] = source;
        this.edgeTargets[ptr] = readCSRValue(this.outIndices, ptr);
      }
    }

    this.edgeIndex = new Map(this.edgeOrder.map((key, index) => [key, index]));
    this.nodeTable = this.buildNodeTable();
    this.edgeTable = this.buildEdgeTable();
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
    this.nodeOrder.forEach((node, index) => callback(node, this.nodeAttributes[index]));
  }

  forEachEdge(callback: (edge: string, attributes: E, source: string, target: string, sourceAttributes: N, targetAttributes: N) => void): void {
    this.edgeOrder.forEach((edge, index) => {
      const sourceIndex = this.edgeSources[index];
      const targetIndex = this.edgeTargets[index];
      callback(
        edge,
        this.edgeAttributes[index],
        this.nodeOrder[sourceIndex],
        this.nodeOrder[targetIndex],
        this.nodeAttributes[sourceIndex],
        this.nodeAttributes[targetIndex],
      );
    });
  }

  filterNodes(callback: (node: string, attributes: N) => boolean): string[] {
    return this.nodeOrder.filter((node, index) => callback(node, this.nodeAttributes[index]));
  }

  hasNode(node: string): boolean {
    return this.nodeIndex.has(node);
  }

  hasEdge(edge: string): boolean {
    return this.edgeIndex.has(edge);
  }

  source(edge: string): string {
    return this.nodeOrder[this.edgeSources[this.getEdgeIndex(edge)]];
  }

  target(edge: string): string {
    return this.nodeOrder[this.edgeTargets[this.getEdgeIndex(edge)]];
  }

  extremities(edge: string): [string, string] {
    const index = this.getEdgeIndex(edge);
    return [this.nodeOrder[this.edgeSources[index]], this.nodeOrder[this.edgeTargets[index]]];
  }

  getNodeAttributes(node: string): N {
    return this.nodeAttributes[this.getNodeIndex(node)];
  }

  getNodeAttribute(node: string, name: string): unknown {
    return this.getNodeAttributes(node)[name];
  }

  setNodeAttribute(node: string, name: string, value: unknown): void {
    const index = this.getNodeIndex(node);
    this.nodeAttributes[index] = { ...this.nodeAttributes[index], [name]: value };
    this.emit("nodeAttributesUpdated", {
      key: node,
      attributes: this.nodeAttributes[index],
      hints: { attributes: [name] },
    });
  }

  getEdgeAttributes(edge: string): E {
    return this.edgeAttributes[this.getEdgeIndex(edge)];
  }

  degree(node: string): number {
    const index = this.getNodeIndex(node);
    return readCSRValue(this.outIndptr, index + 1) - readCSRValue(this.outIndptr, index);
  }

  neighbors(node: string): string[] {
    const index = this.getNodeIndex(node);
    const start = readCSRValue(this.outIndptr, index);
    const end = readCSRValue(this.outIndptr, index + 1);
    const result: string[] = [];
    for (let ptr = start; ptr < end; ptr++) result.push(this.nodeOrder[readCSRValue(this.outIndices, ptr)]);
    return result;
  }

  private getNodeIndex(node: string): number {
    const index = this.nodeIndex.get(node);
    if (index === undefined) throw new Error(`IcebugSigmaGraph: node "${node}" not found.`);
    return index;
  }

  private getEdgeIndex(edge: string): number {
    const index = this.edgeIndex.get(edge);
    if (index === undefined) throw new Error(`IcebugSigmaGraph: edge "${edge}" not found.`);
    return index;
  }

  private buildNodeTable(): Table {
    return buildTable(this.nodeAttributes, {
      key: this.nodeOrder,
      x: getColumn(this.nodeAttributes, "x", null),
      y: getColumn(this.nodeAttributes, "y", null),
      size: getColumn(this.nodeAttributes, "size", null),
      color: getColumn(this.nodeAttributes, "color", null),
      label: getColumn(this.nodeAttributes, "label", null),
    });
  }

  private buildEdgeTable(): Table {
    return buildTable(this.edgeAttributes, {
      key: this.edgeOrder,
      source: Array.from(this.edgeSources, (source) => this.nodeOrder[source]),
      target: Array.from(this.edgeTargets, (target) => this.nodeOrder[target]),
      sourceIndex: Array.from(this.edgeSources),
      targetIndex: Array.from(this.edgeTargets),
      size: getColumn(this.edgeAttributes, "size", null),
      color: getColumn(this.edgeAttributes, "color", null),
      label: getColumn(this.edgeAttributes, "label", null),
    });
  }
}

export default IcebugSigmaGraph;
