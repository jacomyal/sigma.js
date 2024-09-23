import { Attributes } from "graphology-types";
import { NodeHoverDrawingFunction, NodeLabelDrawingFunction } from "sigma/rendering";

export type NodeBorderSizeMode = "relative" | "pixels";
export const DEFAULT_BORDER_SIZE_MODE: NodeBorderSizeMode = "relative";

export type NodeBorderColor = { value: string } | { attribute: string; defaultValue?: string } | { transparent: true };
export type NodeBorderSize =
  | { value: number; mode?: NodeBorderSizeMode }
  | { attribute: string; defaultValue: number; mode?: NodeBorderSizeMode }
  | { fill: true };
export interface CreateNodeBorderProgramOptions<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
> {
  borders: {
    color: NodeBorderColor;
    size: NodeBorderSize;
  }[];
  // Allows overriding drawLabel and drawHover returned class methods.
  drawLabel: NodeLabelDrawingFunction<N, E, G> | undefined;
  drawHover: NodeHoverDrawingFunction<N, E, G> | undefined;
}

export const DEFAULT_CREATE_NODE_BORDER_OPTIONS: CreateNodeBorderProgramOptions<Attributes, Attributes, Attributes> = {
  drawLabel: undefined,
  drawHover: undefined,
  borders: [
    { size: { value: 0.1 }, color: { attribute: "borderColor" } },
    { size: { fill: true }, color: { attribute: "color" } },
  ],
};

export const DEFAULT_COLOR = "#000000";
