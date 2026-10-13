/**
 * Sigma.js v4 Options API - Factory and Type Utilities
 * =====================================================
 *
 * This file provides the `defineSigmaOptions` factory function that enables
 * type-safe configuration of sigma instances, with graphic variables
 * inferred from primitives declarations.
 *
 * @module
 */
import { Attributes } from "graphology-types";

import { PrimitivesDeclaration } from "../primitives";
import type { SigmaOptions } from "../types";
import { EdgeStyleProperties, FullEdgeState, FullGraphState, FullNodeState, NodeStyleProperties } from "./styles";

// =============================================================================
// STYLES DECLARATION TYPE
// =============================================================================

/**
 * Full styles declaration with node and edge styles.
 * This is what gets stored on the Sigma instance.
 */
export interface StylesDeclaration<
  NA extends Attributes = Attributes,
  EA extends Attributes = Attributes,
  NS = {}, // additional custom node state fields
  ES = {}, // additional custom edge state fields
  GS = {}, // additional custom graph state fields
> {
  nodes?:
    | NodeStyleProperties<NA, FullNodeState<NS>, FullGraphState<GS>>
    | NodeStyleProperties<NA, FullNodeState<NS>, FullGraphState<GS>>[];
  edges?:
    | EdgeStyleProperties<EA, FullEdgeState<ES>, FullGraphState<GS>>
    | EdgeStyleProperties<EA, FullEdgeState<ES>, FullGraphState<GS>>[];
}

// =============================================================================
// FACTORY FUNCTION
// =============================================================================

/**
 * Factory function for creating type-safe sigma options.
 *
 * Types the options from the primitives declaration, so that variables and
 * depth layers declared in primitives are checked in styles.
 *
 * @example
 * ```typescript
 * const options = defineSigmaOptions({
 *   primitives: {
 *     nodes: {
 *       shapes: [sdfCircle(), sdfSquare()],
 *       variables: {
 *         borderSize: { type: "number", default: 2 },
 *         borderColor: { type: "color", default: "#fff" },
 *       },
 *       layers: [layerFill()],
 *     },
 *     edges: { paths: [pathLine(), pathCurved()] },
 *   },
 *   styles: {
 *     nodes: {
 *       color: "#666",
 *       shape: "circle",
 *       borderSize: 2,      // Inferred from variables
 *       borderColor: "#fff",
 *     },
 *   },
 * });
 * ```
 */
export function defineSigmaOptions<const P extends PrimitivesDeclaration>(
  options: SigmaOptions<Attributes, Attributes, Attributes, {}, {}, {}, P>,
): SigmaOptions<Attributes, Attributes, Attributes, {}, {}, {}, P> {
  return options;
}
