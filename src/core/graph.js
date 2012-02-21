function Graph() {
  var self = this;
  sigma.classes.Cascade.call(self);
  sigma.classes.EventDispatcher.call(self);

  this.p = {
    minNodeSize: 0,
    maxNodeSize: 0,
    minEdgeSize: 0,
    maxEdgeSize: 0,
    //   Scaling mode:
    //   - 'inside' (default)
    //   - 'outside'
    scalingMode: 'inside'
  };

  function addNode(id, params) {
    if (self.nodesIndex[id]) {
      throw new Error('Node "' + id + '" already exists.');
    }

    params = params || {};
    var n = {
      'x': 0,
      'y': 0,
      'size': 1,
      'degree': 0,
      'displayX': 0,
      'displayY': 0,
      'displaySize': 1,
      'label': id.toString(),
      'id': id.toString(),
      'attr': {}
    };

    for (var k in params) {
      switch (k) {
        case 'x':
        case 'y':
        case 'size':
          n[k] = +params[k];
          break;
        case 'color':
          n[k] = params[k];
          break;
        case 'label':
          n[k] = params[k];
          break;
        default:
          n['attr'][k] = params[k];
      }
    }

    self.nodes.push(n);
    self.nodesIndex[id.toString()] = n;

    return self;
  };

  function dropNode(v) {
    var a = (v instanceof Array ? v : [v]) || [];

    a.forEach(function(id) {
      if (self.nodesIndex[id]) {
        var index = null;
        self.nodes.some(function(n, i) {
          if (n['id'] == id) {
            index = i;
            return true;
          }
          return false;
        });

        index != null && self.nodes.splice(index, 1);
        delete self.nodesIndex[id];

        var edgesToRemove = [];
        self.edges = self.edges.filter(function(e) {
          if (e['source']['id'] == id || e['target']['id'] == id) {
            delete self.edgesIndex[e['id']];
            return false;
          }
          return true;
        });
      }else {
        sigma.log('Node "' + id + '" does not exist.');
      }
    });

    return self;
  };

  function addEdge(id, source, target, params) {
    if (self.edgesIndex[id]) {
      throw new Error('Edge "' + id + '" already exists.');
    }

    if (!self.nodesIndex[source]) {
      var s = 'Edge\'s source "' + source + '" does not exist yet.';
      throw new Error(s);
    }

    if (!self.nodesIndex[target]) {
      var s = 'Edge\'s target "' + target + '" does not exist yet.';
      throw new Error(s);
    }

    params = params || {};
    var e = {
      'source': self.nodesIndex[source],
      'target': self.nodesIndex[target],
      'size': 1,
      'weight': 1,
      'displaySize': 0.5,
      'label': id.toString(),
      'id': id.toString(),
      'attr': {}
    };
    e['source']['degree']++;
    e['target']['degree']++;

    for (var k in params) {
      switch (k) {
        case 'size':
          e[k] = +params[k];
          break;
        case 'color':
          e[k] = params[k].toString();
          break;
        case 'type':
          e[k] = params[k].toString();
          break;
        case 'label':
          e[k] = params[k];
          break;
        default:
          e['attr'][k] = params[k];
      }
    }

    self.edges.push(e);
    self.edgesIndex[id.toString()] = e;

    return self;
  };

  function dropEdge(v) {
    var a = (v instanceof Array ? v : [v]) || [];

    a.forEach(function(id) {
      if (self.edgesIndex[id]) {
        var index = null;
        self.edges.some(function(n, i) {
          if (n['id'] == id) {
            index = i;
            return true;
          }
          return false;
        });

        index != null && self.edges.splice(index, 1);
        delete self.edgesIndex[id];
      }else {
        sigma.log('Edge "' + id + '" does not exist.');
      }
    });

    return self;
  };

  function empty() {
    self.nodes = [];
    self.nodesIndex = {};
    self.edges = [];
    self.edgesIndex = {};

    return self;
  };

  function rescale(w, h) {
    var weightMax = 0, sizeMax = 0;

    self.nodes.forEach(function(node) {
      sizeMax = Math.max(node['size'], sizeMax);
    });

    self.edges.forEach(function(edge) {
      weightMax = Math.max(edge['size'], weightMax);
    });

    sizeMax = sizeMax || 1;
    weightMax = weightMax || 1;

    // Recenter the nodes:
    var xMin, xMax, yMin, yMax;
    self.nodes.forEach(function(node) {
      xMax = Math.max(node['x'], xMax || node['x']);
      xMin = Math.min(node['x'], xMin || node['x']);
      yMax = Math.max(node['y'], yMax || node['y']);
      yMin = Math.min(node['y'], yMin || node['y']);
    });

    var scale = self.p.scalingMode == 'outside' ?
                Math.max(0.95 * w / (xMax - xMin),
                         0.95 * h / (yMax - yMin)) :
                Math.min(0.95 * w / (xMax - xMin),
                         0.95 * h / (yMax - yMin));

    // Size homothetic parameters:
    var a, b;
    if (!self.p.maxNodeSize && !self.p.minNodeSize) {
      a = 1;
      b = 0;
    }else if (self.p.maxNodeSize == self.p.minNodeSize) {
      a = 0;
      b = self.p.maxNodeSize;
    }else {
      a = (self.p.maxNodeSize - self.p.minNodeSize) / sizeMax;
      b = self.p.minNodeSize;
    }

    var c, d;
    if (!self.p.maxEdgeSize && !self.p.minEdgeSize) {
      c = 1;
      d = 0;
    }else if (self.p.maxEdgeSize == self.p.minEdgeSize) {
      c = 0;
      d = self.p.minEdgeSize;
    }else {
      c = (self.p.maxEdgeSize - self.p.minEdgeSize) / weightMax;
      d = self.p.minEdgeSize;
    }

    // Rescale the nodes:
    self.nodes.forEach(function(node) {
      node['displaySize'] = node['size'] * a + b;

      if (!node['isFixed']) {
        node['displayX'] = (node['x'] - (xMax + xMin) / 2) * scale + w / 2;
        node['displayY'] = (node['y'] - (yMax + yMin) / 2) * scale + h / 2;
      }
    });

    self.edges.forEach(function(edge) {
      edge['displaySize'] = edge['size'] * c + d;
    });

    return self;
  };

  function translate(sceneX, sceneY, ratio, pow) {
    var sizeRatio = Math.pow(ratio, pow || 1 / 2);

    self.nodes.forEach(function(node) {
      if (!node['isFixed']) {
        node['displayX'] = node['displayX'] * ratio + sceneX;
        node['displayY'] = node['displayY'] * ratio + sceneY;
      }

      node['displaySize'] = node['displaySize'] * sizeRatio;
    });

    return self;
  };

  function checkHover(mX, mY) {
    var dX, dY, s, over = [], out = [];
    self.nodes.forEach(function(node) {
      dX = Math.abs(node['displayX'] - mX);
      dY = Math.abs(node['displayY'] - mY);
      s = node['displaySize'];

      var oldH = node['hover'];
      var newH = dX < s && dY < s && Math.sqrt(dX * dX + dY * dY) < s;

      if (oldH && !newH) {
        node['hover'] = false;
        out.push(node);
      }else if (newH && !oldH) {
        node['hover'] = true;
        over.push(node);
      }
    });

    over.length && self.dispatch('overnodes', over);
    out.length && self.dispatch('outnodes', out);

    return self;
  };

  function cloneNode(node) {
    return {
      'x': node['x'],
      'y': node['y'],
      'size': node['size'],
      'degree': node['degree'],
      'displayX': node['displayX'],
      'displayY': node['displayY'],
      'displaySize': node['displaySize'],
      'label': node['label'],
      'id': node['id'],
      'color': node['color'],
      'attr': node['attr']
    };
  };

  function cloneEdge(node) {
    return {
      'source': edge['source']['id'],
      'target': edge['target']['id'],
      'size': edge['size'],
      'weight': edge['weight'],
      'displaySize': edge['displaySize'],
      'label': edge['label'],
      'id': edge['id'],
      'attr': edge['attr'],
      'color': edge['color']
    };
  };

  function checkNode(node, copy) {
    for (var k in copy) {
      switch (k) {
        case 'x':
        case 'y':
        case 'size':
          node[k] = +copy[k];
          break;
        case 'color':
        case 'label':
          node[k] = copy[k].toString();
          break;
        default:
          node['attr'][k] = copy[k];
      }
    }

  };

  function checkEdge(edge, copy) {
    for (var k in copy) {
      switch (k) {
        case 'size':
          edge[k] = +copy[k];
          break;
        case 'source':
        case 'target':
          edge[k] = self.nodesIndex[k] || edge[k];
          break;
        case 'color':
        case 'type':
        case 'label':
          edge[k] = copy[k].toString();
          break;
        default:
          edge['attr'][k] = copy[k];
      }
    }

  };

  function iterNodes(fun, ids) {
    var a = ids ? ids.map(function(id) {
      return self.nodesIndex[id];
    }) : self.nodes;

    return a.map(cloneNode).forEach(fun).forEach(checkNode);
  };

  function iterEdges(fun, ids) {
    var a = ids ? ids.map(function(id) {
      return self.edgesIndex[id];
    }) : self.edges;

    return a.map(cloneEdge).forEach(fun).forEach(checkEdge);
  };

  empty();

  this.addNode = addNode;
  this.addEdge = addEdge;
  this.dropNode = dropNode;
  this.dropEdge = dropEdge;

  this.iterEdges = iterEdges;
  this.iterNodes = iterNodes;

  this.empty = empty;
  this.rescale = rescale;
  this.translate = translate;
  this.checkHover = checkHover;
}

