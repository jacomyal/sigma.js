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
    glyphRadius: 10,
    glyphFillColor: 'white',
    glyphTextColor: 'black',
    glyphStrokeColor: 'black',
    glyphLineWidth: 2,
    glyphFontStyle: 'normal',
    glyphFontSize: 6,
    glyphFontName: 'Arial',
    glyphHidden: false
  };

  // Export the previously designed settings:
  sigma.settings = sigma.utils.extend(sigma.settings || {}, settings);

}).call(this);
