;(function() {
  'use strict';

  sigma.utils.pkg('sigma.svg.edges');

  /**
   * The default edge renderer. It renders the edge as a simple line.
   *
   * @param  {object}                   node     The node object.
   * @param  {DOMElement}               context  The SVG context.
   * @param  {configurable}             settings The settings function.
   */

  // TODO: use a path, rather?
  sigma.svg.edges.def = {
    create: function(edge, source, target, settings) {
      var color = edge.color,
          prefix = settings('prefix') || '',
          edgeColor = settings('edgeColor'),
          defaultNodeColor = settings('defaultNodeColor'),
          defaultEdgeColor = settings('defaultEdgeColor');

      if (!color)
        switch (edgeColor) {
          case 'source':
            color = source.color || defaultNodeColor;
            break;
          case 'target':
            color = target.color || defaultNodeColor;
            break;
          default:
            color = defaultEdgeColor;
            break;
        }

      var line = document.createElementNS(settings('xmlns'), 'line');

      // Attributes
      line.setAttributeNS(null, 'id', edge.id);
      line.setAttributeNS(null, 'class', 'edge');
      line.setAttributeNS(null, 'stroke', color);

      return line;
    },
    update: function() {

    },
    hide: function() {

    }
  };
})();
