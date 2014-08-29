;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize package:
  sigma.utils.pkg('sigma.settings');

  /**
  * Extended sigma settings for sigma.renderers.edgeLabels.
  */
  var settings = {
    /**
     * RENDERERS SETTINGS:
     * *******************
     */
    // {string}
    defaultEdgeLabelColor: '#000',
    // {string}
    defaultEdgeLabelSize: 10,
    // {string} Indicates how to choose the edge labels size. Available values:
    //          "fixed", "proportional"
    edgeLabelSize: 'fixed',
    // {string} The opposite power ratio between the font size of the label and
    // the edge size:
    //   Math.pow(size, - edgeLabelSizePowRatio) * size * defaultEdgeLabelSize
    edgeLabelSizePowRatio: 0.8,
    // {number} The minimum size an edge must have to see its label displayed.
    edgeLabelThreshold: 1,
  };

  // Export the previously designed settings:
  sigma.settings = sigma.utils.extend(sigma.settings || {}, settings);

  // Override default settings:
  sigma.settings.drawEdgeLabels = true;

}).call(this);
