;(function(undefined) {
  'use strict';

  var __instances = {};

  /**
   * This is the sigma instances constructor. One instance of sigma represent
   * one graph. It is possible to represent this grapĥ with several renderers
   * at the same time. By default, the default renderer (WebGL + Canvas
   * polyfill) will be used as the only renderer, with the container specified
   * in the configuration.
   *
   * @param  {?*}    conf The configuration of the instance. There are a lot of
   *                      different recognized forms to instantiate sigma, check
   *                      example files, documentation in this file and unit
   *                      tests to know more.
   * @return {sigma}      The fresh new sigma instance.
   *
   * Instanciating sigma:
   * ********************
   * If no parameter is given to the constructor, the instance will be created
   * without any renderer or camera. It will just instantiate the graph, and
   * other modules will have to be instantiated through the public methods,
   * like "addRenderer" etc:
   *
   *  > s0 = new sigma();
   *  > s0.addRenderer({
   *  >   type: 'canvas',
   *  >   container: 'my-container-id'
   *  > });
   *
   * In most of the cases, sigma will simply be used with the default renderer.
   * Then, since the only required parameter is the DOM container, there are
   * some simpler way to call the constructor. The four following calls do the
   * exact same things:
   *
   *  > s1 = new sigma('my-container-id');
   *  > s2 = new sigma(document.getElementById('my-container-id'));
   *  > s3 = new sigma({
   *  >   container: document.getElementById('my-container-id')
   *  > });
   *  > s4 = new sigma({
   *  >   renderers: [{
   *  >     container: document.getElementById('my-container-id')
   *  >   }]
   *  > });
   *
   * Recognized parameters:
   * **********************
   * Here is the exhaustive list of every accepted parameters, when calling the
   * constructor with to top level configuration object (fourth case in the
   * previous examples):
   *
   *   {?string} id        The id of the instance. It will be generated
   *                       automatically if not specified.
   *   {?array}  renderers An array containing objects describing renderers.
   *   {?object} graph     An object containing an array of nodes and an array
   *                       of edges, to avoid having to add them by hand later.
   *   {?object} settings  An object containing instance specific settings that
   *                       will override the default ones defined in the object
   *                       sigma.settings.
   */
  var sigma = function(conf) {
    // Local variables:
    // ****************
    var i,
        l,
        a,
        c,
        o,
        id;

    sigma.classes.dispatcher.extend(this);

    // Private attributes:
    // *******************
    var _self = this,
        _conf = conf || {};

    // Little shortcut:
    // ****************
    // The configuration is supposed to have a list of the configuration
    // objects for each renderer.
    //  - If there are no configuration at all, then nothing is done.
    //  - If there are no renderer list, the given configuration object will be
    //    considered as describing the first and only renderer.
    //  - If there are no renderer list nor "container" object, it will be
    //    considered as the container itself (a DOM element).
    //  - If the argument passed to sigma() is a string, it will be considered
    //    as the ID of the DOM container.
    if (
      typeof _conf === 'string' ||
      _conf instanceof HTMLElement
    )
      _conf = {
        renderers: [_conf]
      };
    else if (Object.prototype.toString.call(_conf) === '[object Array]')
      _conf = {
        renderers: _conf
      };

    // Also check "renderer" and "container" keys:
    o = _conf.renderers || _conf.renderer || _conf.container;
    if (!_conf.renderers || _conf.renderers.length === 0)
      if (
        typeof o === 'string' ||
        o instanceof HTMLElement ||
        (typeof o === 'object' && 'container' in o)
      )
        _conf.renderers = [o];

    // Recense the instance:
    if (_conf.id) {
      if (__instances[_conf.id])
        throw 'sigma: Instance "' + _conf.id + '" already exists.';
      Object.defineProperty(this, 'id', {
        value: _conf.id
      });
    } else {
      id = 0;
      while (__instances[id])
        id++;
      Object.defineProperty(this, 'id', {
        value: '' + id
      });
    }
    __instances[this.id] = this;

    // Initialize settings function:
    this.settings = new sigma.classes.configurable(
      sigma.settings,
      _conf.settings || {}
    );

    // Initialize locked attributes:
    Object.defineProperty(this, 'graph', {
      value: new sigma.classes.graph(this.settings),
      configurable: true
    });
    Object.defineProperty(this, 'middlewares', {
      value: [],
      configurable: true
    });
    Object.defineProperty(this, 'cameras', {
      value: {},
      configurable: true
    });
    Object.defineProperty(this, 'renderers', {
      value: {},
      configurable: true
    });
    Object.defineProperty(this, 'renderersPerCamera', {
      value: {},
      configurable: true
    });
    Object.defineProperty(this, 'cameraFrames', {
      value: {},
      configurable: true
    });
    Object.defineProperty(this, 'camera', {
      get: function() {
        return this.cameras[0];
      }
    });
    Object.defineProperty(this, 'events', {
      value: [
        'click',
        'rightClick',
        'clickStage',
        'doubleClickStage',
        'rightClickStage',
        'clickNode',
        'clickNodes',
        'doubleClickNode',
        'doubleClickNodes',
        'rightClickNode',
        'rightClickNodes',
        'overNode',
        'overNodes',
        'outNode',
        'outNodes',
        'downNode',
        'downNodes',
        'upNode',
        'upNodes'
      ],
      configurable: true
    });

    // Add a custom handler, to redispatch events from renderers:
    this._handler = (function(e) {
      var k,
          data = {};

      for (k in e.data)
        data[k] = e.data[k];

      data.renderer = e.target;
      this.dispatchEvent(e.type, data);
    }).bind(this);

    // Initialize renderers:
    a = _conf.renderers || [];
    for (i = 0, l = a.length; i < l; i++)
      this.addRenderer(a[i]);

    // Initialize middlewares:
    a = _conf.middlewares || [];
    for (i = 0, l = a.length; i < l; i++)
      this.middlewares.push(
        typeof a[i] === 'string' ?
          sigma.middlewares[a[i]] :
          a[i]
      );

    // Check if there is already a graph to fill in:
    if (typeof _conf.graph === 'object' && _conf.graph) {
      this.graph.read(_conf.graph);

      // If a graph is given to the to the instance, the "refresh" method is
      // directly called:
      this.refresh();
    }

    // Deal with resize:
    window.addEventListener('resize', function() {
      if (_self.settings)
        _self.refresh();
    });
  };




  /**
   * This methods will instantiate and reference a new camera. If no id is
   * specified, then an automatic id will be generated.
   *
   * @param  {?string}              id Eventually the camera id.
   * @return {sigma.classes.camera}    The fresh new camera instance.
   */
  sigma.prototype.addCamera = function(id) {
    var self = this,
        camera;

    if (!arguments.length) {
      id = 0;
      while (this.cameras['' + id])
        id++;
      id = '' + id;
    }

    if (this.cameras[id])
      throw 'sigma.addCamera: The camera "' + id + '" already exists.';

    camera = new sigma.classes.camera(id, this.graph, this.settings);
    this.cameras[id] = camera;

    // Add a quadtree to the camera:
    camera.quadtree = new sigma.classes.quad();

    // Add an edgequadtree to the camera:
    if (sigma.classes.edgequad !== undefined) {
      camera.edgequadtree = new sigma.classes.edgequad();
    }

    camera.bind('coordinatesUpdated', function(e) {
      self.renderCamera(camera, camera.isAnimated);
    });

    this.renderersPerCamera[id] = [];

    return camera;
  };

  /**
   * This method kills a camera, and every renderer attached to it.
   *
   * @param  {string|camera} v The camera to kill or its ID.
   * @return {sigma}           Returns the instance.
   */
  sigma.prototype.killCamera = function(v) {
    v = typeof v === 'string' ? this.cameras[v] : v;

    if (!v)
      throw 'sigma.killCamera: The camera is undefined.';

    var i,
        l,
        a = this.renderersPerCamera[v.id];

    for (l = a.length, i = l - 1; i >= 0; i--)
      this.killRenderer(a[i]);

    delete this.renderersPerCamera[v.id];
    delete this.cameraFrames[v.id];
    delete this.cameras[v.id];

    if (v.kill)
      v.kill();

    return this;
  };

  /**
   * This methods will instantiate and reference a new renderer. The "type"
   * argument can be the constructor or its name in the "sigma.renderers"
   * package. If no type is specified, then "sigma.renderers.def" will be used.
   * If no id is specified, then an automatic id will be generated.
   *
   * @param  {?object}  options Eventually some options to give to the renderer
   *                            constructor.
   * @return {renderer}         The fresh new renderer instance.
   *
   * Recognized parameters:
   * **********************
   * Here is the exhaustive list of every accepted parameters in the "options"
   * object:
   *
   *   {?string}            id     Eventually the renderer id.
   *   {?(function|string)} type   Eventually the renderer constructor or its
   *                               name in the "sigma.renderers" package.
   *   {?(camera|string)}   camera Eventually the renderer camera or its
   *                               id.
   */
  sigma.prototype.addRenderer = function(options) {
    var id,
        fn,
        camera,
        renderer,
        o = options || {};

    // Polymorphism:
    if (typeof o === 'string')
      o = {
        container: document.getElementById(o)
      };
    else if (o instanceof HTMLElement)
      o = {
        container: o
      };

    // If the container still is a string, we get it by id
    if (typeof o.container === 'string')
      o.container = document.getElementById(o.container);

    // Reference the new renderer:
    if (!('id' in o)) {
      id = 0;
      while (this.renderers['' + id])
        id++;
      id = '' + id;
    } else
      id = o.id;

    if (this.renderers[id])
      throw 'sigma.addRenderer: The renderer "' + id + '" already exists.';

    // Find the good constructor:
    fn = typeof o.type === 'function' ? o.type : sigma.renderers[o.type];
    fn = fn || sigma.renderers.def;

    // Find the good camera:
    camera = 'camera' in o ?
      (
        o.camera instanceof sigma.classes.camera ?
          o.camera :
          this.cameras[o.camera] || this.addCamera(o.camera)
      ) :
      this.addCamera();

    if (this.cameras[camera.id] !== camera)
      throw 'sigma.addRenderer: The camera is not properly referenced.';

    // Instantiate:
    renderer = new fn(this.graph, camera, this.settings, o);
    this.renderers[id] = renderer;
    Object.defineProperty(renderer, 'id', {
      value: id
    });

    // Bind events:
    if (renderer.bind)
      renderer.bind(
        [
          'click',
          'rightClick',
          'clickStage',
          'doubleClickStage',
          'rightClickStage',
          'clickNode',
          'clickNodes',
          'clickEdge',
          'clickEdges',
          'doubleClickNode',
          'doubleClickNodes',
          'doubleClickEdge',
          'doubleClickEdges',
          'rightClickNode',
          'rightClickNodes',
          'rightClickEdge',
          'rightClickEdges',
          'overNode',
          'overNodes',
          'overEdge',
          'overEdges',
          'outNode',
          'outNodes',
          'outEdge',
          'outEdges',
          'downNode',
          'downNodes',
          'downEdge',
          'downEdges',
          'upNode',
          'upNodes',
          'upEdge',
          'upEdges'
        ],
        this._handler
      );

    // Reference the renderer by its camera:
    this.renderersPerCamera[camera.id].push(renderer);

    return renderer;
  };

  /**
   * This method kills a renderer.
   *
   * @param  {string|renderer} v The renderer to kill or its ID.
   * @return {sigma}             Returns the instance.
   */
  sigma.prototype.killRenderer = function(v) {
    v = typeof v === 'string' ? this.renderers[v] : v;

    if (!v)
      throw 'sigma.killRenderer: The renderer is undefined.';

    var a = this.renderersPerCamera[v.camera.id],
        i = a.indexOf(v);

    if (i >= 0)
      a.splice(i, 1);

    if (v.kill)
      v.kill();

    delete this.renderers[v.id];

    return this;
  };




  /**
   * This method calls the "render" method of each renderer, with the same
   * arguments than the "render" method, but will also check if the renderer
   * has a "process" method, and call it if it exists.
   *
   * It is useful for quadtrees or WebGL processing, for instance.
   *
   * @param  {?object}  options Eventually some options to give to the refresh
   *                            method.
   * @return {sigma}            Returns the instance itself.
   *
   * Recognized parameters:
   * **********************
   * Here is the exhaustive list of every accepted parameters in the "options"
   * object:
   *
   *   {?boolean} skipIndexation A flag specifying wether or not the refresh
   *                             function should reindex the graph in the
   *                             quadtrees or not (default: false).
   */
  sigma.prototype.refresh = function(options) {
    var i,
        l,
        k,
        a,
        c,
        bounds,
        prefix = 0;

    options = options || {};

    // Call each middleware:
    a = this.middlewares || [];
    for (i = 0, l = a.length; i < l; i++)
      a[i].call(
        this,
        (i === 0) ? '' : 'tmp' + prefix + ':',
        (i === l - 1) ? 'ready:' : ('tmp' + (++prefix) + ':')
      );

    // Then, for each camera, call the "rescale" middleware, unless the
    // settings specify not to:
    for (k in this.cameras) {
      c = this.cameras[k];
      if (
        c.settings('autoRescale') &&
        this.renderersPerCamera[c.id] &&
        this.renderersPerCamera[c.id].length
      )
        sigma.middlewares.rescale.call(
          this,
          a.length ? 'ready:' : '',
          c.readPrefix,
          {
            width: this.renderersPerCamera[c.id][0].width,
            height: this.renderersPerCamera[c.id][0].height
          }
        );
      else
        sigma.middlewares.copy.call(
          this,
          a.length ? 'ready:' : '',
          c.readPrefix
        );

      if (!options.skipIndexation) {
        // Find graph boundaries:
        bounds = sigma.utils.getBoundaries(
          this.graph,
          c.readPrefix
        );

        // Refresh quadtree:
        c.quadtree.index(this.graph.nodes(), {
          prefix: c.readPrefix,
          bounds: {
            x: bounds.minX,
            y: bounds.minY,
            width: bounds.maxX - bounds.minX,
            height: bounds.maxY - bounds.minY
          }
        });

        // Refresh edgequadtree:
        if (
          c.edgequadtree !== undefined &&
          c.settings('drawEdges') &&
          c.settings('enableEdgeHovering')
        ) {
          c.edgequadtree.index(this.graph, {
            prefix: c.readPrefix,
            bounds: {
              x: bounds.minX,
              y: bounds.minY,
              width: bounds.maxX - bounds.minX,
              height: bounds.maxY - bounds.minY
            }
          });
        }
      }
    }

    // Call each renderer:
    a = Object.keys(this.renderers);
    for (i = 0, l = a.length; i < l; i++)
      if (this.renderers[a[i]].process) {
        if (this.settings('skipErrors'))
          try {
            this.renderers[a[i]].process();
          } catch (e) {
            console.log(
              'Warning: The renderer "' + a[i] + '" crashed on ".process()"'
            );
          }
        else
          this.renderers[a[i]].process();
      }

    this.render();

    return this;
  };

  /**
   * This method calls the "render" method of each renderer.
   *
   * @return {sigma} Returns the instance itself.
   */
  sigma.prototype.render = function() {
    var i,
        l,
        a,
        prefix = 0;

    // Call each renderer:
    a = Object.keys(this.renderers);
    for (i = 0, l = a.length; i < l; i++)
      if (this.settings('skipErrors'))
        try {
          this.renderers[a[i]].render();
        } catch (e) {
          if (this.settings('verbose'))
            console.log(
              'Warning: The renderer "' + a[i] + '" crashed on ".render()"'
            );
        }
      else
        this.renderers[a[i]].render();

    return this;
  };

  /**
   * This method calls the "render" method of each renderer that is bound to
   * the specified camera. To improve the performances, if this method is
   * called too often, the number of effective renderings is limitated to one
   * per frame, unless you are using the "force" flag.
   *
   * @param  {sigma.classes.camera} camera The camera to render.
   * @param  {?boolean}             force  If true, will render the camera
   *                                       directly.
   * @return {sigma}                       Returns the instance itself.
   */
  sigma.prototype.renderCamera = function(camera, force) {
    var i,
        l,
        a,
        self = this;

    if (force) {
      a = this.renderersPerCamera[camera.id];
      for (i = 0, l = a.length; i < l; i++)
        if (this.settings('skipErrors'))
          try {
            a[i].render();
          } catch (e) {
            if (this.settings('verbose'))
              console.log(
                'Warning: The renderer "' + a[i].id + '" crashed on ".render()"'
              );
          }
        else
          a[i].render();
    } else {
      if (!this.cameraFrames[camera.id]) {
        a = this.renderersPerCamera[camera.id];
        for (i = 0, l = a.length; i < l; i++)
          if (this.settings('skipErrors'))
            try {
              a[i].render();
            } catch (e) {
              if (this.settings('verbose'))
                console.log(
                  'Warning: The renderer "' +
                    a[i].id +
                    '" crashed on ".render()"'
                );
            }
          else
            a[i].render();

        this.cameraFrames[camera.id] = requestAnimationFrame(function() {
          delete self.cameraFrames[camera.id];
        });
      }
    }

    return this;
  };

  /**
   * This method calls the "kill" method of each module and destroys any
   * reference from the instance.
   */
  sigma.prototype.kill = function() {
    var k;

    // Dispatching event
    this.dispatchEvent('kill');

    // Kill graph:
    this.graph.kill();

    // Kill middlewares:
    delete this.middlewares;

    // Kill each renderer:
    for (k in this.renderers)
      this.killRenderer(this.renderers[k]);

    // Kill each camera:
    for (k in this.cameras)
      this.killCamera(this.cameras[k]);

    delete this.renderers;
    delete this.cameras;

    // Kill everything else:
    for (k in this)
      if (this.hasOwnProperty(k))
        delete this[k];

    delete __instances[this.id];
  };




  /**
   * Returns a clone of the instances object or a specific running instance.
   *
   * @param  {?string} id Eventually an instance ID.
   * @return {object}     The related instance or a clone of the instances
   *                      object.
   */
  sigma.instances = function(id) {
    return arguments.length ?
      __instances[id] :
      sigma.utils.extend({}, __instances);
  };



  /**
   * The current version of sigma:
   */
  sigma.version = '1.1.0';




  /**
   * EXPORT:
   * *******
   */
  if (typeof this.sigma !== 'undefined')
    throw 'An object called sigma is already in the global scope.';

  this.sigma = sigma;

}).call(this);
