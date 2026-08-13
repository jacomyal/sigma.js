/**
 * Sigma.js Edge Layer - Gradient
 * ==============================
 *
 * Colors the edge as a gradient along a list of color stops.
 *
 * @module
 */
import { EdgeLayer } from "../types";
import { resolveEdgeColorValue } from "./color-value";

/**
 * A gradient color stop: one of the EdgeColorValue forms, carrying an
 * optional offset along the visible edge span, from 0 (source end) to 1
 * (target end). Constant colors take the `{ color, offset }` form when they
 * need an offset.
 */
export type GradientStop =
  | string
  | { color: string; offset?: number }
  | { node: "source" | "target"; offset?: number }
  | { attribute: string; default?: string; offset?: number };

/**
 * Options for the gradient layer.
 */
export interface LayerGradientOptions {
  /**
   * Color stops, from the source end to the target end. Each stop is an
   * EdgeColorValue form (e.g. `{ node: "source" }`, `"transparent"`,
   * `{ attribute: "color" }`) with an optional `offset` field.
   *
   * Offsets follow CSS gradient rules: the first stop defaults to 0, the last
   * to 1, offsets are clamped to [0, 1] and forced non-decreasing, and stops
   * without an offset spread evenly between their positioned neighbors.
   * Before the first offset and past the last one, the gradient pads with the
   * nearest stop's color.
   */
  stops: GradientStop[];

  /**
   * Per-edge toggle, read from a boolean edge attribute. Edges whose
   * attribute resolves to false skip the gradient and fall through to the
   * layers below (same pattern as disabling dashes with `dashSize: 0`).
   *
   * Default: gradient on for every edge.
   */
  enabled?: { attribute: string; default?: boolean };
}

/**
 * Resolves stop offsets following CSS gradient rules.
 */
function resolveOffsets(stops: { offset?: number }[]): number[] {
  const offsets: (number | undefined)[] = stops.map((s) => s.offset);
  if (offsets[0] === undefined) offsets[0] = 0;
  if (offsets[stops.length - 1] === undefined) offsets[stops.length - 1] = 1;

  // Clamp explicit offsets to [0, 1] and force them non-decreasing
  let floor = 0;
  for (let i = 0; i < offsets.length; i++) {
    const offset = offsets[i];
    if (offset === undefined) continue;
    floor = Math.max(floor, Math.min(Math.max(offset, 0), 1));
    offsets[i] = floor;
  }

  // Spread unpositioned stops evenly between their positioned neighbors
  for (let i = 1; i < offsets.length; i++) {
    if (offsets[i] !== undefined) continue;
    let next = i + 1;
    while (offsets[next] === undefined) next++;
    const from = offsets[i - 1] as number;
    const to = offsets[next] as number;
    for (let j = i; j < next; j++) offsets[j] = from + ((to - from) * (j - i + 1)) / (next - i + 1);
    i = next;
  }

  return offsets as number[];
}

/**
 * Creates a gradient layer that interpolates between color stops along the
 * edge, e.g. `{ stops: [{ node: "source" }, { node: "target" }] }` for a
 * gradient between the endpoint node colors.
 *
 * Node colors are read from the node data texture, so they stay in sync with
 * node styles (hover, state changes...) without any per-edge data. Colors
 * carry only their own alpha; edge opacity dims the final fragment once.
 *
 * @param options - Gradient configuration
 * @returns EdgeLayer definition for the gradient
 */
export function layerGradient(options: LayerGradientOptions): EdgeLayer {
  if (options.stops.length < 2) throw new Error("layerGradient: at least two stops are required");

  const stops = options.stops.map((stop) => {
    if (typeof stop === "string") return { color: stop, offset: undefined };
    return { color: "color" in stop ? stop.color : stop, offset: stop.offset };
  });
  const offsets = resolveOffsets(stops);
  const colors = stops.map((stop, i) => resolveEdgeColorValue(stop.color, `gradientStop${i}`));
  const enabled = options.enabled;

  const attributes: EdgeLayer["attributes"] = colors.flatMap((c) => c.attributes);
  if (enabled) {
    attributes.push({
      name: "a_gradient",
      size: 1,
      type: WebGL2RenderingContext.FLOAT,
      source: enabled.attribute,
      defaultValue: enabled.default ?? true,
    });
  }

  // One premultiplied mix per segment: each factor clamps to 0 before its
  // segment and 1 after it, so the chain yields piecewise-linear interpolation
  // with padding past both ends. Zero-length segments become hard stops.
  const segments = offsets
    .map((offset, i) => {
      if (i === 0) return "";
      const start = offsets[i - 1].toFixed(6);
      const span = Math.max(offset - offsets[i - 1], 1e-6).toFixed(6);
      return `
  vec4 c${i} = ${colors[i].glsl};
  color = mix(color, vec4(c${i}.rgb * c${i}.a, c${i}.a), clamp((ctx.t - ${start}) / ${span}, 0.0, 1.0));`;
    })
    .join("");

  // language=GLSL
  const glsl = /*glsl*/ `
// Gradient layer: interpolates the color stops over the visible span of the
// edge (ctx.t is 0 where the edge leaves the source node, 1 where it reaches
// the target node). Interpolation happens in premultiplied space so fading to
// a (semi-)transparent stop keeps the hue instead of darkening through black;
// the returned color is straight-alpha, matching the blendOver convention.
vec4 layer_gradient(EdgeContext ctx) {${
    enabled
      ? `
  // Per-edge toggle: fall through to the layers below when disabled
  if (v_gradient < 0.5) return vec4(0.0);
`
      : ""
  }
  vec4 c0 = ${colors[0].glsl};
  vec4 color = vec4(c0.rgb * c0.a, c0.a);${segments}
  return color.a > 0.0 ? vec4(color.rgb / color.a, color.a) : vec4(0.0);
}
`;

  return {
    name: "gradient",
    glsl,
    uniforms: [],
    attributes,
    needsNodeColors: colors.some((c) => c.needsNodeColors),
  };
}
