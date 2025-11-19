/**
 * GPU Timing Utility
 * =================================
 *
 * Manages GPU timing queries using EXT_disjoint_timer_query_webgl2 extension.
 * Provides accurate GPU-side rendering pass measurements.
 * @module
 */

export interface GPUTimingData {
  picking: number | null;
  opaque: number | null;
  transparent: number | null;
  composite: number | null;
  render: number | null; // For painter's algorithm single-pass rendering
  total: number | null;
}

export interface GPUTimingResult {
  raw: GPUTimingData;
  averaged: GPUTimingData;
}

interface TimingQuery {
  query: WebGLQuery;
  pass: RenderPass;
}

export type RenderPass = "picking" | "opaque" | "transparent" | "composite" | "render";

/**
 * GPU Timing Manager
 * Handles WebGL timer query lifecycle, result collection, and averaging
 */
export class GPUTimingManager {
  private gl: WebGL2RenderingContext;
  private ext: EXT_disjoint_timer_query_webgl2 | null = null;
  private queryPools: Map<RenderPass, WebGLQuery[]>;
  private pendingQueries: TimingQuery[] = [];
  private currentQueries: Map<RenderPass, WebGLQuery | null> = new Map();
  private rawTimings: GPUTimingData;
  private history: Map<RenderPass, number[]>;
  private averageWindow: number;
  private lastDisjointWarning: number = 0;
  private poolSize: number = 3; // Number of queries to pool per pass

  constructor(gl: WebGL2RenderingContext, averageWindow: number = 60) {
    this.gl = gl;
    this.averageWindow = averageWindow;
    this.queryPools = new Map();
    this.history = new Map();
    this.rawTimings = {
      picking: null,
      opaque: null,
      transparent: null,
      composite: null,
      render: null,
      total: null,
    };

    // Initialize extension
    this.ext = gl.getExtension("EXT_disjoint_timer_query_webgl2");

    if (!this.ext) {
      console.warn(
        "[Sigma GPU Timing] EXT_disjoint_timer_query_webgl2 extension not supported. GPU timing unavailable.",
      );
      return;
    }

    // Create query pool for each render pass
    const passes: RenderPass[] = ["picking", "opaque", "transparent", "composite", "render"];
    for (const pass of passes) {
      const pool: WebGLQuery[] = [];
      for (let i = 0; i < this.poolSize; i++) {
        const query = gl.createQuery();
        if (query) {
          pool.push(query);
        }
      }
      this.queryPools.set(pass, pool);
      this.history.set(pass, []);
      this.currentQueries.set(pass, null);
    }

    console.log(
      `[Sigma GPU Timing] Initialized with ${this.poolSize} queries per pass for ${passes.length} passes`,
    );
  }

  /**
   * Check if GPU timing is supported
   */
  isSupported(): boolean {
    return this.ext !== null && this.queryPools.size > 0;
  }

  /**
   * Get an available query from the pool for a given pass
   */
  private getAvailableQuery(pass: RenderPass): WebGLQuery | null {
    const pool = this.queryPools.get(pass);
    if (!pool) return null;

    // Try to find a query that's not currently pending
    for (const query of pool) {
      const isPending = this.pendingQueries.some((pq) => pq.query === query);
      if (!isPending) {
        return query;
      }
    }

    // All queries in pool are pending, return null
    return null;
  }

  /**
   * Begin timing measurement for a render pass
   */
  beginPass(pass: RenderPass): void {
    if (!this.ext) return;

    const query = this.getAvailableQuery(pass);
    if (!query) return; // No available query in pool

    // Begin timing query
    this.gl.beginQuery(this.ext.TIME_ELAPSED_EXT, query);
    this.currentQueries.set(pass, query);
  }

  /**
   * End timing measurement for a render pass
   */
  endPass(pass: RenderPass): void {
    if (!this.ext) return;

    const query = this.currentQueries.get(pass);
    if (!query) return;

    this.gl.endQuery(this.ext.TIME_ELAPSED_EXT);

    // Add to pending queries list
    this.pendingQueries.push({ query, pass });
    this.currentQueries.set(pass, null);
  }

