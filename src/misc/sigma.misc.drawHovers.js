;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize packages:
  sigma.utils.pkg('sigma.misc');

  /**
   * This method listens to "overNodes", "outNodes", "overNodes" and "outNodes"
   * events from a renderer and renders the nodes differently on the top layer.
   * The goal is to make any node label readable with the mouse, and to
   * highlight hovered nodes and edges.
   *
   * It has to be called in the scope of the related renderer.
   */
  sigma.misc.drawHovers = function(prefix) {
    var self = this,
        hoveredNodes = {},
        hoveredEdges = {};

    this.bind('overNodes', function(event) {
      var n = event.data.nodes,
          l = n.length,
          i;

      for (i = 0; i < l; i++) {
        self.graph.hoverNode(n[i].id);
        hoveredNodes[n[i].id] = n[i];
      }

      draw();
    });
    this.bind('outNodes', function(event) {
      var n = event.data.nodes,
          l = n.length,
          i;

      for (i = 0; i < l; i++) {
        self.graph.hoverNode(n[i].id, false);
        delete hoveredNodes[n[i].id];
      }

      draw();
    });
    this.bind('overEdges', function(event) {
      var e = event.data.edges,
          l = e.length,
          i;

      for (i = 0; i < l; i++) {
        self.graph.hoverEdge(e[i].id);
        hoveredEdges[e[i].id] = e[i];
      }

      draw();
    });
    this.bind('outEdges', function(event) {
      var e = event.data.edges,
          l = e.length,
          i;

      for (i = 0; i < l; i++) {
        self.graph.hoverEdge(e[i].id, false);
        delete hoveredEdges[e[i].id];
      }

      draw();
    });
    this.bind('render', function(event) {
      draw();
    });

    function draw() {
      // Clear self.contexts.hover:
      self.contexts.hover.canvas.width = self.contexts.hover.canvas.width;

      var k,
          nodeRenderers = sigma.canvas.hovers,
          edgeRenderers = sigma.canvas.edgehovers,
          embedSettings = self.settings.embedObjects({
            prefix: prefix
          });

      // Edge render
      if (embedSettings('enableEdgeHovering')) {
        for (k in hoveredEdges)
          if (!hoveredEdges[k].hidden) {
            (edgeRenderers[hoveredEdges[k].type] || edgeRenderers.def)(
              hoveredEdges[k],
              self.graph.nodes(hoveredEdges[k].source),
              self.graph.nodes(hoveredEdges[k].target),
              self.contexts.hover,
              embedSettings
            );
          }
      }

      // Node render
      if (embedSettings('enableHovering')) {
        for (k in hoveredNodes)
          if (!hoveredNodes[k].hidden)
            (nodeRenderers[hoveredNodes[k].type] || nodeRenderers.def)(
              hoveredNodes[k],
              self.contexts.hover,
              embedSettings
            );
      }
    }
  };
}).call(this);
