;(function() {
  'use strict';

  sigma.utils.pkg('sigma.svg.nodes');

  /**
   * The default node renderer. It renders the node as a simple disc.
   *
   * @param  {object}                   node     The node object.
   * @param  {DOMElement}               context  The SVG context.
   * @param  {configurable}             settings The settings function.
   */
  sigma.svg.nodes.def = function(node, context, settings) {
    var prefix = settings('prefix') || '',
        circle = document.createElementNS(settings('xmlns'), 'circle');

    // Defining the node's circle
    circle.setAttributeNS(null, 'id', node.id);
    circle.setAttributeNS(null, 'class', 'node');
    circle.setAttributeNS(
      null, 'fill', node.color || settings('defaultNodeColor'));

    // Returning the DOM Element
    return circle;
  };
})();
