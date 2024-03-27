export type NodeBorderSizeMode = "relative" | "pixels";
export const DEFAULT_BORDER_SIZE_MODE: NodeBorderSizeMode = "relative";

export type NodeSliceColor = { value: string } | { attribute: string; defaultValue?: string } | { transparent: true };
export type NodeSliceValue = { value: number } | { attribute: string };

export interface CreateNodePiechartProgramOptions {
  defaultColor?: string;
  slices: {
    color: NodeSliceColor;
    size: NodeSliceValue;
  }[];
}

export const DEFAULT_COLOR = "#000000";

export function numberToGLSLFloat(n: number): string {
  return n % 1 === 0 ? n.toFixed(1) : n.toString();
}
