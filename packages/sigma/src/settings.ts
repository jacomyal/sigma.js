/**
 * Sigma.js Settings
 * =================================
 *
 * The list of settings and some handy functions.
 * @module
 */
import { Attributes } from "graphology-types";

import {
  EdgeArrowProgram,
  EdgeLabelDrawingFunction,
  EdgeProgramType,
  EdgeRectangleProgram,
  NodeCircleProgram,
  NodeHoverDrawingFunction,
  NodeLabelDrawingFunction,
  NodeProgramType,
  drawDiscNodeHover,
  drawDiscNodeLabel,
  drawStraightEdgeLabel,
} from "./rendering";
import { EdgeDisplayData, NodeDisplayData } from "./types";
import { assign } from "./utils";

/**
 * Sigma.js settings
 * =================================
 */
export interface Settings<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> {
  // Performance
  hideEdgesOnMove: boolean;
  hideLabelsOnMove: boolean;
  renderLabels: boolean;
  renderEdgeLabels: boolean;
  enableEdgeEvents: boolean;
  // Component rendering
  defaultNodeColor: string;
  defaultNodeType: string;
  defaultEdgeColor: string;
  defaultEdgeType: string;
  labelFont: string;
  labelSize: number;
  labelWeight: string;
  labelColor: { attribute: string; color?: string } | { color: string; attribute?: undefined };
  edgeLabelFont: string;
  edgeLabelSize: number;
  edgeLabelWeight: string;
  edgeLabelColor: { attribute: string; color?: string } | { color: string; attribute?: undefined };
  stagePadding: number;
  defaultDrawEdgeLabel: EdgeLabelDrawingFunction<N, E, G>;
  defaultDrawNodeLabel: NodeLabelDrawingFunction<N, E, G>;
  defaultDrawNodeHover: NodeHoverDrawingFunction<N, E, G>;
  minEdgeThickness: number;
  antiAliasingFeather: number;

  // Size and scaling
  zoomToSizeRatioFunction: (ratio: number) => number;
  itemSizesReference: "screen" | "positions";
  autoRescale: boolean;
  autoCenter: boolean;

  // Labels
  labelDensity: number;
  labelGridCellSize: number;
  labelRenderedSizeThreshold: number;

  // Reducers
  nodeReducer: null | ((node: string, data: N) => Partial<NodeDisplayData>);
  edgeReducer: null | ((edge: string, data: E) => Partial<EdgeDisplayData>);

  // Features
  zIndex: boolean;
  minCameraRatio: null | number;
  maxCameraRatio: null | number;
  enableCameraRotation: boolean;

  // Lifecycle
  allowInvalidContainer: boolean;

  // Program classes
  nodeProgramClasses: { [type: string]: NodeProgramType<N, E, G> };
  nodeHoverProgramClasses: { [type: string]: NodeProgramType<N, E, G> };
  edgeProgramClasses: { [type: string]: EdgeProgramType<N, E, G> };
}

export const DEFAULT_SETTINGS: Settings<Attributes, Attributes, Attributes> = {
  // Performance
  hideEdgesOnMove: false,
  hideLabelsOnMove: false,
  renderLabels: true,
  renderEdgeLabels: false,
  enableEdgeEvents: false,

  // Component rendering
  defaultNodeColor: "#999",
  defaultNodeType: "circle",
  defaultEdgeColor: "#ccc",
  defaultEdgeType: "line",
  labelFont: "Arial",
  labelSize: 14,
  labelWeight: "normal",
  labelColor: { color: "#000" },
  edgeLabelFont: "Arial",
  edgeLabelSize: 14,
  edgeLabelWeight: "normal",
  edgeLabelColor: { attribute: "color" },
  stagePadding: 30,
  defaultDrawEdgeLabel: drawStraightEdgeLabel,
  defaultDrawNodeLabel: drawDiscNodeLabel,
  defaultDrawNodeHover: drawDiscNodeHover,
  minEdgeThickness: 1.7,
  antiAliasingFeather: 1,

  // Size and scaling
  zoomToSizeRatioFunction: Math.sqrt,
  itemSizesReference: "screen",
  autoRescale: true,
  autoCenter: true,

  // Labels
  labelDensity: 1,
  labelGridCellSize: 100,
  labelRenderedSizeThreshold: 6,

  // Reducers
  nodeReducer: null,
  edgeReducer: null,

  // Features
  zIndex: false,
  minCameraRatio: null,
  maxCameraRatio: null,
  enableCameraRotation: true,

  // Lifecycle
  allowInvalidContainer: false,

  // Program classes
  nodeProgramClasses: {},
  nodeHoverProgramClasses: {},
  edgeProgramClasses: {},
};

export const DEFAULT_NODE_PROGRAM_CLASSES: Record<string, NodeProgramType> = {
  circle: NodeCircleProgram,
};

export const DEFAULT_EDGE_PROGRAM_CLASSES: Record<string, EdgeProgramType> = {
  arrow: EdgeArrowProgram,
  line: EdgeRectangleProgram,
};

export function validateSettings<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
>(settings: Settings<N, E, G>): void {
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

export function resolveSettings<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
>(settings: Partial<Settings<N, E, G>>): Settings<N, E, G> {
  const resolvedSettings = assign({}, DEFAULT_SETTINGS, settings);

  resolvedSettings.nodeProgramClasses = assign({}, DEFAULT_NODE_PROGRAM_CLASSES, resolvedSettings.nodeProgramClasses);
  resolvedSettings.edgeProgramClasses = assign({}, DEFAULT_EDGE_PROGRAM_CLASSES, resolvedSettings.edgeProgramClasses);

  return resolvedSettings;
}
