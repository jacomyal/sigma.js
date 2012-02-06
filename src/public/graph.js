sigma.classes.Graph = function() {
  sigma.classes.EventDispatcher.call(this);

  this.nodes = [];
  this.nodesIndex = {};
  this.edges = [];
  this.edgesIndex = {};
};

sigma.classes.Graph.prototype.addNode = function(id, params) {
  if (this.nodesIndex[id]) {
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
    'label': id,
    'id': id,
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

  this.nodes.push(n);
  this.nodesIndex[id] = n;

  return this;
};

sigma.classes.Graph.prototype.dropNode = function(v) {
  var a = (v instanceof Array ? v : [v]) || [];
  var self = this;

  a.forEach(function(id) {
    if (self.nodesIndex[id]) {
      // TODO
      // Make this better
      var index = null;
      self.nodes.some(function(n, i) {
        if (n['id'] == id) {
          index = i;
          return true;
        }
        return false;
      });

      index != null && self.nodes.splice(i, 1);
      delete self.nodesIndex[id];

      var edgesToRemove = [];
      self.edges = self.edges.filter(function(e) {
        if (e['source']['id'] == id || e['target']['id'] == id) {
          delete self.edgesIndex[e['id']];
          return false;
        }
        return true;
      });
    }
  });

  return this;
};

sigma.classes.Graph.prototype.addEdge = function(id, source, target, params) {
  if (this.edgesIndex[id]) {
    throw new Error('Edge "' + id + '" already exists.');
  }

  if (!this.nodesIndex[source]) {
    var s = 'Edge\'s source "' + source + '" does not exist yet.';
    throw new Error(s);
  }

  if (!this.nodesIndex[target]) {
    var s = 'Edge\'s target "' + target + '" does not exist yet.';
    throw new Error(s);
  }

  params = params || {};
  var e = {
    'source': this.nodesIndex[source],
    'target': this.nodesIndex[target],
    'size': 1,
    'weight': 1,
    'displaySize': 0.5,
    'label': id,
    'id': id,
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

  this.edges.push(e);
  this.edgesIndex[id] = e;

  return this;
};

sigma.classes.Graph.prototype.dropEdge = function(v) {
  var a = (v instanceof Array ? v : [v]) || [];
  var self = this;

  a.forEach(function(id) {
    if (self.edgesIndex[id]) {
      // TODO
      // Make this better
      var index = null;
      self.edges.some(function(n, i) {
        if (n['id'] == id) {
          index = i;
          return true;
        }
        return false;
      });

      index != null && self.edges.splice(i, 1);
      delete self.edgesIndex[id];
    }
  });

  return this;
};

sigma.classes.Graph.prototype.rescale = function(w, h, sMin, sMax, tMin, tMax) {
  var weightMax = 0, sizeMax = 0;
  var self = this;

  this.nodes.forEach(function(node) {
    sizeMax = Math.max(node['size'], sizeMax);
  });

  this.edges.forEach(function(edge) {
    weightMax = Math.max(edge['size'], weightMax);
  });

  if (sizeMax == 0) {
    return;
  }

  if (weightMax == 0) {
    return;
  }

  // Recenter the nodes:
  var xMin, xMax, yMin, yMax;
  this.nodes.forEach(function(node) {
    xMax = Math.max(node['x'], xMax || node['x']);
    xMin = Math.min(node['x'], xMin || node['x']);
    yMax = Math.max(node['y'], yMax || node['y']);
    yMin = Math.min(node['y'], yMin || node['y']);
  });

  var scale = Math.min(0.9 * w / (xMax - xMin),
                       0.9 * h / (yMax - yMin));

  // Size homothetic parameters:
  var a, b;
  if (!sMax && !sMin) {
    a = 1;
    b = 0;
  }else if (sMax == sMin) {
    a = 0;
    b = sMax;
  }else {
    a = (sMax - sMin) / sizeMax;
    b = sMin;
  }

  var c, d;
  if (!tMax && !tMin) {
    c = 1;
    d = 0;
  }else if (tMax == tMin) {
    c = 0;
    d = tMin;
  }else {
    c = (tMax - tMin) / weightMax;
    d = tMin;
  }

  // Rescale the nodes:
  this.nodes.forEach(function(node) {
    node['displaySize'] = node['size'] * a + b;

    if (!node['isFixed']) {
      node['displayX'] = (node['x'] - (xMax + xMin) / 2) * scale + w / 2;
      node['displayY'] = (node['y'] - (yMax + yMin) / 2) * scale + h / 2;
    }
  });

  this.edges.forEach(function(edge) {
    edge['displaySize'] = edge['size'] * c + d;
  });
};

sigma.classes.Graph.prototype.translate = function(sceneX, sceneY, ratio, pow) {
  var sizeRatio = Math.pow(ratio, pow || 1 / 2);

  this.nodes.forEach(function(node) {
    if (!node['isFixed']) {
      node['displayX'] = node['displayX'] * ratio + sceneX;
      node['displayY'] = node['displayY'] * ratio + sceneY;
    }

    node['displaySize'] = node['displaySize'] * sizeRatio;
  });
};
