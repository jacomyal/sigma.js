export type ContoursOptions = {
  radius: number;
  feather: number;
  zoomToRadiusRatioFunction: (ratio: number) => number;
  levels: {
    color?: string;
    threshold: number;
  }[];
  border?: {
    color: string;
    thickness: number;
  };
};

export const DEFAULT_CONTOURS_OPTIONS: ContoursOptions = {
  radius: 100,
  feather: 1.5,
  zoomToRadiusRatioFunction: (ratio) => Math.sqrt(ratio),
  levels: [
    {
      color: "#cccccc",
      threshold: 0.5,
    },
  ],
};
