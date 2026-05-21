import { DepthBucketCollection } from "sigma/rendering";
import { beforeEach, describe, expect, test } from "vitest";

// Builds a zIndex comparator key from a plain record; unknown keys map to 0.
const zIndexOf = (z: Record<string, number>) => (key: string) => z[key] ?? 0;

describe("DepthBucketCollection", () => {
  let collection: DepthBucketCollection;

  beforeEach(() => {
    collection = new DepthBucketCollection(["nodes", "topNodes"]);
  });

  test("starts empty", () => {
    expect(collection.has("n1")).toBe(false);
    expect(collection.getBucket("nodes")?.size).toBe(0);
    expect(collection.getSorted("nodes", () => 0)).toEqual([]);
  });

  test("set places a key in its depth bucket", () => {
    collection.set("n1", "nodes");
    expect(collection.has("n1")).toBe(true);
    expect(collection.getBucket("nodes")!.has("n1")).toBe(true);
  });

  test("set is idempotent for the same depth", () => {
    collection.set("n1", "nodes");
    collection.set("n1", "nodes");
    expect([...collection.getBucket("nodes")!]).toEqual(["n1"]);
  });

  test("set moves a key out of its previous bucket", () => {
    collection.set("n1", "nodes");
    collection.set("n1", "topNodes");
    expect(collection.getBucket("nodes")!.has("n1")).toBe(false);
    expect(collection.getBucket("topNodes")!.has("n1")).toBe(true);
  });

  test("set throws for an undeclared depth layer", () => {
    expect(() => collection.set("n1", "ghost")).toThrow();
  });

  test("remove drops a key without needing its depth", () => {
    collection.set("n1", "nodes");
    collection.set("n2", "nodes");
    collection.remove("n1");
    expect(collection.has("n1")).toBe(false);
    expect(collection.getBucket("nodes")!.has("n2")).toBe(true);
  });

  test("remove of an unknown key is a no-op", () => {
    expect(() => collection.remove("ghost")).not.toThrow();
  });

  test("getSorted returns a depth's keys ascending by zIndex", () => {
    collection.set("a", "nodes");
    collection.set("b", "nodes");
    collection.set("c", "nodes");
    expect(collection.getSorted("nodes", zIndexOf({ a: 3, b: 1, c: 2 }))).toEqual(["b", "c", "a"]);
  });

  test("getSorted reflects removals", () => {
    collection.set("a", "nodes");
    collection.set("b", "nodes");
    collection.set("c", "nodes");
    collection.remove("b");
    expect(collection.getSorted("nodes", zIndexOf({ a: 1, b: 2, c: 3 }))).toEqual(["a", "c"]);
  });

  test("getSorted is stable for equal zIndex values", () => {
    collection.set("a", "nodes");
    collection.set("b", "nodes");
    collection.set("c", "nodes");
    // Set iteration is insertion-ordered and Array.sort is stable.
    expect(collection.getSorted("nodes", () => 0)).toEqual(["a", "b", "c"]);
  });

  test("getSorted yields an empty array for an unknown depth", () => {
    expect(collection.getSorted("ghost", () => 0)).toEqual([]);
  });

  test("getSorted only returns the targeted depth's keys", () => {
    collection.set("n1", "nodes");
    collection.set("n2", "topNodes");
    expect(collection.getSorted("nodes", () => 0)).toEqual(["n1"]);
    expect(collection.getSorted("topNodes", () => 0)).toEqual(["n2"]);
  });

  test("clearAll empties every bucket", () => {
    collection.set("n1", "nodes");
    collection.set("n2", "topNodes");
    collection.clearAll();
    expect(collection.has("n1")).toBe(false);
    expect(collection.has("n2")).toBe(false);
    expect(collection.getBucket("nodes")?.size).toBe(0);
  });
});
