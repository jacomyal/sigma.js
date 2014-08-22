;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize packages:
  sigma.utils.pkg('sigma.misc');

  /**
   * This method listens to "overNode", "outNode", "overEdge" and "outEdge"
   * events from a renderer and renders the nodes differently on the top layer.
   * The goal is to make any node label readable with the mouse, and to
   * highlight hovered nodes and edges.
   *
   * It has to be called in the scope of the related renderer.
   */
  sigma.misc.drawHovers = function(prefix) {
    var self = this,
        hoveredNodes = [],
        hoveredEdges = [];

    this.bind('overNode', function(event) {
      hoveredNodes.push(event.data.node);
      draw();
    });

    this.bind('outNode', function(event) {
      var indexCheck = hoveredNodes.map(function(n) {
        return n;
      }).indexOf(event.data.node);
      hoveredNodes.splice(indexCheck, 1);
      draw();
    });

    this.bind('overEdge', function(event) {
      hoveredEdges.push(event.data.edge);
      draw();
    });

    this.bind('outEdge', function(event) {
      var indexCheck = hoveredEdges.map(function(e) {
        return e;
      }).indexOf(event.data.edge);
      hoveredEdges.splice(indexCheck, 1);
      draw();
    });

    this.bind('render', function(event) {
      draw();
    });

    function draw() {
      // Clear self.contexts.hover:
      self.contexts.hover.canvas.width = self.contexts.hover.canvas.width;

      var i,
          source,
          target,
          nodeRenderers = sigma.canvas.hovers,
          edgeRenderers = sigma.canvas.edgehovers,
          extremitiesRenderers = sigma.canvas.extremities,
          embedSettings = self.settings.embedObjects({
            prefix: prefix
          });

      // Node render: single hover
      if (embedSettings('enableHovering') &&
        embedSettings('singleHover') &&
        hoveredNodes.length
      ) {
        i = hoveredNodes.length - 1;
        if (! hoveredNodes[i].hidden) {
          (
            nodeRenderers[hoveredNodes[i].type] ||
            nodeRenderers.def
          )(
            hoveredNodes[i],
            self.contexts.hover,
            embedSettings
          );
        }
      }

      // Node render: multiple hover
      if (
        embedSettings('enableHovering') &&
        !embedSettings('singleHover') &&
        hoveredNodes.length
      ) {
        for (i = 0; i < hoveredNodes.length; i++) {
          if (! hoveredNodes[i].hidden) {
            (
              nodeRenderers[hoveredNodes[i].type] ||
              nodeRenderers.def
            ) (
              hoveredNodes[i],
              self.contexts.hover,
              embedSettings
            );
          }
        }
      }

      // Edge render: single hover
      if (embedSettings('enableEdgeHovering') &&
        embedSettings('singleHover') &&
        hoveredEdges.length
      ) {
        i = hoveredEdges.length - 1;
        source = self.graph.nodes(hoveredEdges[i].source);
        target = self.graph.nodes(hoveredEdges[i].target);
        if (! hoveredEdges[i].hidden) {
          (
            edgeRenderers[hoveredEdges[i].type] ||
            edgeRenderers.def
          ) (
            hoveredEdges[i],
            source,
            target,
            self.contexts.hover,
            embedSettings
          );
          if (embedSettings('edgeHoverExtremities')) {
            (
              extremitiesRenderers[hoveredEdges[i].type] ||
              extremitiesRenderers.def
            )(
              hoveredEdges[i],
              source,
              target,
              self.contexts.hover,
              embedSettings
            );
          }
          else {
            // Avoid edges rendered over nodes:
            (
              sigma.canvas.nodes[source.type] ||
              sigma.canvas.nodes.def
            ) (
              source,
              self.contexts.hover,
              embedSettings
            );
            (
              sigma.canvas.nodes[target.type] ||
              sigma.canvas.nodes.def
            ) (
              target,
              self.contexts.hover,
              embedSettings
            );
          }
        }
      }

      // Edge render: multiple hover
      if (embedSettings('enableEdgeHovering') &&
        !embedSettings('singleHover') &&
        hoveredEdges.length
      ) {
        for (i = 0; i < hoveredEdges.length; i++) {
          source = self.graph.nodes(hoveredEdges[i].source);
          target = self.graph.nodes(hoveredEdges[i].target);
          if (! hoveredEdges[i].hidden) {
            (
              edgeRenderers[hoveredEdges[i].type] ||
              edgeRenderers.def
            ) (
              hoveredEdges[i],
              source,
              target,
              self.contexts.hover,
              embedSettings
            );
            if (embedSettings('edgeHoverExtremities')) {
              (
                extremitiesRenderers[hoveredEdges[i].type] ||
                extremitiesRenderers.def
              )(
                hoveredEdges[i],
                source,
                target,
                self.contexts.hover,
                embedSettings
              );
            }
            else {
            // Avoid edges rendered over nodes:
            (
              sigma.canvas.nodes[source.type] ||
              sigma.canvas.nodes.def
            ) (
              source,
              self.contexts.hover,
              embedSettings
            );
            (
              sigma.canvas.nodes[target.type] ||
              sigma.canvas.nodes.def
            ) (
              target,
              self.contexts.hover,
              embedSettings
            );
          }
          }
        }
      }
    }
  };
}).call(this);
