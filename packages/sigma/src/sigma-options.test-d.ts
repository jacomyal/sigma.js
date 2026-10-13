/**
 * Type tests for the SigmaOptions type.
 */
import Graph from "graphology";
import type { Attributes } from "graphology-types";
import Sigma from "sigma";
import { sdfCircle } from "sigma/rendering";
import type { PrimitivesDeclaration, SigmaOptions } from "sigma/types";
import { describe, expectTypeOf, test } from "vitest";

type NodeAttrs = { label: string; score: number };
type EdgeAttrs = { weight: number };

describe("SigmaOptions", () => {
  type N = { label: string };

  test("accepts constructor options and can be passed to new Sigma()", () => {
    const options: SigmaOptions<N> = {
      settings: { renderLabels: false },
      nodeReducer: (_key, data, attrs) => ({ ...data, label: attrs.label }),
    };
    new Sigma(new Graph<N>(), document.createElement("div"), options);
  });

  test("types reducers with the given node attributes", () => {
    const options: SigmaOptions<N> = {
      // @ts-expect-error - 'missing' is not in N
      nodeReducer: (_key, data, attrs) => ({ ...data, label: attrs.missing }),
    };
    void options;
  });

  test("rejects unknown keys", () => {
    // @ts-expect-error - unknown option
    const options: SigmaOptions = { unknown: true };
    void options;
  });
});

describe("Custom state is inferred from custom*State only, not from styles", () => {
  const container = document.createElement("div");

  test("styles can reference declared custom node and edge state", () => {
    new Sigma(new Graph(), container, {
      customNodeState: { isSelected: false },
      customEdgeState: { isActive: false },
      styles: {
        nodes: { color: { whenState: "isSelected", then: "#f00", else: "#666" } },
        edges: { color: { whenState: { isActive: true }, then: "#f00", else: "#ccc" } },
      },
    });
  });

  test("styles cannot add undeclared node state (string predicate)", () => {
    new Sigma(new Graph(), container, {
      customNodeState: { isSelected: false },
      styles: {
        // @ts-expect-error - 'isPinned' is not declared in customNodeState
        nodes: { color: { whenState: "isPinned", then: "#f00", else: "#666" } },
      },
    });
  });

  test("styles cannot add undeclared node state (object predicate)", () => {
    new Sigma(new Graph(), container, {
      customNodeState: { isSelected: false },
      styles: {
        // @ts-expect-error - 'isPinned' is not declared in customNodeState
        nodes: { color: { whenState: { isPinned: true }, then: "#f00", else: "#666" } },
      },
    });
  });

  test("styles cannot add undeclared edge state (object predicate)", () => {
    new Sigma(new Graph(), container, {
      customEdgeState: { isActive: false },
      styles: {
        // @ts-expect-error - 'isPinned' is not declared in customEdgeState
        edges: { color: { whenState: { isPinned: true }, then: "#f00", else: "#ccc" } },
      },
    });
  });
});

describe("Reducers are typed from inferred generics", () => {
  const container = document.createElement("div");

  test("nodeReducer receives N from the graph and NS/GS from custom state", () => {
    new Sigma(new Graph<NodeAttrs, EdgeAttrs>(), container, {
      customNodeState: { isSelected: false },
      customGraphState: { isFiltered: false },
      nodeReducer: (_key, data, attrs, state, graphState) => {
        expectTypeOf(attrs).toEqualTypeOf<NodeAttrs>();
        expectTypeOf(state.isSelected).toBeBoolean();
        expectTypeOf(state.isHovered).toBeBoolean();
        expectTypeOf(graphState.isFiltered).toBeBoolean();
        return data;
      },
    });
  });

  test("edgeReducer receives E from the graph and ES/GS from custom state", () => {
    new Sigma(new Graph<NodeAttrs, EdgeAttrs>(), container, {
      customEdgeState: { isActive: false },
      customGraphState: { isFiltered: false },
      edgeReducer: (_key, data, attrs, state, graphState) => {
        expectTypeOf(attrs).toEqualTypeOf<EdgeAttrs>();
        expectTypeOf(state.isActive).toBeBoolean();
        expectTypeOf(state.isHovered).toBeBoolean();
        expectTypeOf(graphState.isFiltered).toBeBoolean();
        return data;
      },
    });
  });

  test("nodeReducer cannot read undeclared custom state", () => {
    new Sigma(new Graph<NodeAttrs, EdgeAttrs>(), container, {
      customNodeState: { isSelected: false },
      nodeReducer: (_key, data, _attrs, state) => {
        // @ts-expect-error - 'isPinned' is not declared in customNodeState
        void state.isPinned;
        return data;
      },
    });
  });
});

