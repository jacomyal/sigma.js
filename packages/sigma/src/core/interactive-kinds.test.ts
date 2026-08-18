import { describe, expect, test } from "vitest";

import {
  KIND_NAMES,
  PickingState,
  allocateLabelIds,
  createPickingState,
  registerItem,
  resetKind,
} from "./interactive-kinds";
import { AnyInternals } from "./sigma-internals";

const internals = (nodeLabelEvents: unknown, edgeLabelEvents: unknown = false): AnyInternals =>
  ({ settings: { nodeLabelEvents, edgeLabelEvents } }) as AnyInternals;

/** All allocated (kind, key, id) triples. */
function allAllocations(state: PickingState): { kind: string; key: string; id: number }[] {
  return KIND_NAMES.flatMap((kind) => [...state.idsByKind[kind]].map(([key, id]) => ({ kind, key, id })));
}

function expectConsistent(state: PickingState): void {
  const allocations = allAllocations(state);
  // No two (kind, key) pairs share a picking ID
  const ids = allocations.map((a) => a.id);
  expect(new Set(ids).size).toBe(ids.length);
  // Every allocated ID resolves back to its own (kind, key)
  for (const { kind, key, id } of allocations) {
    expect(state.lookup[id]).toEqual({ kind, key });
  }
}

function fullProcess(state: PickingState): void {
  resetKind(state, "node");
  registerItem(state, "node", "n1");
  registerItem(state, "node", "n2");
  resetKind(state, "edge");
  registerItem(state, "edge", "e1");
}

describe("allocateLabelIds", () => {
  test("a full process gives every kind a disjoint range", () => {
    const state = createPickingState();
    fullProcess(state);
    allocateLabelIds(state, internals("separate", "separate"));

    expectConsistent(state);
  });

  test("a nodes-only reprocess keeps label IDs disjoint from preserved edge IDs", () => {
    const state = createPickingState();
    fullProcess(state);
    allocateLabelIds(state, internals("separate"));
    const before = allAllocations(state);

    // Nodes-only reprocess: edges keep their cached IDs
    resetKind(state, "node");
    registerItem(state, "node", "n1");
    registerItem(state, "node", "n2");
    allocateLabelIds(state, internals("separate"));

    expectConsistent(state);
    // Same graph, same order: the allocation is stable (no spurious invalidation)
    expect(allAllocations(state)).toEqual(before);
  });

  test("a nodes-only reprocess with a removed node leaves no collision", () => {
    const state = createPickingState();
    fullProcess(state);
    allocateLabelIds(state, internals("separate"));

    // n2 is gone; the edge keeps its cached ID beyond the shrunk node range
    resetKind(state, "node");
    registerItem(state, "node", "n1");
    allocateLabelIds(state, internals("separate"));

    expectConsistent(state);
  });
});
