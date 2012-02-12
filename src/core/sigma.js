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

  this.tasks = {};

  this.canvas = {};
  initCanvas('edges');
  initCanvas('nodes');
  initCanvas('labels');
  initCanvas('hover');
  initCanvas('mouse');

  // Intern classes:
  this.graph = new sigma.classes.Graph();
  this.plotter = new Plotter(
    this.canvas.nodes.getContext('2d'),
    this.canvas.edges.getContext('2d'),
    this.canvas.labels.getContext('2d'),
    this.canvas.hover.getContext('2d'),
    this.graph,
    this.width,
    this.height
  );
  this.mousecaptor = new MouseCaptor(
    this.canvas.mouse,
    this.graph,
    this.id
  );

  // Interaction listeners:
  self.mousecaptor.bind('drag zooming', function(e) {
    if (getRunningTasks() == 0) {
      self.draw(
        self.p.auto ? 2 : self.p.nodes,
        self.p.auto ? 0 : self.p.edges,
        self.p.auto ? 2 : self.p.labels
      );
    }
  }).bind('stopdrag stopzooming', function(e) {
    if (getRunningTasks() == 0) {
      self.draw(
        self.p.auto ? 2 : self.p.nodes,
        self.p.auto ? 1 : self.p.edges,
        self.p.auto ? 2 : self.p.labels
      );
    }
  }).bind('move', drawHover);

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

  // addTask() will execute the worker while it returns
  // 'true'. Then, it will execute the condition, and starts
  // again if it is 'true'.
  function addTask(id, worker, condition) {
    if (self.tasks[id + '_ext_' + self.id] != undefined) {
      return self;
    }

    self.tasks[id + '_ext_' + self.id] = {
      'worker': worker,
      'condition': condition
    };

    getRunningTasks() == 0 && startTasks();
    return self;
  };

  function removeTask(id) {
    if (self.tasks[id + '_ext_' + self.id]) {
      self.tasks[id + '_ext_' + self.id].on = false;
    }
    self.tasks[id + '_ext_' + self.id]['delete'] = true;
    return self;
  };

  function getRunningTasks() {
    return Object.keys(self.tasks).filter(function(id) {
      return !!self.tasks[id].on;
    }).length;
  };

  function startTasks() {
    if (!Object.keys(self.tasks).length) {
      self.draw();
    }else {
      self.draw(
        self.p.auto ? 2 : self.p.nodes,
        self.p.auto ? 0 : self.p.edges,
        self.p.auto ? 2 : self.p.labels
      );

      sigma.scheduler.unbind('killed', onTaskEnded);
      sigma.scheduler.injectFrame(function() {
        for (var k in self.tasks) {
          self.tasks[k].on = true;
          sigma.scheduler.addWorker(
            self.tasks[k].worker,
            k,
            false
          );
        }
      });

      sigma.scheduler.bind('killed', onTaskEnded).start();
    }

    return self;
  };

  function onTaskEnded(e) {
    if (self.tasks[e.content.name] != undefined) {
      if (self.tasks[e.content.name]['delete'] ||
          !self.tasks[e.content.name].condition()) {
        delete self.tasks[e.content.name];
      }else {
        self.tasks[e.content.name].on = false;
      }

      if (getRunningTasks() == 0) {
        startTasks();
      }
    }
  };

  // nodes, edges, labels:
  // - 0: Don't display them
  // - 1: Display them (asynchronous)
  // - 2: Display them (synchronous)
  function draw(nodes, edges, labels, safe) {
    if (safe && getRunningTasks() > 0) {
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
      self.canvas[k].getContext('2d').clearRect(
        0,
        0,
        self.canvas[k].width,
        self.canvas[k].height
      );
    }

    self.plotter.currentEdgeIndex = 0;
    self.plotter.currentNodeIndex = 0;
    self.plotter.currentLabelIndex = 0;

    var previous = null;
    var start = false;

    if (n) {
      if (n > 1) {
        // TODO: Make this better
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
        // TODO: Make this better
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
        // TODO: Make this better
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

  function drawHover() {
    self.canvas.hover.getContext('2d').clearRect(
      0,
      0,
      self.canvas.hover.width,
      self.canvas.hover.height
    );

    self.graph.checkHover(
      self.mousecaptor.mouseX,
      self.mousecaptor.mouseY
    );

    self.graph.nodes.forEach(function(node) {
      if (node['hover']) {
        self.plotter.drawHoverNode(node);
      }
    });
  }


  this.addTask = addTask;
  this.removeTask = removeTask;
  this.clearSchedule = clearSchedule;

  this.draw = draw;
  this.resize = resize;
}
