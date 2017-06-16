/**
 * Sigma.js Library Endpoint
 * ==========================
 *
 * The library endpoint.
 */
import Sigma from './sigma';
import Renderer from './renderer';
import Camera from './camera';
import QuadTree from './quadtree';
import MouseCaptor from './captors/mouse';
import WebGLRenderer from './renderers/webgl';

const library = {
  Sigma,
  Renderer,
  Camera,
  QuadTree,
  MouseCaptor,
  WebGLRenderer
};

module.exports = library;
