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
    defaultGlyphsRadius: 10,
    defaultGlyphsFillColor: 'white',
    defaultGlyphsTextColor: 'black',
    defaultGlyphsStrokeColor: 'black',
    defaultGlyphsLineWidth: 2,
    defaultGlyphsFontStyle: 'normal',
    defaultGlyphsFontSize: '6px',
    defaultGlyphsFontName: 'Arial'
  };

  // Export the previously designed settings:
  sigma.settings = sigma.utils.extend(sigma.settings || {}, settings);

}).call(this);
