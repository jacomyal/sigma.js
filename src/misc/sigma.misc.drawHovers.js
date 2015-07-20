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
        hoveredNodes = {},
        hoveredEdges = {};

    this.bind('overNode', function(event) {
      var node = event.data.node;
      if (!node.hidden) {
        hoveredNodes[node.id] = node;
        draw();
      }
    });

    this.bind('outNode', function(event) {
      delete hoveredNodes[event.data.node.id];
      draw();
    });

    this.bind('overEdge', function(event) {
      var edge = event.data.edge;
      if (!edge.hidden) {
        hoveredEdges[edge.id] = edge;
        draw();
      }
    });

    this.bind('outEdge', function(event) {
      delete hoveredEdges[event.data.edge.id];
      draw();
    });

    this.bind('render', function(event) {
      draw();
    });

    function draw() {
      // Clear self.contexts.hover:
      self.contexts.hover.canvas.width = self.contexts.hover.canvas.width;

      var hoveredNodesArr = Object.keys(hoveredNodes).map(function(key) {
                return hoveredNodes[key];
          }),
          hoveredEdgesArr = Object.keys(hoveredEdges).map(function(key) {
                return hoveredEdges[key];
          }),
          embedSettings = self.settings.embedObjects({
            prefix: prefix
          }),
          end = embedSettings('singleHover') ? 1 : undefined,
          renderParams = {
            elements: hoveredNodesArr,
            renderers: sigma.canvas.hovers,
            type: 'nodes',
            ctx: self.contexts.hover,
            end: end,
            graph: self.graph,
            settings: embedSettings,
          };

      // Node render
      if (embedSettings('enableHovering')) {
        sigma.renderers.canvas.applyRenderers(renderParams);
      }

      // Edge render
      if (embedSettings('enableEdgeHovering')) {
        renderParams.renderers = sigma.canvas.edgehovers;
        renderParams.elements = hoveredEdgesArr;
        renderParams.type = 'edges';
        sigma.renderers.canvas.applyRenderers(renderParams);

        if (embedSettings('edgeHoverExtremities')) {
          renderParams.renderers = sigma.canvas.extremities;
          sigma.renderers.canvas.applyRenderers(renderParams);
        } else { //draw nodes over edges
          renderParams.ctx = self.contexts.nodes;
          renderParams.type = 'nodes';
          renderParams.renderers = sigma.canvas.nodes;
          renderParams.elements = hoveredNodes;
          sigma.renderers.canvas.applyRenderers(renderParams);
        }
      }
    }
  };
}).call(this);
