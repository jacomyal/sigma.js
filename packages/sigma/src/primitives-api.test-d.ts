import Graph from "graphology";
import Sigma from "sigma";
// Import real schema helpers from sigma/primitives
import { colorProp, enumProp, numberProp, stringProp } from "sigma/primitives";
// Import factory functions
import { layerFill, layerPlain, pathLine, sdfCircle, sdfSquare, sdfTriangle } from "sigma/rendering";
// Import defineSigmaOptions from sigma/types
import { defineSigmaOptions } from "sigma/types";
import { describe, expectTypeOf, test } from "vitest";

// =============================================================================
// TYPE TESTS: Schema helpers
// =============================================================================

describe("Schema helpers", () => {
  test("numberProp creates correct schema type", () => {
    const prop = numberProp(10);
    expectTypeOf(prop.type).toEqualTypeOf<"number">();
    expectTypeOf(prop.default).toEqualTypeOf<number>();
  });

  test("colorProp creates correct schema type", () => {
    const prop = colorProp("#fff");
    expectTypeOf(prop.type).toEqualTypeOf<"color">();
    expectTypeOf(prop.default).toEqualTypeOf<string>();
  });

  test("stringProp creates correct schema type", () => {
    const prop = stringProp("default");
    expectTypeOf(prop.type).toEqualTypeOf<"string">();
    expectTypeOf(prop.default).toEqualTypeOf<string>();
  });

  test("enumProp creates correct schema type", () => {
    const prop = enumProp(["a", "b", "c"] as const, "a");
    expectTypeOf(prop.default).toEqualTypeOf<"a" | "b" | "c">();
  });

  test("variable flag is preserved", () => {
    const withVar = numberProp(0, { variable: true });
    const withoutVar = numberProp(0);

    expectTypeOf(withVar.variable).toEqualTypeOf<true | undefined>();
    expectTypeOf(withoutVar.variable).toEqualTypeOf<false | undefined>();
  });
});

// =============================================================================
// TYPE TESTS: defineSigmaOptions - Minimal Setup
// =============================================================================

describe("defineSigmaOptions - Minimal Setup", () => {
  test("minimal example compiles", () => {
    const options = defineSigmaOptions({
      primitives: {
        nodes: {
          shapes: [sdfCircle()],
          layers: [layerFill()],
        },
        edges: {
          paths: [pathLine()],
          layers: [layerPlain()],
        },
      },
      styles: {
        nodes: {
          color: "#666",
          size: 10,
        },
        edges: {
          color: "#ccc",
          size: 1,
        },
      },
    });

    expectTypeOf(options).toHaveProperty("primitives");
    expectTypeOf(options).toHaveProperty("styles");
  });
});

// =============================================================================
// TYPE TESTS: defineSigmaOptions - With shapes and variables
// =============================================================================

describe("defineSigmaOptions - With shapes and variables", () => {
  test("shapes with variables example compiles", () => {
    const options = defineSigmaOptions({
      primitives: {
        nodes: {
          shapes: [
            sdfCircle(),
            sdfSquare({ cornerRadius: { attribute: "nodeCornerRadius" } }),
            sdfTriangle({ rotation: Math.PI / 6 }),
          ],
          variables: {
            borderSize: { type: "number", default: 0 },
            borderColor: { type: "color", default: "#000" },
            nodeCornerRadius: { type: "number", default: 0 },
          },
          layers: [layerFill()],
        },
      },
      styles: {
        nodes: {
          shape: { attribute: "type", dict: { person: "circle", company: "square" } },
          color: { attribute: "color", defaultValue: "#666" },
          borderSize: { whenState: "isHovered", then: 3 },
          borderColor: "#fff",
          nodeCornerRadius: { attribute: "roundness", defaultValue: 0.1 },
        },
      },
    });

    expectTypeOf(options).toHaveProperty("primitives");
  });
});

// =============================================================================
// TYPE TESTS: defineSigmaOptions - Error Cases
// =============================================================================

