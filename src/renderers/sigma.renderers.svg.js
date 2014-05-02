;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  if (typeof conrad === 'undefined')
    throw 'conrad is not declared';

  // Initialize packages:
  sigma.utils.pkg('sigma.renderers');

  /**
   * This function is the constructor of the svg sigma's renderer.
   *
   * @param  {sigma.classes.graph}            graph    The graph to render.
   * @param  {sigma.classes.camera}           camera   The camera.
   * @param  {configurable}           settings The sigma instance settings
   *                                           function.
   * @param  {object}                 object   The options object.
   * @return {sigma.renderers.svg}             The renderer instance.
   */
  sigma.renderers.svg = function(graph, camera, settings, options) {
    if (typeof options !== 'object')
      throw 'sigma.renderers.svg: Wrong arguments.';

    if (!(options.container instanceof HTMLElement))
      throw 'Container not found.';

    var i,
        l,
        a,
        fn,
        self = this;

    sigma.classes.dispatcher.extend(this);

    // Initialize main attributes:
    this.graph = graph;
    this.camera = camera;
    this.domElements = {
      graph: null,
      nodes: {},
      edges: {},
      labels: {},
      hovers: {}
    };
    this.measurementCanvas = null;
    this.options = options;
    this.container = this.options.container;
    this.settings = (
        typeof options.settings === 'object' &&
        options.settings
      ) ?
        settings.embedObjects(options.settings) :
        settings;

    // SVG xmlns
    this.settings('xmlns', 'http://www.w3.org/2000/svg');

    // Indexes:
    this.nodesOnScreen = [];
    this.edgesOnScreen = [];

    // Find the prefix:
    this.options.prefix = 'renderer' + sigma.utils.id() + ':';

    // Initialize the DOM elements
    this.initDOM('svg');
    this.createDOMElements();

    // Initialize captors:
    this.captors = [];
    a = this.options.captors || [sigma.captors.mouse, sigma.captors.touch];
    for (i = 0, l = a.length; i < l; i++) {
      fn = typeof a[i] === 'function' ? a[i] : sigma.captors[a[i]];
      this.captors.push(
        new fn(
          this.domElements.graph,
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
    // TODO: keep an option to override the DOM events?
    sigma.misc.bindDOMEvents.call(this, this.domElements.graph);
    this.bindHovers(this.options.prefix);

    // Resize
    this.resize(false);
  };

  /**
   * This method renders the graph on the svg scene.
   *
   * @param  {?object}                options Eventually an object of options.
   * @return {sigma.renderers.svg}            Returns the instance itself.
   */
  sigma.renderers.svg.prototype.render = function(options) {
    options = options || {};

    var a,
        i,
        k,
        l,
        o,
        source,
        target,
        start,
        edges,
        renderers,
        subrenderers,
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

    // Hiding everything
    this.hideDOMElements(this.domElements.nodes, sigma.svg.nodes);
    this.hideDOMElements(this.domElements.edges, sigma.svg.edges);
    this.hideDOMElements(this.domElements.labels, sigma.svg.labels);

    // Find which nodes are on screen
    this.edgesOnScreen = [];
    this.nodesOnScreen = this.camera.quadtree.area(
      this.camera.getRectangle(this.width, this.height)
    );

    // Node index
    for (a = this.nodesOnScreen, i = 0, l = a.length; i < l; i++)
      index[a[i].id] = a[i];

    // Find which edges are on screen
    for (a = graph.edges(), i = 0, l = a.length; i < l; i++) {
      o = a[i];
      if (
        (index[o.source] || index[o.target]) &&
        (!o.hidden && !nodes(o.source).hidden && !nodes(o.target).hidden)
      )
        this.edgesOnScreen.push(o);
    }

    // Display nodes
    renderers = sigma.svg.nodes;
    subrenderers = sigma.svg.labels;
    if (drawNodes)
      for (a = this.nodesOnScreen, i = 0, l = a.length; i < l; i++) {

        // Node
        (renderers[a.type] || renderers.def).update(
          a[i],
          this.domElements.nodes[a[i].id],
          embedSettings
        );

        // Label
        (subrenderers[a.type] || subrenderers.def).update(
          a[i],
          this.domElements.labels[a[i].id],
          embedSettings
        );
      }

    // Display edges
    renderers = sigma.svg.edges;
    if (drawEdges)
      for (a = this.edgesOnScreen, i = 0, l = a.length; i < l; i++) {
        source = nodes(a[i].source);
        target = nodes(a[i].target);

        (renderers[a[i].type] || renderers.def).update(
          a[i],
          this.domElements.edges[a[i].id],
          source,
          target,
          embedSettings
        );
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
  sigma.renderers.svg.prototype.initDOM = function(tag) {
    var dom = document.createElementNS(this.settings('xmlns'), tag);

    dom.style.position = 'absolute';
    dom.setAttribute('class', this.settings('classPrefix') + '-svg');

    // Setting SVG namespace
    dom.setAttribute('xmlns', this.settings('xmlns'));
    dom.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    dom.setAttribute('version', '1.1');

    // Creating the measurement canvas
    var canvas = document.createElement('canvas');
    canvas.setAttribute('class', 'sigma-measurement-canvas');

    // Appending elements
    this.domElements.graph = this.container.appendChild(dom);
    this.container.appendChild(canvas);
    this.measurementCanvas = canvas.getContext('2d');
  };

  /**
   * This method creates a the necessary SVG DOM elements such as nodes edges
   * and labels.
   *
   * @return {sigma.renderers.svg}            Returns the instance itself.
   */

   // TODO: Append labels after nodes for z-index purposes
   sigma.renderers.svg.prototype.createDOMElements = function() {
    var nodes = this.graph.nodes,
        edges = this.graph.edges,
        prefix = this.options.prefix || '',
        drawEdges = this.settings('drawEdges'),
        drawNodes = this.settings('drawNodes'),
        drawLabels = this.settings('drawLabels'),
        embedSettings = this.settings.embedObjects({
          prefix: this.options.prefix
        });

    var renderers,
        o,
        a,
        i,
        l;

    // Creating the edges elements
    renderers = sigma.svg.edges;
    if (drawEdges)
      for (a = edges(), i = 0, l = a.length; i < l; i++) {
        o = a[i];
        if (!o.hidden) {
          this.domElements.edges[o.id] =
            (renderers[o.type] || renderers.def).create(
              o,
              nodes(o.source),
              nodes(o.target),
              embedSettings
            );

          // Attaching the nodes elements
          // TODO: display opt or dom inclusion opt
          this.domElements.graph.appendChild(this.domElements.edges[o.id]);
        }

      }

    // Creating the nodes elements
    renderers = sigma.svg.nodes;
    if (drawNodes)
      for (a = nodes(), i = 0, l = a.length; i < l; i++) {
        o = a[i];
        if (!o.hidden) {
          this.domElements.nodes[o.id] =
            (renderers[o.type] || renderers.def).create(
              o,
              embedSettings
            );

          // Attaching the nodes elements
          // TODO: display opt or dom inclusion opt
          this.domElements.graph.appendChild(this.domElements.nodes[o.id]);
        }
      }

    // Creating the labels elements
    renderers = sigma.svg.labels;
    if (drawLabels)
      for (i = 0; i < l; i++) {
        o = a[i];
        if (!o.hidden) {
          this.domElements.labels[o.id] =
            (renderers[o.type] || renderers.def).create(
              o,
              embedSettings
            );

          // Attaching the label elements
          // TODO: display opt or dom inclusion opt
          this.domElements.graph.appendChild(this.domElements.labels[o.id]);
        }

      }

    return this;
   };

  /**
   * This method hides a batch of SVG DOM elements.
   *
   * @param  {array}                  elements  An array of elements to hide.
   * @param  {object}                 renderer  The renderer to use.
   * @return {sigma.renderers.svg}              Returns the instance itself.
   */
  sigma.renderers.svg.prototype.hideDOMElements = function(elements, renderer) {
    var o,
        i;

    for (i in elements) {
      o = elements[i];
      (renderer[o.type] || renderer.def).hide(o);
    }

    return this;
  };

  /**
   * This method binds the hover events to the renderer.
   *
   * @param  {string} prefix The renderer prefix.
   */
  // TODO: add option about whether to display hovers or not
  sigma.renderers.svg.prototype.bindHovers = function(prefix) {
    var renderers = sigma.svg.hovers,
        self = this;

    function overNode(e) {
      var node = e.data.node,
          embedSettings = self.settings.embedObjects({
            prefix: prefix
          });

      if (!embedSettings('enableHovering'))
        return;

      var hover = (renderers[node.type] || renderers.def).create(
        node,
        self.measurementCanvas,
        embedSettings
      );

      self.domElements.hovers[node.id] = hover;

      // Inserting the hover in the dom
      self.domElements.graph.appendChild(hover);
    }

    function outNode(e) {
      var node = e.data.node,
          embedSettings = self.settings.embedObjects({
            prefix: prefix
          });

      if (!embedSettings('enableHovering'))
        return;

      // Deleting element
      self.domElements.graph.removeChild(
        self.domElements.hovers[node.id]
      );
      delete self.domElements.hovers[node.id];
    }

    // Binding events
    this.bind('overNode', overNode);
    this.bind('outNode', outNode);
  };

  /**
   * This method resizes each DOM elements in the container and stores the new
   * dimensions. Then, it renders the graph.
   *
   * @param  {?number}                width  The new width of the container.
   * @param  {?number}                height The new height of the container.
   * @return {sigma.renderers.svg}           Returns the instance itself.
   */
  sigma.renderers.svg.prototype.resize = function(w, h) {
    var oldWidth = this.width,
        oldHeight = this.height,
        pixelRatio = 1;

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
      this.domElements.graph.style.width = w + 'px';
      this.domElements.graph.style.height = h + 'px';

      if (this.domElements.graph.tagName.toLowerCase() === 'svg') {
        this.domElements.graph.setAttribute('width', (w * pixelRatio));
        this.domElements.graph.setAttribute('height', (h * pixelRatio));
      }
    }

    return this;
  };


  /**
   * The labels, nodes and edges renderers are stored in the three following
   * objects. When an element is drawn, its type will be checked and if a
   * renderer with the same name exists, it will be used. If not found, the
   * default renderer will be used instead.
   *
   * They are stored in different files, in the "./svg" folder.
   */
  sigma.utils.pkg('sigma.svg.nodes');
  sigma.utils.pkg('sigma.svg.edges');
  sigma.utils.pkg('sigma.svg.labels');
}).call(this);