  /**
   * Collect timing results (asynchronous)
   * Should be called in subsequent frames after queries are submitted
   */
  collectResults(): void {
    if (!this.ext) return;

    // Check for disjoint operation (GPU context change)
    const disjoint = this.gl.getParameter(this.ext.GPU_DISJOINT_EXT);
    if (disjoint) {
      // Throttle warnings to once per second
      const now = Date.now();
      if (now - this.lastDisjointWarning > 1000) {
        console.warn(
          "[Sigma GPU Timing] GPU disjoint operation detected. Timing results may be invalidated by GPU power management or context changes.",
        );
        this.lastDisjointWarning = now;
      }
      return;
    }

    // Check pending queries for available results
    const stillPending: TimingQuery[] = [];

    for (const pendingQuery of this.pendingQueries) {
      const available = this.gl.getQueryParameter(pendingQuery.query, this.gl.QUERY_RESULT_AVAILABLE);

      if (available) {
        const timeNs = this.gl.getQueryParameter(pendingQuery.query, this.gl.QUERY_RESULT) as number;
        const timeMs = timeNs / 1_000_000; // Convert nanoseconds to milliseconds

        // Update raw timing
        this.rawTimings[pendingQuery.pass] = timeMs;

        // Update history for averaging
        const history = this.history.get(pendingQuery.pass)!;
        history.push(timeMs);
        if (history.length > this.averageWindow) {
          history.shift();
        }

        // Query is done, will be returned to pool automatically
      } else {
        // Result not ready yet, keep it pending
        stillPending.push(pendingQuery);
      }
    }

    // Update pending queries list
    this.pendingQueries = stillPending;

    // Calculate total time
    if (
      this.rawTimings.picking !== null &&
      this.rawTimings.opaque !== null &&
      this.rawTimings.transparent !== null &&
      this.rawTimings.composite !== null
    ) {
      this.rawTimings.total =
        this.rawTimings.picking + this.rawTimings.opaque + this.rawTimings.transparent + this.rawTimings.composite;
    }
  }

  /**
   * Get current timing results (both raw and averaged)
   */
  getTimings(): GPUTimingResult {
    const averaged: GPUTimingData = {
      picking: this.calculateAverage("picking"),
      opaque: this.calculateAverage("opaque"),
      transparent: this.calculateAverage("transparent"),
      composite: this.calculateAverage("composite"),
      render: this.calculateAverage("render"),
      total: null,
    };

    // Calculate averaged total
    if (
      averaged.picking !== null &&
      averaged.opaque !== null &&
      averaged.transparent !== null &&
      averaged.composite !== null
    ) {
      averaged.total = averaged.picking + averaged.opaque + averaged.transparent + averaged.composite;
    } else if (averaged.picking !== null && averaged.render !== null) {
      // For painter's algorithm mode: total = picking + render
      averaged.total = averaged.picking + averaged.render;
    }

    return {
      raw: { ...this.rawTimings },
      averaged,
    };
  }

  /**
   * Calculate moving average for a render pass
   */
  private calculateAverage(pass: RenderPass): number | null {
    const history = this.history.get(pass);
    if (!history || history.length === 0) return null;

    const sum = history.reduce((acc, val) => acc + val, 0);
    return sum / history.length;
  }

  /**
   * Reset all timing data and history
   */
  reset(): void {
    this.rawTimings = {
      picking: null,
      opaque: null,
      transparent: null,
      composite: null,
      render: null,
      total: null,
    };

    for (const history of this.history.values()) {
      history.length = 0;
    }
  }

  /**
   * Update the averaging window size
   */
  setAverageWindow(window: number): void {
    this.averageWindow = Math.max(1, window);

    // Trim existing histories if needed
    for (const history of this.history.values()) {
      if (history.length > this.averageWindow) {
        history.splice(0, history.length - this.averageWindow);
      }
    }
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    // Delete all queries in all pools
    for (const pool of this.queryPools.values()) {
      for (const query of pool) {
        this.gl.deleteQuery(query);
      }
    }
    this.queryPools.clear();
    this.history.clear();
    this.pendingQueries = [];
    this.currentQueries.clear();
  }
}