describe("Explicit generics combined with options", () => {
  const container = document.createElement("div");

  test("explicit N and E type the reducers", () => {
    new Sigma<NodeAttrs, EdgeAttrs>(new Graph<NodeAttrs, EdgeAttrs>(), container, {
      settings: { renderLabels: false },
      nodeReducer: (_key, data, attrs) => {
        expectTypeOf(attrs).toEqualTypeOf<NodeAttrs>();
        return data;
      },
      edgeReducer: (_key, data, attrs) => {
        expectTypeOf(attrs).toEqualTypeOf<EdgeAttrs>();
        return data;
      },
    });
  });

  test("explicit NS types customNodeState and the reducer state", () => {
    new Sigma<Attributes, Attributes, Attributes, { isSelected: boolean }>(new Graph(), container, {
      customNodeState: { isSelected: false },
      nodeReducer: (_key, data, _attrs, state) => {
        expectTypeOf(state.isSelected).toBeBoolean();
        return data;
      },
    });
  });

  test("explicit NS rejects a mismatching customNodeState", () => {
    new Sigma<Attributes, Attributes, Attributes, { isSelected: boolean }>(new Graph(), container, {
      // @ts-expect-error - isSelected must be a boolean
      customNodeState: { isSelected: 0 },
    });
  });
});

describe("SigmaOptions with explicit P", () => {
  const container = document.createElement("div");
  const primitives = {
    nodes: {
      shapes: [sdfCircle()],
      variables: { borderSize: { type: "number", default: 0 } },
    },
    edges: {
      variables: { dashColor: { type: "color", default: "transparent" } },
    },
    depthLayers: ["back", "front"],
  } as const satisfies PrimitivesDeclaration;
  type P = typeof primitives;
  type Options = SigmaOptions<Attributes, Attributes, Attributes, {}, {}, {}, P>;

  test("declared variables and depth layers are accepted in styles", () => {
    const options: Options = {
      primitives,
      styles: {
        nodes: { borderSize: 2, depth: "front" },
        edges: { dashColor: "#f00", depth: "back" },
      },
    };
    new Sigma(new Graph(), container, options);
  });

  test("rejects undeclared variables", () => {
    const options: Options = {
      primitives,
      styles: {
        // @ts-expect-error - 'borderColor' is not declared in primitives
        nodes: { borderColor: "#fff" },
        // @ts-expect-error - 'dashSize' is not declared in primitives
        edges: { dashSize: 5 },
      },
    };
    void options;
  });

  test("rejects wrong value type for a declared variable", () => {
    const options: Options = {
      primitives,
      styles: {
        // @ts-expect-error - borderSize should be a number, not a string
        nodes: { borderSize: "thick" },
      },
    };
    void options;
  });

  test("rejects depth layers missing from depthLayers", () => {
    const options: Options = {
      primitives,
      styles: {
        // @ts-expect-error - "nodes" is not part of the custom depthLayers
        nodes: { depth: "nodes" },
      },
    };
    void options;
  });

  test("without P, declared variables are not available in styles", () => {
    const options: SigmaOptions = {
      primitives,
      styles: {
        // @ts-expect-error - P defaults to PrimitivesDeclaration, which declares no variables
        nodes: { borderSize: 2 },
      },
    };
    void options;
  });
});

describe("SigmaOptions with explicit NS", () => {
  const container = document.createElement("div");
  type NodeState = { isSelected: boolean; score: number };
  type Options = SigmaOptions<Attributes, Attributes, Attributes, NodeState>;

  test("types customNodeState, styles state predicates and reducer state", () => {
    const options: Options = {
      customNodeState: { isSelected: false, score: 0 },
      styles: {
        nodes: [
          { color: { whenState: "isSelected", then: "#f00", else: "#666" } },
          { color: { whenState: { isSelected: true }, then: "#f00" } },
        ],
      },
      nodeReducer: (_key, data, _attrs, state) => {
        expectTypeOf(state.isSelected).toBeBoolean();
        expectTypeOf(state.score).toBeNumber();
        expectTypeOf(state.isHovered).toBeBoolean();
        return data;
      },
    };
    void options;
  });

  test("rejects undeclared state in styles", () => {
    const options: Options = {
      customNodeState: { isSelected: false, score: 0 },
      styles: {
        // @ts-expect-error - 'isPinned' is not part of NS
        nodes: { color: { whenState: "isPinned", then: "#f00", else: "#666" } },
      },
    };
    void options;
  });

  test("rejects a mismatching or incomplete customNodeState", () => {
    const wrongType: Options = {
      // @ts-expect-error - score must be a number
      customNodeState: { isSelected: false, score: "high" },
    };
    const missingKey: Options = {
      // @ts-expect-error - score is missing
      customNodeState: { isSelected: false },
    };
    void wrongType;
    void missingKey;
  });

  test("passing the options to new Sigma() infers NS", () => {
    const options: Options = { customNodeState: { isSelected: false, score: 0 } };
    const sigma = new Sigma(new Graph(), container, options);
    const nodeState = sigma.getNodeState("n1");
    expectTypeOf(nodeState.isSelected).toBeBoolean();
    expectTypeOf(nodeState.score).toBeNumber();
  });
});
