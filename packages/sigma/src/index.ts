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
// Trigger side-effect registration of all built-in primitive factories
// (shapes, layers, paths, etc.) so that default primitives work out of the box.
import "./rendering";
import Sigma from "./sigma";

export default Sigma;
export { Sigma, Camera, MouseCaptor, TouchCaptor, SDFAtlasManager };
export { DEFAULT_CAMERA_STATE } from "./core/camera";
export type { CameraAnimationEndPayload, CameraAnimationPayload, CameraEvents, ZoomOptions } from "./core/camera";
export { DEFAULT_DEPTH_LAYERS, DEFAULT_EDGE_DEPTH_LAYERS, DEFAULT_NODE_DEPTH_LAYERS } from "./primitives/types";
export { easings } from "./utils/easings";
export type { Easing } from "./utils/easings";
