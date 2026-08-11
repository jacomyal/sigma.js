/**
 * Iframe-embedded examples must not trap the page scroll, so their gesture
 * target must default to "shared".
 *
 * A Vite plugin in astro.config.mjs resolves "sigma" here instead of the real
 * package, which this module patches then re-exports. Being imported before
 * any "sigma" importer, the patch always runs first.
 */
import { DEFAULT_SETTINGS } from "sigma/settings";

if (typeof window !== "undefined" && window.self !== window.top) DEFAULT_SETTINGS.gestureTarget = "shared";

export * from "sigma";
export { default } from "sigma";
