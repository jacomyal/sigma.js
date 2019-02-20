export default function configure(sigma) {
  /**
   * This method listens to "overNode", "outNode", "overEdge" and "outEdge"
   * events from a renderer and renders the nodes differently on the top layer.
   * The goal is to make any node label readable with the mouse, and to
   * highlight hovered nodes and edges.
   *
   * It has to be called in the scope of the related renderer.
   */
  sigma.register("sigma.misc.drawHovers", function drawHovers(prefix) {
    const self = this;

    const hoveredNodes = {};

    const hoveredEdges = {};

    this.bind("overNode", function(event) {
      const node = event.data.node;
      if (!node.hidden) {
        hoveredNodes[node.id] = node;
        draw();
      }
    });

    this.bind("outNode", function(event) {
      delete hoveredNodes[event.data.node.id];
      draw();
    });

    this.bind("overEdge", function(event) {
      const edge = event.data.edge;
      if (!edge.hidden) {
        hoveredEdges[edge.id] = edge;
        draw();
      }
    });

    this.bind("outEdge", function(event) {
      delete hoveredEdges[event.data.edge.id];
      draw();
    });

    this.bind("render", function(event) {
      draw();
    });

    function draw() {
      let k;

      let source;

      let target;

      let hoveredNode;

      let hoveredEdge;

      const c = self.contexts.hover.canvas;

      const defaultNodeType = self.settings("defaultNodeType");

      const defaultEdgeType = self.settings("defaultEdgeType");

      const nodeRenderers = sigma.canvas.hovers;

      const edgeRenderers = sigma.canvas.edgehovers;

      const extremitiesRenderers = sigma.canvas.extremities;

      const embedSettings = self.settings.embedObjects({
        prefix
      });

      // Clear self.contexts.hover:
      self.contexts.hover.clearRect(0, 0, c.width, c.height);

      // Node render: single hover
      if (
        embedSettings("enableHovering") &&
        embedSettings("singleHover") &&
        Object.keys(hoveredNodes).length
      ) {
        hoveredNode = hoveredNodes[Object.keys(hoveredNodes)[0]];
        (nodeRenderers[hoveredNode.type] ||
          nodeRenderers[defaultNodeType] ||
          nodeRenderers.def)(hoveredNode, self.contexts.hover, embedSettings);
      }

      // Node render: multiple hover
      if (embedSettings("enableHovering") && !embedSettings("singleHover"))
        for (k in hoveredNodes)
          (nodeRenderers[hoveredNodes[k].type] ||
            nodeRenderers[defaultNodeType] ||
            nodeRenderers.def)(
            hoveredNodes[k],
            self.contexts.hover,
            embedSettings
          );

      // Edge render: single hover
      if (
        embedSettings("enableEdgeHovering") &&
        embedSettings("singleHover") &&
        Object.keys(hoveredEdges).length
      ) {
        hoveredEdge = hoveredEdges[Object.keys(hoveredEdges)[0]];
        source = self.graph.nodes(hoveredEdge.source);
        target = self.graph.nodes(hoveredEdge.target);

        if (!hoveredEdge.hidden) {
          (edgeRenderers[hoveredEdge.type] ||
            edgeRenderers[defaultEdgeType] ||
            edgeRenderers.def)(
            hoveredEdge,
            source,
            target,
            self.contexts.hover,
            embedSettings
          );

          if (embedSettings("edgeHoverExtremities")) {
            (extremitiesRenderers[hoveredEdge.type] ||
              extremitiesRenderers.def)(
              hoveredEdge,
              source,
              target,
              self.contexts.hover,
              embedSettings
            );
          } else {
            // Avoid edges rendered over nodes:
            (sigma.canvas.nodes[source.type] || sigma.canvas.nodes.def)(
              source,
              self.contexts.hover,
              embedSettings
            );
            (sigma.canvas.nodes[target.type] || sigma.canvas.nodes.def)(
              target,
              self.contexts.hover,
              embedSettings
            );
          }
        }
      }

      // Edge render: multiple hover
      if (
        embedSettings("enableEdgeHovering") &&
        !embedSettings("singleHover")
      ) {
        for (k in hoveredEdges) {
          hoveredEdge = hoveredEdges[k];
          source = self.graph.nodes(hoveredEdge.source);
          target = self.graph.nodes(hoveredEdge.target);

          if (!hoveredEdge.hidden) {
            (edgeRenderers[hoveredEdge.type] ||
              edgeRenderers[defaultEdgeType] ||
              edgeRenderers.def)(
              hoveredEdge,
              source,
              target,
              self.contexts.hover,
              embedSettings
            );

            if (embedSettings("edgeHoverExtremities")) {
              (extremitiesRenderers[hoveredEdge.type] ||
                extremitiesRenderers.def)(
                hoveredEdge,
                source,
                target,
                self.contexts.hover,
                embedSettings
              );
            } else {
              // Avoid edges rendered over nodes:
              (sigma.canvas.nodes[source.type] || sigma.canvas.nodes.def)(
                source,
                self.contexts.hover,
                embedSettings
              );
              (sigma.canvas.nodes[target.type] || sigma.canvas.nodes.def)(
                target,
                self.contexts.hover,
                embedSettings
              );
            }
          }
        }
      }
    }
  });
}
