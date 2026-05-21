/**
 * Sigma.js Depth Buckets
 * ======================
 *
 * Groups item keys (nodes or edges) by their `depth` string. Sigma owns one
 * collection per item kind and, at render time, queries each depth in
 * `depthLayers` order to obtain its items sorted by `zIndex`.
 * @module
 */

/**
 * A collection of depth buckets, one per declared depth layer. Each key belongs
 * to exactly one bucket; the collection tracks that placement itself
 * (`keyDepth`), so `set` and `remove` never need a caller-supplied depth and
 * cannot desync from the data caches. Buckets are pre-created for the declared
 * layers, so `set` rejects any depth outside that domain at no extra cost.
 */
export class DepthBucketCollection {
  private buckets = new Map<string, Set<string>>();
  private keyDepth = new Map<string, string>();

  constructor(depthLayers: readonly string[]) {
    for (const layer of depthLayers) this.buckets.set(layer, new Set());
  }

  /** Returns true if the key currently belongs to a bucket. */
  has(key: string): boolean {
    return this.keyDepth.has(key);
  }

  /** Returns the keys at a declared depth layer, or undefined for an undeclared one. */
  getBucket(depth: string): ReadonlySet<string> | undefined {
    return this.buckets.get(depth);
  }

  /**
   * Places `key` at `depth`, removing it from any previous bucket. Throws when
   * `depth` is not a declared depth layer — no bucket was pre-created for it.
   */
  set(key: string, depth: string): void {
    const previous = this.keyDepth.get(key);
    if (previous === depth) return;
    const bucket = this.buckets.get(depth);
    if (!bucket) throw new Error(`Sigma: "${depth}" is not a declared depth layer`);
    if (previous !== undefined) this.buckets.get(previous)?.delete(key);
    bucket.add(key);
    this.keyDepth.set(key, depth);
  }

  /** Removes `key` from whichever bucket holds it. No-op for an unknown key. */
  remove(key: string): void {
    const depth = this.keyDepth.get(key);
    if (depth === undefined) return;
    this.buckets.get(depth)!.delete(key);
    this.keyDepth.delete(key);
  }

  clearAll(): void {
    for (const bucket of this.buckets.values()) bucket.clear();
    this.keyDepth.clear();
  }

  /**
   * Returns the keys at `depth` sorted ascending by `zIndexOf`. The result is a
   * fresh array; an unknown or empty depth yields `[]`.
   */
  getSorted(depth: string, zIndexOf: (key: string) => number): string[] {
    const bucket = this.buckets.get(depth);
    if (!bucket || bucket.size === 0) return [];
    return [...bucket].sort((a, b) => zIndexOf(a) - zIndexOf(b));
  }
}
