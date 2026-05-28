/**
 * Sigma.js Edge Label Shader Config
 * ==================================
 *
 * Holds the shared shader-compile-time config used by both the edge label
 * program (character SDF shader) and the edge label background program
 * (ribbon shader), plus the helper that resolves user options into that
 * config. The two sub-factories consume the same resolved object so they
 * cannot drift on body bounds, visibility ramp, or perpendicular offset.
 *
 * @module
 */
import type { EdgePath } from "../types";

/**
 * Resolved shader-compile-time config shared by the edge label program
 * (character SDF shader) and the edge label background program (ribbon
 * shader). Both must agree on body bounds, visibility ramp, and
 * perpendicular offset, so both shader generators consume this same object.
 */
export interface EdgeLabelShaderConfig {
  paths: EdgePath[];
  headLengthRatio: number;
  tailLengthRatio: number;
  fontSizeMode: "fixed" | "scaled";
  minVisibilityThreshold: number;
  fullVisibilityThreshold: number;
}

/**
 * Normalizes a flat-options shape (as accepted by `createEdgeLabelProgram`
 * and the outer edge factory) into a resolved `EdgeLabelShaderConfig`.
 * Single source of truth for defaults — both sub-factories call this so
 * they cannot disagree.
 */
export function resolveEdgeLabelShaderConfig(options: {
  paths: EdgePath[];
  headLengthRatio?: number;
  tailLengthRatio?: number;
  fontSizeMode?: "fixed" | "scaled";
  minVisibilityThreshold?: number;
  fullVisibilityThreshold?: number;
}): EdgeLabelShaderConfig {
  return {
    paths: options.paths,
    headLengthRatio: options.headLengthRatio ?? 0,
    tailLengthRatio: options.tailLengthRatio ?? 0,
    fontSizeMode: options.fontSizeMode ?? "fixed",
    minVisibilityThreshold: options.minVisibilityThreshold ?? 0.7,
    fullVisibilityThreshold: options.fullVisibilityThreshold ?? 0.8,
  };
}
