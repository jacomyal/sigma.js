/**
 * Sigma.js Display Data Classes
 * ==============================
 *
 * Classes representing nodes & edges display data aiming at facilitating
 * the engine's memory representation and keep them in a pool to avoid
 * requiring to allocate memory too often.
 *
 * NOTE: it's possible to optimize this further by maintaining display data
 * in byte arrays but this would prove more tedious for the rendering logic
 * afterwards.
 */
export class NodeDisplayData {
  index: string;
  x: number;
  y: number;
  size: number;
  color: string;
  hidden: boolean;
  label: string;

  constructor(index, settings) {
    this.index = index;
    this.x = 0;
    this.y = 0;
    this.size = 2;
    this.color = settings.defaultNodeColor;
    this.hidden = false;
    this.label = "";
  }

  assign(data) {
    for (const key in data) this[key] = data[key];
  }
}

export class EdgeDisplayData {
  index: any;
  size: number;
  color: string;
  hidden: boolean;
  label: string;

  constructor(index, settings) {
    this.index = index;
    this.size = 1;
    this.color = settings.defaultEdgeColor;
    this.hidden = false;
    this.label = "";
  }

  assign(data) {
    for (const key in data) this[key] = data[key];
  }
}
