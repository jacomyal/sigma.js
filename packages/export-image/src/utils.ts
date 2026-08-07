import { Override } from "./options";

/**
 * Applies an override to one of the source renderer's declarations: a function
 * takes full control, while an object only spreads over the sections it
 * declares.
 */
export function resolveOverride<S extends object, R extends object>(source: S, override?: Override<S, R>): S | R {
  if (!override) return source;
  return typeof override === "function" ? (override as (source: S) => R)(source) : { ...source, ...override };
}
