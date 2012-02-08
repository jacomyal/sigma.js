function Sigma(root, id) {
  var self = this;
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
  initCanvas('edges');
  initCanvas('nodes');
  initCanvas('labels');
  initCanvas('mouse');

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
  self.mousecaptor.bind('drag zooming', function(e) {
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
  function onWorkerKilled(e) {
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

  function computeOneStep() {
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

  function resize(w, h) {
    if (w != undefined && h != undefined) {
      self.width = w;
      self.height = h;
    }else {
      self.width = self.dom.offsetWidth;
      self.height = self.dom.offsetHeight;
    }

    for (var k in self.canvas) {
      self.canvas[k].setAttribute('width', self.width + 'px');
      self.canvas[k].setAttribute('height', self.height + 'px');
    }

    self.draw(
      self.p.lastNodes,
      self.p.lastEdges,
      self.p.lastLabels,
      true
    );
    return self;
  };

  function clearSchedule() {
    sigma.scheduler.removeWorker(
      'node_' + self.id, 2
    ).removeWorker(
      'edge_' + self.id, 2
    ).removeWorker(
      'label_' + self.id, 2
    ).stop();
    return self;
  };

  function initCanvas(type) {
    self.canvas[type] = document.createElement('canvas');
    self.canvas[type].style.position = 'absolute';
    self.canvas[type].setAttribute('id', 'sigma_' + type + '_' + self.id);
    self.canvas[type].setAttribute('class', 'sigma_' + type + '_canvas');
    self.canvas[type].setAttribute('width', self.width + 'px');
    self.canvas[type].setAttribute('height', self.height + 'px');

    self.dom.appendChild(self.canvas[type]);
    return self;
  };

  function startLayout() {
    sigma.scheduler.removeWorker(
      'layout_' + self.id, 2
    ).bind(
      'killed',
      self.onWorkerKilled
    );

    self.busy = true;

    self.forceatlas2.init();
    self.computeOneStep();
    return self;
  };

  function stopLayout() {
    self.busy = false;
    return self;
  };

  // nodes, edges, labels:
  // - 0: Don't display them
  // - 1: Display them (asynchronous)
  // - 2: Display them (synchronous)
  function draw(nodes, edges, labels, safe) {

    if (safe && self.busy) {
      return self;
    }

    var n = nodes == undefined ? self.p.nodes : nodes;
    var e = edges == undefined ? self.p.edges : edges;
    var l = labels == undefined ? self.p.labels : labels;

    self.p.lastNodes = n;
    self.p.lastEdges = e;
    self.p.lastLabels = l;

    // Remove workers:
    self.clearSchedule();

    // Rescale graph:
    self.graph.rescale(self.width, self.height);
    self.graph.translate(
      self.mousecaptor.stageX,
      self.mousecaptor.stageY,
      self.mousecaptor.ratio
    );

    // Clear scene:
    for (var k in self.canvas) {
      self.canvas[k].width = self.canvas[k].width;
    }

    self.plotter.currentEdgeIndex = 0;
    self.plotter.currentNodeIndex = 0;
    self.plotter.currentLabelIndex = 0;

    var previous = null;
    var start = false;

    if (n) {
      if (n > 1) {
        // TODO: Make self better
        while (self.plotter.worker_drawNode()) {}
      }else {
        sigma.scheduler.addWorker(
          self.plotter.worker_drawNode,
          'node_' + self.id,
          false
        );

        start = true;
        previous = 'node_' + self.id;
      }
    }

    if (l) {
      if (l > 1) {
        // TODO: Make self better
        while (self.plotter.worker_drawLabel()) {}
      } else {
        if (previous) {
          sigma.scheduler.queueWorker(
            self.plotter.worker_drawLabel,
            'label_' + self.id,
            previous
          );
        } else {
          sigma.scheduler.addWorker(
            self.plotter.worker_drawLabel,
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
        // TODO: Make self better
        while (self.plotter.worker_drawEdge()) {}
      }else {
        if (previous) {
          sigma.scheduler.queueWorker(
            self.plotter.worker_drawEdge,
            'edge_' + self.id,
            previous
          );
        }else {
          sigma.scheduler.addWorker(
            self.plotter.worker_drawEdge,
            'edge_' + self.id,
            false
          );
        }

        start = true;
        previous = 'edge_' + self.id;
      }
    }

    start && sigma.scheduler.start();
    return self;
  };

  function getGraph() {
    return self.graph;
  };

  this.resize = resize;
  this.getGraph = getGraph;

  this.stopLayout = stopLayout;
  this.startLayout = startLayout;
  this.clearSchedule = clearSchedule;
  
  this.draw = draw;
}