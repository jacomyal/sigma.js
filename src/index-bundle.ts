/**
 * Sigma.js Bundle Endpoint
 * ========================
 *
 * The library endpoint.
 * Will be built so that it exports a global `Sigma` class, that also exposes
 * useful classes as static properties.
 * @module
 */
import SigmaClass from "./sigma";
import Camera from "./core/camera";
import QuadTree from "./core/quadtree";
import MouseCaptor from "./core/captors/mouse";

class Sigma extends SigmaClass {
  static Camera = Camera;
  static QuadTree = QuadTree;
  static MouseCaptor = MouseCaptor;
  static Sigma = SigmaClass;
}

module.exports = Sigma;
