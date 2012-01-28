function Sigma(root, id) {
  this.id = id;

  this.dom = root;
  this.width = this.dom.offsetWidth;
  this.height = this.dom.offsetHeight;

  this.canvas = document.createElement('canvas');
  this.canvas.style.position = 'absolute';
  this.canvas.setAttribute('class', 'sigma_canvas');
  this.canvas.setAttribute('width', this.width + 'px');
  this.canvas.setAttribute('height', this.height + 'px');
  this.dom.appendChild(this.canvas);

  this.ctx = this.canvas.getContext('2d');

  this.graph = new Graph();
  this.plotter = new Plotter(this.ctx, this.graph, this.width, this.height);
}

Sigma.prototype.draw = function() {
  var self = this;

  // Remove workers:
  sigma.scheduler.removeWorker(
    'node_' + self.id
  ).removeWorker(
    'edge_' + self.id
  ).stop();

  // Rescale graph:
  this.graph.rescale(this.width, this.height);

  // Clear scene:
  this.canvas.width = this.canvas.width;

  this.plotter.currentEdgeIndex = 0;
  this.plotter.currentNodeIndex = 0;

  // Start workers:
  sigma.scheduler.addListener(
    'killed',
    function(e) {
      if (e.content['name'] == 'node_' + self.id) {
        sigma.scheduler.stop().removeListener('killed', self.onWorkerKilled);
        sigma.scheduler.addWorker(
          self.plotter.worker_drawEdge,
          'edge_' + self.id,
          false
        ).start();
      }
    }
  ).addWorker(
    this.plotter.worker_drawNode,
    'node_' + this.id,
    false
  ).start();
};

Sigma.prototype.getGraph = function() {
  return this.graph;
};
