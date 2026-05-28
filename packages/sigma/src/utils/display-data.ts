/**
 * Predicates over node/edge display data.
 *
 * These check the resolved visibility/labelVisibility/backdropVisibility
 * fields produced by the styles pipeline. They tolerate missing fields so
 * they can be called on partial shapes (e.g. before defaults are merged).
 */

export function hasForcedLabel(data: { visibility?: string; labelVisibility?: string }): boolean {
  return data.labelVisibility === "visible" && data.visibility !== "hidden";
}

export function hasBackdrop(data: { visibility?: string; backdropVisibility?: string }): boolean {
  return data.backdropVisibility === "visible" && data.visibility !== "hidden";
}
