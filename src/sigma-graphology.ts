/**
 * Sigma.js + Graphology Bundle Endpoint
 * ======================================
 *
 * Endpoint for a mega bundle gathering sigma + graphology + libraries.
 */
import graphology from 'graphology';
import library from 'graphology-library/browser';

import Renderer from './renderer';
import Camera from './camera';
import QuadTree from './quadtree';
import MouseCaptor from './captors/mouse';
import WebGLRenderer from './renderers/webgl';

const sigma = {
  Renderer,
  Camera,
  QuadTree,
  MouseCaptor,
  WebGLRenderer
};

graphology.library = library;

window.sigma = sigma;
window.graphology = graphology;
