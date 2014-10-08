;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma.renderers.halo: sigma not in scope.';

  // Initialize package:
  sigma.utils.pkg('sigma.settings');

  /**
  * Extended sigma settings.
  */
  var settings = {
    // {string}
    nodeHaloColor: '#fff',
    // {number}
    nodeHaloSize: 50,
    // {string}
    edgeHaloColor: '#fff',
    // {number}
    edgeHaloSize: 10
  };

  // Export the previously designed settings:
  sigma.settings = sigma.utils.extend(sigma.settings || {}, settings);

}).call(this);