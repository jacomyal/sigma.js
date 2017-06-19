/**
 * Sigma.js WebGL Renderer
 * ========================
 *
 * File implementing sigma's WebGL Renderer.
 */
import {mat3} from 'gl-matrix';

import Renderer from '../../renderer';
import Camera from '../../camera';
import MouseCaptor from '../../captors/mouse';
import QuadTree from '../../quadtree';
import NodeProgram from './programs/node';
import EdgeProgram from './programs/edge.fast';

import drawLabel from '../canvas/components/label';
import drawHover from '../canvas/components/hover';

import {
  assign
} from '../../utils';

import {
  createElement,
  getPixelRatio,
  createNodeRescalingFunction
} from '../utils';

import {
  matrixFromCamera,
  extractPixel
} from './utils';

/**
 * Constants.
 */
const WEBGL_OVERSAMPLING_RATIO = 2;
const PIXEL_RATIO = getPixelRatio();

/**
 * Main class.
 *
 * @constructor
 * @param {HTMLElement} container - The graph's container.
 */
export default class WebGLRenderer extends Renderer {
  constructor(container) {
    super();

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

    this.quadtree = new QuadTree();

    this.nodeArray = null;
    this.nodeIndicesArray = null;
    this.nodeOrder = {};
    this.nodeDataCache = {};
    this.edgeArray = null;
    this.edgeIndicesArray = null;
    this.edgeOrder = {};

    this.nodePrograms = {
      def: new NodeProgram()
    };
    this.edgePrograms = {
      def: new EdgeProgram()
    };

    // TODO: if we drop size scaling => this should become "rescalingFunction"
    this.nodeRescalingFunction = null;

    // Starting dimensions
    this.width = 0;
    this.height = 0;

    // State
    this.highlightedNodes = new Set();
    this.hoveredNode = null;
    this.renderFrame = null;
    this.renderHighlightedNodesFrame = null;
    this.needToProcess = false;
    this.needToSoftProcess = false;
    this.pixel = new Uint8Array(4);

    // Initializing contexts
    this.createContext('edges');
    this.createContext('nodes');
    this.createContext('labels', false);
    this.createContext('hovers', false);
    this.createContext('mouse', false);

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

    // Loading programs
    for (const k in this.nodePrograms)
      this.nodePrograms[k].load(this.contexts.nodes);

    for (const k in this.edgePrograms)
      this.edgePrograms[k].load(this.contexts.edges);
  }

  /**---------------------------------------------------------------------------
   * Internal methods.
   **---------------------------------------------------------------------------
   */

