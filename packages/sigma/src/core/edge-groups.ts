/**
 * Sigma.js Edge Group Index
 * =========================
 *
 * Tracks groups of edges that share the same endpoint pair (parallel edges),
 * including self-loops that share the same node. Maintains a sorted order
 * within each group so that forward-direction edges come before reverse-direction
 * ones, and notifies sigma whenever a group changes so that parallelIndex/
 * parallelCount state fields stay up to date.
 *
 * @module
 */
import Graph from "graphology-types";

function groupKey(source: string, target: string): string {
  return source < target ? `${source}\0${target}` : `${target}\0${source}`;
}

/**
 * Manages grouping and ordering of parallel edges (edges that share both
 * endpoints). Calls the provided callback whenever a group's membership or
 * order changes so that callers can update per-edge state accordingly.
 */
export class EdgeGroupIndex {
  private groups: Map<string, string[]> = new Map();
  private edgeToGroupKey: Map<string, string> = new Map();

  constructor(
    private graph: Graph,
    // Called with the full ordered group and its size whenever the group changes.
    private onGroupChanged: (edges: string[], count: number) => void,
  ) {}

  private getGroupKey(edge: string): string {
    return groupKey(this.graph.source(edge), this.graph.target(edge));
  }

  // Canonical-source edges sort before reverse-direction ones.
  private sortGroup(group: string[], groupKey: string): void {
    const canonicalSource = groupKey.split("\0")[0];
    group.sort((a, b) => {
      const aForward = this.graph.source(a) === canonicalSource || !this.graph.isDirected(a) ? 0 : 1;
      const bForward = this.graph.source(b) === canonicalSource || !this.graph.isDirected(b) ? 0 : 1;
      return aForward - bForward;
    });
  }

  register(edge: string): void {
    const groupKey = this.getGroupKey(edge);
    let group = this.groups.get(groupKey);
    if (!group) {
      group = [];
      this.groups.set(groupKey, group);
    }
    if (!group.includes(edge)) group.push(edge);
    this.edgeToGroupKey.set(edge, groupKey);
    if (group.length > 1) this.sortGroup(group, groupKey);
    this.onGroupChanged(group, group.length);
  }

  unregister(edge: string): void {
    const groupKey = this.edgeToGroupKey.get(edge);
    if (!groupKey) return;

    this.edgeToGroupKey.delete(edge);
    const group = this.groups.get(groupKey);
    if (!group) return;

    const idx = group.indexOf(edge);
    if (idx !== -1) group.splice(idx, 1);

    if (group.length === 0) {
      this.groups.delete(groupKey);
    } else {
      this.onGroupChanged(group, group.length);
    }
  }

  getGroup(edge: string): string[] {
    const groupKey = this.edgeToGroupKey.get(edge);
    if (!groupKey) return [];
    return this.groups.get(groupKey) ?? [];
  }

  getSiblings(edge: string): string[] {
    return this.getGroup(edge).filter((e) => e !== edge);
  }

  rebuild(): void {
    this.groups.clear();
    this.edgeToGroupKey.clear();

    this.graph.forEachEdge((edge, _attributes, source, target) => {
      const key = groupKey(source, target);
      let group = this.groups.get(key);
      if (!group) {
        group = [];
        this.groups.set(key, group);
      }
      group.push(edge);
      this.edgeToGroupKey.set(edge, key);
    });

    for (const [key, group] of this.groups) {
      if (group.length > 1) this.sortGroup(group, key);
      this.onGroupChanged(group, group.length);
    }
  }

  clear(): void {
    this.groups.clear();
    this.edgeToGroupKey.clear();
  }
}
