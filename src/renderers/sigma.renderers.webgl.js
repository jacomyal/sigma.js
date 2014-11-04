;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

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
  sigma.renderers.webgl = function(graph, camera, settings, options) {
    if (typeof options !== 'object')
      throw 'sigma.renderers.webgl: Wrong arguments.';

    if (!(options.container instanceof HTMLElement))
      throw 'Container not found.';

    var k,
        i,
        l,
        a,
        fn,
        _self = this;

    sigma.classes.dispatcher.extend(this);

    // Conrad related attributes:
    this.jobs = {};

    Object.defineProperty(this, 'conradId', {
      value: sigma.utils.id()
    });

    // Initialize main attributes:
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

    // Find the prefix:
    this.options.prefix = this.camera.readPrefix;

    // Initialize programs hash
    Object.defineProperty(this, 'nodePrograms', {
      value: {}
    });
    Object.defineProperty(this, 'edgePrograms', {
      value: {}
    });
    Object.defineProperty(this, 'nodeFloatArrays', {
      value: {}
    });
    Object.defineProperty(this, 'edgeFloatArrays', {
      value: {}
    });

    // Initialize the DOM elements:
    if (this.settings(options, 'batchEdgesDrawing')) {
      this.initDOM('canvas', 'edges', true);
      this.initDOM('canvas', 'nodes', true);
    } else {
      this.initDOM('canvas', 'scene', true);
      this.contexts.nodes = this.contexts.scene;
      this.contexts.edges = this.contexts.scene;
    }

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

    // Deal with sigma events:
    sigma.misc.bindEvents.call(this, this.camera.prefix);
    sigma.misc.drawHovers.call(this, this.camera.prefix);

    this.resize();
  };




  /**
   * This method will generate the nodes and edges float arrays. This step is
   * separated from the "render" method, because to keep WebGL efficient, since
   * all the camera and middlewares are modelised as matrices and they do not
   * require the float arrays to be regenerated.
   *
   * Basically, when the user moves the camera or applies some specific linear
   * transformations, this process step will be skipped, and the "render"
   * method will efficiently refresh the rendering.
   *
   * And when the user modifies the graph colors or positions (applying a new
   * layout or filtering the colors, for instance), this "process" step will be
   * required to regenerate the float arrays.
   *
   * @return {sigma.renderers.webgl} Returns the instance itself.
   */
  sigma.renderers.webgl.prototype.process = function() {
    var a,
        i,
        l,
        k,
        type,
        renderer,
        graph = this.graph,
        options = sigma.utils.extend(options, this.options);

    // Empty float arrays:
    for (k in this.nodeFloatArrays)
      delete this.nodeFloatArrays[k];

    for (k in this.edgeFloatArrays)
      delete this.edgeFloatArrays[k];

    // Sort edges and nodes per types:
    for (a = graph.edges(), i = 0, l = a.length; i < l; i++) {
      type = a[i].type || this.settings(options, 'defaultEdgeType');
      k = (type && sigma.webgl.edges[type]) ? type : 'def';

      if (!this.edgeFloatArrays[k])
        this.edgeFloatArrays[k] = {
          edges: []
        };

      this.edgeFloatArrays[k].edges.push(a[i]);
    }

    for (a = graph.nodes(), i = 0, l = a.length; i < l; i++) {
      type = a[i].type || this.settings(options, 'defaultNodeType');
      k = (type && sigma.webgl.nodes[type]) ? type : 'def';

      if (!this.nodeFloatArrays[k])
        this.nodeFloatArrays[k] = {
          nodes: []
        };

      this.nodeFloatArrays[k].nodes.push(a[i]);
    }

    // Push edges:
    for (k in this.edgeFloatArrays) {
      renderer = sigma.webgl.edges[k];

      for (a = this.edgeFloatArrays[k].edges, i = 0, l = a.length; i < l; i++) {
        if (!this.edgeFloatArrays[k].array)
          this.edgeFloatArrays[k].array = new Float32Array(
            a.length * renderer.POINTS * renderer.ATTRIBUTES
          );

        // Just check that the edge and both its extremities are visible:
        if (
          !a[i].hidden &&
          !graph.nodes(a[i].source).hidden &&
          !graph.nodes(a[i].target).hidden
        )
          renderer.addEdge(
            a[i],
            graph.nodes(a[i].source),
            graph.nodes(a[i].target),
            this.edgeFloatArrays[k].array,
            i * renderer.POINTS * renderer.ATTRIBUTES,
            options.prefix,
            this.settings
          );
      }
    }

    // Push nodes:
    for (k in this.nodeFloatArrays) {
      renderer = sigma.webgl.nodes[k];

      for (a = this.nodeFloatArrays[k].nodes, i = 0, l = a.length; i < l; i++) {
        if (!this.nodeFloatArrays[k].array)
          this.nodeFloatArrays[k].array = new Float32Array(
            a.length * renderer.POINTS * renderer.ATTRIBUTES
          );

        // Just check that the edge and both its extremities are visible:
        if (
          !a[i].hidden
        )
          renderer.addNode(
            a[i],
            this.nodeFloatArrays[k].array,
            i * renderer.POINTS * renderer.ATTRIBUTES,
            options.prefix,
            this.settings
          );
      }
    }

    return this;
  };




  /**
   * This method renders the graph. It basically calls each program (and
   * generate them if they do not exist yet) to render nodes and edges, batched
   * per renderer.
   *
   * As in the canvas renderer, it is possible to display edges, nodes and / or
   * labels in batches, to make the whole thing way more scalable.
   *
   * @param  {?object}               params Eventually an object of options.
   * @return {sigma.renderers.webgl}        Returns the instance itself.
   */
  sigma.renderers.webgl.prototype.render = function(params) {
    var a,
        i,
        l,
        k,
        o,
        program,
        renderer,
        self = this,
        graph = this.graph,
        nodesGl = this.contexts.nodes,
        edgesGl = this.contexts.edges,
        matrix = this.camera.getMatrix(),
        options = sigma.utils.extend(params, this.options),
        drawLabels = this.settings(options, 'drawLabels'),
        drawEdges = this.settings(options, 'drawEdges'),
        drawNodes = this.settings(options, 'drawNodes');

    // Call the resize function:
    this.resize(false);

    // Check the 'hideEdgesOnMove' setting:
    if (this.settings(options, 'hideEdgesOnMove'))
      if (this.camera.isAnimated || this.camera.isMoving)
        drawEdges = false;

    // Clear canvases:
    this.clear();

    // Translate matrix to [width/2, height/2]:
    matrix = sigma.utils.matrices.multiply(
      matrix,
      sigma.utils.matrices.translation(this.width / 2, this.height / 2)
    );

    // Kill running jobs:
    for (k in this.jobs)
      if (conrad.hasJob(k))
        conrad.killJob(k);

    if (drawEdges) {
      if (this.settings(options, 'batchEdgesDrawing'))
        (function() {
          var a,
              k,
              i,
              id,
              job,
              arr,
              end,
              start,
              renderer,
              batchSize,
              currentProgram;

          id = 'edges_' + this.conradId;
          batchSize = this.settings(options, 'webglEdgesBatchSize');
          a = Object.keys(this.edgeFloatArrays);

          if (!a.length)
            return;
          i = 0;
          renderer = sigma.webgl.edges[a[i]];
          arr = this.edgeFloatArrays[a[i]].array;
          start = 0;
          end = Math.min(
            start + batchSize * renderer.POINTS,
            arr.length / renderer.ATTRIBUTES
          );

          job = function() {
            // Check program:
            if (!this.edgePrograms[a[i]])
              this.edgePrograms[a[i]] = renderer.initProgram(edgesGl);

            if (start < end) {
              edgesGl.useProgram(this.edgePrograms[a[i]]);
              renderer.render(
                edgesGl,
                this.edgePrograms[a[i]],
                arr,
                {
                  settings: this.settings,
                  matrix: matrix,
                  width: this.width,
                  height: this.height,
                  ratio: this.camera.ratio,
                  scalingRatio: this.settings(
                    options,
                    'webglOversamplingRatio'
                  ),
                  start: start,
                  count: end - start
                }
              );
            }

            // Catch job's end:
            if (
              end >= arr.length / renderer.ATTRIBUTES &&
              i === a.length - 1
            ) {
              delete this.jobs[id];
              return false;
            }

            if (end >= arr.length / renderer.ATTRIBUTES) {
              i++;
              arr = this.edgeFloatArrays[a[i]].array;
              renderer = sigma.webgl.edges[a[i]];
              start = 0;
              end = Math.min(
                start + batchSize * renderer.POINTS,
                arr.length / renderer.ATTRIBUTES
              );
            } else {
              start = end;
              end = Math.min(
                start + batchSize * renderer.POINTS,
                arr.length / renderer.ATTRIBUTES
              );
            }

            return true;
          };

          this.jobs[id] = job;
          conrad.addJob(id, job.bind(this));
        }).call(this);
      else {
        for (k in this.edgeFloatArrays) {
          renderer = sigma.webgl.edges[k];

          // Check program:
          if (!this.edgePrograms[k])
            this.edgePrograms[k] = renderer.initProgram(edgesGl);

          // Render
          if (this.edgeFloatArrays[k]) {
            edgesGl.useProgram(this.edgePrograms[k]);
            renderer.render(
              edgesGl,
              this.edgePrograms[k],
              this.edgeFloatArrays[k].array,
              {
                settings: this.settings,
                matrix: matrix,
                width: this.width,
                height: this.height,
                ratio: this.camera.ratio,
                scalingRatio: this.settings(options, 'webglOversamplingRatio')
              }
            );
          }
        }
      }
    }

    if (drawNodes) {
      // Enable blending:
      nodesGl.blendFunc(nodesGl.SRC_ALPHA, nodesGl.ONE_MINUS_SRC_ALPHA);
      nodesGl.enable(nodesGl.BLEND);

      for (k in this.nodeFloatArrays) {
        renderer = sigma.webgl.nodes[k];

        // Check program:
        if (!this.nodePrograms[k])
          this.nodePrograms[k] = renderer.initProgram(nodesGl);

        // Render
        if (this.nodeFloatArrays[k]) {
          nodesGl.useProgram(this.nodePrograms[k]);
          renderer.render(
            nodesGl,
            this.nodePrograms[k],
            this.nodeFloatArrays[k].array,
            {
              settings: this.settings,
              matrix: matrix,
              width: this.width,
              height: this.height,
              ratio: this.camera.ratio,
              scalingRatio: this.settings(options, 'webglOversamplingRatio')
            }
          );
        }
      }
    }

    if (drawLabels) {
      a = this.camera.quadtree.area(
        this.camera.getRectangle(this.width, this.height)
      );

      // Apply camera view to these nodes:
      this.camera.applyView(
        undefined,
        undefined,
        {
          nodes: a,
          edges: [],
          width: this.width,
          height: this.height
        }
      );

      o = function(key) {
        return self.settings({
          prefix: self.camera.prefix
        }, key);
      };

      for (i = 0, l = a.length; i < l; i++)
        if (!a[i].hidden)
          (
            sigma.canvas.labels[
              a[i].type ||
              this.settings(options, 'defaultNodeType')
            ] || sigma.canvas.labels.def
          )(a[i], this.contexts.labels, o);
    }

    this.dispatchEvent('render');

    return this;
  };




  /**
   * This method creates a DOM element of the specified type, switches its
   * position to "absolute", references it to the domElements attribute, and
   * finally appends it to the container.
   *
   * @param  {string}   tag   The label tag.
   * @param  {string}   id    The id of the element (to store it in
   *                          "domElements").
   * @param  {?boolean} webgl Will init the WebGL context if true.
   */
  sigma.renderers.webgl.prototype.initDOM = function(tag, id, webgl) {
    var gl,
        dom = document.createElement(tag),
        self = this;

    dom.style.position = 'absolute';
    dom.setAttribute('class', 'sigma-' + id);

    this.domElements[id] = dom;
    this.container.appendChild(dom);

    if (tag.toLowerCase() === 'canvas') {
      this.contexts[id] = dom.getContext(webgl ? 'experimental-webgl' : '2d', {
        preserveDrawingBuffer: true
      });

      // Adding webgl context loss listeners
      if (webgl) {
        dom.addEventListener('webglcontextlost', function(e) {
          e.preventDefault();
        }, false);

        dom.addEventListener('webglcontextrestored', function(e) {
          self.render();
        }, false);
      }
    }
  };

  /**
   * This method resizes each DOM elements in the container and stores the new
   * dimensions. Then, it renders the graph.
   *
   * @param  {?number}               width  The new width of the container.
   * @param  {?number}               height The new height of the container.
   * @return {sigma.renderers.webgl}        Returns the instance itself.
   */
  sigma.renderers.webgl.prototype.resize = function(w, h) {
    var k,
        oldWidth = this.width,
        oldHeight = this.height;

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
          // If simple 2D canvas:
          if (this.contexts[k] && this.contexts[k].scale) {
            this.domElements[k].setAttribute('width', w + 'px');
            this.domElements[k].setAttribute('height', h + 'px');
          } else {
            this.domElements[k].setAttribute(
              'width',
              (w * this.settings('webglOversamplingRatio')) + 'px'
            );
            this.domElements[k].setAttribute(
              'height',
              (h * this.settings('webglOversamplingRatio')) + 'px'
            );
          }
        }
      }
    }

    // Scale:
    for (k in this.contexts)
      if (this.contexts[k] && this.contexts[k].viewport)
        this.contexts[k].viewport(
          0,
          0,
          this.width * this.settings('webglOversamplingRatio'),
          this.height * this.settings('webglOversamplingRatio')
        );

    return this;
  };

  /**
   * This method clears each canvas.
   *
   * @return {sigma.renderers.webgl} Returns the instance itself.
   */
  sigma.renderers.webgl.prototype.clear = function() {
    var k;

    for (k in this.domElements)
      if (this.domElements[k].tagName === 'CANVAS')
        this.domElements[k].width = this.domElements[k].width;

    this.contexts.nodes.clear(this.contexts.nodes.COLOR_BUFFER_BIT);
    this.contexts.edges.clear(this.contexts.edges.COLOR_BUFFER_BIT);

    return this;
  };

  /**
   * This method kills contexts and other attributes.
   */
  sigma.renderers.webgl.prototype.kill = function() {
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
   * The object "sigma.webgl.nodes" contains the different WebGL node
   * renderers. The default one draw nodes as discs. Here are the attributes
   * any node renderer must have:
   *
   * {number}   POINTS      The number of points required to draw a node.
   * {number}   ATTRIBUTES  The number of attributes needed to draw one point.
   * {function} addNode     A function that adds a node to the data stack that
   *                        will be given to the buffer. Here is the arguments:
   *                        > {object}       node
   *                        > {number}       index   The node index in the
   *                                                 nodes array.
   *                        > {Float32Array} data    The stack.
   *                        > {object}       options Some options.
   * {function} render      The function that will effectively render the nodes
   *                        into the buffer.
   *                        > {WebGLRenderingContext} gl
   *                        > {WebGLProgram}          program
   *                        > {Float32Array} data    The stack to give to the
   *                                                 buffer.
   *                        > {object}       params  An object containing some
   *                                                 options, like width,
   *                                                 height, the camera ratio.
   * {function} initProgram The function that will initiate the program, with
   *                        the relevant shaders and parameters. It must return
   *                        the newly created program.
   *
   * Check sigma.webgl.nodes.def or sigma.webgl.nodes.fast to see how it
   * works more precisely.
   */
  sigma.utils.pkg('sigma.webgl.nodes');




  /**
   * The object "sigma.webgl.edges" contains the different WebGL edge
   * renderers. The default one draw edges as direct lines. Here are the
   * attributes any edge renderer must have:
   *
   * {number}   POINTS      The number of points required to draw an edge.
   * {number}   ATTRIBUTES  The number of attributes needed to draw one point.
   * {function} addEdge     A function that adds an edge to the data stack that
   *                        will be given to the buffer. Here is the arguments:
   *                        > {object}       edge
   *                        > {object}       source
   *                        > {object}       target
   *                        > {Float32Array} data    The stack.
   *                        > {object}       options Some options.
   * {function} render      The function that will effectively render the edges
   *                        into the buffer.
   *                        > {WebGLRenderingContext} gl
   *                        > {WebGLProgram}          program
   *                        > {Float32Array} data    The stack to give to the
   *                                                 buffer.
   *                        > {object}       params  An object containing some
   *                                                 options, like width,
   *                                                 height, the camera ratio.
   * {function} initProgram The function that will initiate the program, with
   *                        the relevant shaders and parameters. It must return
   *                        the newly created program.
   *
   * Check sigma.webgl.edges.def or sigma.webgl.edges.fast to see how it
   * works more precisely.
   */
  sigma.utils.pkg('sigma.webgl.edges');




  /**
   * The object "sigma.canvas.labels" contains the different
   * label renderers for the WebGL renderer. Since displaying texts in WebGL is
   * definitely painful and since there a way less labels to display than nodes
   * or edges, the default renderer simply renders them in a canvas.
   *
   * A labels renderer is a simple function, taking as arguments the related
   * node, the renderer and a settings function.
   */
  sigma.utils.pkg('sigma.canvas.labels');
}).call(this);
