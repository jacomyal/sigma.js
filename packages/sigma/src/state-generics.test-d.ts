import Graph from "graphology";
import Sigma from "sigma";
import type {
  BaseEdgeState,
  BaseGraphState,
  BaseNodeState,
  FullEdgeState,
  FullGraphState,
  FullNodeState,
} from "sigma/types";
import { describe, expectTypeOf, test } from "vitest";

// =============================================================================
// CUSTOM STATE TYPE DEFINITIONS
// =============================================================================

/**
 * Additional node state with custom properties.
 */
interface CustomNodeState {
  isSelected: boolean;
  isPinned: boolean;
  customScore: number;
}

/**
 * Additional edge state with custom properties.
 */
interface CustomEdgeState {
  isSelected: boolean;
  weight: number;
}

/**
 * Additional graph state with custom properties.
 */
interface CustomGraphState {
  isFiltered: boolean;
  searchQuery: string;
}

// =============================================================================
// TYPE TESTS: Default State Types
// =============================================================================

describe("Default state types", () => {
  test("Sigma with default types has correct state methods", () => {
    const graph = new Graph();
    const sigma = new Sigma(graph, document.createElement("div"));

    // getNodeState returns BaseNodeState (FullNodeState<{}>)
    const nodeState = sigma.getNodeState("n1");
    expectTypeOf(nodeState).toMatchTypeOf<BaseNodeState>();
    expectTypeOf(nodeState.isHovered).toBeBoolean();
    expectTypeOf(nodeState.isHidden).toBeBoolean();
    expectTypeOf(nodeState.isHighlighted).toBeBoolean();

    // getEdgeState returns BaseEdgeState (FullEdgeState<{}>)
    const edgeState = sigma.getEdgeState("e1");
    expectTypeOf(edgeState).toMatchTypeOf<BaseEdgeState>();
    expectTypeOf(edgeState.isHovered).toBeBoolean();
    expectTypeOf(edgeState.isHidden).toBeBoolean();
    expectTypeOf(edgeState.isHighlighted).toBeBoolean();

    // getGraphState returns BaseGraphState (FullGraphState<{}>)
    const graphState = sigma.getGraphState();
    expectTypeOf(graphState).toMatchTypeOf<BaseGraphState>();
    expectTypeOf(graphState.isIdle).toBeBoolean();
    expectTypeOf(graphState.isPanning).toBeBoolean();
    expectTypeOf(graphState.hasHovered).toBeBoolean();
  });

  test("setNodeState accepts partial BaseNodeState", () => {
    const graph = new Graph();
    const sigma = new Sigma(graph, document.createElement("div"));

    // Valid partial state
    sigma.setNodeState("n1", { isHovered: true });
    sigma.setNodeState("n1", { isHidden: false, isHighlighted: true });

    // Returns this for chaining
    expectTypeOf(sigma.setNodeState("n1", {})).toEqualTypeOf<typeof sigma>();
  });
});

// =============================================================================
// TYPE TESTS: Custom State Types (via explicit generics)
// =============================================================================

describe("Custom state types via explicit generics", () => {
  test("Sigma with custom node state has correctly typed methods", () => {
    const graph = new Graph();
    const sigma = new Sigma<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>, CustomNodeState>(
      graph,
      document.createElement("div"),
    );

    // getNodeState returns FullNodeState<CustomNodeState>
    const nodeState = sigma.getNodeState("n1");
    expectTypeOf(nodeState).toMatchTypeOf<FullNodeState<CustomNodeState>>();
    expectTypeOf(nodeState.isSelected).toBeBoolean();
    expectTypeOf(nodeState.isPinned).toBeBoolean();
    expectTypeOf(nodeState.customScore).toBeNumber();

    // Base properties still available
    expectTypeOf(nodeState.isHovered).toBeBoolean();
    expectTypeOf(nodeState.isHidden).toBeBoolean();
  });

  test("Sigma with custom edge state has correctly typed methods", () => {
    const graph = new Graph();
    const sigma = new Sigma<
      Record<string, unknown>,
      Record<string, unknown>,
      Record<string, unknown>,
      {},
      CustomEdgeState
    >(graph, document.createElement("div"));

    // getEdgeState returns FullEdgeState<CustomEdgeState>
    const edgeState = sigma.getEdgeState("e1");
    expectTypeOf(edgeState).toMatchTypeOf<FullEdgeState<CustomEdgeState>>();
    expectTypeOf(edgeState.isSelected).toBeBoolean();
    expectTypeOf(edgeState.weight).toBeNumber();

    // Base properties still available
    expectTypeOf(edgeState.isHovered).toBeBoolean();
  });

  test("Sigma with custom graph state has correctly typed methods", () => {
    const graph = new Graph();
    const sigma = new Sigma<
      Record<string, unknown>,
      Record<string, unknown>,
      Record<string, unknown>,
      {},
      {},
      CustomGraphState
    >(graph, document.createElement("div"));

    // getGraphState returns FullGraphState<CustomGraphState>
    const graphState = sigma.getGraphState();
    expectTypeOf(graphState).toMatchTypeOf<FullGraphState<CustomGraphState>>();
    expectTypeOf(graphState.isFiltered).toBeBoolean();
    expectTypeOf(graphState.searchQuery).toBeString();

    // Base properties still available
    expectTypeOf(graphState.isIdle).toBeBoolean();
    expectTypeOf(graphState.hasHovered).toBeBoolean();
  });
});

