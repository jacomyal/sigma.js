;(function(undefined) {

  /**
   * Sigma Renderer Image Utility
   * ================================
   *
   * The aim of this plugin is to enable users to retrieve a static image
   * of the graph being rendered.
   *
   * Author: Martin de la Taille (martindelataille)
   * Thanks to: Guillaume Plique (Yomguithereal)
   * Version: 0.0.1
   */

  if (typeof sigma === 'undefined')
    throw 'sigma.renderers.snapexport: sigma not in scope.';

  // Constants
  var mainCanvas = null,
    mainCanvasContext = null;

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

  function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
      var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
      return { width: srcWidth*ratio, height: srcHeight*ratio };
   }

  // Main function
  function image() {

    var self = this,
        webgl = this instanceof sigma.renderers.webgl,
        doneContexts = [];

    // Creating a false canvas where we'll merge main canvas
      mainCanvas = document.createElement('canvas');
      mainCanvasContext = mainCanvas.getContext('2d');
      sized = false;

    // Iterating through context
    CONTEXTS.forEach(function(name) {
      if (!self.contexts[name])
        return;

      var canvas = self.domElements[name] || self.domElements['scene'],
        context = self.contexts[name];

      if (~doneContexts.indexOf(context))
        return;

      if (!sized) {
        mainCanvas.width = webgl && context instanceof WebGLRenderingContext ?
         canvas.width / 2 :
         canvas.width;
        mainCanvas.height = webgl && context instanceof WebGLRenderingContext ?
          canvas.height / 2 :
          canvas.height;
        sized = true;
      }

      if (context instanceof WebGLRenderingContext)
        mainCanvasContext.drawImage(canvas, 0, 0, canvas.width / 2, canvas.height / 2);
      else
        mainCanvasContext.drawImage(canvas, 0, 0);

      doneContexts.push(context);
    });

    // Cleaning
    delete doneContexts;
  }

  // Generate image function
 function generateImage (params) {
    params = params || {};

    if(!params.size)
      params.size = window.innerWidth;

    // Enforcing
    if (params.format && !(params.format in TYPES))
      throw Error('sigma.renderers.snaphot: unsupported format "' +
                  params.format + '".');

    var self = this,
        webgl = this instanceof sigma.renderers.webgl,
        doneContextsSize = [];

    // Creating a false canvas
      var merged = document.createElement('canvas'),
          mergedContext= merged.getContext('2d'),
          sized = false;

    // Iterating through context
    CONTEXTS.forEach(function(name) {
      if (!self.contexts[name])
        return;

      if (params.labels === false && name === 'labels')
        return;

      var canvas = self.domElements[name] || self.domElements['scene'],
        context = self.contexts[name];

      if (~doneContextsSize.indexOf(context))
        return;

      if (!sized) {
        // Keep ratio
        var ratio = calculateAspectRatioFit(canvas.width, canvas.height, params.size, params.size)

        merged.width= ratio.width;
        merged.height = ratio.height;
        sized = true;

        // background color
        if (params.background) {
          mergedContext.rect(0, 0, merged.width, merged.height);
          mergedContext.fillStyle = params.background;
          mergedContext.fill();
        }
      }


      if (!context instanceof WebGLRenderingContext) {
        merged.width *= 2;
        merged.height *= 2;
      }

      if(params.zoom)
        mergedContext.drawImage(canvas, 0, 0, merged.width, merged.height);
      else
        mergedContext.drawImage(mainCanvas, 0, 0, merged.width, merged.height);

      doneContextsSize.push(context);
    });

    var dataUrl = merged.toDataURL(TYPES[params.format || 'png']);

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
  sigma.renderers.canvas.prototype.image = image;
  sigma.renderers.canvas.prototype.generateImage = generateImage;

  sigma.renderers.webgl.prototype.image = image;
  sigma.renderers.webgl.prototype.generateImage = generateImage;

}).call(this);
