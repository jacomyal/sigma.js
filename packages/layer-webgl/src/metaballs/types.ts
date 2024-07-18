export type MetaballsOptions = {
  radius: number;
  zoomToRadiusRatioFunction: (ratio: number) => number;
  halos: {
    color?: string;
    threshold: number;
    feather: number;
  }[];
};

export const DEFAULT_METABALLS_OPTIONS: MetaballsOptions = {
  radius: 100,
  zoomToRadiusRatioFunction: (ratio) => Math.sqrt(ratio),
  halos: [
    {
      color: "#999999",
      threshold: 0.5,
      feather: 0.01,
    },
  ],
};
