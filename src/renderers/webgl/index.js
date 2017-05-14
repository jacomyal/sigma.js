/**
 * Sigma.js WebGL Renderer
 * ========================
 *
 * File implementing sigma's WebGL Renderer.
 */
import Renderer from '../../renderer';
import {createElement} from '../utils';
import {
  loadVertexShader,
  loadFragmentShader,
  loadProgram
} from './shaders/utils';

/**
 * Constants.
 */

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

    // Initializing contexts
    this._initContext('nodes');
    this._initContext('edges');
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
   * Function used to render.
   */
  render() {
    return this;
  }
}
