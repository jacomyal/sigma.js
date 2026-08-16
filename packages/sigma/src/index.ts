/**
 * Sigma.js Library Endpoint
 * =========================
 *
 * The library endpoint.
 * @module sigma
 */
import Camera from "./core/camera";
import MouseCaptor from "./core/captors/mouse";
import TouchCaptor from "./core/captors/touch";
import { SDFAtlasManager } from "./core/sdf-atlas";
import {
  DEFAULT_DEPTH_LAYERS as PRIMITIVES_DEFAULT_DEPTH_LAYERS,
  DEFAULT_EDGE_DEPTH_LAYERS as PRIMITIVES_DEFAULT_EDGE_DEPTH_LAYERS,
  DEFAULT_NODE_DEPTH_LAYERS as PRIMITIVES_DEFAULT_NODE_DEPTH_LAYERS,
} from "./primitives/types";
// Trigger side-effect registration of all built-in primitive factories
// (shapes, layers, paths, etc.) so that default primitives work out of the box.
import "./rendering";
import Sigma from "./sigma";
import { easings as UTILS_EASINGS } from "./utils/easings";

export default Sigma;
export { Sigma, Camera, MouseCaptor, TouchCaptor, SDFAtlasManager };
export { DEFAULT_CAMERA_STATE } from "./core/camera";
export type { CameraAnimationEndPayload, CameraAnimationPayload, CameraEvents, ZoomOptions } from "./core/camera";
export { DEFAULT_STYLES, DEPTHLESS_STYLES } from "./types/styles";

/** @deprecated Import `DEFAULT_DEPTH_LAYERS` from `"sigma/primitives"` instead. */
export const DEFAULT_DEPTH_LAYERS = PRIMITIVES_DEFAULT_DEPTH_LAYERS;
/** @deprecated Import `DEFAULT_NODE_DEPTH_LAYERS` from `"sigma/primitives"` instead. */
export const DEFAULT_NODE_DEPTH_LAYERS = PRIMITIVES_DEFAULT_NODE_DEPTH_LAYERS;
/** @deprecated Import `DEFAULT_EDGE_DEPTH_LAYERS` from `"sigma/primitives"` instead. */
export const DEFAULT_EDGE_DEPTH_LAYERS = PRIMITIVES_DEFAULT_EDGE_DEPTH_LAYERS;
/** @deprecated Import `easings` from `"sigma/utils"` instead. */
export const easings = UTILS_EASINGS;
export type { Easing } from "./utils/easings";
