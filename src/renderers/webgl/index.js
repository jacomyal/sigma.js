/**
 * Sigma.js WebGL Renderer
 * ========================
 *
 * File implementing sigma's WebGL Renderer.
 */
import Renderer from '../../renderer';

import {
  createElement,
  getPixelRatio
} from '../utils';

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
    this.container = container;
    this.elements = {};
    this.contexts = {};

    this.nodesData = null;
    this.edgesData = null;

    this.nodePrograms = {};
    this.edgePrograms = {};

    // Starting dimensions
    this.width = 0;
    this.height = 0;

    // Initializing contexts
    this._initContext('nodes');
    this._initContext('edges');

    // Initial resize
    this.resize();
  }

  /**---------------------------------------------------------------------------
   * Internal functions.
   **---------------------------------------------------------------------------
   */

  /**
   * Internal function used to initialize a context.
   *
   * @param  {string}  id    - Context's id.
   * @param  {boolean} webgl - Whether the context is a webgl or canvas one.
   * @return {WebGLRenderer}
   */
  _initContext(id, webgl = true) {
    var element = createElement('canvas', {
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

    const context = element.getContext(webgl ? 'webgl' : '2d');

    this.contexts[id] = context;

    return this;
  }

  /**---------------------------------------------------------------------------
   * Public API.
   **---------------------------------------------------------------------------
   */

  /**
   * Function used to resize the renderer.
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
        this.elements[id].setAttribute('width', this.width * PIXEL_RATIO);
        this.elements[id].setAttribute('height', this.height * PIXEL_RATIO);

        if (PIXEL_RATIO !== 1)
          context.scale(PIXEL_RATIO, PIXEL_RATIO);
      }

      // WebGL contexts
      else {
        this.elements[id].setAttribute('width', this.width * WEBGL_OVERSAMPLING_RATIO);
        this.elements[id].setAttribute('height', this.height * WEBGL_OVERSAMPLING_RATIO);
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
   * Function used to render.
   */
  render() {
    return this;
  }
}