  /**
   * Method used to test a pixel of the given context.
   *
   * @param  {WebGLContext} gl - Context.
   * @param  {number}       x  - Client x.
   * @param  {number}       y  - Client y.
   * @return {boolean}
   */
  testPixel(gl, x, y) {
    extractPixel(
      gl,
      x * WEBGL_OVERSAMPLING_RATIO,
      (this.height - y) * WEBGL_OVERSAMPLING_RATIO,
      this.pixel
    );

    return this.pixel[3] !== 0;
  }

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
      preserveDrawingBuffer: true
    };

    const context = element.getContext(webgl ? 'webgl' : '2d', contextOptions);

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

      // NOTE: for the canvas renderer, testing the pixel's alpha should
      // give some boost but this slows things down for WebGL empirically.
      const sizeRatio = Math.pow(this.camera.getState().ratio, 0.5);

      const quadNodes = getQuadNodes(e.clientX, e.clientY);

      for (let i = 0, l = quadNodes.length; i < l; i++) {
        const node = quadNodes[i];

        const data = this.nodeDataCache[node];

        const pos = this.camera.graphToDisplay(
          data.x,
          data.y
        );

        const size = data.size / sizeRatio;

        if (mouseIsOnNode(e.clientX, e.clientY, pos.x, pos.y, size)) {
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

        if (!mouseIsOnNode(e.clientX, e.clientY, pos.x, pos.y, size)) {
          this.hoveredNode = null;

          this.emit('outNode', {node: this.hoveredNode});
          return this.scheduleHighlightedNodesRender();
        }
      }
    };

    // Handling down
    this.listeners.handleDown = e => {
      const sizeRatio = Math.pow(this.camera.getState().ratio, 0.5);

      const quadNodes = getQuadNodes(e.clientX, e.clientY);

      for (let i = 0, l = quadNodes.length; i < l; i++) {
        const node = quadNodes[i];

        const data = this.nodeDataCache[node];

        const pos = this.camera.graphToDisplay(
          data.x,
          data.y
        );

        const size = data.size / sizeRatio;

        if (mouseIsOnNode(e.clientX, e.clientY, pos.x, pos.y, size))
          return this.emit('downNode', {node});
      }
    };

    // Handling click
    this.listeners.handleClick = e => {
      const sizeRatio = Math.pow(this.camera.getState().ratio, 0.5);

      const quadNodes = getQuadNodes(e.clientX, e.clientY);

      for (let i = 0, l = quadNodes.length; i < l; i++) {
        const node = quadNodes[i];

        const data = this.nodeDataCache[node];

        const pos = this.camera.graphToDisplay(
          data.x,
          data.y
        );

        const size = data.size / sizeRatio;

        if (mouseIsOnNode(e.clientX, e.clientY, pos.x, pos.y, size))
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

    const extent = this.sigma.getGraphExtent();

    // Rescaling function
    this.nodeRescalingFunction = createNodeRescalingFunction(
      {width: this.width, height: this.height},
      extent
    );

    const minRescaled = this.nodeRescalingFunction({
      x: extent.minX,
      y: extent.minY
    });

    const maxRescaled = this.nodeRescalingFunction({
      x: extent.maxX,
      y: extent.maxY
    });

    this.quadtree.resize({
      x: minRescaled.x,
      y: minRescaled.y,
      width: maxRescaled.x - minRescaled.x,
      height: maxRescaled.y - minRescaled.y
    });

    this.nodeRescaleCache = {};

    const nodeProgram = this.nodePrograms.def;

    if (!keepArrays) {
      this.nodeArray = new Float32Array(
        NodeProgram.POINTS * NodeProgram.ATTRIBUTES * graph.order
      );

      this.nodeOrder = {};
    }

    const nodes = graph.nodes();

    for (let i = 0, l = nodes.length; i < l; i++) {
      const node = nodes[i];

      this.nodeOrder[node] = i;

      const data = this.sigma.getNodeData(node);

      const rescaledData = this.nodeRescalingFunction(data);

      // TODO: Optimize this to be save a loop and one object
      const displayData = assign({}, data, rescaledData);

      this.quadtree.add(node, displayData.x, displayData.y, displayData.size);

      this.nodeDataCache[node] = displayData;

      nodeProgram.process(
        this.nodeArray,
        displayData,
        i * NodeProgram.POINTS * NodeProgram.ATTRIBUTES
      );
    }

    const edgeProgram = this.edgePrograms.def;

    if (!keepArrays) {
      this.edgeArray = new Float32Array(
        EdgeProgram.POINTS * EdgeProgram.ATTRIBUTES * graph.size
      );

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
        this.edgeArray,
        sourceData,
        targetData,
        data,
        i * EdgeProgram.POINTS * EdgeProgram.ATTRIBUTES
      );
    }

    // Computing edge indices if necessary
    if (!keepArrays && typeof edgeProgram.computeIndices === 'function')
      this.edgeIndicesArray = edgeProgram.computeIndices(this.edgeArray);

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
      this.nodeArray,
      data,
      this.nodeOrder[key] * NodeProgram.POINTS * NodeProgram.ATTRIBUTES
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
      this.edgeArray,
      sourceData,
      targetData,
      data,
      this.edgeOrder[key] * EdgeProgram.POINTS * EdgeProgram.ATTRIBUTES
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

    // First we need to resize
    this.resize();

    // Clearing the canvases
    this.clear();

    // Then we need to extract a matrix from the camera
    const cameraState = this.camera.getState(),
          cameraMatrix = matrixFromCamera(cameraState);

    const translation = mat3.fromTranslation(mat3.create(), [
      this.width / 2,
      this.height / 2
    ]);

    mat3.multiply(cameraMatrix, translation, cameraMatrix);

    let program,
        gl;

    // Drawing nodes
    gl = this.contexts.nodes;
    program = this.nodePrograms.def;

    // Blending
    // TODO: check the purpose of this
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);

    // TODO: should probably use another name for the `program` abstraction
    program.render(
      gl,
      this.nodeArray,
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
    gl = this.contexts.edges;
    program = this.edgePrograms.def;

    program.render(
      gl,
      this.edgeArray,
      {
        matrix: cameraMatrix,
        width: this.width,
        height: this.height,
        ratio: cameraState.ratio,
        edgesPowRatio: 0.5,
        scalingRatio: WEBGL_OVERSAMPLING_RATIO,
        indices: this.edgeIndicesArray
      }
    );

    // Drawing labels
    // TODO: POW RATIO is currently default 0.5 and harcoded
    const nodes = this.sigma.getGraph().nodes(),
          context = this.contexts.labels;

    const sizeRatio = Math.pow(cameraState.ratio, 0.5);

    for (let i = 0, l = nodes.length; i < l; i++) {
      const data = this.nodeDataCache[nodes[i]];

      const {x, y} = this.camera.graphToDisplay(data.x, data.y);

      // TODO: we can cache the labels we need to render until the camera's ratio changes
      const size = data.size / sizeRatio;

      // TODO: this is the label threshold hardcoded
      if (size < 8)
        continue;

      drawLabel(context, {
        label: data.label,
        size,
        x,
        y
      });
    }

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
    if (this.renderFrame)
      return this;

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
    if (this.renderHighlightedNodesFrame)
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
