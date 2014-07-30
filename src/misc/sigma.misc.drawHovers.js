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
      hoveredNodes = [];

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

    this.bind('render', function(event) {
      draw();
    });

    function draw() {
      // Clear self.contexts.hover:
      self.contexts.hover.canvas.width = self.contexts.hover.canvas.width;

      var k,
        renderers = sigma.canvas.hovers,
        embedSettings = self.settings.embedObjects({
          prefix: prefix
        });

      // Single hover
      if (
        embedSettings('enableHovering') &&
        embedSettings('singleHover') &&
        hoveredNodes.length
      ) {
        if (! hoveredNodes[hoveredNodes.length - 1].hidden) {
          (
            renderers[hoveredNodes[hoveredNodes.length - 1].type] ||
            renderers.def
          )(
            hoveredNodes[hoveredNodes.length - 1],
            self.contexts.hover,
            embedSettings
          );
        }
      }

      // Multiple hover
      if (
        embedSettings('enableHovering') &&
        !embedSettings('singleHover') &&
        hoveredNodes.length
      ) {
        for (var i = 0; i < hoveredNodes.length; i++) {
          if (! hoveredNodes[i].hidden) {
            (renderers[hoveredNodes[i].type] || renderers.def)(
              hoveredNodes[i],
              self.contexts.hover,
              embedSettings
            );
          }
        }
      }


    }
  };
}).call(this);
