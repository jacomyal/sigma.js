import Sigma from "sigma";
import { Settings } from "sigma/settings";
import { CameraState, PrimitivesDeclaration, StylesDeclaration } from "sigma/types";

export type Override<Source, Result = Source> = Result | ((source: Source) => Result);

export type ToImageOptions = {
  width: null | number;
  height: null | number;
  fileName: string;
  format: "png" | "jpeg";
  sigmaOverrides: Partial<{
    primitives: Override<PrimitivesDeclaration>;
    styles: Override<StylesDeclaration>;
    settings: Override<Settings, Partial<Settings>>;
  }>;
  cameraState: null | CameraState;
  backgroundColor: string;
  withTempRenderer: null | ((tmpRenderer: Sigma) => void) | ((tmpRenderer: Sigma) => Promise<void>);
};

export const DEFAULT_TO_IMAGE_OPTIONS: ToImageOptions = {
  width: null,
  height: null,
  fileName: "graph",
  format: "png",
  sigmaOverrides: {},
  cameraState: null,
  backgroundColor: "transparent",
  withTempRenderer: null,
};
