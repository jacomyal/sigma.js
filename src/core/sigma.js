function Sigma(root, id) {
  var self = this;
  sigma.classes.Cascade.call(this);
  sigma.classes.EventDispatcher.call(this);

  this.id = id.toString();

  this.p = {
    auto: true,
    drawNodes: 2,
    drawEdges: 1,
    drawLabels: 2,
    lastNodes: 2,
    lastEdges: 0,
    lastLabels: 2
  };

  this.dom = root;
  this.width = this.dom.offsetWidth;
  this.height = this.dom.offsetHeight;

  // Intern classes:
  this.graph = new Graph();

  this.canvas = {};
  initDOM('edges', 'canvas');
  initDOM('nodes', 'canvas');
  initDOM('labels', 'canvas');
  initDOM('hover', 'canvas');
  this.plotter = new Plotter(
    this.canvas.nodes.getContext('2d'),
    this.canvas.edges.getContext('2d'),
    this.canvas.labels.getContext('2d'),
    this.canvas.hover.getContext('2d'),
    this.graph,
    this.width,
    this.height
  );

  initDOM('monitor', 'div');
  this.monitor = new Monitor(
    this,
    this.canvas.monitor
  );

  initDOM('mouse', 'canvas');
  this.mousecaptor = new MouseCaptor(
    this.canvas.mouse,
    this.graph,
    this.id
  );

  // Interaction listeners:
  this.mousecaptor.bind('drag zooming', function(e) {
    self.draw(
      self.p.auto ? 2 : self.p.drawNodes,
      self.p.auto ? 0 : self.p.drawEdges,
      self.p.auto ? 2 : self.p.drawLabels,
      true
    );
  }).bind('stopdrag stopzooming', function(e) {
    self.draw(
      self.p.auto ? 2 : self.p.drawNodes,
      self.p.auto ? 1 : self.p.drawEdges,
      self.p.auto ? 2 : self.p.drawLabels,
      true
    );
  }).bind('mousedown mouseup', function(e) {
    var targeted = self.graph.nodes.filter(function(n) {
      return !!n['hover'];
    });

    if (targeted.length) {
      self.dispatch(
        e['type'] == 'mousedown' ?
          'downnodes' :
          'upnodes',
        targeted
      );
    }
  }).bind('move', drawHover);

  sigma.chronos.bind('startgenerators', function() {
    self.draw(
      self.p.auto ? 2 : self.p.drawNodes,
      self.p.auto ? 0 : self.p.drawEdges,
      self.p.auto ? 2 : self.p.drawLabels
    );
  }).bind('stopgenerators', function() {
    self.draw();
  });

  function resize(w, h) {
    var oldW = self.width, oldH = self.height;

    if (w != undefined && h != undefined) {
      self.width = w;
      self.height = h;
    }else {
      self.width = self.dom.offsetWidth;
      self.height = self.dom.offsetHeight;
    }

    if (oldW != self.width || oldH != self.height) {
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
    }
    return self;
  };

  function clearSchedule() {
    sigma.chronos.removeTask(
      'node_' + self.id, 2
    ).removeTask(
      'edge_' + self.id, 2
    ).removeTask(
      'label_' + self.id, 2
    ).stopTasks();
    return self;
  };

  function initDOM(type, dom) {
    self.canvas[type] = document.createElement(dom);
    self.canvas[type].style.position = 'absolute';
    self.canvas[type].setAttribute('id', 'sigma_' + type + '_' + self.id);
    self.canvas[type].setAttribute('class', 'sigma_' + type + '_' + dom);
    self.canvas[type].setAttribute('width', self.width + 'px');
    self.canvas[type].setAttribute('height', self.height + 'px');

    self.dom.appendChild(self.canvas[type]);
    return self;
  };

  // nodes, edges, labels:
  // - 0: Don't display them
  // - 1: Display them (asynchronous)
  // - 2: Display them (synchronous)
  function draw(nodes, edges, labels, safe) {
    if (safe && sigma.chronos.getGeneratorsIDs().some(function(id) {
      var m = id.match(/_ext_(.*)$/);
      return m && (m[1] == self.id);
    })) {
      return self;
    }

    var n = nodes == undefined ? self.p.drawNodes : nodes;
    var e = edges == undefined ? self.p.drawEdges : edges;
    var l = labels == undefined ? self.p.drawLabels : labels;

    self.p.lastNodes = n;
    self.p.lastEdges = e;
    self.p.lastLabels = l;

    // Remove tasks:
    clearSchedule();

    // Rescale graph:
    self.graph.rescale(self.width, self.height);
    self.graph.translate(
      self.mousecaptor.stageX,
      self.mousecaptor.stageY,
      self.mousecaptor.ratio
    );

    // Clear scene:
    for (var k in self.canvas) {
      if (self.canvas[k].nodeName.toLowerCase() == 'canvas') {
        self.canvas[k].getContext('2d').clearRect(
          0,
          0,
          self.canvas[k].width,
          self.canvas[k].height
        );
      }
    }

    self.plotter.currentEdgeIndex = 0;
    self.plotter.currentNodeIndex = 0;
    self.plotter.currentLabelIndex = 0;

    var previous = null;
    var start = false;

    if (n) {
      if (n > 1) {
        while (self.plotter.task_drawNode()) {}
      }else {
        sigma.chronos.addTask(
          self.plotter.task_drawNode,
          'node_' + self.id,
          false
        );

        start = true;
        previous = 'node_' + self.id;
      }
    }

    if (l) {
      if (l > 1) {
        while (self.plotter.task_drawLabel()) {}
      } else {
        if (previous) {
          sigma.chronos.queueTask(
            self.plotter.task_drawLabel,
            'label_' + self.id,
            previous
          );
        } else {
          sigma.chronos.addTask(
            self.plotter.task_drawLabel,
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
        while (self.plotter.task_drawEdge()) {}
      }else {
        if (previous) {
          sigma.chronos.queueTask(
            self.plotter.task_drawEdge,
            'edge_' + self.id,
            previous
          );
        }else {
          sigma.chronos.addTask(
            self.plotter.task_drawEdge,
            'edge_' + self.id,
            false
          );
        }

        start = true;
        previous = 'edge_' + self.id;
      }
    }

    self.dispatch(
      'draw'
    );

    drawHover();

    start && sigma.chronos.runTasks();
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

  // Apply plugins:
  for (var i = 0; i < local.plugins.length; i++) {
    local.plugins[i](this);
  }

  this.draw = draw;
  this.resize = resize;
  this.initDOM = initDOM;
  this.drawHover = drawHover;
  this.clearSchedule = clearSchedule;
}

