import conrad from "conrad";
import Dispatcher from "../../classes/Dispatcher";
import id from "../../utils/misc/id";
import getPixelRatio from "../../utils/events/getPixelRatio";

/**
 * This function is the constructor of the canvas sigma's renderer.
 *
 * @param  {graph}            graph    The graph to render.
 * @param  {camera}           camera   The camera.
 * @param  {configurable}           settings The sigma instance settings
 *                                           function.
 * @param  {object}                 object   The options object.
 * @return {Canvas}          The renderer instance.
 */
export default sigma => {
  function CanvasRenderer(graph, camera, settings, options) {
    if (typeof options !== "object")
      throw new Error("Canvas: Wrong arguments.");

    if (!(options.container instanceof HTMLElement))
      throw new Error("Container not found.");

    let k;
    let i;
    let l;
    let a;
    let fn;
    const self = this;

    Dispatcher.extend(this);

    // Initialize main attributes:
    Object.defineProperty(this, "conradId", {
      value: id()
    });
    this.graph = graph;
    this.camera = camera;
    this.contexts = {};
    this.domElements = {};
    this.options = options;
    this.container = this.options.container;
    this.settings =
      typeof options.settings === "object" && options.settings
        ? settings.embedObjects(options.settings)
        : settings;

    // Node indexes:
    this.nodesOnScreen = [];
    this.edgesOnScreen = [];

    // Conrad related attributes:
    this.jobs = {};

    // Find the prefix:
    this.options.prefix = `renderer${this.conradId}:`;

    // Initialize the DOM elements:
    if (!this.settings("batchEdgesDrawing")) {
      this.initDOM("canvas", "scene");
      this.contexts.edges = this.contexts.scene;
      this.contexts.nodes = this.contexts.scene;
      this.contexts.labels = this.contexts.scene;
    } else {
      this.initDOM("canvas", "edges");
      this.initDOM("canvas", "scene");
      this.contexts.nodes = this.contexts.scene;
      this.contexts.labels = this.contexts.scene;
    }

    this.initDOM("canvas", "mouse");
    this.contexts.hover = this.contexts.mouse;

    // Initialize captors:
    this.captors = [];
    a = this.options.captors || [sigma.captors.mouse, sigma.captors.touch];
    for (i = 0, l = a.length; i < l; i++) {
      fn = typeof a[i] === "function" ? a[i] : sigma.captors[a[i]];
      this.captors.push(
        new fn(this.domElements.mouse, this.camera, this.settings)
      );
    }

    // Deal with sigma events:
    sigma.misc.bindEvents.call(this, this.options.prefix);
    sigma.misc.drawHovers.call(this, this.options.prefix);

    this.resize(false);
  }

  /**
   * This method renders the graph on the canvases.
   *
   * @param  {?object}                options Eventually an object of options.
   * @return {Canvas}         Returns the instance itself.
   */
  CanvasRenderer.prototype.render = function render(options) {
    options = options || {};

    let a;

    let i;

    let k;

    let l;

    let o;

    let id;

    let end;

    let job;

    let start;

    let edges;

    let renderers;

    let rendererType;

    let batchSize;

    let tempGCO;

    const index = {};

    const graph = this.graph;

    const nodes = this.graph.nodes;

    const prefix = this.options.prefix || "";

    let drawEdges = this.settings(options, "drawEdges");

    const drawNodes = this.settings(options, "drawNodes");

    const drawLabels = this.settings(options, "drawLabels");

    const drawEdgeLabels = this.settings(options, "drawEdgeLabels");

    const embedSettings = this.settings.embedObjects(options, {
      prefix: this.options.prefix
    });

    // Call the resize function:
    this.resize(false);

    // Check the 'hideEdgesOnMove' setting:
    if (this.settings(options, "hideEdgesOnMove"))
      if (this.camera.isAnimated || this.camera.isMoving) drawEdges = false;

    // Apply the camera's view:
    this.camera.applyView(undefined, this.options.prefix, {
      width: this.width,
      height: this.height
    });

    // Clear canvases:
    this.clear();

    // Kill running jobs:
    for (k in this.jobs) if (conrad.hasJob(k)) conrad.killJob(k);

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
      if (this.settings(options, "batchEdgesDrawing")) {
        id = `edges_${this.conradId}`;
        batchSize = embedSettings("canvasEdgesBatchSize");

        edges = this.edgesOnScreen;
        l = edges.length;

        start = 0;
        end = Math.min(edges.length, start + batchSize);

        job = function job() {
          tempGCO = this.contexts.edges.globalCompositeOperation;
          this.contexts.edges.globalCompositeOperation = "destination-over";

          renderers = sigma.canvas.edges;
          for (i = start; i < end; i++) {
            o = edges[i];
            (renderers[o.type || this.settings(options, "defaultEdgeType")] ||
              renderers.def)(
              o,
              graph.nodes(o.source),
              graph.nodes(o.target),
              this.contexts.edges,
              embedSettings
            );
          }

          // Draw edge labels:
          if (drawEdgeLabels) {
            renderers = sigma.canvas.edges.labels;
            for (i = start; i < end; i++) {
              o = edges[i];
              if (!o.hidden)
                (renderers[
                  o.type || this.settings(options, "defaultEdgeType")
                ] || renderers.def)(
                  o,
                  graph.nodes(o.source),
                  graph.nodes(o.target),
                  this.contexts.labels,
                  embedSettings
                );
            }
          }

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
        renderers = sigma.canvas.edges;
        for (a = this.edgesOnScreen, i = 0, l = a.length; i < l; i++) {
          o = a[i];
          (renderers[o.type || this.settings(options, "defaultEdgeType")] ||
            renderers.def)(
            o,
            graph.nodes(o.source),
            graph.nodes(o.target),
            this.contexts.edges,
            embedSettings
          );
        }

        // Draw edge labels:
        // - No batching
        if (drawEdgeLabels) {
          renderers = sigma.canvas.edges.labels;
          for (a = this.edgesOnScreen, i = 0, l = a.length; i < l; i++)
            if (!a[i].hidden)
              (renderers[
                a[i].type || this.settings(options, "defaultEdgeType")
              ] || renderers.def)(
                a[i],
                graph.nodes(a[i].source),
                graph.nodes(a[i].target),
                this.contexts.labels,
                embedSettings
              );
        }
      }
    }

    // Draw nodes:
    // - No batching
    if (drawNodes) {
      renderers = sigma.canvas.nodes;
      for (a = this.nodesOnScreen, i = 0, l = a.length; i < l; i++)
        if (!a[i].hidden)
          (renderers[a[i].type || this.settings(options, "defaultNodeType")] ||
            renderers.def)(a[i], this.contexts.nodes, embedSettings);
    }

    // Draw labels:
    // - No batching
    if (drawLabels) {
      renderers = sigma.canvas.labels;
      for (a = this.nodesOnScreen, i = 0, l = a.length; i < l; i++)
        if (!a[i].hidden)
          (renderers[a[i].type || this.settings(options, "defaultNodeType")] ||
            renderers.def)(a[i], this.contexts.labels, embedSettings);
    }

    this.dispatchEvent("render");

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
  CanvasRenderer.prototype.initDOM = function initDOM(tag, id) {
    const dom = document.createElement(tag);

    dom.style.position = "absolute";
    dom.setAttribute("class", `sigma-${id}`);

    this.domElements[id] = dom;
    this.container.appendChild(dom);

    if (tag.toLowerCase() === "canvas")
      this.contexts[id] = dom.getContext("2d");
  };

  /**
   * This method resizes each DOM elements in the container and stores the new
   * dimensions. Then, it renders the graph.
   *
   * @param  {?number}                width  The new width of the container.
   * @param  {?number}                height The new height of the container.
   * @return {Canvas}        Returns the instance itself.
   */
  CanvasRenderer.prototype.resize = function resize(w, h) {
    let k;

    const oldWidth = this.width;
    const oldHeight = this.height;
    const pixelRatio = getPixelRatio();

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
        this.domElements[k].style.width = `${w}px`;
        this.domElements[k].style.height = `${h}px`;

        if (this.domElements[k].tagName.toLowerCase() === "canvas") {
          this.domElements[k].setAttribute("width", `${w * pixelRatio}px`);
          this.domElements[k].setAttribute("height", `${h * pixelRatio}px`);

          if (pixelRatio !== 1) this.contexts[k].scale(pixelRatio, pixelRatio);
        }
      }
    }

    return this;
  };

  /**
   * This method clears each canvas.
   *
   * @return {Canvas} Returns the instance itself.
   */
  CanvasRenderer.prototype.clear = function clear() {
    for (const k in this.contexts) {
      this.contexts[k].clearRect(0, 0, this.width, this.height);
    }

    return this;
  };

  /**
   * This method kills contexts and other attributes.
   */
  CanvasRenderer.prototype.kill = function kill() {
    let k;
    let captor;

    // Kill captors:
    while ((captor = this.captors.pop())) captor.kill();
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

  return CanvasRenderer;
};
