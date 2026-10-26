/**
 * Iframe-embedded examples must not trap the page scroll, so their gesture
 * target must default to "shared".
 *
 * Examples also accept `?camera=x,y,ratio,angle` (trailing values optional)
 * to override their initial camera state, e.g. to frame one item in tests.
 *
 * A Vite plugin in astro.config.mjs resolves "sigma" here instead of the real
 * package, which this module patches then re-exports. Being imported before
 * any "sigma" importer, the patch always runs first.
 */
import OriginalSigma from "sigma";
import { DEFAULT_SETTINGS } from "sigma/settings";
import type { CameraState } from "sigma/types";

if (typeof window !== "undefined" && window.self !== window.top) DEFAULT_SETTINGS.gestureTarget = "shared";

const CAMERA_KEYS = ["x", "y", "ratio", "angle"] as const;

function getCameraOverride(): Partial<CameraState> | null {
  if (typeof window === "undefined") return null;
  const raw = new URLSearchParams(location.search).get("camera");
  if (!raw) return null;

  const state: Partial<CameraState> = {};
  raw.split(",").forEach((value, i) => {
    const n = value === "" ? NaN : Number(value);
    if (i < CAMERA_KEYS.length && Number.isFinite(n)) state[CAMERA_KEYS[i]] = n;
  });
  return state;
}

class Sigma extends OriginalSigma {
  constructor(...args: ConstructorParameters<typeof OriginalSigma>) {
    super(...args);
    const camera = getCameraOverride();
    if (camera) queueMicrotask(() => this.getCamera().setState(camera));
  }
}

export * from "sigma";
export { Sigma, Sigma as default };
