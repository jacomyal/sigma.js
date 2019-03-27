;(function(global) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize packages:
  sigma.utils.pkg('sigma.renderers');

  // Check if WebGL is enabled:
  var canvas,
      webgl = !!global.WebGLRenderingContext;
  if (webgl) {
    canvas = document.createElement('canvas');
    try {
      webgl = !!(
        canvas.getContext('webgl', {premultipliedAlpha: false}) ||
        canvas.getContext('experimental-webgl', {premultipliedAlpha: false})
      );
    } catch (e) {
      webgl = false;
    }
  }

  // Copy the good renderer:
  sigma.renderers.def = webgl ?
    sigma.renderers.webgl :
    sigma.renderers.canvas;
})(this);
