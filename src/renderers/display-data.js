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
  constructor(index, settings) {
    this.index = index;
    this.x = 0;
    this.y = 0;
    this.size = 2;
    this.color = settings.defaultNodeColor;
    this.hidden = false;
    this.label = '';
  }

  assign(data) {
    if ('x' in data)
      this.x = data.x;

    if ('y' in data)
      this.y = data.y;

    if ('size' in data)
      this.size = data.size;

    if ('color' in data)
      this.color = data.color;

    if ('hidden' in data)
      this.hidden = data.hidden;

    if ('label' in data)
      this.label = data.label;
  }
}

export class EdgeDisplayData {
  constructor(index, settings) {
    this.index = index;
    this.size = 1;
    this.color = settings.defaultEdgeColor;
    this.hidden = false;
  }

  assign(data) {
    if ('size' in data)
      this.size = data.size;

    if ('color' in data)
      this.color = data.color;

    if ('hidden' in data)
      this.hidden = data.hidden;
  }
}
