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
    this.initDOM('canvas', 'edges');
    this.initDOM('canvas', 'nodes');
    this.initDOM('canvas', 'labels');
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

    // Bind resize:
    window.addEventListener('resize', function() {
      self.resize();
    });

    // Deal with sigma events:
    sigma.misc.bindEvents.call(this, this.options.prefix);
    sigma.misc.drawHovers.call(this, this.options.prefix);

    this.resize(false);
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
        index = {},
        graph = this.graph,
        prefix = this.options.prefix || '',
        drawEdges = this.settings(options, 'drawEdges'),
        drawNodes = this.settings(options, 'drawNodes'),
        drawLabels = this.settings(options, 'drawLabels');

    // Check the 'hideEdgesOnMove' setting:
    if (this.settings(options, 'hideEdgesOnMove'))
      if (this.camera.isAnimated || this.camera.isMoving)
        drawEdges = 0;

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

    if (drawEdges)
      for (a = graph.edges(), i = 0, l = a.length; i < l; i++) {
        o = a[i];
        if (index[o.source] || index[o.target])
          this.edgesOnScreen.push(o);
      }

    if (drawEdges)
      this.drawEdges(drawEdges === 2, options);
    if (drawNodes)
      this.drawNodes(drawNodes === 2, options);
    if (drawLabels)
      this.drawLabels(drawLabels === 2, options);

    this.dispatchEvent('render');

    return this;
  };

  sigma.renderers.canvas.prototype.drawEdges = function(synchronous, options) {
    var a,
        i,
        l,
        o,
        id,
        job,
        end,
        start,
        graph = this.graph,
        renderers = sigma.canvas.edges,
        embedSettings = this.settings.embedObjects(options, {
          prefix: this.options.prefix
        }),
        batchSize = embedSettings('canvasEdgesBatchSize');

    if (synchronous)
      for (a = this.edgesOnScreen, i = 0, l = a.length; i < l; i++) {
        o = a[i];
        (renderers[o.type] || renderers.def)(
          o,
          graph.nodes(o.source),
          graph.nodes(o.target),
          this.contexts.edges,
          embedSettings
        );
      }
    else {
      id = 'edges_' + this.conradId;

      a = this.edgesOnScreen;
      l = a.length;

      start = 0;
      end = Math.min(a.length, start + batchSize);

      job = function() {
        for (i = start; i < end; i++) {
          o = a[i];
          (renderers[o.type] || renderers.def)(
            o,
            graph.nodes(o.source),
            graph.nodes(o.target),
            this.contexts.edges,
            embedSettings
          );
        }

        // Catch job's end:
        if (end === a.length) {
          delete this.jobs[id];
          return false;
        }

        start = end + 1;
        end = Math.min(a.length, start + batchSize);
        return true;
      };

      this.jobs[id] = job;
      conrad.addJob(id, job.bind(this));
    }
  };

  sigma.renderers.canvas.prototype.drawNodes = function(synchronous, options) {
    var a,
        i,
        l,
        o,
        renderers = sigma.canvas.nodes,
        embedSettings = this.settings.embedObjects(options, {
          prefix: this.options.prefix
        }),
        batchSize = embedSettings('canvasNodesBatchSize');

    if (synchronous)
      for (a = this.nodesOnScreen, i = 0, l = a.length; i < l; i++)
        (renderers[a[i].type] || renderers.def)(
          a[i],
          this.contexts.nodes,
          embedSettings
        );
    else {
      id = 'nodes_' + this.conradId;

      a = this.nodesOnScreen;
      l = a.length;

      start = 0;
      end = Math.min(a.length, start + batchSize);

      job = function() {
        for (i = start; i < end; i++)
          (renderers[a[i].type] || renderers.def)(
            a[i],
            this.contexts.nodes,
            embedSettings
          );

        // Catch job's end:
        if (end === a.length) {
          delete this.jobs[id];
          return false;
        }

        start = end + 1;
        end = Math.min(a.length, start + batchSize);
        return true;
      };

      this.jobs[id] = job;
      conrad.addJob(id, job.bind(this));
    }
  };

  sigma.renderers.canvas.prototype.drawLabels = function(synchronous, options) {
    var a,
        i,
        l,
        o,
        renderers = sigma.canvas.labels,
        embedSettings = this.settings.embedObjects(options, {
          prefix: this.options.prefix
        }),
        batchSize = embedSettings('canvasLabelsBatchSize');

    if (synchronous)
      for (a = this.nodesOnScreen, i = 0, l = a.length; i < l; i++)
        (renderers[a[i].type] || renderers.def)(
          a[i],
          this.contexts.labels,
          embedSettings
        );
    else {
      id = 'labels_' + this.conradId;

      a = this.nodesOnScreen;
      l = a.length;

      start = 0;
      end = Math.min(a.length, start + batchSize);

      job = function() {
        for (i = start; i < end; i++)
          (renderers[a[i].type] || renderers.def)(
            a[i],
            this.contexts.labels,
            embedSettings
          );

        // Catch job's end:
        if (end === a.length) {
          delete this.jobs[id];
          return false;
        }

        start = end + 1;
        end = Math.min(a.length, start + batchSize);
        return true;
      };

      this.jobs[id] = job;
      conrad.addJob(id, job.bind(this));
    }
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
