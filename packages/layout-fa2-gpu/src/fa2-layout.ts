import Sigma from "sigma";
import { GLStateGuard } from "sigma/rendering";
import { TypedEventEmitter } from "sigma/types";

import { DEFAULT_FORCE_ATLAS_2_SETTINGS, ForceAtlas2Settings } from "./consts";
import { ForceAtlas2Program } from "./programs/force-atlas-2";
import { QuadTreeGPU, getDefaultQuadTreeDepth } from "./programs/quad-tree";
import { ScatterProgram } from "./programs/scatter";
import { AsyncTexelsReader, getTextureSize } from "./utils";

const ATTRIBUTES_PER_ITEM = {
  nodesPosition: 4,
  nodesMovement: 4,
  nodesMetadata: 4,
  edges: 2,
} as const;

// Custom node/edge/graph state and primitives don't affect the layout, so any
// Sigma instance is accepted:
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FA2GPUCompatibleSigma = Sigma<any, any, any, any, any, any, any>;

export type ForceAtlas2GPULayoutEvents = {
  started(): void;
  stopped(payload: { reason: StopReason }): void;
};

export type StopReason =
  // The user called stop() (or started another run while one was on):
  | "stop"
  // The requested iterations count has been reached:
  | "iterations"
  // The requested duration has elapsed:
  | "duration"
  // The graph structure changed (nodes or edges added/dropped):
  | "structure"
  // The layout (or its renderer) was killed:
  | "kill";

// Budget of a run: it ends as soon as either limit is reached (omit both for
// an unbounded run, ended by stop()):
export type RunBudget = {
  iterations?: number;
  duration?: number;
};

// Loose typing of graphology's "nodeAttributesUpdated" payload:
type NodeAttributesUpdatedPayload = {
  type: "set" | "remove" | "replace" | "merge" | "update";
  key: string;
  name?: string | number | symbol;
  data?: Record<string, unknown>;
};

/**
 * GPU-computed ForceAtlas2 layout, running directly in a sigma renderer's
 * WebGL context. Iterations happen in the layout's own ping-pong float
 * textures, and the resulting positions are copied straight into sigma's node
 * data texture every frame (one GPU draw call), so rendering never waits for
 * a CPU readback.
 *
 * Runs come in two modes: live (start()/stop(), sigma renders the moving
 * graph every frame) and headless (run(), iterations only — typically
 * awaited behind a loading overlay, sigma refreshes once at the end).
 *
 * The graphology instance stays the source of truth for the graph structure
 * and the long-term store for positions:
 * - Positions are read from graphology when a run starts.
 * - They are written back ("backported") at most every `backportInterval` ms
 *   during a live run, and always when a run stops. In between, CPU-side
 *   position consumers (labels, coordinate conversions) lag behind by up to
 *   that interval.
 * - While a run is active, the layout owns positions: external x/y writes to
 *   graphology are forwarded into the simulation (which is what makes
 *   dragging nodes during a run work), and any structural change stops the
 *   run (after a final backport of the surviving nodes).
 */
export class ForceAtlas2GPULayout extends TypedEventEmitter<ForceAtlas2GPULayoutEvents> {
  // At most this many issued-but-not-finished batches of iterations. 2 keeps
  // the GPU busy while a batch runs, without letting the command queue grow
  // unboundedly (which freezes the whole page when the GPU can't keep up):
  private static readonly MAX_PENDING_BATCHES = 2;

  private renderer: FA2GPUCompatibleSigma;
  private gl: WebGL2RenderingContext;
  private guard: GLStateGuard;
  private params: ForceAtlas2Settings;

  // Internal state:
  private running = false;
  // "live" renders every frame (scatter + backports); "headless" only
  // iterates, and syncs everything once at the end:
  private mode: "live" | "headless" | null = null;
  private remainingIterations = -1;
  private deadline: number | null = null;
  private headlessTimeout: ReturnType<typeof setTimeout> | null = null;
  private totalIterations = 0;
  // Current per-frame iterations count in "auto" mode, adapted with an
  // AIMD-style controller (see issueIterations). Kept across runs, since the
  // GPU throughput doesn't change between them:
  private adaptiveIterationsPerFrame = 10;
  private batchFences: WebGLSync[] = [];
  private lastBackportTime = 0;
  private backportPending = false;
  private pendingMovedNodes = new Set<string>();
  private fixedNodes = new Set<string>();
  private pendingFixedUpdates = new Set<string>();
  private sigmaIndicesDirty = true;
  private killed = false;

