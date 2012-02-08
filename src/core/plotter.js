function Plotter(nodesCtx, edgesCtx, labelsCtx, graph, w, h, params) {
  sigma.classes.Cascade.call(this);
  var self = this;

  this.p = {
    // LABELS:
    //   Edge color:
    //   - 'node'
    //   - default (then defaultLabelColor or node['color']
    //              will be used instead)
    labelColor: 'none',
    defaultLabelColor: '#000',
    font: 'Arial',
    // EDGES:
    //   Edge color:
    //   - 'source'
    //   - 'target'
    //   - default (then defaultEdgeColor or edge['color']
    //              will be used instead)
    edgeColor: 'source',
    defaultEdgeColor: '#aaa',
    defaultEdgeType: 'line',
    // NODES:
    defaultNodeColor: '#aaa'
  };

  for (var k in params) {
    if (this.params[k] != undefined) {
      this.params[k] = params[k];
    }
  }

  this.nodesCtx = nodesCtx;
  this.edgesCtx = edgesCtx;
  this.labelsCtx = labelsCtx;

  this.graph = graph;
  this.width = w;
  this.height = h;

  this.currentEdgeIndex = 0;
  this.currentNodeIndex = 0;
  this.currentLabelIndex = 0;

  this.edgesSpeed = 200;
  this.nodesSpeed = 200;
  this.labelsSpeed = 200;

  function worker_drawEdge() {
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

  function worker_drawNode() {
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

  function worker_drawLabel() {
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
    var ctx = self.nodesCtx;

    ctx.fillStyle = node['color'];
    ctx.beginPath();
    ctx.arc(node['displayX'],
            node['displayY'],
            node['displaySize'],
            0,
            Math.PI * 2,
            true);

    ctx.closePath();
    ctx.fill();
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

    if (node['displaySize'] * 2 >= 8) {
      ctx.font = node['displaySize'] * 2 + 'px ' + self.p.font;
      ctx.fillStyle = self.p.labelColor == 'node' ?
                      (node['color'] || self.p.defaultNodeColor) :
                      self.p.defaultLabelColor;
      ctx.fillText(
        node['label'],
        node['displayX'] + node['displaySize'] * 1.5,
        node['displayY'] + node['displaySize'] / 2
      );
    }
  };

  function isOnScreen(node) {
    if (isNaN(node['x']) || isNaN(node['y'])) {
      throw (new Error(
        'A node\'s coordinate is not a number (id: ' + node['id'] + ')')
      );
    }

    return (node['displayX'] + node['displaySize'] > -self.width / 3) &&
           (node['displayX'] - node['displaySize'] < self.width * 4 / 3) &&
           (node['displayY'] + node['displaySize'] > -self.height / 3) &&
           (node['displayY'] - node['displaySize'] < self.height * 4 / 3);
  };

  this.worker_drawLabel = worker_drawLabel;
  this.worker_drawEdge = worker_drawEdge;
  this.worker_drawNode = worker_drawNode;
  this.isOnScreen = isOnScreen;
}
