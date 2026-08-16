/**
 * Sigma.js Bundle Endpoint
 * ========================
 *
 * The library endpoint.
 * Will be built so that it exports a global `Sigma` class, that also exposes:
 * - the main entrypoint's value exports as flat statics
 * - one static namespace per package entrypoint (`sigma/types`,
 *   `sigma/settings`, etc.), mirroring the ESM subpath imports
 * @module
 */
import * as primitives from "./primitives";
import * as rendering from "./rendering";
import * as settings from "./settings";
import * as types from "./types";
import * as utils from "./utils";
import Camera, { DEFAULT_CAMERA_STATE } from "./core/camera";
import MouseCaptor from "./core/captors/mouse";
import TouchCaptor from "./core/captors/touch";
import { SDFAtlasManager } from "./core/sdf-atlas";
import Sigma from "./sigma";
import { DEFAULT_STYLES, DEPTHLESS_STYLES } from "./types/styles";

export default Object.assign(Sigma, {
  Sigma,
  Camera,
  MouseCaptor,
  TouchCaptor,
  SDFAtlasManager,

  DEFAULT_CAMERA_STATE,
  DEFAULT_STYLES,
  DEPTHLESS_STYLES,

  types,
  settings,
  primitives,
  rendering,
  utils,
});
