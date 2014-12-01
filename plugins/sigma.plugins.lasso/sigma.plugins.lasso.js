;(function (undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize package:
  sigma.utils.pkg('sigma.plugins');

  /**
   * Sigma Lasso
   * =============================
   *
   * @author Florent Schildknecht <florent.schildknecht@gmail.com> (Florent Schildknecht)
   * @version 0.0.1
   */
   var _self = undefined,
       _sigmaInstance = undefined,
       _graph = undefined,
       _renderer = undefined,
       _body,
       _activated = false,
       _settings = null,
       _drawingCanvas = undefined,
       _drawingContext = undefined,
       _drewPoints = [],
       _selectedNodes = [],
       isDrawing = false;

  /**
   * Lasso Object
   * ------------------
   * @param  {sigma}                                  sigmaInstance The related sigma instance.
   * @param  {renderer} renderer                      The sigma instance renderer.
   * @param  {sigma.classes.configurable} settings    A settings class
   */
  function Lasso (sigmaInstance, renderer, settings) {
    // Lasso is also an event dispatcher
    sigma.classes.dispatcher.extend(this);

    // A quick hardcoded rule to prevent people from using this plugin with the
    // WebGL renderer (which is impossible at the moment):
    if (
      sigma.renderers.webgl &&
      renderer instanceof sigma.renderers.webgl
    )
      throw new Error(
        'The sigma.plugins.lasso is not compatible with the WebGL renderer'
      );

    _self = this;
    _sigmaInstance = sigmaInstance;
    _graph = sigmaInstance.graph;
    _renderer = renderer;

    // Extends default settings
    _settings = new sigma.classes.configurable({
      'fillStyle': 'rgba(200, 200, 200, 0.25)',
      'strokeStyle': 'black',
      'lineWidth': 2,
      'fillWhileDrawing': false
     }, settings || {});

    _body = document.body;

    console.log('created');
  };

  /**
   * This method is used to destroy the lasso.
   *
   * > var lasso = new sigma.plugins.lasso(sigmaInstance);
   * > lasso.clear();
   *
   * @return {sigma.plugins.lasso} Returns the instance.
   */
  Lasso.prototype.clear = function () {
    this.deactivate();
    lasso = null;

    return this;
  };

  /**
   * This method is used to activate the lasso mode.
   *
   * > var lasso = new sigma.plugins.lasso(sigmaInstance);
   * > lasso.activate();
   *
   * @return {sigma.plugins.lasso} Returns the instance.
   */
  Lasso.prototype.activate = function () {
    if (!_activated) {
      _activated = true;

      // Add a new background layout canvas to draw the path on
      if (!_renderer.domElements['lasso-background']) {
        _renderer.initDOM('canvas', 'lasso-background');
        _drawingCanvas = _renderer.domElements['lasso-background'];

        _drawingCanvas.width = _renderer.container.offsetWidth;
        _drawingCanvas.height = _renderer.container.offsetHeight;
        _renderer.container.appendChild(_drawingCanvas);
        _drawingContext = _drawingCanvas.getContext('2d');
      }

      this.bindAll();

      console.log('activated');
    }

    return this;
  };

  /**
   * This method is used to deactivate the lasso mode.
   *
   * > var lasso = new sigma.plugins.lasso(sigmaInstance);
   * > lasso.deactivate();
   *
   * @return {sigma.plugins.lasso} Returns the instance.
   */
  Lasso.prototype.deactivate = function () {
    if (_activated) {
      _activated = false;

      this.unbindAll();

      if (_renderer.domElements['lasso-background']) {
        _renderer.container.removeChild(_renderer.domElements['lasso-background']);
        delete _renderer.domElements['lasso-background'];
        _drawingCanvas = null;
        _drawingContext = null;
      }

      console.log('deactivated');
    }

    return this;
  };

  /**
   * This method is used to bind all events of the lasso mode.
   *
   * > var lasso = new sigma.plugins.lasso(sigmaInstance);
   * > lasso.activate();
   *
   * @return {sigma.plugins.lasso} Returns the instance.
   */
  Lasso.prototype.bindAll = function () {
    // Mouse events
    _drawingCanvas.addEventListener('mousedown', onDrawingStart);
    _body.addEventListener('mousemove', onDrawing);
    _body.addEventListener('mouseup', onDrawingEnd);
    // Touch events
    _drawingCanvas.addEventListener('touchstart', onDrawingStart);
    _body.addEventListener('touchmove', onDrawing);
    _body.addEventListener('touchcancel', onDrawingEnd);
    _body.addEventListener('touchleave', onDrawingEnd);
    _body.addEventListener('touchend', onDrawingEnd);

    return this;
  };

  /**
   * This method is used to unbind all events of the lasso mode.
   *
   * > var lasso = new sigma.plugins.lasso(sigmaInstance);
   * > lasso.activate();
   *
   * @return {sigma.plugins.lasso} Returns the instance.
   */
  Lasso.prototype.unbindAll = function () {
    // Mouse events
    _drawingCanvas.removeEventListener('mousedown', onDrawingStart);
    _body.removeEventListener('mousemove', onDrawing);
    _body.removeEventListener('mouseup', onDrawingEnd);
    // Touch events
    _drawingCanvas.removeEventListener('touchstart', onDrawingStart);
    _drawingCanvas.removeEventListener('touchmove', onDrawing);
    _body.removeEventListener('touchcancel', onDrawingEnd);
    _body.removeEventListener('touchleave', onDrawingEnd);
    _body.removeEventListener('touchend', onDrawingEnd);

    return this;
  };

  /**
   * This method is used to retrieve the previously selected nodes
   *
   * > var lasso = new sigma.plugins.lasso(sigmaInstance);
   * > lasso.getSelectedNodes();
   *
   * @return {array} Returns an array of nodes.
   */
  Lasso.prototype.getSelectedNodes = function () {
    return _selectedNodes;
  };

  function onDrawingStart (event) {
    var drawingRectangle = _drawingCanvas.getBoundingClientRect();

    if (_activated) {
      isDrawing = true;
      _drewPoints = [];
      _selectedNodes = [];

      _sigmaInstance.refresh();

      _drewPoints.push({
        x: event.clientX - drawingRectangle.left,
        y: event.clientY - drawingRectangle.top
      });

      event.stopPropagation();
    }
  }

  function onDrawing (event) {
    var drawingRectangle = _drawingCanvas.getBoundingClientRect();

    if (_activated && isDrawing) {
      var x = 0, y = 0;
      switch (event.type) {
        case 'touchmove':
          x = event.touches[0].clientX;
          y = event.touches[0].clientY;
          break;
        default:
          x = event.clientX;
          y = event.clientY;
          break;
      }
      _drewPoints.push({
        x: x - drawingRectangle.left,
        y: y - drawingRectangle.top
      });

      // Drawing styles
      _drawingContext.lineWidth = _settings('lineWidth');
      _drawingContext.strokeStyle = _settings('strokeStyle');
      _drawingContext.fillStyle = _settings('fillStyle');
      _drawingContext.lineJoin = 'round';
      _drawingContext.lineCap = 'round';
      _drawingCanvas.style.cursor = 'move';

      // Clear the canvas
      _drawingContext.clearRect(0, 0, _drawingContext.canvas.width, _drawingContext.canvas.height);

      // Redraw the complete path for a smoother effect
      // Even smoother with quadratic curves
      var sourcePoint = _drewPoints[0],
          destinationPoint = _drewPoints[1],
          pointsLength = _drewPoints.length,
          getMiddlePointCoordinates = function (firstPoint, secondPoint) {
            return {
              x: firstPoint.x + (secondPoint.x - firstPoint.x) / 2,
              y: firstPoint.y + (secondPoint.y - firstPoint.y) / 2
            };
          };

      _drawingContext.beginPath();
      _drawingContext.moveTo(sourcePoint.x, sourcePoint.y);

      for (var i = 1; i < pointsLength; i++) {
        var middlePoint = getMiddlePointCoordinates(sourcePoint, destinationPoint);
        // _drawingContext.lineTo(_drewPoints[i].x, _drewPoints[i].y);
        _drawingContext.quadraticCurveTo(sourcePoint.x, sourcePoint.y, middlePoint.x, middlePoint.y);
        sourcePoint = _drewPoints[i];
        destinationPoint = _drewPoints[i+1];
      }

      _drawingContext.lineTo(sourcePoint.x, sourcePoint.y);
      _drawingContext.stroke();

      if (_settings('fillWhileDrawing')) {
        _drawingContext.fill();
      }

      event.stopPropagation();
    }
  }

  function onDrawingEnd (event) {
    if (_activated && isDrawing) {
      isDrawing = false;

      // Select the nodes inside the path
      var nodes = _sigmaInstance.graph.nodes(),
        nodesLength = nodes.length,
        i = 0,
        prefix = _renderer.options.prefix || '';

      // Loop on all nodes and check if they are in the path
      while (nodesLength--) {
        var node = nodes[nodesLength],
            x = node[prefix + 'x'],
            y = node[prefix + 'y'];

        if (_drawingContext.isPointInPath(x, y)) {
          _selectedNodes.push(node);
        }
      }

      // Dispatch event with selected nodes
      _self.dispatchEvent('selectedNodes', _selectedNodes);

      // Clear the drawing canvas
      // _drawingContext.clearRect(0, 0, _drawingCanvas.width, _drawingCanvas.height);

      event.stopPropagation();
    }
  }

  /**
   * Interface
   * ------------------
   *
   * > var lasso = new sigma.plugins.lasso(sigmaInstance);
   */
  var lasso = null;

  /**
   * @param  {sigma}                                  sigmaInstance The related sigma instance.
   * @param  {renderer} renderer                      The sigma instance renderer.
   * @param  {sigma.classes.configurable} settings    A settings class
   *
   * @return {sigma.plugins.lasso} Returns the instance
   */
  sigma.plugins.lasso = function (sigmaInstance, renderer, settings) {
    // Create lasso if undefined
    if (!lasso) {
      lasso = new Lasso(sigmaInstance, renderer, settings);
    }

    // Listen for sigmaInstance kill event, and remove the lasso isntance
    sigmaInstance.bind('kill', function () {
      lasso.deactivate();
      lasso = null;
    });

    return lasso;
  };

}).call(this);
