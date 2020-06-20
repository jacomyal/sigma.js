/**
 * Sigma.js Captor Class
 * ======================
 *
 * Abstract class representing a captor like the user's mouse or touch controls.
 */
import { EventEmitter } from "events";
import Camera from "./camera";

export default class Captor extends EventEmitter {
  container: HTMLElement;
  camera: Camera;

  constructor(container: HTMLElement, camera: Camera) {
    super();
    // Properties
    this.container = container;
    this.camera = camera;
  }
}
