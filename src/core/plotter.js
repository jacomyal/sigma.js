function Plotter(nodesCtx, edgesCtx, labelsCtx, hoverCtx, graph, w, h, params) {
  sigma.classes.Cascade.call(this);
  var self = this;

  this.p = {
    // -------
    // LABELS:
    // -------
    //   Label color:
    //   - 'node'
    //   - default (then defaultLabelColor
    //              will be used instead)
    labelColor: 'default',
    defaultLabelColor: '#000',
    //   Label background color:
    //   - 'node'
    //   - default (then defaultLabelBGColor
    //              will be used instead)
    labelBGColor: 'default',
    defaultLabelBGColor: '#fff',
    //   Label shadow:
    labelShadow: true,
    labelShadowColor: '#000',
    //   Label hover color:
    //   - 'node'
    //   - default (then defaultLabelHoverColor
    //              will be used instead)
    labelHoverColor: 'default',
    defaultLabelHoverColor: '#000',
    //   Label size:
    //   - 'fixed'
    //   - 'proportional'
    //   Label size:
    //   - 'fixed'
    //   - 'proportional'
    labelSize: 'fixed',
    defaultLabelSize: 12, // for fixed display only
    labelSizeRatio: 2,    // for proportional display only
    labelThreshold: 6,
    font: 'Arial',
    // ------
    // EDGES:
    // ------
    //   Edge color:
    //   - 'source'
    //   - 'target'
    //   - default (then defaultEdgeColor or edge['color']
    //              will be used instead)
    edgeColor: 'source',
    defaultEdgeColor: '#aaa',
    defaultEdgeType: 'line',
    // ------
    // NODES:
    // ------
    defaultNodeColor: '#aaa',
    // HOVER:
    //   Node hover color:
    //   - 'node'
    //   - default (then defaultNodeHoverColor
    //              will be used instead)
    nodeHoverColor: 'node',
    defaultNodeHoverColor: '#fff',
    //   Node border color:
    //   - 'node'
    //   - default (then defaultNodeBorderColor
    //              will be used instead)
    borderSize: 0,
    nodeBorderColor: 'node',
    defaultNodeBorderColor: '#fff'
  };

  for (var k in params) {
    if (this.params[k] != undefined) {
      this.params[k] = params[k];
    }
  }

  this.nodesCtx = nodesCtx;
  this.edgesCtx = edgesCtx;
  this.labelsCtx = labelsCtx;
  this.hoverCtx = hoverCtx;

  // ImageData for caching nodes and labels:
  this.cacheNodes = {};
  this.cacheLabels = {};

  this.dataNodes = {};
  this.dataLabels = {};

  this.cacheCanvas = document.createElement('canvas');
  this.cacheCanvas.width = '100px';
  this.cacheCanvas.height = '100px';

  this.graph = graph;
  this.width = w;
  this.height = h;

  this.currentEdgeIndex = 0;
  this.currentNodeIndex = 0;
  this.currentLabelIndex = 0;

  this.edgesSpeed = 200;
  this.nodesSpeed = 200;
  this.labelsSpeed = 200;

  function task_drawEdge() {
    var c = self.graph.edges.length;
    var i = 0;

    while (i++< self.edgesSpeed && self.currentEdgeIndex < c) {
      if (!self.isOnScreen(
           self.graph.edges[self.currentEdgeIndex]['source']
         ) &&
         !self.isOnScreen(
           self.graph.edges[self.currentEdgeIndex]['target'])
         ) {
        self.currentEdgeIndex++;
      }else {
        drawEdge(self.graph.edges[self.currentEdgeIndex++]);
      }
    }

    return self.currentEdgeIndex < c;
  };

  function task_drawNode() {
    var c = self.graph.nodes.length;
    var i = 0;

    while (i++< self.nodesSpeed && self.currentNodeIndex < c) {
      if (!self.isOnScreen(self.graph.nodes[self.currentNodeIndex])) {
        self.currentNodeIndex++;
      }else {
        drawNode(self.graph.nodes[self.currentNodeIndex++]);
      }
    }

    return self.currentNodeIndex < c;
  };

  function task_drawLabel() {
    var c = self.graph.nodes.length;
    var i = 0;

    while (i++< self.labelsSpeed && self.currentLabelIndex < c) {
      if (!self.isOnScreen(self.graph.nodes[self.currentLabelIndex])) {
        self.currentLabelIndex++;
      }else {
        drawLabel(self.graph.nodes[self.currentLabelIndex++]);
      }
    }

    return self.currentLabelIndex < c;
  };

  function drawNode(node) {
    var size = Math.round(node['displaySize'] * 10) / 10;
    var ctx = self.nodesCtx;

    ctx.fillStyle = node['color'];
    ctx.beginPath();
    ctx.arc(node['displayX'],
            node['displayY'],
            size,
            0,
            Math.PI * 2,
            true);

    ctx.closePath();
    ctx.fill();

    node['hover'] && drawHoverNode(node);
  };

  function drawEdge(edge) {
    var x1 = edge['source']['displayX'];
    var y1 = edge['source']['displayY'];
    var x2 = edge['target']['displayX'];
    var y2 = edge['target']['displayY'];
    var color = edge['color'];

    if (!color) {
      switch (self.p.edgeColor) {
        case 'source':
          color = edge['source']['color'] ||
                  self.p.defaultNodeColor;
          break;
        case 'target':
          color = edge['target']['color'] ||
                  self.p.defaultNodeColor;
          break;
        default:
          color = self.p.defaultEdgeColor;
          break;
      }
    }

    var ctx = self.edgesCtx;

    switch (edge['type'] || self.p.defaultEdgeType) {
      case 'curve':
        ctx.strokeStyle = color;
        ctx.lineWidth = edge['displaySize'] / 3;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo((x1 + x2) / 2 + (y2 - y1) / 4,
                             (y1 + y2) / 2 + (x1 - x2) / 4,
                             x2,
                             y2);
        ctx.stroke();
        break;
      case 'line':
      default:
        ctx.strokeStyle = color;
        ctx.lineWidth = edge['displaySize'] / 3;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);

        ctx.stroke();
        break;
    }
  };

  function drawLabel(node) {
    var ctx = self.labelsCtx;

    if (node['displaySize'] >= self.p.labelThreshold) {
      var fontSize = self.p.labelSize == 'fixed' ?
                     self.p.defaultLabelSize :
                     self.p.labelSizeRatio * node['displaySize'];

      ctx.font = fontSize + 'px ' + self.p.font;

      ctx.fillStyle = self.p.labelColor == 'node' ?
                      (node['color'] || self.p.defaultNodeColor) :
                      self.p.defaultLabelColor;
      ctx.fillText(
        node['label'],
        node['displayX'] + node['displaySize'] * 1.5,
        node['displayY'] + fontSize / 2 - 3
      );
    }
  };

  function drawHoverNode(node) {
    var ctx = self.hoverCtx;

    var fontSize = self.p.labelSize == 'fixed' ?
                   self.p.defaultLabelSize :
                   self.p.labelSizeRatio * node['displaySize'];

    ctx.font = fontSize + 'px ' + self.p.font;

    ctx.fillStyle = self.p.labelBGColor == 'node' ?
                    (node['color'] || self.p.defaultNodeColor) :
                    self.p.defaultLabelBGColor;

    // Label background:
    ctx.beginPath();

    if (self.p.labelShadow) {
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = 4;
      ctx.shadowColor = self.p.labelShadowColor;
    }

    sigma.tools.drawRoundRect(
      ctx,
      node['displayX'] - fontSize / 2 - 2,
      node['displayY'] - fontSize / 2 - 2,
      ctx.measureText(node['label']).width +
        node['displaySize'] * 1.5 +
        fontSize / 2 + 4,
      fontSize + 4,
      fontSize / 2 + 2,
      'left'
    );
    ctx.closePath();
    ctx.fill();

    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 0;

    // Node border:
    ctx.beginPath();
    ctx.fillStyle = self.p.nodeBorderColor == 'node' ?
                    (node['color'] || self.p.defaultNodeColor) :
                    self.p.defaultNodeBorderColor;
    ctx.arc(node['displayX'],
            node['displayY'],
            node['displaySize'] + self.p.borderSize,
            0,
            Math.PI * 2,
            true);
    ctx.closePath();
    ctx.fill();

    // Node:
    ctx.beginPath();
    ctx.fillStyle = self.p.nodeHoverColor == 'node' ?
                    (node['color'] || self.p.defaultNodeColor) :
                    self.p.defaultNodeHoverColor;
    ctx.arc(node['displayX'],
            node['displayY'],
            node['displaySize'],
            0,
            Math.PI * 2,
            true);

    ctx.closePath();
    ctx.fill();

    // Label:
    ctx.fillStyle = self.p.labelHoverColor == 'node' ?
                    (node['color'] || self.p.defaultNodeColor) :
                    self.p.defaultLabelHoverColor;
    ctx.fillText(
      node['label'],
      node['displayX'] + node['displaySize'] * 1.5,
      node['displayY'] + fontSize / 2 - 3
    );
  };

  function isOnScreen(node) {
    if (isNaN(node['x']) || isNaN(node['y'])) {
      throw (new Error('A node\'s coordinate is not a ' +
                       'number (id: ' + node['id'] + ')')
      );
    }

    return (node['displayX'] + node['displaySize'] > -self.width / 3) &&
           (node['displayX'] - node['displaySize'] < self.width * 4 / 3) &&
           (node['displayY'] + node['displaySize'] > -self.height / 3) &&
           (node['displayY'] - node['displaySize'] < self.height * 4 / 3);
  };

  function applyDrawing() {

  }

  this.task_drawLabel = task_drawLabel;
  this.task_drawEdge = task_drawEdge;
  this.task_drawNode = task_drawNode;
  this.drawHoverNode = drawHoverNode;
  this.applyDrawing = applyDrawing;
  this.isOnScreen = isOnScreen;
}
