import nodeImagePkg from "../../node-image/package.json";
import sigmaPkg from "../../sigma/package.json";
import websitePkg from "../package.json";

export const SIGMA_VERSION = sigmaPkg.version;
export const NODE_IMAGE_VERSION = nodeImagePkg.version;
export const GRAPHOLOGY_VERSION = websitePkg.dependencies.graphology.replace(/^\D*/, "");
