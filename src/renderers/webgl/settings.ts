import { NodeEntry, EdgeEntry } from "graphology-types";

import drawLabel from "../canvas/components/label";
import drawHover from "../canvas/components/hover";
import drawEdgeLabel from "../canvas/components/edge-label";
import { Coordinates } from "../../captors/utils";
import CircleNodeProgram from "./programs/node.fast";
import LineEdgeProgram from "./programs/edge";
import ArrowEdgeProgram from "./programs/edge.arrow";
import { EdgeProgramConstructor } from "./programs/common/edge";
import { NodeProgramConstructor } from "./programs/common/node";

/**
 * Sigma.js WebGL Renderer Settings
 * =================================
 *
 * The list of settings for the WebGL renderer and some handy functions.
 */

export function validateWebglRendererSettings(settings: WebGLSettings) {
  // Label grid cell
  if (
    settings.labelGrid &&
    settings.labelGrid.cell &&
    typeof settings.labelGrid.cell === "object" &&
    (!settings.labelGrid.cell.width || !settings.labelGrid.cell.height)
  ) {
    throw new Error("sigma/renderers/webgl/settings: invalid `labelGrid.cell`. Expecting {width, height}.");
  }
}

/**
 * Sigma.js WebGL Renderer Settings
 * =================================
 *
 * The list of settings for the WebGL renderer and some handy functions.
 */

export interface SigmaNode extends Coordinates {
  key: string;
  label: any;
  color: any;
  size: number;
}

export interface SigmaEdge {
  key: string;
  label: any;
  color: any;
  size: number;
}

export interface WebGLSettings {
  // Performance
  hideEdgesOnMove: boolean;
  hideLabelsOnMove: boolean;
  renderLabels: boolean;
  renderEdgeLabels: boolean;
  // Component rendering
  defaultNodeColor: string;
  defaultNodeType: string;
  defaultEdgeColor: string;
  defaultEdgeType: string;
  labelFont: string;
  labelSize: number;
  labelWeight: string;
  edgeLabelFont: string;
  edgeLabelSize: number;
  edgeLabelWeight: string;
  // Labels
  labelGrid: {
    cell: any;
    renderedSizeThreshold: number;
  };
  // Reducers
  nodeReducer: null | ((edge: EdgeEntry, data: { [key: string]: any }) => { [key: string]: any });
  edgeReducer: null | ((node: NodeEntry, data: { [key: string]: any }) => { [key: string]: any });
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

export const WEBGL_RENDERER_DEFAULT_SETTINGS: WebGLSettings = {
  // Performance
  hideEdgesOnMove: false,
  hideLabelsOnMove: false,
  renderLabels: true,
  renderEdgeLabels: false,

  // Component rendering
  defaultNodeColor: "#999",
  defaultNodeType: "circle",
  defaultEdgeColor: "#ccc",
  defaultEdgeType: "line",
  labelFont: "Arial",
  labelSize: 14,
  labelWeight: "normal",
  edgeLabelFont: "Arial",
  edgeLabelSize: 14,
  edgeLabelWeight: "normal",

  // Labels
  labelGrid: {
    cell: null,
    renderedSizeThreshold: -Infinity,
  },

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