  // Graph data and various caches:
  private nodeKeys: string[] = [];
  private nodeDataCache: Record<string, { index: number; mass: number }> = {};
  private edgeEntriesCount = 0;
  private outboundAttCompensation = 0;
  private nodesPositionArray: Float32Array = new Float32Array();
  private nodesMovementArray: Float32Array = new Float32Array();
  private nodesMetadataArray: Float32Array = new Float32Array();
  private edgesArray: Float32Array = new Float32Array();

  // Programs (rebuilt when the graph dimensions or shader-affecting settings
  // change):
  private fa2Program: ForceAtlas2Program | null = null;
  private quadTree: QuadTreeGPU | null = null;
  private scatter: ScatterProgram | null = null;
  // Asynchronous readback for backports:
  private positionsReader: AsyncTexelsReader | null = null;
  private programsKey = "";

  // Bound listeners:
  private handleFrame = () => this.onFrame();
  private handleAfterProcess = () => {
    // A reprocess can reallocate sigma's texture indices:
    this.sigmaIndicesDirty = true;
  };
  private handleRendererKill = () => this.kill();
  private handleStructuralChange = () => this.stopRun("structure");
  private handleNodeUpdate = (payload: NodeAttributesUpdatedPayload) => {
    const touchesPosition =
      payload.type === "set" || payload.type === "remove"
        ? payload.name === "x" || payload.name === "y"
        : payload.type === "merge" || payload.type === "update"
          ? !!payload.data && ("x" in payload.data || "y" in payload.data)
          : true;
    if (touchesPosition) this.pendingMovedNodes.add(payload.key);
  };
  constructor(renderer: FA2GPUCompatibleSigma, params: Partial<ForceAtlas2Settings> = {}) {
    super();

    this.renderer = renderer;
    this.gl = renderer.getWebGLContext();
    this.guard = new GLStateGuard(this.gl);
    this.params = { ...DEFAULT_FORCE_ATLAS_2_SETTINGS, ...params };

    if (!this.gl.getExtension("EXT_color_buffer_float"))
      throw new Error("ForceAtlas2GPULayout: EXT_color_buffer_float extension not supported");
    // The quad-tree accumulates cells with additive blending on float
    // textures:
    if (!this.gl.getExtension("EXT_float_blend"))
      throw new Error("ForceAtlas2GPULayout: EXT_float_blend extension not supported");

    renderer.on("afterTexturesUpload", this.handleFrame);
    renderer.on("afterProcess", this.handleAfterProcess);
    renderer.on("kill", this.handleRendererKill);
  }

  /**
   * Public API:
   * ***********
   */

  /**
   * Starts a live run: sigma renders the moving graph every frame. Accepts an
   * iterations count (-1 runs until stop()), or a {@link RunBudget}.
   */
  public start(budget: number | RunBudget = -1) {
    this.beginRun("live", typeof budget === "number" ? { iterations: budget } : budget);
  }

  /**
   * Starts a headless run: the layout only iterates, without rendering nor
   * live backports, until its budget is exhausted (or stop() is called).
   * Positions are then synced to graphology at once — which
   * refreshes sigma — and the promise resolves. Typically awaited behind a
   * loading overlay.
   */
  public run(budget: RunBudget = {}): Promise<StopReason> {
    const started = this.beginRun("headless", budget);
    if (!started) return Promise.resolve("stop");

    // beginRun ended any previous run synchronously, so the next "stopped"
    // event is this run's:
    return new Promise((resolve) => {
      this.once("stopped", ({ reason }) => resolve(reason));
    });
  }

  public stop() {
    this.stopRun("stop");
  }

  public isRunning() {
    return this.running;
  }

  public getTotalIterations() {
    return this.totalIterations;
  }

