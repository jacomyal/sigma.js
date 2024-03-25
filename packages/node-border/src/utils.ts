export type NodeBorderSizeMode = "relative" | "pixels";
export const DEFAULT_BORDER_SIZE_MODE: NodeBorderSizeMode = "relative";

export type NodeBorderColor = { value: string } | { attribute: string; defaultValue?: string } | { transparent: true };
export type NodeBorderSize =
  | { value: number; mode?: NodeBorderSizeMode }
  | { attribute: string; defaultValue: number; mode?: NodeBorderSizeMode }
  | { fill: true };

export interface CreateNodeBorderProgramOptions {
  borders: {
    color: NodeBorderColor;
    size: NodeBorderSize;
  }[];
}

export const DEFAULT_CREATE_NODE_BORDER_OPTIONS: CreateNodeBorderProgramOptions = {
  borders: [
    { size: { value: 0.1 }, color: { attribute: "borderColor" } },
    { size: { fill: true }, color: { attribute: "color" } },
  ],
};

export const DEFAULT_COLOR = "#000000";

export function numberToGLSLFloat(n: number): string {
  return n % 1 === 0 ? n.toFixed(1) : n.toString();
}
