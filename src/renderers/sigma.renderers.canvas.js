;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  if (typeof conrad === 'undefined')
    throw 'conrad is not declared';

  // Initialize packages:
  sigma.utils.pkg('sigma.renderers');

  /**
   * This function is the constructor of the canvas sigma's renderer.
   *
   * @param  {sigma.classes.graph}            graph    The graph to render.
   * @param  {sigma.classes.camera}           camera   The camera.
   * @param  {configurable}           settings The sigma instance settings
   *                                           function.
   * @param  {object}                 object   The options object.
   * @return {sigma.renderers.canvas}          The renderer instance.
   */
  sigma.renderers.canvas = function(graph, camera, settings, options) {
    if (typeof options !== 'object')
      throw 'sigma.renderers.canvas: Wrong arguments.';

    if (!(options.container instanceof HTMLElement))
      throw 'Container not found.';

    var k,
        i,
        l,
        a,
        fn,
        self = this;

    sigma.classes.dispatcher.extend(this);

    // Initialize main attributes:
    Object.defineProperty(this, 'conradId', {
      value: sigma.utils.id()
    });
    this.graph = graph;
    this.camera = camera;
    this.contexts = {};
    this.domElements = {};
    this.options = options;
    this.container = this.options.container;
    this.settings = (
        typeof options.settings === 'object' &&
        options.settings
      ) ?
        settings.embedObjects(options.settings) :
        settings;

    // Node indexes:
    this.nodesOnScreen = [];
    this.edgesOnScreen = [];

    // Conrad related attributes:
    this.jobs = {};

    // Find the prefix:
    this.options.prefix = 'renderer' + this.conradId + ':';

    // Initialize the DOM elements:
    if (
      !this.settings('batchEdgesDrawing')
    ) {
      this.initDOM('canvas', 'scene');
      this.contexts.edges = this.contexts.scene;
      this.contexts.nodes = this.contexts.scene;
      this.contexts.labels = this.contexts.scene;
    } else {
      this.initDOM('canvas', 'edges');
      this.initDOM('canvas', 'scene');
      this.contexts.nodes = this.contexts.scene;
      this.contexts.labels = this.contexts.scene;
    }

    this.initDOM('canvas', 'mouse');
    this.contexts.hover = this.contexts.mouse;

    // Initialize captors:
    this.captors = [];
    a = this.options.captors || [sigma.captors.mouse, sigma.captors.touch];
    for (i = 0, l = a.length; i < l; i++) {
      fn = typeof a[i] === 'function' ? a[i] : sigma.captors[a[i]];
      this.captors.push(
        new fn(
          this.domElements.mouse,
          this.camera,
          this.settings
        )
      );
    }

    // Deal with sigma events:
    sigma.misc.bindEvents.call(this, this.options.prefix);
    sigma.misc.drawHovers.call(this, this.options.prefix);

    this.resize(false);
  };

  /**
   * Static method to render edges or nodes with the given renderers
   *
   * @param  {object}       params     The parameters passed in an object
   *      {
   *        renderers:           Renderers to be used
   *        type:                "edges" or "nodes"
   *        ctx:                 Canvas Context to draw on
   *        settings:            Settings object to use
   *        elements:            Elements to render
   *        graph:               Graph object (necessary for edge rendering)
   *        start:    (optional) Starting index of the elements to render
   *        end:      (optional) Last index of the elements to render
   *      }
   */
  sigma.renderers.canvas.applyRenderers = function(params) {
    var i,
        renderer,
        specialized_renderer,
        def,
        render,
        els = params.elements,
        elementType = (params.elements || params.type == 'edges' ?
              'defaultEdgeType' : 'defaultNodeType');

    params.start = params.start || 0;
    params.end = params.end || params.elements.length;
    params.end = Math.min(params.elements.length, params.end);

    for (renderer in params.renderers) {
      if (params.renderers[renderer].pre) {
        params.renderers[renderer].pre(params.ctx, params.settings);
      }
    }
    for (i = params.start; i < params.end; i++) {
      if (!els[i].hidden) {
        specialized_renderer = params.renderers[
          els[i].type || params.settings(params.options, elementType)
        ];
        def = (specialized_renderer || params.renderers.def);
        render = (def.render || def);
        if (params.type == 'edges') {
          render(
            els[i],
            params.graph.nodes(els[i].source),
            params.graph.nodes(els[i].target),
            params.ctx,
            params.settings
          );
        }else {
          render(
            els[i],
            params.ctx,
            params.settings
          );
        }
      }
    }
    for (renderer in params.renderers) {
      if (params.renderers[renderer].post) {
        params.renderers[renderer].post(params.ctx, params.settings);
      }
    }
  };


  /**
   * Render a batch of edges
   *
   * @param    {integer}               start   Starting index of the edges
   *                                           to render
   * @param    {integer}               end     An object of options.
   * @param    {object}                options An object of options.
   */
  sigma.renderers.canvas.prototype.renderEdges =
          function(start, end, settings) {
    var renderParams = {
      renderers: sigma.canvas.edges,
      type: 'edges',
      elements: this.edgesOnScreen,
      ctx: this.contexts.edges,
      start: start,
      end: end,
      graph: this.graph,
      settings: settings
    };
    sigma.renderers.canvas.applyRenderers(renderParams);
    if (settings('drawEdgeLabels')) {
      renderParams.renderers = sigma.canvas.edges.labels;
      renderParams.ctx = this.contexts.labels;
      sigma.renderers.canvas.applyRenderers(renderParams);
    }
  };

  /**
   * This method renders the graph on the canvases.
   *
   * @param  {?object}                options Eventually an object of options.
   * @return {sigma.renderers.canvas}         Returns the instance itself.
   */
  sigma.renderers.canvas.prototype.render = function(options) {
    options = options || {};

    var a,
        i,
        k,
        l,
        o,
        id,
        end,
        job,
        start,
        edges,
        batchSize,
        tempGCO,
        index = {},
        graph = this.graph,
        nodes = this.graph.nodes,
        prefix = this.options.prefix || '',
        drawEdges = this.settings(options, 'drawEdges'),
        drawNodes = this.settings(options, 'drawNodes'),
        drawLabels = this.settings(options, 'drawLabels'),
        embedSettings = this.settings.embedObjects(options, {
          prefix: this.options.prefix
        });

    // Call the resize function:
    this.resize(false);

    // Check the 'hideEdgesOnMove' setting:
    if (this.settings(options, 'hideEdgesOnMove'))
      if (this.camera.isAnimated || this.camera.isMoving)
        drawEdges = false;

    // Apply the camera's view:
    this.camera.applyView(
      undefined,
      this.options.prefix,
      {
        width: this.width,
        height: this.height
      }
    );

    // Clear canvases:
    this.clear();

    // Kill running jobs:
    for (k in this.jobs)
      if (conrad.hasJob(k))
        conrad.killJob(k);

    // Find which nodes are on screen:
    this.edgesOnScreen = [];
    this.nodesOnScreen = this.camera.quadtree.area(
      this.camera.getRectangle(this.width, this.height)
    );

    for (a = this.nodesOnScreen, i = 0, l = a.length; i < l; i++)
      index[a[i].id] = a[i];

    // Draw edges:
    // - If settings('batchEdgesDrawing') is true, the edges are displayed per
    //   batches. If not, they are drawn in one frame.
    if (drawEdges) {
      // First, let's identify which edges to draw. To do this, we just keep
      // every edges that have at least one extremity displayed according to
      // the quadtree and the "hidden" attribute. We also do not keep hidden
      // edges.
      for (a = graph.edges(), i = 0, l = a.length; i < l; i++) {
        o = a[i];
        if (
          (index[o.source] || index[o.target]) &&
          (!o.hidden && !nodes(o.source).hidden && !nodes(o.target).hidden)
        )
          this.edgesOnScreen.push(o);
      }

      // If the "batchEdgesDrawing" settings is true, edges are batched:
      if (embedSettings('batchEdgesDrawing')) {
        id = 'edges_' + this.conradId;
        batchSize = embedSettings('canvasEdgesBatchSize');

        edges = this.edgesOnScreen;
        l = edges.length;

        start = 0;
        end = Math.min(edges.length, start + batchSize);

        job = function() {
          tempGCO = this.contexts.edges.globalCompositeOperation;
          this.contexts.edges.globalCompositeOperation = 'destination-over';

          this.renderEdges(start, end, embedSettings);

          // Restore original globalCompositeOperation:
          this.contexts.edges.globalCompositeOperation = tempGCO;

          // Catch job's end:
          if (end === edges.length) {
            delete this.jobs[id];
            return false;
          }

          start = end + 1;
          end = Math.min(edges.length, start + batchSize);
          return true;
        };

        this.jobs[id] = job;
        conrad.addJob(id, job.bind(this));

      // If not, they are drawn in one frame:
      } else {
        this.renderEdges(0, this.edgesOnScreen.length, embedSettings);
      }
    }

    // Draw nodes:
    // - No batching
    if (drawNodes) {
      sigma.renderers.canvas.applyRenderers({
        renderers: sigma.canvas.nodes,
        type: 'nodes',
        ctx: this.contexts.nodes,
        elements: this.nodesOnScreen,
        settings: embedSettings
      });
    }

    // Draw labels:
    // - No batching
    if (drawLabels) {
      sigma.renderers.canvas.applyRenderers({
        renderers: sigma.canvas.labels,
        type: 'nodes',
        ctx: this.contexts.labels,
        elements: this.nodesOnScreen,
        settings: embedSettings
      });
    }

    this.dispatchEvent('render');

    return this;
  };

  /**
   * This method creates a DOM element of the specified type, switches its
   * position to "absolute", references it to the domElements attribute, and
   * finally appends it to the container.
   *
   * @param  {string} tag The label tag.
   * @param  {string} id  The id of the element (to store it in "domElements").
   */
  sigma.renderers.canvas.prototype.initDOM = function(tag, id) {
    var dom = document.createElement(tag);

    dom.style.position = 'absolute';
    dom.setAttribute('class', 'sigma-' + id);

    this.domElements[id] = dom;
    this.container.appendChild(dom);

    if (tag.toLowerCase() === 'canvas')
      this.contexts[id] = dom.getContext('2d');
  };

  /**
   * This method resizes each DOM elements in the container and stores the new
   * dimensions. Then, it renders the graph.
   *
   * @param  {?number}                width  The new width of the container.
   * @param  {?number}                height The new height of the container.
   * @return {sigma.renderers.canvas}        Returns the instance itself.
   */
  sigma.renderers.canvas.prototype.resize = function(w, h) {
    var k,
        oldWidth = this.width,
        oldHeight = this.height,
        pixelRatio = 1;
        // TODO:
        // *****
        // This pixelRatio is the solution to display with the good definition
        // on canvases on Retina displays (ie oversampling). Unfortunately, it
        // has a huge performance cost...
        //  > pixelRatio = window.devicePixelRatio || 1;

    if (w !== undefined && h !== undefined) {
      this.width = w;
      this.height = h;
    } else {
      this.width = this.container.offsetWidth;
      this.height = this.container.offsetHeight;

      w = this.width;
      h = this.height;
    }

    if (oldWidth !== this.width || oldHeight !== this.height) {
      for (k in this.domElements) {
        this.domElements[k].style.width = w + 'px';
        this.domElements[k].style.height = h + 'px';

        if (this.domElements[k].tagName.toLowerCase() === 'canvas') {
          this.domElements[k].setAttribute('width', (w * pixelRatio) + 'px');
          this.domElements[k].setAttribute('height', (h * pixelRatio) + 'px');

          if (pixelRatio !== 1)
            this.contexts[k].scale(pixelRatio, pixelRatio);
        }
      }
    }

    return this;
  };

  /**
   * This method clears each canvas.
   *
   * @return {sigma.renderers.canvas} Returns the instance itself.
   */
  sigma.renderers.canvas.prototype.clear = function() {
    var k;

    for (k in this.domElements)
      if (this.domElements[k].tagName === 'CANVAS')
        this.domElements[k].width = this.domElements[k].width;

    return this;
  };

  /**
   * This method kills contexts and other attributes.
   */
  sigma.renderers.canvas.prototype.kill = function() {
    var k,
        captor;

    // Kill captors:
    while ((captor = this.captors.pop()))
      captor.kill();
    delete this.captors;

    // Kill contexts:
    for (k in this.domElements) {
      this.domElements[k].parentNode.removeChild(this.domElements[k]);
      delete this.domElements[k];
      delete this.contexts[k];
    }
    delete this.domElements;
    delete this.contexts;
  };




  /**
   * The labels, nodes and edges renderers are stored in the three following
   * objects. When an element is drawn, its type will be checked and if a
   * renderer with the same name exists, it will be used. If not found, the
   * default renderer will be used instead.
   *
   * They are stored in different files, in the "./canvas" folder.
   */
  sigma.utils.pkg('sigma.canvas.nodes');
  sigma.utils.pkg('sigma.canvas.edges');
  sigma.utils.pkg('sigma.canvas.labels');
}).call(this);
