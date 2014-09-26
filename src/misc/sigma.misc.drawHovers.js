;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize packages:
  sigma.utils.pkg('sigma.misc');

  /**
   * This method listens to "overNodes" and "outNodes" events from a renderer
   * and renders the nodes differently on the top layer. The goal is to make any
   * label readable with the mouse.
   *
   * It has to be called in the scope of the related renderer.
   */
  sigma.misc.drawHovers = function(prefix) {
    var self = this,
        hoveredNodes = {};

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

    this.bind('render', function(event) {
      draw();
    });

    function draw() {
      // Clear self.contexts.hover:
      self.contexts.hover.canvas.width = self.contexts.hover.canvas.width;

      var k,
          hoveredNode,
          renderers = sigma.canvas.hovers,
          embedSettings = self.settings.embedObjects({
            prefix: prefix
          });

      // Single hover
      if (
        embedSettings('enableHovering') &&
        embedSettings('singleHover') &&
        Object.keys(hoveredNodes).length
      ) {
        hoveredNode = hoveredNodes[Object.keys(hoveredNodes)[0]];
        (renderers[hoveredNode.type] || renderers.def)(
          hoveredNode,
          self.contexts.hover,
          embedSettings
        );
      }

      // Multiple hover
      if (
        embedSettings('enableHovering') &&
        !embedSettings('singleHover')
      ) {
        for (k in hoveredNodes) {
          (renderers[hoveredNodes[k].type] || renderers.def)(
            hoveredNodes[k],
            self.contexts.hover,
            embedSettings
          );
        }
      }
    }
  };
}).call(this);
