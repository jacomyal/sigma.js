;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma.plugins.poweredBy: sigma not in scope.';

  // Initialize package:
  sigma.utils.pkg('sigma.settings');

  /**
  * Extended sigma settings.
  */
  var settings = {
    // {string}
    poweredByHTML: 'Powered by Sigma.js',
    // {number}
    poweredByURL: 'http://sigmajs.org',
    // {string}
    poweredByPingURL: ''
  };

  // Export the previously designed settings:
  sigma.settings = sigma.utils.extend(sigma.settings || {}, settings);

}).call(this);
