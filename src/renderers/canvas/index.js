/**
 * Sigma.js Canvas Renderer
 * =========================
 */
import Renderer from '../../renderer';
import {createDOMElement} from '../helpers';
import Node from './components/node';

// TODO: validate container
// TODO: mecanisms to ensure the renderer is not used by another instance?
// TODO: drop the type system -> should be handled at component level? (probably not, case of the webgl renderer)

/**
 * Renderer class.
 *
 * @constructor
 */
export default class CanvasRenderer extends Renderer {
  constructor(container) {
    super();

    // Properties
    this.container = container;
    this.scene = createDOMElement('canvas', {
      class: 'sigma-scene',
      style: {
        position: 'absolute',

        // TODO: this is hardcoded for the time being
        width: '300px',
        height: '300px'
      }
    });
    this.context = this.scene.getContext('2d');

    // Appending scene to container
    this.container.appendChild(this.scene);
  }

  /**
   * Method used to initialize the renderer.
   *
   * @param  {Graph}          graph - The instance's graph.
   * @return {CanvasRenderer}       - Returns itself for chaining.
   */
  initialize(graph) {

    this.nodesIndex = Object.create(null);
    this.edgesIndex = Object.create(null);

    return this;
  }

  /**
   * Method used to update a node's display information.
   *
   * @param  {any}            node - Target node.
   * @param  {object}         data - Reduced data.
   * @return {CanvasRenderer}      - Returns itself for chaining.
   */
  updateNodeDisplayInformation(node, data) {

    // TODO: for now, this is only saving raw
    this.nodesIndex[node] = data;

    return this;
  }

  /**
   * Method used to render.
   *
   * @return {CanvasRenderer} - Returns itself for chaining.
   */
  render() {

    // Rendering nodes
    for (const k in this.nodesIndex) {
      const displayInformation = this.nodesIndex[k];

      Node(this.context, displayInformation);
    }

    return this;
  }
}
