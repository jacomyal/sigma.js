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

  this.worker_drawEdge = function() {
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
        self.drawEdge(self.graph.edges[self.currentEdgeIndex++]);
      }
    }

    return self.currentEdgeIndex < c;
  }

  this.worker_drawNode = function() {
    var c = self.graph.nodes.length;
    var i = 0;
    while (i++< self.nodesSpeed && self.currentNodeIndex < c) {
      if (!self.isOnScreen(self.graph.nodes[self.currentNodeIndex])) {
        self.currentNodeIndex++;
      }else {
        self.drawNode(self.graph.nodes[self.currentNodeIndex++]);
      }
    }

    return self.currentNodeIndex < c;
  }

  this.worker_drawLabel = function() {
    var c = self.graph.nodes.length;
    var i = 0;
    while (i++< self.labelsSpeed && self.currentLabelIndex < c) {
      if (!self.isOnScreen(self.graph.nodes[self.currentLabelIndex])) {
        self.currentLabelIndex++;
      }else {
        self.drawLabel(self.graph.nodes[self.currentLabelIndex++]);
      }
    }

    return self.currentLabelIndex < c;
  }
}

Plotter.prototype.drawNode = function(node) {
  var ctx = this.nodesCtx;

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

Plotter.prototype.drawEdge = function(edge) {
  var x1 = edge['source']['displayX'];
  var y1 = edge['source']['displayY'];
  var x2 = edge['target']['displayX'];
  var y2 = edge['target']['displayY'];
  var color = edge['color'];

  if (!color) {
    switch (this.p.edgeColor) {
      case 'source':
        color = edge['source']['color'] || this.p.defaultNodeColor;
        break;
      case 'target':
        color = edge['target']['color'] || this.p.defaultNodeColor;
        break;
      default:
        color = this.p.defaultEdgeColor;
        break;
    }
  }

  var ctx = this.edgesCtx;

  switch (edge['type'] || this.p.defaultEdgeType) {
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

Plotter.prototype.drawLabel = function(node) {
  var ctx = this.labelsCtx;

  if (node['displaySize'] * 2 >= 8) {
    ctx.font = node['displaySize'] * 2 + 'px ' + this.p.font;
    ctx.fillStyle = this.p.labelColor == 'node' ?
                    (node['color'] || this.p.defaultNodeColor) :
                    this.p.defaultLabelColor;
    ctx.fillText(
      node['label'],
      node['displayX'] + node['displaySize'] * 1.5,
      node['displayY'] + node['displaySize'] / 2
    );
  }
};

Plotter.prototype.isOnScreen = function(node) {
  if (isNaN(node['x']) || isNaN(node['y'])) {
    throw (new Error(
      'A node\'s coordinate is not a number (id: ' + node['id'] + ')')
    );
  }

  return (node['displayX'] + node['displaySize'] > -this.width / 3) &&
         (node['displayX'] - node['displaySize'] < this.width * 4 / 3) &&
         (node['displayY'] + node['displaySize'] > -this.height / 3) &&
         (node['displayY'] - node['displaySize'] < this.height * 4 / 3);
};
