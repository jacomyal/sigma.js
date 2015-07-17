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

      var hoveredNodesArr = Object.keys(hoveredNodes).map(function(key){
                return hoveredNodes[key];
          }),
          hoveredEdgesArr = Object.keys(hoveredEdges).map(function(key){
                return hoveredEdges[key];
          }),
          defaultNodeType = self.settings('defaultNodeType'),
          defaultEdgeType = self.settings('defaultEdgeType'),
          embedSettings = self.settings.embedObjects({
            prefix: prefix
          }),
          end = embedSettings('singleHover') ? 1 : undefined;

      // Node render
      if (embedSettings('enableHovering') && hoveredNodesArr.length > 0){
        sigma.renderers.canvas.applyRenderers({
          elements: hoveredNodesArr,
          renderers: sigma.canvas.hovers,
          type: 'nodes',
          ctx: self.contexts.hover,
          end: end,
          settings: embedSettings,
        });
      }

      // Edge render
      if (embedSettings('enableEdgeHovering') && hoveredEdgesArr.length > 0) {
        sigma.renderers.canvas.applyRenderers({
          elements: hoveredEdgesArr,
          renderers: sigma.canvas.edgehovers,
          type: 'edges',
          ctx: self.contexts.hover,
          end: end,
          settings: embedSettings,
          graph: self.graph,
        });

        if (embedSettings('edgeHoverExtremities')) {
          sigma.renderers.canvas.applyRenderers({
            elements: hoveredEdgesArr,
            renderers: sigma.canvas.extremities,
            type: 'edges',
            ctx: self.contexts.hover,
            end: end,
            settings: embedSettings,
            graph: self.graph,
          });
        } else { //draw nodes over edges
          sigma.renderers.canvas.applyRenderers({
            elements: hoveredNodes,
            renderers: sigma.canvas.nodes,
            type: 'nodes',
            ctx: self.contexts.nodes,
            end: end,
            settings: embedSettings,
          });
        }
      }
    }
  };
}).call(this);
