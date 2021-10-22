/**
 * Sigma.js Settings
 * =================================
 *
 * The list of settings and some handy functions.
 * @module
 */

import { Attributes } from "graphology-types";

import drawLabel from "./rendering/canvas/label";
import drawHover from "./rendering/canvas/hover";
import drawEdgeLabel from "./rendering/canvas/edge-label";
import { EdgeDisplayData, NodeDisplayData } from "./types";
import CircleNodeProgram from "./rendering/webgl/programs/node.fast";
import LineEdgeProgram from "./rendering/webgl/programs/edge";
import ArrowEdgeProgram from "./rendering/webgl/programs/edge.arrow";
import { EdgeProgramConstructor } from "./rendering/webgl/programs/common/edge";
import { NodeProgramConstructor } from "./rendering/webgl/programs/common/node";

export function validateSettings(settings: Settings): void {
  if (typeof settings.labelDensity !== "number" || settings.labelDensity < 0) {
    throw new Error("Settings: invalid `labelDensity`. Expecting a positive number.");
  }
}

/**
 * Sigma.js settings
 * =================================
 */
export interface Settings {
  // Performance
  hideEdgesOnMove: boolean;
  hideLabelsOnMove: boolean;
  renderLabels: boolean;
  renderEdgeLabels: boolean;
  enableEdgeClickEvents: boolean;
  enableEdgeWheelEvents: boolean;
  enableEdgeHoverEvents: boolean | "debounce";
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
  // Labels
  labelDensity: number;
  labelGridCellSize: number;
  labelRenderedSizeThreshold: number;
  // Reducers
  nodeReducer: null | ((node: string, data: Attributes) => Partial<NodeDisplayData>);
  edgeReducer: null | ((edge: string, data: Attributes) => Partial<EdgeDisplayData>);
  // Features
  zIndex: boolean;
  // Renderers
  labelRenderer: typeof drawLabel;
  hoverRenderer: typeof drawHover;
  edgeLabelRenderer: typeof drawEdgeLabel;

  // Program classes
  nodeProgramClasses: { [key: string]: NodeProgramConstructor };
  edgeProgramClasses: { [key: string]: EdgeProgramConstructor };
}

export const DEFAULT_SETTINGS: Settings = {
  // Performance
  hideEdgesOnMove: false,
  hideLabelsOnMove: false,
  renderLabels: true,
  renderEdgeLabels: false,
  enableEdgeClickEvents: false,
  enableEdgeWheelEvents: false,
  enableEdgeHoverEvents: false,

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

  // Labels
  labelDensity: 0.07,
  labelGridCellSize: 60,
  labelRenderedSizeThreshold: 6,

  // Reducers
  nodeReducer: null,
  edgeReducer: null,

  // Features
  zIndex: false,

  // Renderers
  labelRenderer: drawLabel,
  hoverRenderer: drawHover,
  edgeLabelRenderer: drawEdgeLabel,

  // Program classes
  nodeProgramClasses: {
    circle: CircleNodeProgram,
  },
  edgeProgramClasses: {
    arrow: ArrowEdgeProgram,
    line: LineEdgeProgram,
  },
};
