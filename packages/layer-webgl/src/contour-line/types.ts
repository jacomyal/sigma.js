export type ContourLineOptions = {
  // Score computation:
  radius: number;
  zoomToRadiusRatioFunction: (ratio: number) => number;
  // Rendering:
  threshold: number;
  lineWidth: number;
  feather: number;
  backgroundColor: string;
  contourColor: string;
};

export const DEFAULT_CONTOUR_LINE_OPTIONS: ContourLineOptions = {
  radius: 100,
  zoomToRadiusRatioFunction: (ratio) => Math.sqrt(ratio),
  threshold: 0.5,
  lineWidth: 8,
  feather: 2,
  backgroundColor: "#00000000",
  contourColor: "#000000ff",
};
