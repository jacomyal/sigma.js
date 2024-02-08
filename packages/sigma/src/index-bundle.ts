/**
 * Sigma.js Bundle Endpoint
 * ========================
 *
 * The library endpoint.
 * Will be built so that it exports a global `Sigma` class, that also exposes
 * useful classes as static properties.
 * @module
 */
import Camera from "./core/camera";
import MouseCaptor from "./core/captors/mouse";
import SigmaClass from "./sigma";

class Sigma extends SigmaClass {
  static Camera = Camera;
  static MouseCaptor = MouseCaptor;
  static Sigma = SigmaClass;
}

export { Sigma };