  /**
   * Returns the iterations count currently issued per frame (the adapted
   * value in "auto" mode, the configured one else).
   */
  public getCurrentIterationsPerFrame(): number {
    const { iterationsPerFrame, maxIterationsPerFrame } = this.params;
    const count = iterationsPerFrame === "auto" ? Math.round(this.adaptiveIterationsPerFrame) : iterationsPerFrame;
    return Math.max(1, Math.min(count, maxIterationsPerFrame));
  }

  public getSettings(): ForceAtlas2Settings {
    return { ...this.params };
  }

  /**
   * Updates settings. Force parameters (gravity, scalingRatio, etc.) apply to
   * the next iterations; shader-affecting settings (the FA2 mode flags, the
   * quad-tree geometry) apply on the next start().
   */
  public setSettings(params: Partial<ForceAtlas2Settings>) {
    this.params = { ...this.params, ...params };
  }

  /**
   * Fixes or releases a node. A fixed node does not move under the layout's
   * forces, but still repulses and attracts the other nodes. Can be called at
   * any time, including while the layout runs.
   */
  public setNodeFixed(node: string, fixed: boolean): void {
    if (fixed === this.fixedNodes.has(node)) return;

    if (fixed) this.fixedNodes.add(node);
    else this.fixedNodes.delete(node);
    // Applied at the next frame when a run is on; readGraph handles the
    // stopped case at the next start:
    if (this.running) this.pendingFixedUpdates.add(node);
  }

  public isNodeFixed(node: string): boolean {
    return this.fixedNodes.has(node);
  }

  /**
   * Stops the run without backporting, and frees every GPU resource. Called
   * automatically when the renderer is killed.
   */
  public kill() {
    if (this.killed) return;
    if (this.running) this.stopRun("kill", { backport: false });

    this.renderer.off("afterTexturesUpload", this.handleFrame);
    this.renderer.off("afterProcess", this.handleAfterProcess);
    this.renderer.off("kill", this.handleRendererKill);

    this.guard.save();
    try {
      this.fa2Program?.kill();
      this.quadTree?.kill();
      this.scatter?.kill();
      this.positionsReader?.kill();
    } finally {
      this.guard.restore();
    }
    this.fa2Program = null;
    this.quadTree = null;
    this.scatter = null;
    this.positionsReader = null;
    this.programsKey = "";
    this.killed = true;
  }

  /**
   * Internal lifecycle:
   * *******************
   */
  private beginRun(mode: "live" | "headless", { iterations = -1, duration }: RunBudget): boolean {
    if (this.killed) throw new Error("ForceAtlas2GPULayout: layout was killed");

    const graph = this.renderer.getGraph();
    if (!graph.order) return false;

    if (this.running) this.stopRun("stop");

    this.readGraph();

    this.guard.save();
    try {
      this.ensurePrograms();
      const fa2Program = this.fa2Program!;
      this.positionsReader!.cancel();
      fa2Program.setData({
        nodesPosition: this.nodesPositionArray,
        nodesMovement: this.nodesMovementArray,
        nodesMetadata: this.nodesMetadataArray,
        edges: this.edgesArray,
      });
      this.uploadSigmaIndices();
    } finally {
      this.guard.restore();
    }

    this.bindGraphListeners();
    this.clearBatchFences();
    this.pendingMovedNodes.clear();
    // Fixed flags are baked into the freshly read metadata:
    this.pendingFixedUpdates.clear();
    this.backportPending = false;
    this.remainingIterations = iterations;
    this.deadline = typeof duration === "number" ? performance.now() + duration : null;
    this.lastBackportTime = performance.now();
    this.mode = mode;
    this.running = true;
    this.emit("started");

    if (mode === "live") this.renderer.scheduleRender();
    else this.scheduleHeadlessFrame();

    return true;
  }

  /**
   * Returns the reason ending the run when its budget is exhausted, null
   * while there is budget left.
   */
  private exhaustedBudgetReason(): StopReason | null {
    if (this.remainingIterations === 0) return "iterations";
    if (this.deadline !== null && performance.now() >= this.deadline) return "duration";
    return null;
  }

