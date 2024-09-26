import Sigma from "sigma";
import { Settings } from "sigma/settings";
import { CameraState } from "sigma/types";

export type ToImageOptions = {
  layers: null | string[];
  width: null | number;
  height: null | number;
  fileName: string;
  format: "png" | "jpeg";
  sigmaSettings: Partial<Settings>;
  cameraState: null | CameraState;
  backgroundColor: string;
  withTempRenderer: null | ((tmpRenderer: Sigma) => void) | ((tmpRenderer: Sigma) => Promise<void>);
};

export const DEFAULT_TO_IMAGE_OPTIONS: ToImageOptions = {
  layers: null,
  width: null,
  height: null,
  fileName: "graph",
  format: "png",
  sigmaSettings: {},
  cameraState: null,
  backgroundColor: "transparent",
  withTempRenderer: null,
};
