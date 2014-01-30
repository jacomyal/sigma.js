;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  sigma.utils.pkg('sigma.classes');

  /**
   * The camera constructor. It just initializes its attributes and methods.
   *
   * @param  {string}       id       The id.
   * @param  {sigma.classes.graph}  graph    The graph.
   * @param  {configurable} settings The settings function.
   * @param  {?object}      options  Eventually some overriding options.
   * @return {camera}                Returns the fresh new camera instance.
   */
  sigma.classes.camera = function(id, graph, settings, options) {
    sigma.classes.dispatcher.extend(this);

    Object.defineProperty(this, 'graph', {
      value: graph
    });
    Object.defineProperty(this, 'id', {
      value: id
    });
    Object.defineProperty(this, 'readPrefix', {
      value: 'read_cam' + id + ':'
    });
    Object.defineProperty(this, 'prefix', {
      value: 'cam' + id + ':'
    });

    this.x = 0;
    this.y = 0;
    this.ratio = 1;
    this.angle = 0;
    this.isAnimated = false;
    this.settings = (typeof options === 'object' && options) ?
      settings.embedObject(options) :
      settings;
  };

  /**
   * Updates the camera position.
   *
   * @param  {object} coordinates The new coordinates object.
   * @return {camera}             Returns the camera.
   */
  sigma.classes.camera.prototype.goTo = function(coordinates) {
    if (!this.settings('enableCamera'))
      return this;

    var i,
        l,
        c = coordinates || {},
        keys = ['x', 'y', 'ratio', 'angle'];

    for (i = 0, l = keys.length; i < l; i++)
      if (c[keys[i]] !== undefined) {
        if (typeof c[keys[i]] === 'number' && !isNaN(c[keys[i]]))
          this[keys[i]] = c[keys[i]];
        else
          throw 'Value for "' + keys[i] + '" is not a number.';
      }

    this.dispatchEvent('coordinatesUpdated');
    return this;
  };

  /**
   * This method takes a graph and computes for each node and edges its
   * coordinates relatively to the center of the camera. Basically, it will
   * compute the coordinates that will be used by the graphic renderers.
   *
   * Since it should be possible to use different cameras and different
   * renderers, it is possible to specify a prefix to put before the new
   * coordinates (to get something like "node.camera1_x")
   *
   * @param  {?string} read    The prefix of the coordinates to read.
   * @param  {?string} write   The prefix of the coordinates to write.
   * @param  {?object} options Eventually an object of options. Those can be:
   *                           - A restricted nodes array.
   *                           - A restricted edges array.
   *                           - A width.
   *                           - A height.
   * @return {camera}        Returns the camera.
   */
  sigma.classes.camera.prototype.applyView = function(read, write, options) {
    options = options || {};
    write = write !== undefined ? write : this.prefix;
    read = read !== undefined ? read : this.readPrefix;

    var nodes = options.nodes || this.graph.nodes(),
        edges = options.edges || this.graph.edges();

    var i,
        l,
        node,
        cos = Math.cos(this.angle),
        sin = Math.sin(this.angle);

    for (i = 0, l = nodes.length; i < l; i++) {
      node = nodes[i];
      node[write + 'x'] =
        (
          ((node[read + 'x'] || 0) - this.x) * cos +
          ((node[read + 'y'] || 0) - this.y) * sin
        ) / this.ratio + (options.width || 0) / 2;
      node[write + 'y'] =
        (
          ((node[read + 'y'] || 0) - this.y) * cos -
          ((node[read + 'x'] || 0) - this.x) * sin
        ) / this.ratio + (options.height || 0) / 2;
      node[write + 'size'] =
        (node[read + 'size'] || 0) /
        Math.pow(this.ratio, this.settings('nodesPowRatio'));
    }

    for (i = 0, l = edges.length; i < l; i++) {
      edges[i][write + 'size'] =
        (edges[i][read + 'size'] || 0) /
        Math.pow(this.ratio, this.settings('edgesPowRatio'));
    }

    return this;
  };

  /**
   * This function converts the coordinates of a point from the frame of the
   * camera to the frame of the graph.
   *
   * @param  {number} x The X coordinate of the point in the frame of the
   *                    camera.
   * @param  {number} y The Y coordinate of the point in the frame of the
   *                    camera.
   * @return {object}   The point coordinates in the frame of the graph.
   */
  sigma.classes.camera.prototype.graphPosition = function(x, y, vector) {
    var X = 0,
        Y = 0,
        cos = Math.cos(this.angle),
        sin = Math.sin(this.angle);

    // Revert the origin differential vector:
    if (!vector) {
      X = - (this.x * cos + this.y * sin) / this.ratio;
      Y = - (this.y * cos - this.x * sin) / this.ratio;
    }

    return {
      x: (x * cos + y * sin) / this.ratio + X,
      y: (y * cos - x * sin) / this.ratio + Y
    };
  };

  /**
   * This function converts the coordinates of a point from the frame of the
   * graph to the frame of the camera.
   *
   * @param  {number} x The X coordinate of the point in the frame of the
   *                    graph.
   * @param  {number} y The Y coordinate of the point in the frame of the
   *                    graph.
   * @return {object}   The point coordinates in the frame of the camera.
   */
  sigma.classes.camera.prototype.cameraPosition = function(x, y, vector) {
    var X = 0,
        Y = 0,
        cos = Math.cos(this.angle),
        sin = Math.sin(this.angle);

    // Revert the origin differential vector:
    if (!vector) {
      X = - (this.x * cos + this.y * sin) / this.ratio;
      Y = - (this.y * cos - this.x * sin) / this.ratio;
    }

    return {
      x: ((x - X) * cos - (y - Y) * sin) * this.ratio,
      y: ((y - Y) * cos + (x - X) * sin) * this.ratio
    };
  };

  /**
   * This method returns the transformation matrix of the camera. This is
   * especially useful to apply the camera view directly in shaders, in case of
   * WebGL rendering.
   *
   * @return {array} The transformation matrix.
   */
  sigma.classes.camera.prototype.getMatrix = function() {
    var scale = sigma.utils.matrices.scale(1 / this.ratio),
        rotation = sigma.utils.matrices.rotation(this.angle),
        translation = sigma.utils.matrices.translation(-this.x, -this.y),
        matrix = sigma.utils.matrices.multiply(
          translation,
          sigma.utils.matrices.multiply(
            rotation,
            scale
          )
        );

    return matrix;
  };

  /**
   * Taking a width and a height as parameters, this method returns the
   * coordinates of the rectangle representing the camera on screen, in the
   * graph's referentiel.
   *
   * To keep displaying labels of nodes going out of the screen, the method
   * keeps a margin around the screen in the returned rectangle.
   *
   * @param  {number} width  The width of the screen.
   * @param  {number} height The height of the screen.
   * @return {object}        The rectangle as x1, y1, x2 and y2, representing
   *                         two opposite points.
   */
  sigma.classes.camera.prototype.getRectangle = function(width, height) {
    var widthVect = this.cameraPosition(width, 0, true),
        heightVect = this.cameraPosition(0, height, true),
        centerVect = this.cameraPosition(width / 2, height / 2, true),
        marginX = this.cameraPosition(width / 4, 0, true).x,
        marginY = this.cameraPosition(0, height / 4, true).y;

    return {
      x1: this.x - centerVect.x - marginX,
      y1: this.y - centerVect.y - marginY,
      x2: this.x - centerVect.x + marginX + widthVect.x,
      y2: this.y - centerVect.y - marginY + widthVect.y,
      height: Math.sqrt(
        Math.pow(heightVect.x, 2) +
        Math.pow(heightVect.y + 2 * marginY, 2)
      )
    };
  };
}).call(this);
