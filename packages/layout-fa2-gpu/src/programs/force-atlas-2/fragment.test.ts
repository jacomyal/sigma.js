import { describe, expect, test } from "vitest";

import { getForceAtlas2FragmentShader } from "./fragment";

describe("getForceAtlas2FragmentShader", () => {
  const BASE = {
    nodesCount: 10,
    edgeEntriesCount: 24,
    linLogMode: false,
    strongGravityMode: false,
    outboundAttractionDistribution: false,
    quadTreeDepth: 5,
    quadTreeTheta: 1,
  };

  test("it should bake the graph dimensions as defines", () => {
    const shader = getForceAtlas2FragmentShader(BASE);
    expect(shader).toContain("#define NODES_COUNT 10.0");
    expect(shader).toContain("#define NODES_TEXTURE_SIZE 4.0");
    expect(shader).toContain("#define EDGES_TEXTURE_SIZE 5.0");
    expect(shader).not.toContain("#define LINLOG_MODE");
  });

  test("it should reflect the FA2 mode flags", () => {
    const shader = getForceAtlas2FragmentShader({
      ...BASE,
      linLogMode: true,
      strongGravityMode: true,
      outboundAttractionDistribution: true,
    });
    expect(shader).toContain("#define LINLOG_MODE");
    expect(shader).toContain("#define STRONG_GRAVITY_MODE");
    expect(shader).toContain("#define OUTBOUND_ATTRACTION_DISTRIBUTION");
  });

  test("it should configure the quad-tree from depth and theta", () => {
    const shader = getForceAtlas2FragmentShader({
      ...BASE,
      quadTreeDepth: 5,
      quadTreeTheta: 0.5,
    });
    expect(shader).toContain("#define QUAD_TREE_DEPTH 5");
    // theta = 0.5 -> ring = ceil(1 / 0.5) = 2:
    expect(shader).toContain("#define QUAD_TREE_RING 2");
  });
});
