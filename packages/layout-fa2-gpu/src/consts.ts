export type ForceAtlas2Settings = {
  linLogMode: boolean;
  strongGravityMode: boolean;
  outboundAttractionDistribution: boolean;
  edgeWeightInfluence: number;
  scalingRatio: number;
  gravity: number;
  slowDown: number;
  maxForce: number;
  // Repulsion is approximated with a Barnes-Hut-like quad-tree:
  // - quadTreeDepth is the number of grid levels; "auto" picks a depth giving
  //   roughly one cell per node at the finest level.
  // - quadTreeTheta is the precision parameter, between 0.25 and 1. Lower
  //   thetas mean wider per-level neighborhoods, whose cost grows as
  //   1/theta^2.
  quadTreeDepth: number | "auto";
  quadTreeTheta: number;
  // Iterations issued per rendered frame (GPU work only, never blocks).
  // "auto" adapts the count to what the GPU actually sustains: it grows while
  // batches complete in time, and shrinks when the GPU falls behind:
  iterationsPerFrame: number | "auto";
  // Upper bound for the per-frame iterations count (both modes):
  maxIterationsPerFrame: number;
  // Minimum delay (in ms) between two syncs of the positions back to the
  // graphology instance during a live run. 0 syncs on every frame (fine for
  // small-ish graphs, and keeps every CPU-side consumer fresh); Infinity
  // disables the periodic syncs. A final sync always happens when the layout
  // stops.
  backportInterval: number;
};

export const DEFAULT_FORCE_ATLAS_2_SETTINGS: ForceAtlas2Settings = {
  linLogMode: false,
  strongGravityMode: false,
  outboundAttractionDistribution: false,
  edgeWeightInfluence: 1,
  scalingRatio: 1,
  gravity: 1,
  slowDown: 1,
  // Safety net against float32 blow-ups only: high enough to never throttle
  // regular dynamics:
  maxForce: 1000,
  quadTreeDepth: "auto",
  quadTreeTheta: 1,
  iterationsPerFrame: "auto",
  maxIterationsPerFrame: 100,
  backportInterval: 200,
};
