function Sigma(root, id) {
  this.id = id;

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

  // Interaction listeners:
  var self = this;
  this.mousecaptor.addListener('drag zooming', function(e) {
    self.draw(true, false, true, true);
  }).addListener('stopdrag stopzooming', function(e) {
    self.draw(true, true, true, true);
  });
}

Sigma.prototype.resize = function() {
  this.width = this.dom.offsetWidth;
  this.height = this.dom.offsetHeight;

  for (var k in this.canvas) {
    this.canvas[k].setAttribute('width', this.width + 'px');
    this.canvas[k].setAttribute('height', this.height + 'px');
  }

  this.draw(true, true, true, true);
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
};

Sigma.prototype.initCanvas = function(type) {
  this.canvas[type] = document.createElement('canvas');
  this.canvas[type].style.position = 'absolute';
  this.canvas[type].setAttribute('id', 'sigma_' + type + '_' + this.id);
  this.canvas[type].setAttribute('class', 'sigma_' + type + '_canvas');
  this.canvas[type].setAttribute('width', this.width + 'px');
  this.canvas[type].setAttribute('height', this.height + 'px');

  this.dom.appendChild(this.canvas[type]);
};

Sigma.prototype.draw = function(nodes, edges, labels, scheduled) {
  var self = this;

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

  // Start workers:
  if (nodes) {
    sigma.scheduler.addWorker(
      this.plotter.worker_drawNode,
      'node_' + self.id,
      false
    );

    labels && sigma.scheduler.queueWorker(
      this.plotter.worker_drawLabel,
      'label_' + self.id,
      'node_' + self.id
    );

    edges && sigma.scheduler.queueWorker(
      this.plotter.worker_drawEdge,
      'edge_' + self.id,
      'node_' + self.id
    );

    sigma.scheduler.start();
  }else if (edges) {
    sigma.scheduler.addWorker(
      this.plotter.worker_drawEdge,
      'edge_' + self.id,
      false
    );

    labels && sigma.scheduler.addWorker(
      this.plotter.worker_drawLabel,
      'label_' + self.id,
      false
    );

    sigma.scheduler.start();
  }else if (labels) {
    sigma.scheduler.addWorker(
      this.plotter.worker_drawLabel,
      'label_' + self.id,
      false
    ).start();
  }else {
    throw new Error('Nothing to draw');
  }
};

Sigma.prototype.getGraph = function() {
  return this.graph;
};
