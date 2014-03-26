;(function() {
  'use strict';

  sigma.utils.pkg('sigma.svg.nodes');

  /**
   * The default node renderer. It renders the node as a simple disc.
   *
   * @param  {object}                   node     The node object.
   * @param  {DOMElement}               context  The SVG container.
   * @param  {configurable}             settings The settings function.
   */
  sigma.svg.nodes.def = function(node, context, settings) {
    var prefix = settings('prefix') || '',
        circle = document.createElementNS(settings('xmlns'), 'circle');

    // Defining the node's circle
    circle.setAttributeNS(null, 'id', node.id);
    circle.setAttributeNS(
      null, 'fill', node.color || settings('defaultNodeColor'));
    circle.setAttributeNS(null, 'cx', node[prefix + 'x']);
    circle.setAttributeNS(null, 'cy', node[prefix + 'y']);
    circle.setAttributeNS(null, 'r', node[prefix + 'size']);

    // Adding to context
    context.appendChild(circle);
  };
})();
