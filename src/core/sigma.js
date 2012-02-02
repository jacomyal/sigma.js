function Sigma(root, id) {
  this.id = id;

  this.dom = root;
  this.width = this.dom.offsetWidth;
  this.height = this.dom.offsetHeight;

  this.nodesCanvas = document.createElement('canvas');
  this.nodesCanvas.style.position = 'absolute';
  this.nodesCanvas.setAttribute('id', 'sigma_' + this.id);
  this.nodesCanvas.setAttribute('class', 'sigma_nodes_canvas');
  this.nodesCanvas.setAttribute('width', this.width + 'px');
  this.nodesCanvas.setAttribute('height', this.height + 'px');

  this.edgesCanvas = document.createElement('canvas');
  this.edgesCanvas.style.position = 'absolute';
  this.edgesCanvas.setAttribute('id', 'sigma_' + this.id);
  this.edgesCanvas.setAttribute('class', 'sigma_nodes_canvas');
  this.edgesCanvas.setAttribute('width', this.width + 'px');
  this.edgesCanvas.setAttribute('height', this.height + 'px');

  this.dom.appendChild(this.edgesCanvas);
  this.dom.appendChild(this.nodesCanvas);

  this.nodesCtx = this.nodesCanvas.getContext('2d');
  this.edgesCtx = this.edgesCanvas.getContext('2d');

  // Intern classes:
  this.graph = new sigma.classes.Graph();
  this.plotter = new Plotter(
    this.nodesCtx,
    this.edgesCtx,
    this.graph,
    this.width,
    this.height
  );
  this.mousecaptor = new MouseCaptor(
    this.nodesCanvas,
    this.graph,
    this.id
  );

  // Interaction listeners:
  var self = this;
  this.mousecaptor.addListener('drag zooming', function(e) {
    console.log(e['type']);
    self.draw(true, false, false, true);
  }).addListener('stopdrag stopzooming', function(e) {
    console.log(e['type']);
    self.draw(true, true, false, true);
  });
}

Sigma.prototype.resize = function() {
  this.width = this.dom.offsetWidth;
  this.height = this.dom.offsetHeight;

  this.nodesCanvas.setAttribute('width', this.width + 'px');
  this.nodesCanvas.setAttribute('height', this.height + 'px');

  this.edgesCanvas.setAttribute('width', this.width + 'px');
  this.edgesCanvas.setAttribute('height', this.height + 'px');

  this.draw(true, true, false, true);
};

Sigma.prototype.clearSchedule = function() {
  var self = this;
  sigma.scheduler.removeWorker(
    'node_' + self.id, 2
  ).removeWorker(
    'edge_' + self.id, 2
  ).stop();
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
  this.nodesCanvas.width = this.nodesCanvas.width;
  this.edgesCanvas.width = this.edgesCanvas.width;
  this.plotter.currentEdgeIndex = 0;
  this.plotter.currentNodeIndex = 0;

  // Start workers:
  if (nodes) {
    sigma.scheduler.addWorker(
      this.plotter.worker_drawNode,
      'node_' + self.id,
      false
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
    ).start();
  }else {
    throw new Error('Nothing to draw');
  }
};

Sigma.prototype.getGraph = function() {
  return this.graph;
};
