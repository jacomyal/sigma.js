/**
 * Sigma.js Captor Class
 * ======================
 *
 * Abstract class representing a captor like the user's mouse or touch controls.
 */
import {EventEmitter} from 'events';

export default class Captor extends EventEmitter {
  constructor(container, camera) {
    super();

    // Properties
    this.container = container;
    this.camera = camera;
  }
}
