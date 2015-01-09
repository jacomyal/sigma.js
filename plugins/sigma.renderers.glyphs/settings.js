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
    // {number} The glyph radius in pixels.
    glyphRadius: 10,
    // {string} The glyph background-color.
    glyphFillColor: 'white',
    // {string} The glyph text-color.
    glyphTextColor: 'black',
    // {string} The glyph border-color.
    glyphStrokeColor: 'black',
    // {number} The glyph border-width in pixels.
    glyphLineWidth: 2,
    // {string} The glyph text font-style.
    glyphFontStyle: 'normal',
    // {number} The glyph text font-size in pixels.
    glyphFontSize: 6,
    // {string} The glyph text font-family in pixels. Should be included if
    // needed with @font-face or equivalent.
    glyphFont: 'Arial',
    // {number} The minimum size a node must have to see its glyph text displayed.
    glyphTextThreshold: 6,
    // {boolean} A flag to display glyphs or not.
    drawGlyphs: true
  };

  // Export the previously designed settings:
  sigma.settings = sigma.utils.extend(sigma.settings || {}, settings);

}).call(this);