// =============================================================================
// TYPE TESTS: Custom State Types (via inference from defaults)
// =============================================================================

describe("Custom state types via inference from defaults", () => {
  test("NS is inferred from customNodeState", () => {
    const graph = new Graph();
    const sigma = new Sigma(graph, document.createElement("div"), {
      customNodeState: { isSelected: false, isPinned: false, customScore: 0 },
    });

    const nodeState = sigma.getNodeState("n1");
    expectTypeOf(nodeState.isSelected).toBeBoolean();
    expectTypeOf(nodeState.isPinned).toBeBoolean();
    expectTypeOf(nodeState.customScore).toBeNumber();
    // Base properties still available
    expectTypeOf(nodeState.isHovered).toBeBoolean();
  });

  test("ES is inferred from customEdgeState", () => {
    const graph = new Graph();
    const sigma = new Sigma(graph, document.createElement("div"), {
      customEdgeState: { isSelected: false, weight: 0 },
    });

    const edgeState = sigma.getEdgeState("e1");
    expectTypeOf(edgeState.isSelected).toBeBoolean();
    expectTypeOf(edgeState.weight).toBeNumber();
    // Base properties still available
    expectTypeOf(edgeState.isHovered).toBeBoolean();
  });

  test("GS is inferred from customGraphState", () => {
    const graph = new Graph();
    const sigma = new Sigma(graph, document.createElement("div"), {
      customGraphState: { isFiltered: false, searchQuery: "" },
    });

    const graphState = sigma.getGraphState();
    expectTypeOf(graphState.isFiltered).toBeBoolean();
    expectTypeOf(graphState.searchQuery).toBeString();
    // Base properties still available
    expectTypeOf(graphState.isIdle).toBeBoolean();
  });
});

// =============================================================================
// TYPE TESTS: State Mutation with Custom Types
// =============================================================================

describe("State mutation with custom types", () => {
  test("setNodeState accepts custom state properties", () => {
    const graph = new Graph();
    const sigma = new Sigma(graph, document.createElement("div"), {
      customNodeState: { isSelected: false, isPinned: false, customScore: 0 },
    });

    // Valid custom properties
    sigma.setNodeState("n1", { isSelected: true });
    sigma.setNodeState("n1", { isPinned: true, customScore: 42 });
    sigma.setNodeState("n1", { isHovered: true, isSelected: false });
  });

  test("setEdgeState accepts custom state properties", () => {
    const graph = new Graph();
    const sigma = new Sigma(graph, document.createElement("div"), {
      customEdgeState: { isSelected: false, weight: 0 },
    });

    // Valid custom properties
    sigma.setEdgeState("e1", { isSelected: true });
    sigma.setEdgeState("e1", { weight: 0.5 });
  });

  test("setGraphState accepts custom state properties", () => {
    const graph = new Graph();
    const sigma = new Sigma(graph, document.createElement("div"), {
      customGraphState: { isFiltered: false, searchQuery: "" },
    });

    // Valid custom properties
    sigma.setGraphState({ isFiltered: true });
    sigma.setGraphState({ searchQuery: "test" });
    sigma.setGraphState({ isIdle: false, isFiltered: true });
  });

  test("setNodesState batch updates with custom state", () => {
    const graph = new Graph();
    const sigma = new Sigma(graph, document.createElement("div"), {
      customNodeState: { isSelected: false, isPinned: false, customScore: 0 },
    });

    // Batch update with custom properties
    sigma.setNodesState(["n1", "n2"], { isSelected: true });
    sigma.setNodesState(["n1", "n2"], { isPinned: false, customScore: 0 });
  });
});

// =============================================================================
// TYPE TESTS: Error Cases
// =============================================================================

describe("Custom state error cases", () => {
  test("rejects invalid property types on custom node state", () => {
    const graph = new Graph();
    const sigma = new Sigma(graph, document.createElement("div"), {
      customNodeState: { customScore: 0, isSelected: false },
    });

    // @ts-expect-error - customScore should be number, not string
    sigma.setNodeState("n1", { customScore: "high" });

    // @ts-expect-error - isSelected should be boolean, not number
    sigma.setNodeState("n1", { isSelected: 1 });
  });

  test("rejects invalid property types on custom edge state", () => {
    const graph = new Graph();
    const sigma = new Sigma(graph, document.createElement("div"), {
      customEdgeState: { weight: 0 },
    });

    // @ts-expect-error - weight should be number, not string
    sigma.setEdgeState("e1", { weight: "heavy" });
  });

  test("rejects invalid property types on custom graph state", () => {
    const graph = new Graph();
    const sigma = new Sigma(graph, document.createElement("div"), {
      customGraphState: { searchQuery: "" },
    });

    // @ts-expect-error - searchQuery should be string, not number
    sigma.setGraphState({ searchQuery: 123 });
  });

  test("rejects custom state keys that collide with base state", () => {
    const graph = new Graph();

    new Sigma(graph, document.createElement("div"), {
      // @ts-expect-error - isHovered collides with BaseNodeState
      customNodeState: { isHovered: true },
    });

    new Sigma(graph, document.createElement("div"), {
      // @ts-expect-error - isHidden collides with BaseEdgeState
      customEdgeState: { isHidden: false },
    });

    new Sigma(graph, document.createElement("div"), {
      // @ts-expect-error - isIdle collides with BaseGraphState
      customGraphState: { isIdle: true },
    });
  });
});
