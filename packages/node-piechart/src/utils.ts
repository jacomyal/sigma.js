import { NonEmptyArray } from "sigma/src/types.ts";

export type NodeSliceColor = { value: string } | { attribute: string; defaultValue?: string } | { transparent: true };
export type NodeSliceSize = { value: number } | { attribute: string };

export interface CreateNodePiechartProgramOptions {
  defaultColor: string;
  offset: NodeSliceSize;
  slices: NonEmptyArray<{
    color: NodeSliceColor;
    size: NodeSliceSize;
  }>;
}

export const DEFAULT_COLOR = "#000000";

export const DEFAULT_CREATE_NODE_PIECHART_OPTIONS: Omit<CreateNodePiechartProgramOptions, "slices"> = {
  defaultColor: DEFAULT_COLOR,
  offset: { value: 0 },
};

export function numberToGLSLFloat(n: number): string {
  return n % 1 === 0 ? n.toFixed(1) : n.toString();
}