describe("defineSigmaOptions - Error Cases", () => {
  test("rejects wrong type for graphic variable", () => {
    defineSigmaOptions({
      primitives: {
        nodes: {
          shapes: [sdfCircle()],
          variables: {
            borderSize: { type: "number", default: 0 },
          },
        },
      },
      styles: {
        // @ts-expect-error - borderSize should be a number, not a string
        nodes: { borderSize: "thick" },
      },
    });
  });

  test("variable default value type is not validated at compile time", () => {
    // Note: The current GraphicVariableDefinition type uses a generic T parameter
    // that doesn't enforce the relationship between `type` and `default`.
    // This limitation means these mismatches are only caught at runtime.
    defineSigmaOptions({
      primitives: {
        nodes: {
          shapes: [sdfCircle()],
          variables: {
            // These mismatches are NOT caught at compile time (would fail at runtime)
            borderSize: { type: "number", default: "large" },
            borderColor: { type: "color", default: 0xffcc00 },
          },
        },
      },
    });
  });

  test("rejects undeclared program variable", () => {
    defineSigmaOptions({
      primitives: {
        nodes: {
          shapes: [sdfCircle()],
          variables: {
            borderSize: { type: "number", default: 0 },
          },
        },
      },
      styles: {
        nodes: {
          color: "#666",
          borderSize: 2,
          // @ts-expect-error - 'borderColor' was not declared in variables
          borderColor: "#fff",
        },
      },
    });
  });

  test("rejects invalid state predicate", () => {
    defineSigmaOptions({
      primitives: {
        nodes: {
          shapes: [sdfCircle()],
        },
      },
      styles: {
        // @ts-expect-error - 'nonExistentState' is not a valid state property
        nodes: { color: { when: "nonExistentState", then: "#f00", else: "#666" } },
      },
    });
  });
});

// =============================================================================
// TYPE TESTS: new Sigma() - Variable inference from primitives to styles
// =============================================================================

describe("new Sigma() - Variable inference from primitives to styles", () => {
  const graph = new Graph();
  const container = document.createElement("div");

  test("declared node variables are accepted in styles", () => {
    new Sigma(graph, container, {
      primitives: {
        nodes: {
          variables: {
            borderSize: { type: "number", default: 0 },
            borderColor: { type: "color", default: "#000" },
          },
        },
      },
      styles: {
        nodes: {
          borderSize: 2,
          borderColor: "#fff",
        },
      },
    });
  });

  test("declared edge variables are accepted in styles", () => {
    new Sigma(graph, container, {
      primitives: {
        edges: {
          variables: {
            dashSize: { type: "number", default: 0 },
            dashColor: { type: "color", default: "transparent" },
          },
        },
      },
      styles: {
        edges: [{ dashSize: 5 }, { dashColor: "#ff0000" }],
      },
    });
  });

  test("rejects undeclared node variable in styles", () => {
    new Sigma(graph, container, {
      primitives: {
        nodes: {
          variables: {
            borderSize: { type: "number", default: 0 },
          },
        },
      },
      styles: {
        nodes: {
          borderSize: 2,
          // @ts-expect-error - 'borderColor' was not declared in variables
          borderColor: "#fff",
        },
      },
    });
  });

  test("rejects undeclared edge variable in styles", () => {
    new Sigma(graph, container, {
      primitives: {
        edges: {
          variables: {
            dashSize: { type: "number", default: 0 },
          },
        },
      },
      styles: {
        // @ts-expect-error - 'bogusVar' was not declared in variables
        edges: [{ bogusVar: 42 }],
      },
    });
  });

  test("rejects wrong type for declared variable", () => {
    new Sigma(graph, container, {
      primitives: {
        nodes: {
          variables: {
            borderSize: { type: "number", default: 0 },
          },
        },
      },
      styles: {
        // @ts-expect-error - borderSize should be a number, not a string
        nodes: { borderSize: "thick" },
      },
    });
  });
});

// =============================================================================
// TYPE TESTS: match/cases style rules
// =============================================================================

describe("matchData/cases style rules", () => {
  const graph = new Graph();
  const container = document.createElement("div");

  test("matchData/cases rule with node styles compiles", () => {
    new Sigma(graph, container, {
      styles: {
        nodes: [
          { color: "#666" },
          { matchData: "type", cases: { person: { color: "#f00", size: 20 }, company: { color: "#0f0" } } },
        ],
      },
    });
  });

  test("matchData/cases rule with edge styles compiles", () => {
    new Sigma(graph, container, {
      styles: {
        edges: [
          { color: "#ccc" },
          { matchData: "type", cases: { cites: { color: "#0f0" }, coauthored: { color: "#f00", size: 3 } } },
        ],
      },
    });
  });

  test("matchData/cases with declared edge variables compiles", () => {
    new Sigma(graph, container, {
      primitives: {
        edges: {
          variables: {
            dashSize: { type: "number", default: 0 },
            dashColor: { type: "color", default: "transparent" },
          },
        },
      },
      styles: {
        edges: [{ matchData: "type", cases: { dashed: { dashSize: 5, dashColor: "#f00" } } }],
      },
    });
  });

  test("matchData/cases with attribute binding in case values compiles", () => {
    new Sigma(graph, container, {
      styles: {
        nodes: [{ matchData: "type", cases: { person: { size: { attribute: "score", min: 5, max: 50 } } } }],
      },
    });
  });

  test("matchData/cases rejects wrong value type in case", () => {
    new Sigma(graph, container, {
      styles: {
        // @ts-expect-error - size should be a number, not a string
        nodes: [{ matchData: "type", cases: { person: { size: "big" } } }],
      },
    });
  });
});
