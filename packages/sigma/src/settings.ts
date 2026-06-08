/**
 * Sigma.js Settings
 * =================================
 *
 * The list of settings and some handy functions.
 * @module sigma/settings
 */
import { AtLeastOne, AutoRescaleContent, Coordinates, LabelEventsSetting } from "./types";
import { assign } from "./utils";

/**
 * Sigma.js settings
 * =================================
 *
 * Settings control camera, interaction, and rendering behavior.
 * Styling is handled separately via the `styles` option.
 * Program generation is handled via the `primitives` option.
 */
export interface Settings {
  // Performance
  hideEdgesOnMove: boolean;
  hideLabelsOnMove: boolean;
  renderLabels: boolean;
  renderEdgeLabels: boolean;
  enableEdgeEvents: boolean;
  nodeLabelEvents: LabelEventsSetting;
  edgeLabelEvents: LabelEventsSetting;
  pickingDownSizingRatio: number;
  nodePickingPadding: number;
  edgePickingPadding: number;
  labelPickingPadding: number;
  stagePadding: number;
  minEdgeThickness: number;
  antiAliasingFeather: number;

  // Mouse and touch settings
  dragTimeout: number;
  draggedEventsTolerance: number;
  inertiaDuration: number;
  inertiaRatio: number;
  zoomDuration: number;
  zoomingRatio: number;
  doubleClickTimeout: number;
  doubleClickZoomingRatio: number;
  doubleClickZoomingDuration: number;
  tapMoveTolerance: number;

  // Size and scaling
  zoomToSizeRatioFunction: (ratio: number) => number;
  itemSizesReference: "screen" | "positions";
  autoRescale: boolean | "once";
  autoRescaleContent: AutoRescaleContent;

  // Node drag
  enableNodeDrag: boolean;
  getDraggedNodes: (draggedNode: string) => string[];
  dragPositionToAttributes: ((position: Coordinates, node: string) => Record<string, unknown>) | null;

  // Label rendering optimization
  labelDensity: number;
  labelGridCellSize: number;
  labelRenderedSizeThreshold: number;
  labelPixelSnapping: boolean;

  // Camera and features
  minCameraRatio: null | number;
  maxCameraRatio: null | number;
  enableCameraZooming: boolean;
  enableScrollBlocking: boolean;
  // When scroll blocking is enabled, controls how many consecutive wheel events at a zoom boundary
  // are still blocked before page scroll is released. Use Infinity to never release (always block).
  scrollBlockingReleaseThreshold: number;
  enableCameraPanning: boolean;
  enableCameraRotation: boolean;
  enableCameraMouseRotation: boolean;
  cameraPanBoundaries:
    | null
    | true
    | AtLeastOne<{ tolerance: number; boundaries: { x: [number, number]; y: [number, number] } }>;

  // Lifecycle
  allowInvalidContainer: boolean;

  // Debug
  DEBUG_displayPickingLayer: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  // Performance
  hideEdgesOnMove: false,
  hideLabelsOnMove: false,
  renderLabels: true,
  renderEdgeLabels: false,
  enableEdgeEvents: false,
  nodeLabelEvents: false,
  edgeLabelEvents: false,
  pickingDownSizingRatio: 2,
  nodePickingPadding: 0,
  edgePickingPadding: 4,
  labelPickingPadding: 10,
  stagePadding: 30,
  minEdgeThickness: 1.7,
  antiAliasingFeather: 1,

  // Mouse and touch settings
  dragTimeout: 100,
  draggedEventsTolerance: 3,
  inertiaDuration: 200,
  inertiaRatio: 3,
  zoomDuration: 250,
  zoomingRatio: 1.7,
  doubleClickTimeout: 300,
  doubleClickZoomingRatio: 2.2,
  doubleClickZoomingDuration: 200,
  tapMoveTolerance: 10,

  // Size and scaling
  zoomToSizeRatioFunction: Math.sqrt,
  itemSizesReference: "positions",
  autoRescale: true,
  autoRescaleContent: "positions",

  // Node drag
  enableNodeDrag: false,
  getDraggedNodes: (node: string) => [node],
  dragPositionToAttributes: null,

  // Label rendering optimization
  labelDensity: 1,
  labelGridCellSize: 100,
  labelRenderedSizeThreshold: 6,
  labelPixelSnapping: true,

  // Camera and features
  minCameraRatio: null,
  maxCameraRatio: null,
  enableCameraZooming: true,
  enableScrollBlocking: true,
  scrollBlockingReleaseThreshold: 5,
  enableCameraPanning: true,
  enableCameraRotation: true,
  enableCameraMouseRotation: true,
  cameraPanBoundaries: null,

  // Lifecycle
  allowInvalidContainer: false,

  // Debug
  DEBUG_displayPickingLayer: false,
};

export function validateSettings(settings: Settings): void {
  if (typeof settings.labelDensity !== "number" || settings.labelDensity < 0) {
    throw new Error("Settings: invalid `labelDensity`. Expecting a positive number.");
  }

  const { minCameraRatio, maxCameraRatio } = settings;
  if (typeof minCameraRatio === "number" && typeof maxCameraRatio === "number" && maxCameraRatio < minCameraRatio) {
    throw new Error(
      "Settings: invalid camera ratio boundaries. Expecting `maxCameraRatio` to be greater than `minCameraRatio`.",
    );
  }
}

export function resolveSettings(settings: Partial<Settings>): Settings {
  return assign({}, DEFAULT_SETTINGS, settings);
}
