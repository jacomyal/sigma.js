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

    this.bind('overNodes', function(event) {
      var n = event.data.nodes,
          l = n.length,
          i;

      for (i = 0; i < l; i++)
        hoveredNodes[n[i].id] = n[i];

      draw();
    });
    this.bind('outNodes', function(event) {
      var n = event.data.nodes,
          l = n.length,
          i;

      for (i = 0; i < l; i++)
        delete hoveredNodes[n[i].id];

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

      // Render
      if (embedSettings('enableHovering'))
        for (k in hoveredNodes)
          if (!hoveredNodes[k].hidden)
            (renderers[hoveredNodes[k].type] || renderers.def)(
              hoveredNodes[k],
              self.contexts.hover,
              embedSettings
            );
    }
  };
}).call(this);
