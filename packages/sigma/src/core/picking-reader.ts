é/**
 * Sigma.js Async Picking Reader
 * =============================
 *
 * Maintains a CPU-side snapshot of the picking framebuffer, refreshed through
 * asynchronous readbacks (pixel pack buffer + fence): readbacks are only
 * *enqueued* on the GPU, and picking lookups resolve against the freshest
 * completed snapshot. A synchronous readPixels would instead stall the main
 * thread until the whole GPU command queue drains — which takes hundreds of
 * milliseconds when a GPU-heavy consumer (like a GPU layout) shares the
 * context. The price is latency instead: hits lag behind the displayed frame
 * by the GPU queue latency, usually a frame or two.
 *
 * @module
 */

type Slot = {
  pbo: WebGLBuffer;
  fence: WebGLSync | null;
  byteLength: number;
  width: number;
  height: number;
};

export class AsyncPickingReader {
  private gl: WebGL2RenderingContext;
  // Two buffers: one readback can stay in flight while the next frame
  // enqueues another.
  private slots: Slot[];
  // Slots with a pending fence, in submission order:
  private pending: Slot[] = [];
  private snapshot: Uint8Array | null = null;
  private snapshotWidth = 0;
  private snapshotHeight = 0;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    this.slots = [0, 1].map(() => ({
      pbo: gl.createBuffer() as WebGLBuffer,
      fence: null,
      byteLength: 0,
      width: 0,
      height: 0,
    }));
  }

  /**
   * Enqueues a readback of the given framebuffer. A no-op when both buffers
   * are still in flight (the GPU is late, the snapshot just stays stale a bit
   * longer).
   */
  enqueue(framebuffer: WebGLFramebuffer, width: number, height: number): void {
    const { gl } = this;
    this.poll();
    const slot = this.slots.find((s) => !s.fence);
    if (!slot) return;

    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, slot.pbo);
    const byteLength = width * height * 4;
    if (slot.byteLength !== byteLength) {
      gl.bufferData(gl.PIXEL_PACK_BUFFER, byteLength, gl.STREAM_READ);
      slot.byteLength = byteLength;
    }
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, 0);
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    slot.width = width;
    slot.height = height;
    slot.fence = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) as WebGLSync;
    this.pending.push(slot);
    // Guarantee the readback progresses even if nothing else is submitted:
    gl.flush();
  }

  /**
   * Retrieves the freshest finished readback into the snapshot, without ever
   * blocking.
   */
  poll(): void {
    const { gl } = this;

    // Fences signal in submission order, so consume the queue from the front
    // and only copy the newest finished readback:
    let latest: Slot | null = null;
    while (this.pending.length) {
      const slot = this.pending[0];
      if (gl.clientWaitSync(slot.fence as WebGLSync, 0, 0) === gl.TIMEOUT_EXPIRED) break;
      gl.deleteSync(slot.fence as WebGLSync);
      slot.fence = null;
      this.pending.shift();
      latest = slot;
    }
    if (!latest) return;

    if (!this.snapshot || this.snapshot.byteLength !== latest.byteLength)
      this.snapshot = new Uint8Array(latest.byteLength);
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, latest.pbo);
    gl.getBufferSubData(gl.PIXEL_PACK_BUFFER, 0, this.snapshot);
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);
    this.snapshotWidth = latest.width;
    this.snapshotHeight = latest.height;
  }

  /**
   * Returns the RGBA bytes of the snapshot pixel under the (x, y) viewport
   * position, or null when no snapshot covers it (yet).
   */
  read(x: number, y: number, pixelRatio: number, downSizingRatio: number): [number, number, number, number] | null {
    const snapshot = this.snapshot;
    if (!snapshot) return null;

    const bufferX = Math.floor((x / downSizingRatio) * pixelRatio);
    // The framebuffer's y axis points up:
    const bufferY = Math.floor(this.snapshotHeight - (y / downSizingRatio) * pixelRatio);
    if (bufferX < 0 || bufferX >= this.snapshotWidth || bufferY < 0 || bufferY >= this.snapshotHeight) return null;

    const offset = (bufferY * this.snapshotWidth + bufferX) * 4;
    return [snapshot[offset], snapshot[offset + 1], snapshot[offset + 2], snapshot[offset + 3]];
  }

  kill(): void {
    const { gl } = this;
    for (const slot of this.slots) {
      if (slot.fence) gl.deleteSync(slot.fence);
      gl.deleteBuffer(slot.pbo);
    }
    this.pending = [];
    this.snapshot = null;
  }
}
