;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize package:
  sigma.utils.pkg('sigma.canvas.nodes');

  /**
   * Sigma Image Utility
   * =============================
   *
   * @author: Martin de la Taille (martindelataille)
   * @thanks: Guillaume Plique (Yomguithereal)
   * @version: 0.1
   */

  var _contexts,
      _types,
      _canvas,
      _canvasContext;

  _contexts = ['scene', 'edges', 'nodes', 'labels'];
  _types = {
    png: 'image/png',
    jpg: 'image/jpeg',
    gif: 'image/gif',
    tiff: 'image/tiff'
  };

  // UTILITIES FUNCTIONS:
  // ******************
  function download(dataUrl, extension, filename) {
    var anchor = document.createElement('a');
    anchor.setAttribute('href', dataUrl);
    anchor.setAttribute('download', filename || 'graph.' + extension);

    var event = document.createEvent('MouseEvent');
    event.initMouseEvent('click', true, false, window, 0, 0, 0 ,0, 0,
      false, false, false, false, 0, null);

    anchor.dispatchEvent(event);
    anchor.remove();
  }

  function calculateAspectRatioFit(srcWidth, srcHeight, maxSize) {
    var ratio = Math.min(maxSize / srcWidth, maxSize / srcHeight);
    return { width: srcWidth*ratio, height: srcHeight*ratio };
  }

  /**
   * Helpers
   */
  function extend() {
    var i,
        k,
        res = {},
        l = arguments.length;

    for (i = l - 1; i >= 0; i--)
      for (k in arguments[i])
        res[k] = arguments[i][k];
    return res;
  };

  /**
  * This function clone graph and generate a new canvas to download image
  *
  * Recognized parameters:
  * **********************
  * Here is the exhaustive list of every accepted parameters in the settings
  * object:
  *
   * @param {sigma}  s       The related sigma instance.
   * @param {object} o       The node or the edge.
   * @param {object} options The options related to the object.
  */

  function cloneCanvas(s) {
    var self = s,
        webgl = s instanceof sigma.renderers.webgl,
        sized = false,
        doneContexts = [];

    _canvas = document.createElement('canvas');
    _canvasContext = _canvas.getContext('2d');

    _contexts.forEach(function(name) {
      if (!self.contexts[name])
        return;

      var canvas = self.domElements[name] || self.domElements.scene,
        context = self.contexts[name];

        if(!sized) {
          _canvas.width = webgl && context instanceof WebGLRenderingContext ? canvas.width / 2 : canvas.width;
          _canvas.height = webgl && context instanceof WebGLRenderingContext ? canvas.height / 2 : canvas.height;
          sized = true;
        }

        if (context instanceof WebGLRenderingContext)
          _canvasContext.drawImage(canvas, 0, 0, canvas.width / 2, canvas.height / 2);
        else
          _canvasContext.drawImage(canvas, 0, 0);

      if (~doneContexts.indexOf(context))
        return;

      doneContexts.push(context);
    });

    // Cleaning
    doneContexts = [];
  }

  // image function
 function image (s, params) {
    var y = new sigma();

    y = extend(s, y);

    console.log(s.camera.ratio, y.camera.ratio)
    y.camera.ratio = 1;
    console.log(s.camera.ratio, y.camera.ratio)

    if(!_canvas) {
      cloneCanvas(y);
    }

    params = params || {};

    if(!params.size)
      params.size = window.innerWidth;

    if (params.format && !(params.format in _types))
      throw Error('sigma.renderers.image: unsupported format "' + params.format + '".');

    var self = s,
        webgl = s instanceof sigma.renderers.webgl,
        sized = false,
        doneContexts = [];

    var merged = document.createElement('canvas'),
        mergedContext= merged.getContext('2d');

    _contexts.forEach(function(name) {
      if (!self.contexts[name])
        return;

      if (params.labels === false && name === 'labels')
        return;

      var canvas = self.domElements[name] || self.domElements.scene,
        context = self.contexts[name];

      if (~doneContexts.indexOf(context))
        return;

      if (!sized) {

        var width, height;

        if(!params.zoom) {
          width = _canvas.width;
          height = _canvas.height;
        } else {
          width = canvas.width;
          height = canvas.height;
        }

        var ratio = calculateAspectRatioFit(width, height, params.size);

        merged.width= ratio.width;
        merged.height = ratio.height;

        if (!webgl && !context instanceof WebGLRenderingContext) {
          merged.width *= 2;
          merged.height *=2;
        }

        sized = true;

        // background color
        if (params.background) {
          mergedContext.rect(0, 0, merged.width, merged.height);
          mergedContext.fillStyle = params.background;
          mergedContext.fill();
        }
      }

      if(params.zoom)
        mergedContext.drawImage(canvas, 0, 0, merged.width, merged.height);
      else
        mergedContext.drawImage(_canvas, 0, 0, merged.width, merged.height);

      doneContexts.push(context);
    });

    var dataUrl = merged.toDataURL(_types[params.format || 'png']);

    if(params.download)
      download(
        dataUrl,
        params.format || 'png',
        params.filename
      );

    // Cleaning
    mergedContext = null;
    merged  = null;
    doneContexts = [];

    return dataUrl;
  }

  // Extending canvas and webgl renderers
  sigma.renderers.canvas.prototype.image = image;
  sigma.renderers.webgl.prototype.image = image;

}).call(this);
