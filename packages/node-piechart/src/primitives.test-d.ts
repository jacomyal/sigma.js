import { layerPiechart, piechartSchema } from "@sigma/node-piechart";
import { sdfCircle } from "sigma/rendering";
import { defineSigmaOptions } from "sigma/types";
import { describe, expectTypeOf, test } from "vitest";

describe("@sigma/node-piechart types", () => {
  test("layerPiechart() is accepted in a node layers array", () => {
    const options = defineSigmaOptions({
      primitives: {
        nodes: {
          shapes: [sdfCircle()],
          layers: [layerPiechart({ slices: [{ color: "#f00", value: 1 }] })],
        },
      },
      styles: {
        nodes: { color: "#666", size: 10 },
      },
    });

    expectTypeOf(options).toHaveProperty("primitives");
  });

  test("piechartSchema exposes its expected fields", () => {
    expectTypeOf(piechartSchema).toHaveProperty("slices");
    expectTypeOf(piechartSchema).toHaveProperty("offset");
    expectTypeOf(piechartSchema).toHaveProperty("defaultColor");
  });
});