  private stopRun(reason: StopReason, { backport = true }: { backport?: boolean } = {}) {
    if (!this.running) return;
    this.running = false;
    this.mode = null;
    this.deadline = null;

    if (this.headlessTimeout !== null) {
      clearTimeout(this.headlessTimeout);
      this.headlessTimeout = null;
    }

    this.unbindGraphListeners();
    this.clearBatchFences();

    const fa2Program = this.fa2Program;
    if (fa2Program) {
      this.positionsReader?.cancel();
      this.backportPending = false;

      if (backport) {
        // One last, synchronous readback (a single GPU stall, at the very
        // end). Writing the positions to graphology triggers a regular sigma
        // refresh, which re-syncs sigma's CPU-side state (extent,
        // normalization, labels, the node data texture) with the layout's
        // final positions:
        let positions: Float32Array;
        this.guard.save();
        try {
          positions = fa2Program.readPositionsSync();
        } finally {
          this.guard.restore();
        }
        this.applyPositions(positions);
      }
    }

    this.emit("stopped", { reason });
  }

  /**
   * Runs once per sigma render (during the "afterTexturesUpload" event), and
   * never blocks:
   * - It only *issues* the iterations' GPU commands (the CPU does not wait
   *   for their results)
   * - It then issues the scatter pass, copying the freshest positions into
   *   sigma's node data texture, which everything sigma draws this frame
   *   reads
   * - Positions are synced back to the graphology instance through an
   *   asynchronous readback, polled here and started at most once every
   *   backportInterval milliseconds
   */
  private onFrame() {
    if (!this.running || this.mode !== "live" || !this.fa2Program || !this.scatter) return;

    let finishedReason: StopReason | null = null;
    this.guard.save();
    try {
      if (this.sigmaIndicesDirty) this.uploadSigmaIndices();
      this.applyPendingMoves();
      this.applyPendingFixedUpdates();
      this.issueIterations();
      finishedReason = this.exhaustedBudgetReason();
      if (!finishedReason) {
        this.runScatter();
        this.pollBackport();
      }
    } finally {
      this.guard.restore();
    }

    if (finishedReason) {
      this.stopRun(finishedReason);
      return;
    }

    // Keep sigma rendering (and this hook running) as long as the layout is
    // active:
    this.renderer.scheduleRender();
  }

  /**
   * Headless counterpart of onFrame, on its own loop: only iterations, no
   * scatter, no periodic backport. Sigma keeps displaying the
   * positions from before the run until it ends.
   *
   * The loop rides setTimeout(0) rather than requestAnimationFrame: headless
   * runs have nothing to sync with the display, and rAF stops firing in
   * hidden tabs, which would stall a run awaited behind a loading overlay
   * (setTimeout is only throttled to ~1s ticks there):
   */
  private scheduleHeadlessFrame() {
    this.headlessTimeout = setTimeout(() => this.headlessFrame(), 0);
  }

  private headlessFrame() {
    this.headlessTimeout = null;
    if (!this.running || this.mode !== "headless" || !this.fa2Program) return;

    let finishedReason: StopReason | null = null;
    this.guard.save();
    try {
      this.applyPendingMoves();
      this.applyPendingFixedUpdates();
      this.issueIterations();
      finishedReason = this.exhaustedBudgetReason();
    } finally {
      this.guard.restore();
    }

    if (finishedReason) {
      this.stopRun(finishedReason);
      return;
    }

    this.scheduleHeadlessFrame();
  }

