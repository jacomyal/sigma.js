(function() {
  sigma.utils.pkg("sigma.svg.edges");

  /**
   * The default edge renderer. It renders the node as a simple line.
   */
  sigma.svg.edges.def = {
    /**
     * SVG Element creation.
     *
     * @param  {object}                   edge       The edge object.
     * @param  {object}                   source     The source node object.
     * @param  {object}                   target     The target node object.
     * @param  {configurable}             settings   The settings function.
     */
    create(edge, source, target, settings) {
      let color = edge.color;

      const prefix = settings("prefix") || "";

      const edgeColor = settings("edgeColor");

      const defaultNodeColor = settings("defaultNodeColor");

      const defaultEdgeColor = settings("defaultEdgeColor");

      if (!color)
        switch (edgeColor) {
          case "source":
            color = source.color || defaultNodeColor;
            break;
          case "target":
            color = target.color || defaultNodeColor;
            break;
          default:
            color = defaultEdgeColor;
            break;
        }

      const line = document.createElementNS(settings("xmlns"), "line");

      // Attributes
      line.setAttributeNS(null, "data-edge-id", edge.id);
      line.setAttributeNS(null, "class", `${settings("classPrefix")}-edge`);
      line.setAttributeNS(null, "stroke", color);

      return line;
    },

    /**
     * SVG Element update.
     *
     * @param  {object}                   edge       The edge object.
     * @param  {DOMElement}               line       The line DOM Element.
     * @param  {object}                   source     The source node object.
     * @param  {object}                   target     The target node object.
     * @param  {configurable}             settings   The settings function.
     */
    update(edge, line, source, target, settings) {
      const prefix = settings("prefix") || "";

      line.setAttributeNS(null, "stroke-width", edge[`${prefix}size`] || 1);
      line.setAttributeNS(null, "x1", source[`${prefix}x`]);
      line.setAttributeNS(null, "y1", source[`${prefix}y`]);
      line.setAttributeNS(null, "x2", target[`${prefix}x`]);
      line.setAttributeNS(null, "y2", target[`${prefix}y`]);

      // Showing
      line.style.display = "";

      return this;
    }
  };
})();
