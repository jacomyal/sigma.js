import { Attributes } from "graphology-types";
import { NodeHoverDrawingFunction, NodeLabelDrawingFunction } from "sigma/rendering";
import { NonEmptyArray } from "sigma/types";

export type NodeSliceColor = { value: string } | { attribute: string; defaultValue?: string } | { transparent: true };
export type NodeSliceValue = { value: number } | { attribute: string };

export interface CreateNodePiechartProgramOptions<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> {
  defaultColor: string;
  offset: NodeSliceValue;
  slices: NonEmptyArray<{
    color: NodeSliceColor;
    value: NodeSliceValue;
  }>;
  // Allows overriding drawLabel and drawHover returned class methods.
  drawLabel: NodeLabelDrawingFunction<N, E, G> | undefined;
  drawHover: NodeHoverDrawingFunction<N, E, G> | undefined;
}

export const DEFAULT_COLOR = "#000000";

export const DEFAULT_CREATE_NODE_PIECHART_OPTIONS: Omit<CreateNodePiechartProgramOptions, "slices"> = {
  drawLabel: undefined,
  drawHover: undefined,
  defaultColor: DEFAULT_COLOR,
  offset: { value: 0 },
};
