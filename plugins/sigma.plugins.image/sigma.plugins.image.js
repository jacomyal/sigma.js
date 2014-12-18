;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize package:
  sigma.utils.pkg('sigma.plugins');

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
  * This function generate a new canvas to download image
  *
  * Recognized parameters:
  * **********************
  * Here is the exhaustive list of every accepted parameters in the settings
  * object:
  * @param {s}  sigma instance
  * @param {params}  Options
  */
 function Image(s, r, params) {
    params = params || {};

    if (params.format && !(params.format in _types))
      throw Error('sigma.renderers.image: unsupported format "' + params.format + '".');

    if(!params.zoom)
      this.clone(s, params);

    var merged = this.draw(r, params);

    var dataUrl = merged.toDataURL(_types[params.format || 'png']);

    if(params.download)
      download(
        dataUrl,
        params.format || 'png',
        params.filename
      );

    return dataUrl;
  }

  /**
  * @param {s}  sigma instance
  * @param {params}  Options
  */
  Image.prototype.clone = function(s, params) {
    params.tmpContainer = params.tmpContainer || 'image-container';

    if (!document.getElementById(params.tmpContainer)) {
      var el =  document.createElement("div");
      el.id = params.tmpContainer;
      document.body.appendChild(el);
    }

    var renderer = s.addRenderer({
      container: document.getElementById(params.tmpContainer),
      type: 'canvas'
    });

    var webgl = renderer instanceof sigma.renderers.webgl,
        sized = false,
        doneContexts = [];

    _canvas = document.createElement('canvas');
    _canvasContext = _canvas.getContext('2d');

    s.refresh();

    _contexts.forEach(function(name) {
      if (!renderer.contexts[name])
        return;

      if (params.labels === false && name === 'labels')
        return;

      var canvas = renderer.domElements[name] || renderer.domElements.scene,
        context = renderer.contexts[name];

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
    s.killRenderer(renderer);
    document.getElementById(params.tmpContainer).remove();
  }

  /**
  * @param {renderer}  related renderer instance
  * @param {params}  Options
  */
  Image.prototype.draw = function(r, params) {

    if(!params.size || params.size < 1)
      params.size = window.innerWidth;

    var webgl = r instanceof sigma.renderers.webgl,
        sized = false,
        doneContexts = [];

    var merged = document.createElement('canvas'),
        mergedContext= merged.getContext('2d');

    _contexts.forEach(function(name) {
      if (!r.contexts[name])
        return;

      if (params.labels === false && name === 'labels')
        return;

      var canvas = r.domElements[name] || r.domElements.scene,
        context = r.contexts[name];

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

    // Cleaning
    doneContexts = [];

    return merged;
  }

  /**
   * Interface
   * ------------------
   */
  var _instance = null;

  /**
   * @param {sigma}  s       The related sigma instance.
   * @param {renderer}  r    The related renderer instance.
   * @param {object} options An object with options.
   */
  sigma.plugins.image = function(s, r, options) {
    sigma.plugins.killImage();
    // Create object if undefined
    if (!_instance) {
      _instance = new Image(s, r, options);
    }
    return _instance;
  };

  /**
   *  This function kills the image instance.
   */
  sigma.plugins.killImage = function() {
    if (_instance instanceof Image) {
      _instance = null;
      _canvas = null;
      _canvasContext = null;
    }
  };

}).call(this);
