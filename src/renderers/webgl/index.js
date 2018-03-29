/**
 * Sigma.js WebGL Renderer
 * ========================
 *
 * File implementing sigma's WebGL Renderer.
 */
import nodeExtent from 'graphology-metrics/extent';

import Renderer from '../../renderer';
import Camera from '../../camera';
import MouseCaptor from '../../captors/mouse';
import QuadTree from '../../quadtree';
import NodeProgram from './programs/node.fast';
import EdgeProgram from './programs/edge';

import drawLabel from '../canvas/components/label';
import drawHover from '../canvas/components/hover';

import {
  assign
} from '../../utils';

import {
  createElement,
  getPixelRatio,
  createNormalizationFunction
} from '../utils';

import {
  matrixFromCamera
} from './utils';

import {
  labelsToDisplayFromGrid
} from '../../heuristics/labels';

/**
 * Constants.
 */
const PIXEL_RATIO = getPixelRatio();
const WEBGL_OVERSAMPLING_RATIO = getPixelRatio();

/**
 * Defaults.
 */
const DEFAULT_SETTINGS = {
  hideEdgesOnMove: false,
  hideLabelsOnMove: false
};

/**
 * Main class.
 *
 * @constructor
 * @param {HTMLElement} container - The graph's container.
 */
export default class WebGLRenderer extends Renderer {
  constructor(container, settings) {
    super();

    settings = settings || {};

    this.settings = assign({}, DEFAULT_SETTINGS, settings);

    // Validating
    if (!(container instanceof HTMLElement))
      throw new Error('sigma/renderers/webgl: container should be an html element.');

    // Properties
    this.sigma = null;
    this.captors = {};
    this.container = container;
    this.elements = {};
    this.contexts = {};
    this.listeners = {};

    // Indices
    // TODO: this could be improved by key => index => floatArray
    // TODO: the cache should erase keys on node delete
    this.quadtree = new QuadTree();
    this.nodeOrder = {};
    this.nodeDataCache = {};
    this.edgeOrder = {};

    // Normalization function
    this.normalizationFunction = null;

    // Starting dimensions
    this.width = 0;
    this.height = 0;

    // State
    this.highlightedNodes = new Set();
    this.previousVisibleNodes = new Set();
    this.displayedLabels = new Set();
    this.hoveredNode = null;
    this.wasRenderedInThisFrame = false;
    this.renderFrame = null;
    this.renderHighlightedNodesFrame = null;
    this.needToProcess = false;
    this.needToSoftProcess = false;

    // Initializing contexts
    this.createContext('edges');
    this.createContext('nodes');
    this.createContext('labels', false);
    this.createContext('hovers', false);
    this.createContext('mouse', false);

    // Blending
    let gl = this.contexts.nodes;

    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);