  private issueIterations() {
    const { gl, params } = this;
    const auto = params.iterationsPerFrame === "auto";

    // 1. Reap the fences of the batches the GPU has finished:
    this.batchFences = this.batchFences.filter((fence) => {
      if (gl.clientWaitSync(fence, 0, 0) === gl.TIMEOUT_EXPIRED) return true;
      gl.deleteSync(fence);
      return false;
    });

    // 2. Issue a new batch of iterations, but only if the GPU keeps up
    //    (backpressure). When it doesn't, skip this frame: the main thread
    //    stays free, and the iterations rate settles on what the GPU can
    //    actually sustain:
    if (this.batchFences.length < ForceAtlas2GPULayout.MAX_PENDING_BATCHES) {
      let count = this.getCurrentIterationsPerFrame();
      if (this.remainingIterations >= 0) count = Math.min(count, this.remainingIterations);

      if (count > 0) {
        // Force parameters can change live; uniform values persist with the
        // program, so once per batch is enough:
        this.fa2Program!.setUniforms({
          edgeWeightInfluence: params.edgeWeightInfluence,
          scalingRatio: params.scalingRatio,
          gravity: params.gravity,
          maxForce: params.maxForce,
          slowDown: params.slowDown,
          outboundAttCompensation: this.outboundAttCompensation,
        });
        for (let i = 0; i < count; i++) this.runIteration();
        this.batchFences.push(gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) as WebGLSync);
        gl.flush();
      }
      if (this.remainingIterations > 0) this.remainingIterations -= count;

      // AIMD growth: the GPU kept up, try a slightly bigger batch next frame:
      if (auto)
        this.adaptiveIterationsPerFrame = Math.min(
          params.maxIterationsPerFrame,
          this.adaptiveIterationsPerFrame * 1.1 + 1,
        );
    } else if (auto) {
      // AIMD backoff: the GPU is falling behind, shrink the batches:
      this.adaptiveIterationsPerFrame = Math.max(1, this.adaptiveIterationsPerFrame * 0.7);
    }
  }

  private runIteration() {
    const fa2Program = this.fa2Program!;

    // The quadtree reads the current input positions texture, which changes
    // at every swap:
    this.quadTree!.compute(fa2Program.getPositionsTexture());
    fa2Program.run();

    this.totalIterations++;
  }

  private runScatter() {
    const nodeDataTexture = this.renderer.getNodeDataTexture();
    const targetTexture = nodeDataTexture.getTexture();
    if (!targetTexture) return;

    // Reuse sigma's own normalization: GPU-written positions then match what
    // sigma would compute from the same graph coordinates, so backports never
    // cause a jump:
    const normalizationFunction = this.renderer.getNormalizationFunction();
    const center = normalizationFunction.inverse({ x: 0.5, y: 0.5 });

    this.scatter!.run({
      positionsTexture: this.fa2Program!.getPositionsTexture(),
      targetTexture,
      targetWidth: nodeDataTexture.getTextureWidth(),
      targetHeight: nodeDataTexture.getTextureHeight(),
      normalization: { dX: center.x, dY: center.y, ratio: normalizationFunction.ratio },
    });
  }

  private pollBackport() {
    const { backportInterval } = this.params;
    // Infinity disables periodic backports (0 backports on every frame):
    if (!Number.isFinite(backportInterval)) return;

    const positionsReader = this.positionsReader!;
    if (this.backportPending) {
      const positions = positionsReader.poll();
      if (positions) {
        this.applyPositions(positions);
        this.backportPending = false;
        this.lastBackportTime = performance.now();
      }
    }

    if (!this.backportPending && performance.now() - this.lastBackportTime >= backportInterval) {
      this.backportPending = positionsReader.start(this.fa2Program!.getPositionsTexture());
    }
  }

  private applyPositions(positions: Float32Array) {
    const graph = this.renderer.getGraph();
    graph.updateEachNodeAttributes(
      (node: string, attributes: Record<string, unknown>) => {
        const cache = this.nodeDataCache[node];
        if (cache) {
          attributes.x = positions[ATTRIBUTES_PER_ITEM.nodesPosition * cache.index];
          attributes.y = positions[ATTRIBUTES_PER_ITEM.nodesPosition * cache.index + 1];
        }
        return attributes;
      },
      { attributes: ["x", "y"] },
    );
  }

  /**
   * Injects external position updates (typically node drags) into the
   * running simulation, and resets the nodes' inertia:
   */
  private applyPendingMoves() {
    if (!this.pendingMovedNodes.size) return;

    const graph = this.renderer.getGraph();
    const fa2Program = this.fa2Program!;
    this.pendingMovedNodes.forEach((node) => {
      const cache = this.nodeDataCache[node];
      if (!cache || !graph.hasNode(node)) return;

      const attributes = graph.getNodeAttributes(node);
      const x = typeof attributes.x === "number" ? attributes.x : 0;
      const y = typeof attributes.y === "number" ? attributes.y : 0;
      fa2Program.setPositionItem(cache.index, new Float32Array([x, y, cache.mass, 0]));
      fa2Program.setMovementItem(cache.index, new Float32Array([0, 0, 1, 0]));
    });
    this.pendingMovedNodes.clear();
  }

  /**
   * Applies fixed/released flags to the running simulation, by patching the
   * node's texel in the (non-ping-ponged) metadata texture. The CPU-side
   * metadata array is kept in sync, so restarts and other texel patches see
   * the current flags.
   */
  private applyPendingFixedUpdates() {
    if (!this.pendingFixedUpdates.size) return;

    const fa2Program = this.fa2Program!;
    this.pendingFixedUpdates.forEach((node) => {
      const cache = this.nodeDataCache[node];
      if (!cache) return;

      const k = cache.index * ATTRIBUTES_PER_ITEM.nodesMetadata;
      this.nodesMetadataArray[k + 2] = this.fixedNodes.has(node) ? 1 : 0;
      fa2Program.setMetadataItem(
        cache.index,
        this.nodesMetadataArray.subarray(k, k + ATTRIBUTES_PER_ITEM.nodesMetadata),
      );
    });
    this.pendingFixedUpdates.clear();
  }

  /**
   * Graph reading and GPU programs setup:
   * *************************************
   */
  private readGraph() {
    const graph = this.renderer.getGraph();
    const neighborsPerSource: { weight: number; index: number }[][] = [];

    // Index nodes per order:
    this.nodeDataCache = {};
    this.nodeKeys = graph.nodes();
    this.nodeKeys.forEach((node, i) => {
      this.nodeDataCache[node] = { index: i, mass: 1 };
      neighborsPerSource[i] = [];
    });

    // Index edges per sources and targets:
    graph.forEachEdge((_edge: string, attributes: Record<string, unknown>, source: string, target: string) => {
      const weight = typeof attributes.weight === "number" ? attributes.weight : 1;
      const sourceIndex = this.nodeDataCache[source].index;
      const targetIndex = this.nodeDataCache[target].index;

      neighborsPerSource[sourceIndex].push({ weight, index: targetIndex });
      neighborsPerSource[targetIndex].push({ weight, index: sourceIndex });
      this.nodeDataCache[source].mass += weight;
      this.nodeDataCache[target].mass += weight;
    });

    const order = this.nodeKeys.length;
    this.edgeEntriesCount = graph.size * 2;
    const nodesTextureSize = getTextureSize(order);
    const edgesTextureSize = getTextureSize(this.edgeEntriesCount);
    this.nodesPositionArray = new Float32Array(ATTRIBUTES_PER_ITEM.nodesPosition * nodesTextureSize ** 2);
    this.nodesMovementArray = new Float32Array(ATTRIBUTES_PER_ITEM.nodesMovement * nodesTextureSize ** 2);
    this.nodesMetadataArray = new Float32Array(ATTRIBUTES_PER_ITEM.nodesMetadata * nodesTextureSize ** 2);
    this.edgesArray = new Float32Array(ATTRIBUTES_PER_ITEM.edges * edgesTextureSize ** 2);

    let k = 0;
    let edgeIndex = 0;
    this.outboundAttCompensation = 0;
    this.nodeKeys.forEach((node, index) => {
      const attributes = graph.getNodeAttributes(node);
      const x = typeof attributes.x === "number" ? attributes.x : 0;
      const y = typeof attributes.y === "number" ? attributes.y : 0;
      const { mass } = this.nodeDataCache[node];
      const neighbors = neighborsPerSource[index];
      const neighborsCount = neighbors.length;

      k = index * ATTRIBUTES_PER_ITEM.nodesPosition;
      this.nodesPositionArray[k++] = x;
      this.nodesPositionArray[k++] = y;
      this.nodesPositionArray[k++] = mass;
      this.outboundAttCompensation += mass;

      k = index * ATTRIBUTES_PER_ITEM.nodesMovement;
      this.nodesMovementArray[k++] = 0;
      this.nodesMovementArray[k++] = 0;
      this.nodesMovementArray[k++] = 1;

      k = index * ATTRIBUTES_PER_ITEM.nodesMetadata;
      this.nodesMetadataArray[k++] = edgeIndex;
      this.nodesMetadataArray[k++] = neighborsCount;
      this.nodesMetadataArray[k++] = this.fixedNodes.has(node) ? 1 : 0;

      for (let j = 0; j < neighborsCount; j++) {
        const { weight, index: otherIndex } = neighbors[j];
        k = edgeIndex * ATTRIBUTES_PER_ITEM.edges;
        this.edgesArray[k++] = otherIndex;
        this.edgesArray[k++] = weight;
        edgeIndex++;
      }
    });

    this.outboundAttCompensation /= order;
  }

  /**
   * (Re)builds the GPU programs when the graph dimensions or any
   * shader-affecting setting changed since the last run.
   */
  private ensurePrograms() {
    const { gl, params } = this;
    const order = this.nodeKeys.length;

    const depth = params.quadTreeDepth === "auto" ? getDefaultQuadTreeDepth(order) : params.quadTreeDepth;
    if (depth < 1 || depth > 12) throw new Error("ForceAtlas2GPULayout: quadTreeDepth must be between 1 and 12");
    // Lower thetas mean wider per-level neighborhoods, whose cost grows as
    // 1/theta^2 (theta=1 reads 27 cells per level, theta=0.25 reads 243):
    const theta = params.quadTreeTheta;
    if (theta < 0.25 || theta > 1) throw new Error("ForceAtlas2GPULayout: quadTreeTheta must be between 0.25 and 1");

    const key = JSON.stringify([
      order,
      this.edgeEntriesCount,
      params.linLogMode,
      params.strongGravityMode,
      params.outboundAttractionDistribution,
      depth,
      theta,
    ]);
    if (key === this.programsKey && this.fa2Program) return;

    this.fa2Program?.kill();
    this.quadTree?.kill();
    this.scatter?.kill();
    this.positionsReader?.kill();

    this.quadTree = new QuadTreeGPU(gl, { nodesCount: order }, { depth });
    this.fa2Program = new ForceAtlas2Program(gl, {
      nodesCount: order,
      edgeEntriesCount: this.edgeEntriesCount,
      linLogMode: params.linLogMode,
      strongGravityMode: params.strongGravityMode,
      outboundAttractionDistribution: params.outboundAttractionDistribution,
      quadTreeDepth: depth,
      quadTreeTheta: theta,
      boundariesTexture: this.quadTree.getBoundariesTexture(),
      quadTreeTexture: this.quadTree.getAtlasTexture(),
    });
    this.scatter = new ScatterProgram(gl, { nodesCount: order });
    this.positionsReader = new AsyncTexelsReader(gl, getTextureSize(order));
    this.programsKey = key;
  }

  /**
   * Uploads the fa2Index -> sigma texture index mapping to the scatter
   * program (sigma indices can change whenever sigma reprocesses its data).
   */
  private uploadSigmaIndices() {
    if (!this.scatter) return;
    const nodeDataTexture = this.renderer.getNodeDataTexture();
    const indices = new Float32Array(this.nodeKeys.length);
    for (let i = 0, l = this.nodeKeys.length; i < l; i++) indices[i] = nodeDataTexture.getIndex(this.nodeKeys[i]);
    this.scatter.setIndices(indices);
    this.sigmaIndicesDirty = false;
  }

  /**
   * Graphology safeguards, active only while a run is on:
   * ******************************************************
   */
  private bindGraphListeners() {
    const graph = this.renderer.getGraph();
    graph.on("nodeAdded", this.handleStructuralChange);
    graph.on("nodeDropped", this.handleStructuralChange);
    graph.on("edgeAdded", this.handleStructuralChange);
    graph.on("edgeDropped", this.handleStructuralChange);
    graph.on("edgesCleared", this.handleStructuralChange);
    graph.on("cleared", this.handleStructuralChange);
    graph.on("nodeAttributesUpdated", this.handleNodeUpdate);
  }

  private unbindGraphListeners() {
    const graph = this.renderer.getGraph();
    graph.off("nodeAdded", this.handleStructuralChange);
    graph.off("nodeDropped", this.handleStructuralChange);
    graph.off("edgeAdded", this.handleStructuralChange);
    graph.off("edgeDropped", this.handleStructuralChange);
    graph.off("edgesCleared", this.handleStructuralChange);
    graph.off("cleared", this.handleStructuralChange);
    graph.off("nodeAttributesUpdated", this.handleNodeUpdate);
  }

  private clearBatchFences() {
    this.batchFences.forEach((fence) => this.gl.deleteSync(fence));
    this.batchFences = [];
  }
}
