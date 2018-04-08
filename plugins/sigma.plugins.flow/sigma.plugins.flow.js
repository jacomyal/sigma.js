;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  if (typeof spp === 'undefined')
    throw 'you must import svg-path-properties at first';
  var path = spp;


  // Initialize package:
  sigma.utils.pkg('sigma.plugins');

  /**
   * Sigma flow
   * =============================
   *
   * @author wjz <https://github.com/englishisnotenglish>
   * @version 1.0
   */
  var _instances = {};

  /*
  *  first  prepare a new layer to show the animation
  *  don't need to watch the event like wheel, move
  *  use the the latest nodes to compute position flow where should be
  * */
  function Flow(sigmaIns, config) {
    this.graph = sigmaIns.graph;
    this.renderer = sigmaIns.renderers[0];
    this.prefix = sigma.renderers.webgl &&
      this.renderer instanceof sigma.renderers.webgl ?
      sigmaIns.camera.prefix :
      this.renderer.options.prefix;

    this.config = Object.assign({
      flowColor: '#AEE4D9',
      speed: 1,
      paths: [],
      edgeTypeList: {
        curve: 'C',
        def: 'L',
        arrow: 'L',
        curvedArrow: 'C'
      },
      radius: 5,
    }, config);

    this.drawingCanvas = null;
    this.drawingContext = null;
    
    this.pathAnimateProcess = {};
    this.animationTimer = null;
    this.status =  'stop';
    this.isActive =  false;
  }

  Flow.prototype.active = function () {
    if (!this.renderer.domElements['animation']) {
      this.renderer.initDOM('canvas', 'animation');

      this.drawingCanvas = this.renderer.domElements['animation'];
      this.drawingCanvas.width = this.renderer.container.offsetWidth;
      this.drawingCanvas.height = this.renderer.container.offsetHeight;

      this.renderer.container.insertBefore(this.drawingCanvas, this.renderer.domElements['mouse']);

      this.drawingContext = this.drawingCanvas.getContext('2d');
    }
  };

  /*
  * deactivate the plugin
  * first stop the animation
  * second deactivate
  * */
  Flow.prototype.deactivate = function () {
    this.stop();

    if (this.renderer.domElements['animation']) {
      this.renderer.container.removeChild(this.drawingCanvas);
      delete this.renderer.domElements['animation'];
      this.drawingCanvas = null;
      this.drawingContext = null;
    }
  };

  /*
  * draw one frame
  * first compute new position
  * second draw new frame
  * */
  Flow.prototype.drawFrame = function () {
    var that = this,
      newPosition = [],
      paths = this.config.paths;

    paths.forEach(function (p) {
      var pathOutput = that.generatePath(p),
        properties = path.svgPathProperties(pathOutput.svgPath),
        animateProcess = pathOutput.pathId && that.pathAnimateProcess[pathOutput.pathId];

      animateProcess.total = properties.getTotalLength();

      newPosition.push({
        center: properties.getPointAtLength(animateProcess.percent / 100 * animateProcess.total),
        radius: animateProcess.radius
      });
    });

    newPosition.forEach(function (point) {
      that.drawPoint(point.center, point.radius);
    })
  };

  Flow.prototype.generatePath = function (path) {
    var that = this,
      edgeTypeList = this.config.edgeTypeList,
      prefix = this.prefix,
      radius = this.config.radius;

    var generateSvgPath = function (edge, svgPath) {
      var endPoint = that.graph.nodes([edge.source, edge.target]),
        position = [],
        edgeType = edge.type || 'def';

      // need the screen axis
      endPoint.forEach(function (node) {
        position.push({
          x: node[prefix + 'x'],
          y: node[prefix + 'y']
        });
      });

      var position1 = edgeTypeList[edgeType] + position[1].x + ' ' + position[1].y;

      svgPath +=  svgPath ? position1 : 'M' + position[0].x + ' ' + position[0].y + ' ' + position1;

      return svgPath;
    };

    //  or the curve Type can''t get the correct method
    var svgPath = '',
      pathId = '';
    
    for (var i = 0, len = path.length; i < len; i++) {
      var edgeId = '',
        edge = null;
      if(typeof path[i] === 'string') {
        edgeId = path[i];
        edge = this.graph.edges(edgeId);
      }

      if(typeof path[i] === 'object') {
        edge = path[i];
        edgeId = edge.id;
      }

      if (!edge) {
        throw 'please give the existed edge';
      }

      pathId += edgeId;

      // second generate the path
      svgPath = generateSvgPath(edge, svgPath);
    }

    if (pathId && !this.pathAnimateProcess[pathId]) {
      this.pathAnimateProcess[pathId] = {
        percent: 0,
        radius: radius,
      };
    }

    return {
      svgPath: svgPath,
      pathId : pathId
    };
  };

  Flow.prototype.drawPoint = function (point, r) {
    var ctx = this.drawingContext,
      flowColor = this.config.flowColor;

    ctx.beginPath();
    ctx.shadowColor = flowColor;
    ctx.shadowBlur = r * 3;
    ctx.arc(point.x, point.y, r, 0, 2 * Math.PI);
    ctx.fillStyle = flowColor;
    ctx.fill();
    ctx.closePath();
  };

  Flow.prototype.setConfig = function (type, value) {
    this.config[type] = value;
  };

  Flow.prototype.setPath = function (paths) {
    this.stop();

    this.setConfig('paths', paths);
    this.pathAnimateProcess = {};

    this.start();
  };

  Flow.prototype.hide = function () {
    this.stop();

    var width = this.drawingCanvas.width,
      height = this.drawingCanvas.height;

    this.drawingContext.clearRect(0, 0, width, height);
  };

  /*
  * for the play and pause
  * */
  Flow.prototype.changeFlowMode = function () {
    if(this.status === 'stop') {
      this.start();
    } else {
      this.stop();
    }
  };

  Flow.prototype.start = function () {
    var that = this,
      config = this.config,
      pathAnimateProcess = that.pathAnimateProcess;

    if(!this.isActive) {
      this.active();
    }

    this.status = 'start';

    this.animationTimer = setInterval(function () {
      var width = that.drawingCanvas.width,
        height = that.drawingCanvas.height;

      for (var key in pathAnimateProcess) {
        that.drawingContext.clearRect(0, 0, width, height);
        pathAnimateProcess[key].percent = (pathAnimateProcess[key].percent + config.speed) % 100;
      }
      requestAnimationFrame(that.drawFrame.bind(that));
    }, 16);
  };
  
  Flow.prototype.stop = function () {
    this.status = 'stop';
    clearInterval(this.animationTimer);
    this.animationTimer = null;
  };

  /*
  * kill the plugin
  * second deactivate
  * */
  Flow.prototype.kill = function () {
    this.deactivate();

    this.graph = null;
    this.renderer = null;
  };

  sigma.plugins.flow =  function(sigmaIns, config, paths) {
    if (!_instances[sigmaIns.id]) {
      _instances[sigmaIns.id] = new Flow(sigmaIns, config);
    }

    // while killing sigmaIns, and remove the flow isntance
    sigmaIns.bind('kill', function () {
      if (_instances[sigmaIns.id] instanceof Flow) {
        _instances[sigmaIns.id].kill();
        delete _instances[sigmaInstance.id];
      }
    });

    return _instances[sigmaIns.id];
  };
}).call(this);
