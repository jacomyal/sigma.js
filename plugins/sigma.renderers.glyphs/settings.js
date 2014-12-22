;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma.renderers.glyphs: sigma not in scope.';

  // Initialize package:
  sigma.utils.pkg('sigma.settings');

  /**
  * Extended sigma settings.
  */
  var settings = {
    fillColor: 'transparent',
    textColor: 'black',
    strokeColor: 'white',
    lineWidth: 2
  };

  // Export the previously designed settings:
  sigma.settings = sigma.utils.extend(sigma.settings || {}, settings);

}).call(this);
