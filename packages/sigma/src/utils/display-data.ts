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

/**
 * Encodes a node's rotation-alignment styles as the two GPU flags written to
 * texel 1 of the node-data texture: `[nodeRotation, labelRotation]`, each
 * 0 = viewport (screen-upright) or 1 = graph (turns with the camera).
 */
export function nodeRotationFlags(data: {
  rotationAlignment?: string;
  labelRotationAlignment?: string;
}): [number, number] {
  return [data.rotationAlignment === "graph" ? 1 : 0, data.labelRotationAlignment === "graph" ? 1 : 0];
}
