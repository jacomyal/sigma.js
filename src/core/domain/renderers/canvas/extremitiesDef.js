/**
 * The default renderer for hovered edge extremities. It renders the edge
 * extremities as hovered.
 *
 * @param  {object}                   edge         The edge object.
 * @param  {object}                   source node  The edge source node.
 * @param  {object}                   target node  The edge target node.
 * @param  {CanvasRenderingContext2D} context      The canvas context.
 * @param  {configurable}             settings     The settings function.
 */
export default sigma =>
  function extremitiesDef(edge, source, target, context, settings) {
    // Source Node:
    (sigma.canvas.hovers[source.type] || sigma.canvas.hovers.def)(
      source,
      context,
      settings
    );

    // Target Node:
    (sigma.canvas.hovers[target.type] || sigma.canvas.hovers.def)(
      target,
      context,
      settings
    );
  };
