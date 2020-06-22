/**
 * Sigma.js WebGL Renderer
 * ========================
 *
 * File implementing sigma's WebGL Renderer.
 */
import graphExtent from "graphology-metrics/extent";
import isGraph from "graphology-utils/is-graph";

import Renderer from "../../renderer";
import Camera from "../../camera";
import MouseCaptor from "../../captors/mouse";
import QuadTree from "../../quadtree";
import { NodeDisplayData, EdgeDisplayData } from "../display-data";

import { assign } from "../../utils";

import { createElement, getPixelRatio, createNormalizationFunction } from "../utils";

import { matrixFromCamera } from "./utils";

import { labelsToDisplayFromGrid, edgeLabelsToDisplayFromNodes } from "../../heuristics/labels";

import { zIndexOrdering } from "../../heuristics/z-index";

import { WEBGL_RENDERER_DEFAULT_SETTINGS, validateWebglRendererSettings } from "./settings";

const { nodeExtent, edgeExtent } = graphExtent;

/**
 * Constants.
 */
const PIXEL_RATIO = getPixelRatio();
const WEBGL_OVERSAMPLING_RATIO = getPixelRatio();

/**
 * Main class.
 *
 * @constructor
 * @param {Graph}       graph     - Graph to render.
 * @param {HTMLElement} container - DOM container in which to render.
 * @param {object}      settings  - Optional settings.
 */
export default class WebGLRenderer extends Renderer {
  settings: { [key: string]: any };
  graph: any;
  captors: any = {};
  container: any;
  elements: any = {};
  contexts: any = {};
  listeners: any = {};
  quadtree: QuadTree = new QuadTree();
  nodeDataCache: any = {};
  edgeDataCache: any = {};
  nodeExtent: any = null;
  edgeExtent: any = null;

  normalizationFunction: any = null;

  // Starting dimensions
  width: number = 0;
  height: number = 0;

  // State
  highlightedNodes: Set<any> = new Set();
  displayedLabels: Set<string> = new Set();
  hoveredNode = null;
  wasRenderedInThisFrame: boolean = false;
  renderFrame: any = null;
  renderHighlightedNodesFrame: any = null;
  needToProcess: boolean = false;
  needToSoftProcess: boolean = false;

  // programs
  nodePrograms: any = {};
  edgePrograms: any = {};

  camera: Camera;

  constructor(graph, container, settings = {}) {
    super();

    this.settings = assign({}, WEBGL_RENDERER_DEFAULT_SETTINGS, settings);

    validateWebglRendererSettings(this.settings);

    // Validating
    if (!isGraph(graph)) throw new Error("sigma/renderers/webgl: invalid graph instance.");

    if (!(container instanceof HTMLElement))
      throw new Error("sigma/renderers/webgl: container should be an html element.");

    // Properties
    this.graph = graph;
    this.container = container;

    this.initializeCache();

    // Initializing contexts
    this.createContext("edges");
    this.createContext("edgeLabels", false);
    this.createContext("nodes");
    this.createContext("labels", false);
    this.createContext("hovers", false);
    this.createContext("mouse", false);

    // Blending
    let gl = this.contexts.nodes;

    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);

