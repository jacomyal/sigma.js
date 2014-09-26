;(function(undefined) {

  /**
   * Sigma Renderer Snapshot Utility
   * ================================
   *
   * The aim of this plugin is to enable users to retrieve a static image
   * of the graph being rendered.
   *
   * Author: Guillaume Plique (Yomguithereal)
   * Version: 0.0.1
   */

  // Terminating if sigma were not to be found
  if (typeof sigma === 'undefined')
    throw 'sigma.renderers.snapshot: sigma not in scope.';

  // Constants
  var CONTEXTS = ['scene', 'edges', 'nodes', 'labels'],
      TYPES = {
        png: 'image/png',
        jpg: 'image/jpeg',
        gif: 'image/gif',
        tiff: 'image/tiff'
      };

  // Utilities
  function download(dataUrl, extension, filename) {

    // Anchor
    var anchor = document.createElement('a');
    anchor.setAttribute('href', dataUrl);
    anchor.setAttribute('download', filename || 'graph.' + extension);

    // Click event
    var event = document.createEvent('MouseEvent');
    event.initMouseEvent('click', true, false, window, 0, 0, 0 ,0, 0,
      false, false, false, false, 0, null);

    anchor.dispatchEvent(event);
    delete anchor;
  }

  // Main function
  function snapshot(params) {
    params = params || {};

    // Enforcing
    if (params.format && !(params.format in TYPES))
      throw Error('sigma.renderers.snaphot: unsupported format "' +
                  params.format + '".');

    var self = this,
        webgl = this instanceof sigma.renderers.webgl,
        doneContexts = [];

    // Creating a false canvas where we'll merge the other
    var merged = document.createElement('canvas'),
        mergedContext = merged.getContext('2d'),
        sized = false;

    // Iterating through context
    CONTEXTS.forEach(function(name) {
      if (!self.contexts[name])
        return;

      if (params.labels === false && name === 'labels')
        return;

      var canvas = self.domElements[name] || self.domElements['scene'],
          context = self.contexts[name];

      if (~doneContexts.indexOf(context))
        return;

      if (!sized) {
        merged.width = webgl && context instanceof WebGLRenderingContext ?
         canvas.width / 2 :
         canvas.width;
        merged.height = webgl && context instanceof WebGLRenderingContext ?
          canvas.height / 2 :
          canvas.height
        sized = true;

        // Do we want a background color?
        if (params.background) {
          mergedContext.rect(0, 0, merged.width, merged.height);
          mergedContext.fillStyle = params.background;
          mergedContext.fill();
        }
      }

      if (context instanceof WebGLRenderingContext)
        mergedContext.drawImage(canvas, 0, 0,
          canvas.width / 2, canvas.height / 2);
      else
        mergedContext.drawImage(canvas, 0, 0);

      doneContexts.push(context);
    });

    var dataUrl = merged.toDataURL(TYPES[params.format || 'png']);

    if (params.download)
      download(
        dataUrl,
        params.format || 'png',
        params.filename
      );

    // Cleaning
    delete mergedContext;
    delete merged;
    delete doneContexts;

    return dataUrl;
  }

  // Extending canvas and webl renderers
  sigma.renderers.canvas.prototype.snapshot = snapshot;
  sigma.renderers.webgl.prototype.snapshot = snapshot;
}).call(this);
