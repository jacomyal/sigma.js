import { NonEmptyArray } from "sigma/types";

export type NodeSliceColor = { value: string } | { attribute: string; defaultValue?: string } | { transparent: true };
export type NodeSliceValue = { value: number } | { attribute: string };

export interface CreateNodePiechartProgramOptions {
  defaultColor: string;
  offset: NodeSliceValue;
  slices: NonEmptyArray<{
    color: NodeSliceColor;
    value: NodeSliceValue;
  }>;
}

export const DEFAULT_COLOR = "#000000";

export const DEFAULT_CREATE_NODE_PIECHART_OPTIONS: Omit<CreateNodePiechartProgramOptions, "slices"> = {
  defaultColor: DEFAULT_COLOR,
  offset: { value: 0 },
};
