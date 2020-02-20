import drawLabel from '../canvas/components/label';
import drawHover from '../canvas/components/hover';

/**
 * Sigma.js WebGL Renderer Settings
 * =================================
 *
 * The list of settings for the WebGL renderer and some handy functions.
 */

export function validateWebglRendererSettings(settings) {

  // Label grid cell
  if (
    settings.labelGrid &&
    settings.labelGrid.cell &&
    typeof settings.labelGrid.cell === 'object' &&
    (!settings.labelGrid.cell.width || !settings.labelGrid.cell.height)
  ) {
    throw new Error('sigma/renderers/webgl/settings: invalid `labelGrid.cell`. Expecting {width, height}.');
  }
}

export const WEBGL_RENDERER_DEFAULT_SETTINGS = {

  // Performance
  hideEdgesOnMove: false,
  hideLabelsOnMove: false,
  renderLabels: true,

  // Component rendering
  defaultNodeColor: '#999',
  defaultNodeType: 'circle',
  defaultEdgeColor: '#ccc',
  defaultEdgeType: 'line',
  labelFont: 'Arial',
  labelSize: 14,
  labelWeight: 'normal',

  // Labels
  labelGrid: {
    cell: null,
    renderedSizeThreshold: -Infinity
  },

  // Reducers
  nodeReducer: null,
  edgeReducer: null,

  // Features
  zIndex: false,

  // Renderers
  labelRenderer: drawLabel,
  hoverRenderer: drawHover,
};
