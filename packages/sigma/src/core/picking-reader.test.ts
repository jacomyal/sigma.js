import { beforeEach, describe, expect, test } from "vitest";

import { AsyncPickingReader } from "./picking-reader";

type MockSync = { signaled: boolean };
type MockBuffer = { data: Uint8Array };

/**
 * Minimal WebGL2 mock - only implements methods used by AsyncPickingReader.
 * Framebuffer content is set through `fbPixels` (captured at readPixels
 * time, like a GPU would); fences are signaled manually through `syncs`.
 */
function createMockGL() {
  let boundPbo: MockBuffer | null = null;
  const gl = {
    fbPixels: new Uint8Array(0),
    syncs: [] as MockSync[],
    deletedBuffers: 0,

    createBuffer: (): MockBuffer => ({ data: new Uint8Array(0) }),
    deleteBuffer: () => {
      gl.deletedBuffers++;
    },
    bindBuffer: (_target: number, buffer: MockBuffer | null) => {
      boundPbo = buffer;
    },
    bindFramebuffer: () => {},
    bufferData: (_target: number, size: number) => {
      if (boundPbo) boundPbo.data = new Uint8Array(size);
    },
    readPixels: (_x: number, _y: number, width: number, height: number) => {
      if (boundPbo) boundPbo.data.set(gl.fbPixels.subarray(0, width * height * 4));
    },
    fenceSync: (): MockSync => {
      const sync = { signaled: false };
      gl.syncs.push(sync);
      return sync;
    },
    clientWaitSync: (sync: MockSync) => (sync.signaled ? gl.ALREADY_SIGNALED : gl.TIMEOUT_EXPIRED),
    deleteSync: () => {},
    getBufferSubData: (_target: number, _offset: number, out: Uint8Array) => {
      if (boundPbo) out.set(boundPbo.data.subarray(0, out.length));
    },
    flush: () => {},

    PIXEL_PACK_BUFFER: 0x88eb,
    STREAM_READ: 0x88e1,
    RGBA: 0x1908,
    UNSIGNED_BYTE: 0x1401,
    FRAMEBUFFER: 0x8d40,
    SYNC_GPU_COMMANDS_COMPLETE: 0x9117,
    TIMEOUT_EXPIRED: 0x911b,
    ALREADY_SIGNALED: 0x911a,
  };
  return gl;
}

const FRAMEBUFFER = {} as WebGLFramebuffer;

/** Writes RGBA bytes at (x, row), row 0 being the framebuffer's bottom. */
function setPixel(pixels: Uint8Array, width: number, x: number, row: number, rgba: number[]) {
  pixels.set(rgba, (row * width + x) * 4);
}

describe("AsyncPickingReader", () => {
  let gl: ReturnType<typeof createMockGL>;
  let reader: AsyncPickingReader;

  beforeEach(() => {
    gl = createMockGL();
    reader = new AsyncPickingReader(gl as unknown as WebGL2RenderingContext);
  });

  test("returns null before any readback completed", () => {
    expect(reader.read(0, 0, 1, 1)).toBeNull();

    gl.fbPixels = new Uint8Array(8 * 8 * 4);
    reader.enqueue(FRAMEBUFFER, 8, 8);
    reader.poll();
    expect(reader.read(0, 0, 1, 1)).toBeNull();
  });

  test("resolves viewport positions in a completed snapshot (y flipped)", () => {
    gl.fbPixels = new Uint8Array(8 * 8 * 4);
    // Viewport (3, 2) with pixelRatio 1 and no downsizing -> column 3, row 6:
    setPixel(gl.fbPixels, 8, 3, 6, [1, 2, 3, 4]);
    reader.enqueue(FRAMEBUFFER, 8, 8);
    gl.syncs[0].signaled = true;
    reader.poll();

    expect(reader.read(3, 2, 1, 1)).toEqual([1, 2, 3, 4]);
    expect(reader.read(4, 2, 1, 1)).toEqual([0, 0, 0, 0]);
  });

  test("applies pixelRatio and downSizingRatio like the picking pass does", () => {
    gl.fbPixels = new Uint8Array(16 * 16 * 4);
    // Viewport (10, 6) with pixelRatio 2, downsized by 2 -> column 10, row 10:
    setPixel(gl.fbPixels, 16, 10, 10, [9, 9, 9, 9]);
    reader.enqueue(FRAMEBUFFER, 16, 16);
    gl.syncs[0].signaled = true;
    reader.poll();

    expect(reader.read(10, 6, 2, 2)).toEqual([9, 9, 9, 9]);
  });

  test("returns null outside the snapshot", () => {
    gl.fbPixels = new Uint8Array(8 * 8 * 4);
    reader.enqueue(FRAMEBUFFER, 8, 8);
    gl.syncs[0].signaled = true;
    reader.poll();

    expect(reader.read(-1, 2, 1, 1)).toBeNull();
    expect(reader.read(8, 2, 1, 1)).toBeNull();
    expect(reader.read(2, 9, 1, 1)).toBeNull();
  });

  test("keeps the newest completed readback", () => {
    gl.fbPixels = new Uint8Array(4 * 4 * 4);
    setPixel(gl.fbPixels, 4, 0, 3, [1, 1, 1, 1]);
    reader.enqueue(FRAMEBUFFER, 4, 4);
    setPixel(gl.fbPixels, 4, 0, 3, [2, 2, 2, 2]);
    reader.enqueue(FRAMEBUFFER, 4, 4);

    gl.syncs[0].signaled = true;
    gl.syncs[1].signaled = true;
    reader.poll();
    expect(reader.read(0, 0, 1, 1)).toEqual([2, 2, 2, 2]);
  });

  test("skips enqueuing while both readbacks are in flight, then recovers", () => {
    gl.fbPixels = new Uint8Array(4 * 4 * 4);
    setPixel(gl.fbPixels, 4, 0, 3, [1, 1, 1, 1]);
    reader.enqueue(FRAMEBUFFER, 4, 4);
    setPixel(gl.fbPixels, 4, 0, 3, [2, 2, 2, 2]);
    reader.enqueue(FRAMEBUFFER, 4, 4);
    // Both buffers busy: this one is dropped.
    setPixel(gl.fbPixels, 4, 0, 3, [3, 3, 3, 3]);
    reader.enqueue(FRAMEBUFFER, 4, 4);
    expect(gl.syncs.length).toBe(2);

    gl.syncs[0].signaled = true;
    gl.syncs[1].signaled = true;
    reader.poll();
    expect(reader.read(0, 0, 1, 1)).toEqual([2, 2, 2, 2]);

    // Buffers are free again:
    reader.enqueue(FRAMEBUFFER, 4, 4);
    gl.syncs[2].signaled = true;
    reader.poll();
    expect(reader.read(0, 0, 1, 1)).toEqual([3, 3, 3, 3]);
  });

  test("follows framebuffer size changes", () => {
    gl.fbPixels = new Uint8Array(8 * 8 * 4);
    reader.enqueue(FRAMEBUFFER, 8, 8);
    gl.syncs[0].signaled = true;
    reader.poll();
    expect(reader.read(6, 2, 1, 1)).toEqual([0, 0, 0, 0]);

    gl.fbPixels = new Uint8Array(4 * 4 * 4);
    reader.enqueue(FRAMEBUFFER, 4, 4);
    gl.syncs[1].signaled = true;
    reader.poll();
    expect(reader.read(6, 2, 1, 1)).toBeNull();
  });

  test("kill releases both buffers", () => {
    reader.kill();
    expect(gl.deletedBuffers).toBe(2);
  });
});
