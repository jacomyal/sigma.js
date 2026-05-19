/**
 * Sigma.js Label Events
 * =====================
 *
 * Helpers around the `LabelEventsSetting` shape used by `nodeLabelEvents` /
 * `edgeLabelEvents`. They resolve the per-interaction mode and summarize a
 * setting for the picking-encoding decision.
 *
 * @module
 */
import { LabelEventMode, LabelEventsSetting, MouseInteraction } from "../types";

export function resolveLabelMode(setting: LabelEventsSetting, interaction: MouseInteraction): LabelEventMode {
  if (setting === false || setting === "extend" || setting === "separate") return setting;
  const explicit = setting[interaction];
  if (explicit !== undefined) return explicit;
  return setting.default ?? false;
}

export function hasAnyEnabled(setting: LabelEventsSetting): boolean {
  if (setting === false) return false;
  if (setting === "extend" || setting === "separate") return true;
  return Object.values(setting).some((s) => s === "extend" || s === "separate");
}

export function hasAnySeparate(setting: LabelEventsSetting): boolean {
  if (setting === "separate") return true;
  if (setting === false || setting === "extend") return false;
  if (setting.default === "separate") return true;

  return Object.values(setting).includes("separate");
}
