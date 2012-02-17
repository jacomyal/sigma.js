function SigmaPublic(sigmaInstance) {
  var s = sigmaInstance;
  var self = this;
  sigma.classes.EventDispatcher.call(this);

  // Config:
  this.config = function(a1, a2) {
    var res = s.config(a1, a2);
    return res == s ? self : res;
  };

  this.config_drawing = function(a1, a2) {
    var res = s.plotter.config(a1, a2);
    return res == s.plotter ? self : res;
  };

  this.config_mouse = function(a1, a2) {
    var res = s.mousecaptor.config(a1, a2);
    return res == s.mousecaptor ? self : res;
  };

  this.config_graph = function(a1, a2) {
    var res = s.graph.config(a1, a2);
    return res == s.graph ? self : res;
  };

  this.getMouse = function() {
    return {
      mouseX: s.mousecaptor.mouseX,
      mouseY: s.mousecaptor.mouseY,
      down: s.mousecaptor.isMouseDown
    };
  };

  // Actions:
  this.position = function(stageX, stageY, ratio) {
    if (arguments.length == 0) {
      return {
        stageX: s.mousecaptor.stageX,
        stageY: s.mousecaptor.stageY,
        ratio: s.mousecaptor.ratio
      };
    }else {
      s.mousecaptor.stageX = stageX != undefined ?
        stageX :
        s.mousecaptor.stageX;
      s.mousecaptor.stageY = stageY != undefined ?
        stageY :
        s.mousecaptor.stageY;
      s.mousecaptor.ratio = ratio != undefined ?
        ratio :
        s.mousecaptor.ratio;

      return self;
    }
  };

  this.resize = function(w, h) {
    s.resize(w, h);
    return self;
  };

  this.draw = function(nodes, edges, labels, safe) {
    s.draw(nodes, edges, labels, safe);
    return self;
  };

  // Tasks methods:
  this.addGenerator = function(id, task, condition) {
    sigma.scheduler.addGenerator(id + '_ext_' + s.id, task, condition);
    return self;
  };

  this.removeGenerator = function(id) {
    sigma.scheduler.removeGenerator(id + '_ext_' + s.id);
    return self;
  };

  // Graph methods:
  this.addNode = function(id, params) {
    s.graph.addNode(id, params);
    return self;
  };

  this.addEdge = function(id, source, target, params) {
    s.graph.addEdge(id, source, target, params);
    return self;
  }

  this.dropNode = function(v) {
    s.graph.dropNode(v);
    return self;
  };

  this.dropEdge = function(v) {
    s.graph.dropEdge(v);
    return self;
  };

  this.getGraph = function() {
    return s.graph;
  };

  this.emptyGraph = function() {
    s.graph.empty();
    return self;
  };

  this.getNodesCount = function() {
    return s.graph.nodes.length;
  };

  this.getEdgesCount = function() {
    return s.graph.edges.length;
  };

  // Monitoring
  this.activateMonitoring = function() {
    return s.monitor.activate();
  };

  this.desactivate = function() {
    return s.monitor.desactivate();
  };

  // Events
  s.bind('downnodes upnodes', function(e) {
    self.dispatch(e.type, e.content);
  });

  s.graph.bind('overnodes outnodes', function(e) {
    self.dispatch(e.type, e.content);
  });
}
