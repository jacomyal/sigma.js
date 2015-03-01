;(function() {
  'use strict';

  sigma.utils.pkg('sigma.svg.edges');

  /**
   * The curve edge renderer. It renders the node as a bezier curve.
   */
  sigma.svg.edges.curve = {

    /**
     * SVG Element creation.
     *
     * @param  {object}                   edge       The edge object.
     * @param  {object}                   source     The source node object.
     * @param  {object}                   target     The target node object.
     * @param  {configurable}             settings   The settings function.
     */
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

      var path = document.createElementNS(settings('xmlns'), 'path');

      // Attributes
      path.setAttributeNS(null, 'data-edge-id', edge.id);
      path.setAttributeNS(null, 'class', settings('classPrefix') + '-edge');
      path.setAttributeNS(null, 'stroke', color);

      return path;
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
    update: function(edge, path, source, target, settings) {
      var prefix = settings('prefix') || '';

      path.setAttributeNS(null, 'stroke-width', edge[prefix + 'size'] || 1);

      // Control point
      var cx = (source[prefix + 'x'] + target[prefix + 'x']) / 2 +
        (target[prefix + 'y'] - source[prefix + 'y']) / 4,
          cy = (source[prefix + 'y'] + target[prefix + 'y']) / 2 +
        (source[prefix + 'x'] - target[prefix + 'x']) / 4;

      // Path
      var p = 'M' + source[prefix + 'x'] + ',' + source[prefix + 'y'] + ' ' +
              'Q' + cx + ',' + cy + ' ' +
              target[prefix + 'x'] + ',' + target[prefix + 'y'];

      // Updating attributes
      path.setAttributeNS(null, 'd', p);
      path.setAttributeNS(null, 'fill', 'none');

      // Showing
      path.style.display = '';

      return this;
    }
  };
})();
