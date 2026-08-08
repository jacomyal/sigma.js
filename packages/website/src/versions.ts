import sigmaPkg from "../../sigma/package.json";
import websitePkg from "../package.json";

export const SIGMA_VERSION = sigmaPkg.version;
export const GRAPHOLOGY_VERSION = websitePkg.dependencies.graphology.replace(/^\D*/, "");