    gl = this.contexts.edges;

    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);

    // Loading programs
    this.nodePrograms = {
      def: new NodeProgram(this.contexts.nodes)
    };
    this.edgePrograms = {
      def: new EdgeProgram(this.contexts.edges)
    };

    // Initial resize
    this.resize();

    // Initializing the camera
    this.camera = new Camera({
      width: this.width,
      height: this.height
    });

    // Binding camera events
    this.bindCameraHandlers();

    // Initializing captors
    this.captors = {
      mouse: new MouseCaptor(this.elements.mouse, this.camera)
    };

    // Binding event handlers
    this.bindEventHandlers();
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
    const element = createElement('canvas', {
      class: `sigma-${id}`,
      style: {
        position: 'absolute'
      }
    });

    this.elements[id] = element;
    this.container.appendChild(element);

    const contextOptions = {
      preserveDrawingBuffer: true,
      antialias: false
    };

    let context;

    if (webgl) {
      context = element.getContext('webgl', contextOptions);

      // Edge, I am looking right at you...
      if (!context)
        context = element.getContext('experimental-webgl', contextOptions);
    }
    else {
      context = element.getContext('2d', contextOptions);
    }

    this.contexts[id] = context;

    return this;
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

    this.camera.on('updated', this.listeners.camera);

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

    window.addEventListener('resize', this.listeners.handleResize);

    // Function checking if the mouse is on the given node
    const mouseIsOnNode = (mouseX, mouseY, nodeX, nodeY, size) => {
      return (
        mouseX > nodeX - size &&
        mouseX < nodeX + size &&
        mouseY > nodeY - size &&
        mouseY < nodeY + size &&
        Math.sqrt(Math.pow(mouseX - nodeX, 2) +
          Math.pow(mouseY - nodeY, 2)) < size
      );
    };

    // Function returning the nodes in the mouse's quad
    const getQuadNodes = (mouseX, mouseY) => {

      const mouseGraphPosition = this.camera.displayToGraph(
        mouseX,
        mouseY
      );

      return this.quadtree.point(
        mouseGraphPosition.x,
        mouseGraphPosition.y
      );
    };

    // Handling mouse move
    this.listeners.handleMove = e => {
      return;

      // NOTE: for the canvas renderer, testing the pixel's alpha should
      // give some boost but this slows things down for WebGL empirically.

      // TODO: this should be a method from the camera (or can be passed to graph to display somehow)
      const sizeRatio = Math.pow(this.camera.getState().ratio, 0.5);

      const quadNodes = getQuadNodes(e.x, e.y);

      for (let i = 0, l = quadNodes.length; i < l; i++) {
        const node = quadNodes[i];

        const data = this.nodeDataCache[node];

        const pos = this.camera.graphToDisplay(
          data.x,
          data.y
        );

        const size = data.size / sizeRatio;

        // TODO: we should get the nearest node instead
        if (mouseIsOnNode(e.x, e.y, pos.x, pos.y, size)) {
          this.hoveredNode = node;

          this.emit('overNode', {node});
          return this.scheduleHighlightedNodesRender();
        }
      }

      // Checking if the hovered node is still hovered
      if (this.hoveredNode) {
        const data = this.nodeDataCache[this.hoveredNode];

        const pos = this.camera.graphToDisplay(
          data.x,
          data.y
        );

        const size = data.size / sizeRatio;

        if (!mouseIsOnNode(e.x, e.y, pos.x, pos.y, size)) {
          this.hoveredNode = null;

          this.emit('outNode', {node: this.hoveredNode});
          return this.scheduleHighlightedNodesRender();
        }
      }
    };

    // Handling down
    this.listeners.handleDown = e => {
      return;

      const sizeRatio = Math.pow(this.camera.getState().ratio, 0.5);

      const quadNodes = getQuadNodes(e.x, e.y);

      for (let i = 0, l = quadNodes.length; i < l; i++) {
        const node = quadNodes[i];

        const data = this.nodeDataCache[node];

        const pos = this.camera.graphToDisplay(
          data.x,
          data.y
        );

        const size = data.size / sizeRatio;

        if (mouseIsOnNode(e.x, e.y, pos.x, pos.y, size))
          return this.emit('downNode', {node});
      }
    };

    // Handling click
    this.listeners.handleClick = e => {
      return;

      const sizeRatio = Math.pow(this.camera.getState().ratio, 0.5);

      const quadNodes = getQuadNodes(e.x, e.y);

      for (let i = 0, l = quadNodes.length; i < l; i++) {
        const node = quadNodes[i];

        const data = this.nodeDataCache[node];

        const pos = this.camera.graphToDisplay(
          data.x,
          data.y
        );

        const size = data.size / sizeRatio;

        if (mouseIsOnNode(e.x, e.y, pos.x, pos.y, size))
          return this.emit('clickNode', {node});
      }

      return this.emit('clickStage');
    };

    // TODO: optimize, we don't need to repeat collisions
    this.captors.mouse.on('mousemove', this.listeners.handleMove);
    this.captors.mouse.on('mousedown', this.listeners.handleDown);
    this.captors.mouse.on('click', this.listeners.handleClick);

    return this;
  }

  /**
   * Method binding graph handlers
   *
   * @return {WebGLRenderer}
   */
  bindGraphHandlers() {

    const graph = this.sigma.getGraph();

    this.listeners.graphUpdate = () => {
      this.needToProcess = true;
      this.scheduleRender();
    };

    this.listeners.softGraphUpdate = () => {
      this.needToSoftProcess = true;
      this.scheduleRender();
    };

    // TODO: bind this on composed state events
    // TODO: it could be possible to update only specific node etc. by holding
    // a fixed-size pool of updated items
    graph.on('nodeAdded', this.listeners.graphUpdate);
    graph.on('nodeDropped', this.listeners.graphUpdate);
    graph.on('nodeAttributesUpdated', this.listeners.softGraphUpdate);
    graph.on('edgeAdded', this.listeners.graphUpdate);
    graph.on('nodeDropped', this.listeners.graphUpdate);
    graph.on('edgeAttributesUpdated', this.listeners.softGraphUpdate);
    graph.on('cleared', this.listeners.graphUpdate);

    return this;
  }

  /**
   * Method used to process the whole graph's data.
   *
   * @return {WebGLRenderer}
   */
  process(keepArrays = false) {

    const graph = this.sigma.getGraph();

    // TODO: possible to index this somehow using two byte arrays or so
    const extent = nodeExtent(graph, ['x', 'y', 'size']);

    // Rescaling function
    this.normalizationFunction = createNormalizationFunction(extent);

    this.quadtree.resize({
      x: 0,
      y: 0,
      width: 1,
      height: 1
    });

    const nodeProgram = this.nodePrograms.def;

    if (!keepArrays) {
      nodeProgram.allocate(graph.order);
      this.nodeOrder = {};
    }

    const nodes = graph.nodes();

    for (let i = 0, l = nodes.length; i < l; i++) {
      const node = nodes[i];

      this.nodeOrder[node] = i;

      const data = this.sigma.getNodeData(node);

      const rescaledData = this.normalizationFunction(data);

      // TODO: Optimize this to be save a loop and one object, by using a reversed assign
      const displayData = assign({}, data, rescaledData);

      this.quadtree.add(
        node,
        displayData.x,
        displayData.y,
        0.001
      );

      this.nodeDataCache[node] = displayData;

      nodeProgram.process(displayData, i);
    }

    // TODO: do we need to keep passing gl to the program?
    nodeProgram.bufferData();

    const edgeProgram = this.edgePrograms.def;

    if (!keepArrays) {
      edgeProgram.allocate(graph.size);
      this.edgeOrder = {};
    }

    const edges = graph.edges();

    for (let i = 0, l = edges.length; i < l; i++) {
      const edge = edges[i];

      this.edgeOrder[edge] = i;

      const data = this.sigma.getEdgeData(edge),
            extremities = graph.extremities(edge),
            sourceData = this.nodeDataCache[extremities[0]],
            targetData = this.nodeDataCache[extremities[1]];

      edgeProgram.process(
        sourceData,
        targetData,
        data,
        i
      );
    }

    // Computing edge indices if necessary
    if (!keepArrays && typeof edgeProgram.computeIndices === 'function')
      this.edgeIndicesArray = edgeProgram.computeIndices();

    edgeProgram.bufferData();

    return this;
  }

  /**
   * Method used to process a single node.
   *
   * @return {WebGLRenderer}
   */
  processNode(key) {

    const nodeProgram = this.nodePrograms.def;

    const data = this.sigma.getNodeData(key);

    nodeProgram.process(
      data,
      this.nodeOrder[key]
    );

    return this;
  }

  /**
   * Method used to process a single edge.
   *
   * @return {WebGLRenderer}
   */
  processEdge(key) {

    const graph = this.sigma.getGraph();

    const edgeProgram = this.edgePrograms.def;

    const data = this.sigma.getEdgeData(key),
          extremities = graph.extremities(key),
          sourceData = this.sigma.getNodeData(extremities[0]),
          targetData = this.sigma.getNodeData(extremities[1]);

    edgeProgram.process(
      sourceData,
      targetData,
      data,
      this.edgeOrder[key]
    );

    return this;
  }

  /**---------------------------------------------------------------------------
   * Public API.
   **---------------------------------------------------------------------------
   */

  /**
   * Method used to bind the renderer to a sigma instance.
   *
   * @param  {Sigma} sigma - Target sigma instance.
   * @return {WebGLRenderer}
   */
  bind(sigma) {

    // Binding instance
    this.sigma = sigma;

    this.bindGraphHandlers();

    // Processing initial data
    this.process();

    return this;
  }

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
  resize(width, height) {
    const previousWidth = this.width,
          previousHeight = this.height;

    if (arguments.length > 1) {
      this.width = width;
      this.height = height;
    }
    else {
      this.width = this.container.offsetWidth;
      this.height = this.container.offsetHeight;
    }

    // If nothing has changed, we can stop right here
    if (previousWidth === this.width && previousHeight === this.height)
      return this;

    // Resizing camera
    // TODO: maybe move this elsewhere
    if (this.camera)
      this.camera.resize({width: this.width, height: this.height});

    // Sizing dom elements
    for (const id in this.elements) {
      const element = this.elements[id];

      element.style.width = this.width + 'px';
      element.style.height = this.height + 'px';
    }

    // Sizing contexts
    for (const id in this.contexts) {
      const context = this.contexts[id];

      // Canvas contexts
      if (context.scale) {
        this.elements[id].setAttribute('width', (this.width * PIXEL_RATIO) + 'px');
        this.elements[id].setAttribute('height', (this.height * PIXEL_RATIO) + 'px');

        if (PIXEL_RATIO !== 1)
          context.scale(PIXEL_RATIO, PIXEL_RATIO);
      }

      // WebGL contexts
      else {
        this.elements[id].setAttribute('width', (this.width * WEBGL_OVERSAMPLING_RATIO) + 'px');
        this.elements[id].setAttribute('height', (this.height * WEBGL_OVERSAMPLING_RATIO) + 'px');
      }

      if (context.viewport) {
        context.viewport(
          0,
          0,
          this.width * WEBGL_OVERSAMPLING_RATIO,
          this.height * WEBGL_OVERSAMPLING_RATIO
        );
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
    let context = this.contexts.nodes;
    context.clear(context.COLOR_BUFFER_BIT);

    context = this.contexts.edges;
    context.clear(context.COLOR_BUFFER_BIT);

    context = this.contexts.labels;
    context.clearRect(0, 0, this.width, this.height);

    context = this.contexts.hovers;
    context.clearRect(0, 0, this.width, this.height);

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

    // TODO: improve this heuristic
    const moving = (
      this.camera.isAnimated() ||
      this.captors.mouse.isMoving ||
      this.captors.mouse.hasDragged ||
      this.captors.mouse.wheelLock
    );

    // First we need to resize
    this.resize();

    // Clearing the canvases
    this.clear();

    // Then we need to extract a matrix from the camera
    const cameraState = this.camera.getState(),
          cameraMatrix = matrixFromCamera(cameraState, {width: this.width, height: this.height});

    let program;

    // Drawing nodes
    program = this.nodePrograms.def;

    // TODO: should probably use another name for the `program` abstraction
    program.render(
      {
        matrix: cameraMatrix,
        width: this.width,
        height: this.height,
        ratio: cameraState.ratio,
        nodesPowRatio: 0.5,
        scalingRatio: WEBGL_OVERSAMPLING_RATIO
      }
    );

    // Drawing edges
    if (!this.settings.hideEdgesOnMove || !moving) {
      program = this.edgePrograms.def;

      program.render(
        {
          matrix: cameraMatrix,
          width: this.width,
          height: this.height,
          ratio: cameraState.ratio,
          nodesPowRatio: 0.5,
          edgesPowRatio: 0.5,
          scalingRatio: WEBGL_OVERSAMPLING_RATIO
        }
      );
    }

    // Do not display labels on move per setting
    if (this.settings.hideLabelsOnMove && moving)
      return this;

    // Finding visible nodes to display their labels
    let visibleNodes;

    if (true || cameraState.ratio >= 1) {

      // Camera is unzoomed so no need to ask the quadtree for visible nodes
      visibleNodes = this.sigma.getGraph().nodes();
    }
    else {

      // Let's ask the quadtree
      // const viewRectangle = this.camera.viewRectangle();

      // visibleNodes = this.quadtree.rectangle(
      //   viewRectangle.x1,
      //   viewRectangle.y1,
      //   viewRectangle.x2,
      //   viewRectangle.y2,
      //   viewRectangle.height
      // );
    }

    // Selecting labels to draw
    const labelsToDisplay = labelsToDisplayFromGrid({
      cache: this.nodeDataCache,
      camera: this.camera,
      displayedLabels: this.displayedLabels,
      previousVisibleNodes: this.previousVisibleNodes,
      visibleNodes
    });

    // Drawing labels
    // TODO: POW RATIO is currently default 0.5 and harcoded
    const context = this.contexts.labels;

    const sizeRatio = Math.pow(cameraState.ratio, 0.5);

    for (let i = 0, l = labelsToDisplay.length; i < l; i++) {
      const data = this.nodeDataCache[labelsToDisplay[i]];

      const {x, y} = this.camera.graphToViewport(this, data.x, data.y);

      // TODO: we can cache the labels we need to render until the camera's ratio changes
      const size = data.size / sizeRatio;

      // TODO: this is the label threshold hardcoded
      // if (size < 8)
      //   continue;

      drawLabel(context, {
        label: data.label,
        size,
        x,
        y
      });
    }

    // Caching visible nodes and displayed labels
    this.previousVisibleNodes = new Set(visibleNodes);
    this.displayedLabels = new Set(labelsToDisplay);

    // Rendering highlighted nodes
    this.renderHighlightedNodes();

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
    const render = node => {
      const data = this.nodeDataCache[node];

      const {x, y} = camera.graphToDisplay(data.x, data.y);

      const size = data.size / sizeRatio;

      drawHover(context, {
        label: data.label,
        color: data.color,
        size,
        x,
        y
      });
    };

    if (this.hoveredNode)
      render(this.hoveredNode);

    this.highlightedNodes.forEach(render);
  }

  /**
   * Method used to schedule a render.
   *
   * @return {WebGLRenderer}
   */
  scheduleRender() {

    // A frame is already scheduled
    if (this.renderFrame)
      return this;

    // Let's schedule a frame
    this.renderFrame = requestAnimationFrame(() => {

      // Do we need to process data?
      if (this.needToProcess || this.needToSoftProcess)
        this.process(this.needToSoftProcess);

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
    if (this.renderHighlightedNodesFrame || this.renderFrame)
      return this;

    this.renderHighlightedNodesFrame = requestAnimationFrame(() => {

      // Resetting state
      this.renderHighlightedNodesFrame = null;

      // Rendering
      this.renderHighlightedNodes();
    });
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
}
