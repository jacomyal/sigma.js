/**
 * Sigma.js Bundle Endpoint
 * ========================
 *
 * The library endpoint.
 * Will be built so that it exports a global `Sigma` class, that also exposes
 * useful classes as static properties.
 * @module
 */
import { NodeImageProgram } from "@sigma/node-image";

import * as rendering from "./rendering";
import * as utils from "./utils";
import Camera from "./core/camera";
import MouseCaptor from "./core/captors/mouse";
import SigmaClass from "./sigma";

class Sigma extends SigmaClass {
  static Camera = Camera;
  static MouseCaptor = MouseCaptor;
  static Sigma = SigmaClass;

  static rendering = { ...rendering, NodeImageProgram };
  static utils = utils;
}

export default Sigma;