    gl = this.contexts.edges;

    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);

    // Loading programs
    for (const type in this.settings.nodeProgramClasses) {
      const NodeProgramClass = this.settings.nodeProgramClasses[type];
      this.nodePrograms[type] = new NodeProgramClass(this.contexts.nodes);
    }
    for (const type in this.settings.edgeProgramClasses) {
      const EdgeProgramClass = this.settings.edgeProgramClasses[type];
      this.edgePrograms[type] = new EdgeProgramClass(this.contexts.edges);
    }

    // Initial resize
    this.resize();

    // Initializing the camera
    this.camera = new Camera();

    // Binding camera events
    this.bindCameraHandlers();

    // Initializing captors
    this.captors = {
      mouse: new MouseCaptor(this.elements.mouse, this.camera),
    };

    // Binding event handlers
    this.bindEventHandlers();

    // Binding graph handlers
    this.bindGraphHandlers();

    // Processing data for the first time & render
    this.process();
    this.render();
  }

  /**---------------------------------------------------------------------------
   * Internal methods.
   **---------------------------------------------------------------------------
   */

  /**
   * Internal function used to create a canvas context and add the relevant
   * DOM elements.
   *
   * @param  {string}  id    - Context's id.
   * @param  {boolean} webgl - Whether the context is a webgl or canvas one.
   * @return {WebGLRenderer}
   */
  createContext(id, webgl = true) {
    const element = createElement("canvas", {
      class: `sigma-${id}`,
      style: {
        position: "absolute",
      },
    });

    this.elements[id] = element;
    this.container.appendChild(element);

    const contextOptions = {
      preserveDrawingBuffer: false,
      antialias: false,
    };

    let context;

    if (webgl) {
      // First we try webgl2 for an easy performance boost
      context = element.getContext("webgl2", contextOptions);

      // Else we fall back to webgl
      if (!context) context = element.getContext("webgl", contextOptions);

      // Edge, I am looking right at you...
      if (!context) context = element.getContext("experimental-webgl", contextOptions);
    } else {
      context = element.getContext("2d", contextOptions);
    }

    this.contexts[id] = context;

    return this;
  }

  /**
   * Method used to initialize display data cache.
   *
   * @return {WebGLRenderer}
   */
  initializeCache() {
    const graph = this.graph;

    const nodes = graph.nodes();

    for (let i = 0, l = nodes.length; i < l; i++) this.nodeDataCache[nodes[i]] = new NodeDisplayData(i, this.settings);

    const edges = graph.edges();

    for (let i = 0, l = edges.length; i < l; i++) this.edgeDataCache[edges[i]] = new EdgeDisplayData(i, this.settings);
  }

  /**
   * Method binding camera handlers.
   *
   * @return {WebGLRenderer}
   */
  bindCameraHandlers() {
    this.listeners.camera = () => {
      this.scheduleRender();
    };

    this.camera.on("updated", this.listeners.camera);

    return this;
  }

  /**
   * Method binding event handlers.
   *
   * @return {WebGLRenderer}
   */
  bindEventHandlers() {
    // Handling window resize
    this.listeners.handleResize = () => {
      this.needToSoftProcess = true;
      this.scheduleRender();
    };

    window.addEventListener("resize", this.listeners.handleResize);

    // Function checking if the mouse is on the given node
    const mouseIsOnNode = (mouseX, mouseY, nodeX, nodeY, size) => {
      return (
        mouseX > nodeX - size &&
        mouseX < nodeX + size &&
        mouseY > nodeY - size &&
        mouseY < nodeY + size &&
        Math.sqrt(Math.pow(mouseX - nodeX, 2) + Math.pow(mouseY - nodeY, 2)) < size
      );
    };

    // Function returning the nodes in the mouse's quad
    const getQuadNodes = (mouseX, mouseY) => {
      const mouseGraphPosition = this.camera.viewportToGraph(this, mouseX, mouseY);

      // TODO: minus 1? lol
      return this.quadtree.point(mouseGraphPosition.x, 1 - mouseGraphPosition.y);
    };

    // Handling mouse move
    this.listeners.handleMove = (e) => {
      // NOTE: for the canvas renderer, testing the pixel's alpha should
      // give some boost but this slows things down for WebGL empirically.

      // TODO: this should be a method from the camera (or can be passed to graph to display somehow)
      const sizeRatio = Math.pow(this.camera.getState().ratio, 0.5);

      const quadNodes = getQuadNodes(e.x, e.y);

      // We will hover the node whose center is closest to mouse
      let minDistance = Infinity,
        nodeToHover = null;

      for (let i = 0, l = quadNodes.length; i < l; i++) {
        const node = quadNodes[i];

        const data = this.nodeDataCache[node];

        const pos = this.camera.graphToViewport(this, data.x, data.y);

        const size = data.size / sizeRatio;

        if (mouseIsOnNode(e.x, e.y, pos.x, pos.y, size)) {
          const distance = Math.sqrt(Math.pow(e.x - pos.x, 2) + Math.pow(e.y - pos.y, 2));

          // TODO: sort by min size also for cases where center is the same
          if (distance < minDistance) {
            minDistance = distance;
            nodeToHover = node;
          }
        }
      }

      if (nodeToHover && this.hoveredNode !== nodeToHover) {
        // Handling passing from one node to the other directly
        if (this.hoveredNode !== null) this.emit("leaveNode", { node: this.hoveredNode });

        this.hoveredNode = nodeToHover;
        this.emit("enterNode", { node: nodeToHover });
        return this.scheduleHighlightedNodesRender();
      }

      // Checking if the hovered node is still hovered
      if (this.hoveredNode) {
        const data = this.nodeDataCache[this.hoveredNode];

        const pos = this.camera.graphToViewport(this, data.x, data.y);

        const size = data.size / sizeRatio;

        if (!mouseIsOnNode(e.x, e.y, pos.x, pos.y, size)) {
          const node = this.hoveredNode;
          this.hoveredNode = null;

          this.emit("leaveNode", { node });
          return this.scheduleHighlightedNodesRender();
        }
      }
    };

    // Handling click
    const createClickListener = (eventType) => {
      return (e) => {
        const sizeRatio = Math.pow(this.camera.getState().ratio, 0.5);

        const quadNodes = getQuadNodes(e.x, e.y);

        for (let i = 0, l = quadNodes.length; i < l; i++) {
          const node = quadNodes[i];

          const data = this.nodeDataCache[node];

          const pos = this.camera.graphToViewport(this, data.x, data.y);

          const size = data.size / sizeRatio;

          if (mouseIsOnNode(e.x, e.y, pos.x, pos.y, size))
            return this.emit(`${eventType}Node`, { node, captor: e, event: e });
        }

        return this.emit(`${eventType}Stage`, { event: e });
      };
    };

    this.listeners.handleClick = createClickListener("click");
    this.listeners.handleRightClick = createClickListener("rightClick");
    this.listeners.handleDown = createClickListener("down");

    this.captors.mouse.on("mousemove", this.listeners.handleMove);
    this.captors.mouse.on("click", this.listeners.handleClick);
    this.captors.mouse.on("rightClick", this.listeners.handleRightClick);
    this.captors.mouse.on("mousedown", this.listeners.handleDown);

    return this;
  }

  /**
   * Method binding graph handlers
   *
   * @return {WebGLRenderer}
   */
  bindGraphHandlers() {
    const graph = this.graph;

    this.listeners.graphUpdate = () => {
      this.needToProcess = true;
      this.scheduleRender();
    };

    this.listeners.softGraphUpdate = () => {
      this.needToSoftProcess = true;
      this.scheduleRender();
    };

    this.listeners.addNodeGraphUpdate = (e) => {
      // Adding entry to cache
      this.nodeDataCache[e.key] = new NodeDisplayData(graph.order - 1, this.settings);

      this.listeners.graphUpdate();
    };

    this.listeners.addEdgeGraphUpdate = (e) => {
      // Adding entry to cache
      this.edgeDataCache[e.key] = new EdgeDisplayData(graph.size - 1, this.settings);

      this.listeners.graphUpdate();
    };

    // TODO: clean cache on drop!

    // TODO: bind this on composed state events
    // TODO: it could be possible to update only specific node etc. by holding
    // a fixed-size pool of updated items
    graph.on("nodeAdded", this.listeners.addNodeGraphUpdate);
    graph.on("nodeDropped", this.listeners.graphUpdate);
    graph.on("nodeAttributesUpdated", this.listeners.softGraphUpdate);
    graph.on("edgeAdded", this.listeners.addEdgeGraphUpdate);
    graph.on("nodeDropped", this.listeners.graphUpdate);
    graph.on("edgeAttributesUpdated", this.listeners.softGraphUpdate);
    graph.on("cleared", this.listeners.graphUpdate);

    return this;
  }

  /**
   * Method used to process the whole graph's data.
   *
   * @return {WebGLRenderer}
   */
  process(keepArrays = false) {
    const graph = this.graph,
      settings = this.settings;

    // Clearing the quad
    this.quadtree.clear();

    // Computing extents
    const nodeExtentProperties = ["x", "y"];

    if (this.settings.zIndex) {
      nodeExtentProperties.push("z");
      this.edgeExtent = edgeExtent(graph, ["z"]);
    }

    this.nodeExtent = nodeExtent(graph, nodeExtentProperties);

    // Rescaling function
    this.normalizationFunction = createNormalizationFunction(this.nodeExtent);

    const nodeProgram = this.nodePrograms[this.settings.defaultNodeType];

    if (!keepArrays) nodeProgram.allocate(graph.order);

    let nodes = graph.nodes();

    // Handling node z-index
    // TODO: z-index needs us to compute display data before hand
    // TODO: remains to be seen if reducers are a good or bad thing and if we
    // should store display data in flat byte arrays indices
    if (this.settings.zIndex)
      nodes = zIndexOrdering(this.edgeExtent.z, (node) => graph.getNodeAttribute(node, "z"), nodes);

    for (let i = 0, l = nodes.length; i < l; i++) {
      const node = nodes[i];

      let data = graph.getNodeAttributes(node);

      const displayData = this.nodeDataCache[node];

      if (settings.nodeReducer) data = settings.nodeReducer(node, data);

      // TODO: should assign default also somewhere here if there is a reducer
      displayData.assign(data);
      this.normalizationFunction.applyTo(displayData);

      this.quadtree.add(node, displayData.x, 1 - displayData.y, displayData.size / this.width);

      nodeProgram.process(displayData, i);

      displayData.index = i;
    }

    nodeProgram.bufferData();

    const edgeProgram = this.edgePrograms[this.settings.defaultEdgeType];

    if (!keepArrays) edgeProgram.allocate(graph.size);

    let edges = graph.edges();

    // Handling edge z-index
    if (this.settings.zIndex)
      edges = zIndexOrdering(this.edgeExtent.z, (edge) => graph.getEdgeAttribute(edge, "z"), edges);

    for (let i = 0, l = edges.length; i < l; i++) {
      const edge = edges[i];

      let data = graph.getEdgeAttributes(edge);

      const displayData = this.edgeDataCache[edge];

      if (settings.edgeReducer) data = settings.edgeReducer(edge, data);

      displayData.assign(data);

      const extremities = graph.extremities(edge),
        sourceData = this.nodeDataCache[extremities[0]],
        targetData = this.nodeDataCache[extremities[1]];

      edgeProgram.process(sourceData, targetData, displayData, i);

      displayData.index = i;
    }

    // Computing edge indices if necessary
    if (!keepArrays && typeof edgeProgram.computeIndices === "function") edgeProgram.computeIndices();

    edgeProgram.bufferData();

    return this;
  }

  /**
   * Method used to process a single node.
   *
   * @return {WebGLRenderer}
   */
  processNode(key) {
    const nodeProgram = this.nodePrograms[this.settings.defaultNodeType];

    const data = this.graph.getNodeAttributes(key);

    nodeProgram.process(data, this.nodeDataCache[key].index);

    return this;
  }

  /**
   * Method used to process a single edge.
   *
   * @return {WebGLRenderer}
   */
  processEdge(key) {
    const graph = this.graph;

    const edgeProgram = this.edgePrograms[this.settings.defaultEdgeType];

    const data = graph.getEdgeAttributes(key),
      extremities = graph.extremities(key),
      sourceData = graph.getNodeAttributes(extremities[0]),
      targetData = graph.getNodeAttributes(extremities[1]);

    edgeProgram.process(sourceData, targetData, data, this.edgeDataCache[key].index);

    return this;
  }

  /**---------------------------------------------------------------------------
   * Public API.
   **---------------------------------------------------------------------------
   */

  /**
   * Method returning the renderer's camera.
   *
   * @return {Camera}
   */
  getCamera() {
    return this.camera;
  }

  /**
   * Method returning the mouse captor.
   *
   * @return {Camera}
   */
  getMouseCaptor() {
    return this.captors.mouse;
  }

  /**
   * Method used to resize the renderer.
   *
   * @param  {number} width  - Target width.
   * @param  {number} height - Target height.
   * @return {WebGLRenderer}
   */
  resize(width?: number, height?: number): WebGLRenderer {
    const previousWidth = this.width,
      previousHeight = this.height;

    if (arguments.length > 1) {
      this.width = width;
      this.height = height;
    } else {
      this.width = this.container.offsetWidth;
      this.height = this.container.offsetHeight;
    }

    if (this.width === 0) throw new Error("sigma/renderers/webgl: container has no width.");

    if (this.height === 0) throw new Error("sigma/renderers/webgl: container has no height.");

    // If nothing has changed, we can stop right here
    if (previousWidth === this.width && previousHeight === this.height) return this;

    // Sizing dom elements
    for (const id in this.elements) {
      const element = this.elements[id];

      element.style.width = this.width + "px";
      element.style.height = this.height + "px";
    }

    // Sizing contexts
    for (const id in this.contexts) {
      const context = this.contexts[id];

      // Canvas contexts
      if (context.scale) {
        this.elements[id].setAttribute("width", this.width * PIXEL_RATIO + "px");
        this.elements[id].setAttribute("height", this.height * PIXEL_RATIO + "px");

        if (PIXEL_RATIO !== 1) context.scale(PIXEL_RATIO, PIXEL_RATIO);
      }

      // WebGL contexts
      else {
        this.elements[id].setAttribute("width", this.width * WEBGL_OVERSAMPLING_RATIO + "px");
        this.elements[id].setAttribute("height", this.height * WEBGL_OVERSAMPLING_RATIO + "px");
      }

      if (context.viewport) {
        context.viewport(0, 0, this.width * WEBGL_OVERSAMPLING_RATIO, this.height * WEBGL_OVERSAMPLING_RATIO);
      }
    }

    return this;
  }

  /**
   * Method used to clear the canvases.
   *
   * @return {WebGLRenderer}
   */
  clear() {
    this.contexts.nodes.clear(this.contexts.nodes.COLOR_BUFFER_BIT);
    this.contexts.edges.clear(this.contexts.edges.COLOR_BUFFER_BIT);
    this.contexts.labels.clearRect(0, 0, this.width, this.height);
    this.contexts.hovers.clearRect(0, 0, this.width, this.height);
    this.contexts.edgeLabels.clearRect(0, 0, this.width, this.height);

    return this;
  }

  /**
   * Method used to render.
   *
   * @return {WebGLRenderer}
   */
  render() {
    // If a render was scheduled, we cancel it
    if (this.renderFrame) {
      cancelAnimationFrame(this.renderFrame);
      this.renderFrame = null;
      this.needToProcess = false;
      this.needToSoftProcess = false;
    }

    // First we need to resize
    this.resize();

    // Clearing the canvases
    this.clear();

    // If we have no nodes we can stop right there
    if (!this.graph.order) return this;

    // TODO: improve this heuristic or move to the captor itself?
    const moving =
      this.camera.isAnimated() ||
      this.captors.mouse.isMoving ||
      this.captors.mouse.hasDragged ||
      this.captors.mouse.wheelLock;

    // Then we need to extract a matrix from the camera
    const cameraState = this.camera.getState(),
      cameraMatrix = matrixFromCamera(cameraState, {
        width: this.width,
        height: this.height,
      });

    let program;

    // Drawing nodes
    program = this.nodePrograms[this.settings.defaultNodeType];

    program.render({
      matrix: cameraMatrix,
      width: this.width,
      height: this.height,
      ratio: cameraState.ratio,
      nodesPowRatio: 0.5,
      scalingRatio: WEBGL_OVERSAMPLING_RATIO,
    });

    // Drawing edges
    if (!this.settings.hideEdgesOnMove || !moving) {
      program = this.edgePrograms[this.settings.defaultEdgeType];

      program.render({
        matrix: cameraMatrix,
        width: this.width,
        height: this.height,
        ratio: cameraState.ratio,
        nodesPowRatio: 0.5,
        edgesPowRatio: 0.5,
        scalingRatio: WEBGL_OVERSAMPLING_RATIO,
      });
    }

    // Do not display labels on move per setting
    if (this.settings.hideLabelsOnMove && moving) return this;

    this.renderLabels();
    this.renderEdgeLabels();
    this.renderHighlightedNodes();

    return this;
  }

  /**
   * Method used to render labels.
   *
   * @return {WebGLRenderer}
   */
  renderLabels() {
    if (!this.settings.renderLabels) return this;

    const cameraState = this.camera.getState();

    // Finding visible nodes to display their labels
    let visibleNodes;

    if (cameraState.ratio >= 1) {
      // Camera is unzoomed so no need to ask the quadtree for visible nodes
      visibleNodes = this.graph.nodes();
    } else {
      // Let's ask the quadtree
      const viewRectangle = this.camera.viewRectangle(this);

      visibleNodes = this.quadtree.rectangle(
        viewRectangle.x1,
        1 - viewRectangle.y1,
        viewRectangle.x2,
        1 - viewRectangle.y2,
        viewRectangle.height,
      );
    }

    // Selecting labels to draw
    const gridSettings = this.settings.labelGrid;

    const labelsToDisplay = labelsToDisplayFromGrid({
      cache: this.nodeDataCache,
      camera: this.camera,
      cell: gridSettings.cell,
      dimensions: this,
      displayedLabels: this.displayedLabels,
      fontSize: this.settings.labelSize,
      graph: this.graph,
      renderedSizeThreshold: gridSettings.renderedSizeThreshold,
      visibleNodes,
    });

    // Drawing labels
    const context = this.contexts.labels;

    const sizeRatio = Math.pow(cameraState.ratio, 0.5);

    for (let i = 0, l = labelsToDisplay.length; i < l; i++) {
      const data = this.nodeDataCache[labelsToDisplay[i]];

      const { x, y } = this.camera.graphToViewport(this, data.x, data.y);

      // TODO: we can cache the labels we need to render until the camera's ratio changes
      // TODO: this should be computed in the canvas components?
      const size = data.size / sizeRatio;

      this.settings.labelRenderer(
        context,
        {
          key: labelsToDisplay[i],
          label: data.label,
          size,
          x,
          y,
        },
        this.settings,
      );
    }

    // Caching visible nodes and displayed labels
    this.displayedLabels = new Set(labelsToDisplay);

    return this;
  }

  /**
   * Method used to render edge labels, based on which node labels were
   * rendered.
   *
   * @return {WebGLRenderer}
   */
  renderEdgeLabels() {
    if (!this.settings.renderEdgeLabels) return this;

    const cameraState = this.camera.getState();
    const sizeRatio = Math.pow(cameraState.ratio, 0.5);

    const context = this.contexts.edgeLabels;

    // Clearing
    context.clearRect(0, 0, this.width, this.height);

    const edgeLabelsToDisplay = edgeLabelsToDisplayFromNodes({
      graph: this.graph,
      hoveredNode: this.hoveredNode,
      displayedNodeLabels: this.displayedLabels,
      highlightedNodes: this.highlightedNodes,
    });

    for (let i = 0, l = edgeLabelsToDisplay.length; i < l; i++) {
      const edge = edgeLabelsToDisplay[i],
        extremities = this.graph.extremities(edge),
        sourceData = this.nodeDataCache[extremities[0]],
        targetData = this.nodeDataCache[extremities[1]],
        edgeData = this.edgeDataCache[edgeLabelsToDisplay[i]];

      const { x: sourceX, y: sourceY } = this.camera.graphToViewport(this, sourceData.x, sourceData.y);
      const { x: targetX, y: targetY } = this.camera.graphToViewport(this, targetData.x, targetData.y);

      // TODO: we can cache the labels we need to render until the camera's ratio changes
      // TODO: this should be computed in the canvas components?
      const size = edgeData.size / sizeRatio;

      this.settings.edgeLabelRenderer(
        context,
        {
          key: edge,
          label: edgeData.label,
          color: edgeData.color,
          size,
        },
        {
          key: extremities[0],
          x: sourceX,
          y: sourceY,
        },
        {
          key: extremities[1],
          x: targetX,
          y: targetY,
        },
        this.settings,
      );
    }

    return this;
  }

  /**
   * Method used to render the highlighted nodes.
   *
   * @return {WebGLRenderer}
   */
  renderHighlightedNodes() {
    const camera = this.camera;

    const sizeRatio = Math.pow(camera.getState().ratio, 0.5);

    const context = this.contexts.hovers;

    // Clearing
    context.clearRect(0, 0, this.width, this.height);

    // Rendering
    const render = (node) => {
      const data = this.nodeDataCache[node];

      const { x, y } = camera.graphToViewport(this, data.x, data.y);

      const size = data.size / sizeRatio;

      this.settings.hoverRenderer(
        context,
        {
          key: node,
          label: data.label,
          color: data.color,
          size,
          x,
          y,
        },
        this.settings,
      );
    };

    if (this.hoveredNode) render(this.hoveredNode);

    this.highlightedNodes.forEach(render);
  }

  /**
   * Method used to schedule a render.
   *
   * @return {WebGLRenderer}
   */
  scheduleRender() {
    // A frame is already scheduled
    if (this.renderFrame) return this;

    // Let's schedule a frame
    this.renderFrame = requestAnimationFrame(() => {
      // Do we need to process data?
      if (this.needToProcess) {
        this.process();
      } else if (this.needToSoftProcess) {
        this.process(true);
      }

      // Resetting state
      this.renderFrame = null;
      this.needToProcess = false;
      this.needToSoftProcess = false;

      // Rendering
      this.render();
    });
  }

  /**
   * Method used to schedule a hover render.
   *
   * @return {WebGLRenderer}
   */
  scheduleHighlightedNodesRender() {
    if (this.renderHighlightedNodesFrame || this.renderFrame) return this;

    this.renderHighlightedNodesFrame = requestAnimationFrame(() => {
      // Resetting state
      this.renderHighlightedNodesFrame = null;

      // Rendering
      this.renderHighlightedNodes();
      this.renderEdgeLabels();
    });
  }

  /**
   * Method used to manually refresh.
   *
   * @return {WebGLRenderer}
   */
  refresh() {
    this.needToSoftProcess = true;
    this.scheduleRender();

    return this;
  }

  /**
   * Method used to highlight a node.
   *
   * @param  {string} key - The node's key.
   * @return {WebGLRenderer}
   */
  highlightNode(key) {
    // TODO: check the existence of the node
    // TODO: coerce?
    this.highlightedNodes.add(key);

    // Rendering
    this.scheduleHighlightedNodesRender();

    return this;
  }

  /**
   * Method used to unhighlight a node.
   *
   * @param  {string} key - The node's key.
   * @return {WebGLRenderer}
   */
  unhighlightNode(key) {
    // TODO: check the existence of the node
    // TODO: coerce?
    this.highlightedNodes.delete(key);

    // Rendering
    this.scheduleHighlightedNodesRender();

    return this;
  }

  /**
   * Method used to shut the container & release event listeners.
   *
   * @return {undefined}
   */
  kill() {
    const graph = this.graph;

    // Emitting "kill" events so that plugins and such can cleanup
    this.emit("kill");

    // Releasing events
    this.removeAllListeners();

    // Releasing camera handlers
    this.camera.removeListener("updated", this.listeners.camera);

    // Releasing DOM events & captors
    window.removeEventListener("resize", this.listeners.handleResize);
    this.captors.mouse.kill();

    // Releasing graph handlers
    graph.removeListener("nodeAdded", this.listeners.addNodeGraphUpdate);
    graph.removeListener("nodeDropped", this.listeners.graphUpdate);
    graph.removeListener("nodeAttributesUpdated", this.listeners.softGraphUpdate);
    graph.removeListener("edgeAdded", this.listeners.addEdgeGraphUpdate);
    graph.removeListener("nodeDropped", this.listeners.graphUpdate);
    graph.removeListener("edgeAttributesUpdated", this.listeners.softGraphUpdate);
    graph.removeListener("cleared", this.listeners.graphUpdate);

    // Releasing cache & state
    this.quadtree = null;
    this.nodeDataCache = null;
    this.edgeDataCache = null;

    this.highlightedNodes = null;
    this.displayedLabels = null;

    // Clearing frames
    if (this.renderFrame) {
      cancelAnimationFrame(this.renderFrame);
      this.renderFrame = null;
    }

    if (this.renderHighlightedNodesFrame) {
      cancelAnimationFrame(this.renderHighlightedNodesFrame);
      this.renderHighlightedNodesFrame = null;
    }

    // Destroying canvases
    const container = this.container;

    while (container.firstChild) container.removeChild(container.firstChild);
  }
}
