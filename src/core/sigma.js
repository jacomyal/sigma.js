function Sigma(root, id) {
  this.id = id;

  this.dom = root;
  this.width = this.dom.offsetWidth;
  this.height = this.dom.offsetHeight;

  this.canvas = document.createElement('canvas');
  this.canvas.style.position = 'absolute';
  this.canvas.setAttribute('id', 'sigma_' + this.id);
  this.canvas.setAttribute('class', 'sigma_canvas');
  this.canvas.setAttribute('width', this.width + 'px');
  this.canvas.setAttribute('height', this.height + 'px');
  this.dom.appendChild(this.canvas);

  this.ctx = this.canvas.getContext('2d');

  // Intern classes:
  this.graph = new sigma.classes.Graph();
  this.plotter = new Plotter(this.ctx, this.graph, this.width, this.height);
  this.mousecaptor = new MouseCaptor(this.canvas, this.graph);
}

Sigma.prototype.resize = function() {
  this.width = this.dom.offsetWidth;
  this.height = this.dom.offsetHeight;

  this.canvas.setAttribute('width', this.width + 'px');
  this.canvas.setAttribute('height', this.height + 'px');

  this.draw();
};

Sigma.prototype.clearSchedule = function() {
  var self = this;
  sigma.scheduler.removeWorker(
    'node_' + self.id, true
  ).removeWorker(
    'edge_' + self.id, true
  ).stop();
};

Sigma.prototype.draw = function(nodes, edges, scheduled) {
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
  this.canvas.width = this.canvas.width;
  this.plotter.currentEdgeIndex = 0;
  this.plotter.currentNodeIndex = 0;

  // Start workers:
  sigma.scheduler.addWorker(
    this.plotter.worker_drawNode,
    'node_' + self.id,
    false
  ).queueWorker(
    this.plotter.worker_drawEdge,
    'edge_' + self.id,
    'node_' + self.id
  ).start();
};

Sigma.prototype.getGraph = function() {
  return this.graph;
};
