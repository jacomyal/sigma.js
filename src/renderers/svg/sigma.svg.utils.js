;(function() {
  'use strict';

  sigma.utils.pkg('sigma.svg.utils');

  /**
   * Some useful functions used by sigma's SVG renderer.
   */
  sigma.svg.utils = {

    /**
     * SVG Element show.
     *
     * @param  {DOMElement}               element   The DOM element to show.
     */
    show: function(element) {
      element.style.display = '';
      return this;
    },

    /**
     * SVG Element hide.
     *
     * @param  {DOMElement}               element   The DOM element to hide.
     */
    hide: function(element) {
      element.style.display = 'none';
      return this;
    },
    /**
     * SVG node check for child node.
     *
     * @param  {Node}                     parentNode  The parent node.
     * @param  {Node}                     childNode   The child node.
     */
    containsChild: function(parentNode, childNode) {
      if (!parentNode || !childNode) {
        return false;
      }

      // Node.contains is not supported on IE and this is checking for
      // direct relationship
      for (var i = 0, childNodes = parentNode.childNodes;
           i < childNodes.length;
           i++) {
        if (childNodes[i] === childNode) {
          return true;
        }
      }

      return false;
    }
  };
})();
