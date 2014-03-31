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
      throw 'sigma.renderers.canvas: Wrong arguments.';

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
      edges: {}
    };
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
    sigma.misc.bindEvents.call(this, this.options.prefix);
    // sigma.misc.drawHovers.call(this, this.options.prefix);

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
        id,
        end,
        job,
        start,
        edges,
        renderers,
        batchSize,
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

    // Find which nodes are on screen
    this.edgesOnScreen = [];
    this.nodesOnScreen = this.camera.quadtree.area(
      this.camera.getRectangle(this.width, this.height)
    );

    // Display nodes
    if (drawNodes)
      for (i = 0, l = this.nodesOnScreen.length; i < l; i++)
        this.updateDOMElement(
          this.domElements.nodes[this.nodesOnScreen[i].id],
          {
            cx: this.nodesOnScreen[i][prefix + 'x'],
            cy: this.nodesOnScreen[i][prefix + 'y'],
            r: this.nodesOnScreen[i][prefix + 'size']
          }
        );


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
    dom.setAttribute('class', 'sigma-svg');

    // Setting SVG namespace
    dom.setAttribute('xmlns', this.settings('xmlns'));
    dom.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    dom.setAttribute('version', '1.1');

    this.domElements.graph = this.container.appendChild(dom);
  };

  /**
   * This method creates a the necessary SVG DOM elements such as nodes edges
   * and labels.
   *
   * @return {sigma.renderers.svg}            Returns the instance itself.
   */
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
        el,
        a,
        i,
        l;

    // Creating the nodes elements
    renderers = sigma.svg.nodes;
    if (drawNodes)
      for (a = nodes(), i = 0, l = a.length; i < l; i++) {
        el = a[i];
        if (!el.hidden) {
          this.domElements.nodes[el.id] =
            (renderers[el.type] || renderers.def)(
              el,
              this.domElements.graph,
              embedSettings
            );

          // Attaching the nodes elements
          // TODO: display opt or dom inclusion opt
          this.domElements.graph.appendChild(this.domElements.nodes[el.id]);
        }
      }

    // Creating the eges elements
    renderers = sigma.svg.edges;
    if (drawEdges)
      for (a = edges(), i = 0, l = a.length; i < l; i++) {
        el = a[i];
        if (!el.hidden) {
          this.domElements.edges[el.id] =
            (renderers[el.type] || renderers.def)(
              el,
              nodes(el.source),
              nodes(el.target),
              this.domElements.graph,
              embedSettings
            );

          // Attaching the nodes elements
          // TODO: display opt or dom inclusion opt
          this.domElements.graph.appendChild(this.domElements.edges[el.id]);
        }

      }

    return this;
   };

  /**
   * This method update a SVG DOM element's attributes.
   *
   * @param  {DOMElement}                el         The element to update.
   * @param  {object}                    attributes The attributes to update.
   * @return {sigma.renderers.svg}                  Returns the instance itself.
   */
  sigma.renderers.svg.prototype.updateDOMElement = function(el, attributes) {
    var att;

    // TODO: optimize with document fragments later
    for (att in attributes) {
      el.setAttributeNS(null, att, attributes[att]);
    }

    return this;
  };

  /**
   * This method resizes each DOM elements in the container and stores the new
   * dimensions. Then, it renders the graph.
   *
   * @param  {?number}                width  The new width of the container.
   * @param  {?number}                height The new height of the container.
   * @return {sigma.renderers.canvas}        Returns the instance itself.
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
}).call(this);
