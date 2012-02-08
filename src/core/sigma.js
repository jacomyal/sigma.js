function Sigma(root, id) {
  sigma.classes.Cascade.call(this);
  sigma.classes.EventDispatcher.call(this);

  this.id = id;

  this.p = {
    auto: true,
    nodes: 2,
    edges: 0,
    labels: 2,
    lastNodes: 2,
    lastEdges: 0,
    lastLabels: 2
  };

  this.dom = root;
  this.width = this.dom.offsetWidth;
  this.height = this.dom.offsetHeight;

  this.canvas = {};
  this.initCanvas('edges');
  this.initCanvas('nodes');
  this.initCanvas('labels');
  this.initCanvas('mouse');

  // Intern classes:
  this.graph = new sigma.classes.Graph();
  this.plotter = new Plotter(
    this.canvas.nodes.getContext('2d'),
    this.canvas.edges.getContext('2d'),
    this.canvas.labels.getContext('2d'),
    this.graph,
    this.width,
    this.height
  );
  this.mousecaptor = new MouseCaptor(
    this.canvas.mouse,
    this.graph,
    this.id
  );
  this.forceatlas2 = new forceatlas2.ForceAtlas2(
    this.graph
  );

  this.busy = false;

  // Interaction listeners:
  var self = this;
  this.mousecaptor.bind('drag zooming', function(e) {
    if (!self.busy) {
      self.draw(
        self.p.auto ? 2 : self.p.nodes,
        self.p.auto ? 0 : self.p.edges,
        self.p.auto ? 2 : self.p.labels
      );
    }
  }).bind('stopdrag stopzooming', function(e) {
    if (!self.busy) {
      self.draw(
        self.p.auto ? 2 : self.p.nodes,
        self.p.auto ? 1 : self.p.edges,
        self.p.auto ? 2 : self.p.labels
      );
    }
  });

  // The following methods are not declared in the prototype
  // due to the scope issues (TODO: find a solution)
  this.onWorkerKilled = function(e) {
    if (e.content.name == 'layout_' + self.id) {
      self.draw(
        self.p.auto ? 2 : self.p.nodes,
        self.p.auto ? 0 : self.p.edges,
        self.p.auto ? 2 : self.p.labels
      );
      sigma.scheduler.unbind(
        'killed',
        self.onWorkerKilled
      ).injectFrame(self.computeOneStep);
    }
  };

  this.computeOneStep = function() {
    if (self.busy) {
      sigma.scheduler.addWorker(
        self.forceatlas2.atomicGo,
        'layout_' + self.id,
        false
      ).bind(
        'killed',
        self.onWorkerKilled
      ).start();
    }else {
      self.busy = false;
      self.draw();
    }
  };
}

Sigma.prototype.resize = function(w, h) {
  if (w != undefined && h != undefined) {
    this.width = w;
    this.height = h;
  }else {
    this.width = this.dom.offsetWidth;
    this.height = this.dom.offsetHeight;
  }

  for (var k in this.canvas) {
    this.canvas[k].setAttribute('width', this.width + 'px');
    this.canvas[k].setAttribute('height', this.height + 'px');
  }

  this.draw(
    this.p.lastNodes,
    this.p.lastEdges,
    this.p.lastLabels,
    true
  );
  return this;
};

Sigma.prototype.clearSchedule = function() {
  var self = this;
  sigma.scheduler.removeWorker(
    'node_' + self.id, 2
  ).removeWorker(
    'edge_' + self.id, 2
  ).removeWorker(
    'label_' + self.id, 2
  ).stop();
  return this;
};

Sigma.prototype.initCanvas = function(type) {
  this.canvas[type] = document.createElement('canvas');
  this.canvas[type].style.position = 'absolute';
  this.canvas[type].setAttribute('id', 'sigma_' + type + '_' + this.id);
  this.canvas[type].setAttribute('class', 'sigma_' + type + '_canvas');
  this.canvas[type].setAttribute('width', this.width + 'px');
  this.canvas[type].setAttribute('height', this.height + 'px');

  this.dom.appendChild(this.canvas[type]);
  return this;
};

Sigma.prototype.startLayout = function() {
  sigma.scheduler.removeWorker(
    'layout_' + this.id, 2
  ).bind(
    'killed',
    this.onWorkerKilled
  );

  this.busy = true;

  this.forceatlas2.init();
  this.computeOneStep();
  return this;
};

Sigma.prototype.stopLayout = function() {
  this.busy = false;
  return this;
};

// nodes, edges, labels:
// - 0: Don't display them
// - 1: Display them (asynchronous)
// - 2: Display them (synchronous)
Sigma.prototype.draw = function(nodes, edges, labels, safe) {
  var self = this;

  if (safe && this.busy) {
    return this;
  }

  var n = nodes == undefined ? self.p.nodes : nodes;
  var e = edges == undefined ? self.p.edges : edges;
  var l = labels == undefined ? self.p.labels : labels;

  self.p.lastNodes = n;
  self.p.lastEdges = e;
  self.p.lastLabels = l;

  // Remove workers:
  this.clearSchedule();

  // Rescale graph:
  this.graph.rescale(this.width, this.height);
  this.graph.translate(
    this.mousecaptor.stageX,
    this.mousecaptor.stageY,
    this.mousecaptor.ratio
  );

  // Clear scene:
  for (var k in this.canvas) {
    this.canvas[k].width = this.canvas[k].width;
  }

  this.plotter.currentEdgeIndex = 0;
  this.plotter.currentNodeIndex = 0;
  this.plotter.currentLabelIndex = 0;

  var previous = null;
  var start = false;

  if (n) {
    if (n > 1) {
      // TODO: Make this better
      while (this.plotter.worker_drawNode()) {}
    }else {
      sigma.scheduler.addWorker(
        this.plotter.worker_drawNode,
        'node_' + self.id,
        false
      );

      start = true;
      previous = 'node_' + self.id;
    }
  }

  if (l) {
    if (l > 1) {
      // TODO: Make this better
      while (this.plotter.worker_drawLabel()) {}
    } else {
      if (previous) {
        sigma.scheduler.queueWorker(
          this.plotter.worker_drawLabel,
          'label_' + self.id,
          previous
        );
      } else {
        sigma.scheduler.addWorker(
          this.plotter.worker_drawLabel,
          'label_' + self.id,
          false
        );
      }

      start = true;
      previous = 'label_' + self.id;
    }
  }

  if (e) {
    if (e > 1) {
      // TODO: Make this better
      while (this.plotter.worker_drawEdge()) {}
    }else {
      if (previous) {
        sigma.scheduler.queueWorker(
          this.plotter.worker_drawEdge,
          'edge_' + self.id,
          previous
        );
      }else {
        sigma.scheduler.addWorker(
          this.plotter.worker_drawEdge,
          'edge_' + self.id,
          false
        );
      }

      start = true;
      previous = 'edge_' + self.id;
    }
  }

  start && sigma.scheduler.start();
  return this;
};

Sigma.prototype.getGraph = function() {
  return this.graph;
};
