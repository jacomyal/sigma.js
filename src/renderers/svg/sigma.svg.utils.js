(function() {
  sigma.utils.pkg("sigma.svg.utils");

  /**
   * Some useful functions used by sigma's SVG renderer.
   */
  sigma.svg.utils = {
    /**
     * SVG Element show.
     *
     * @param  {DOMElement}               element   The DOM element to show.
     */
    show(element) {
      element.style.display = "";
      return this;
    },

    /**
     * SVG Element hide.
     *
     * @param  {DOMElement}               element   The DOM element to hide.
     */
    hide(element) {
      element.style.display = "none";
      return this;
    }
  };
})();
