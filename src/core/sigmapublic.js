function SigmaPublic(inst) {
  var s = inst;

  // Config:
  this.sigmaConfig = function(a1, a2) {
    var res = s.config(a1, a2);
    return res == s ? this : res;
  };

  this.drawConfig = function(a1, a2) {
    var res = s.plotter.config(a1, a2);
    return res == s.plotter ? this : res;
  };

  this.layoutConfig = function(a1, a2) {
    var res = s.forceatlas2.config(a1, a2);
    return res == s.forceatlas2 ? this : res;
  };

  this.draw = function(nodes, edges, labels) {
    s.draw(nodes, edges, labels);
    return this;
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

      return this;
    }
  };

  this.resize = function(w, h) {
    s.resize(w, h);
    return this;
  };

  this.startLayout = function() {
    s.startLayout();
  };

  this.stopLayout = function() {
    s.stopLayout();
  };

  this.addNode = function(id, params) {
    s.graph.addNode(id, params);
    return this;
  };

  this.addEdge = function(id, source, target, params) {
    s.graph.addEdge(id, source, target, params);
    return this;
  };

  this.dropNode = function(v) {
    s.graph.dropNode(v);
    return this;
  };

  this.dropEdge = function(v) {
    s.graph.dropEdge(v);
    return this;
  };

  this.getNodesCount = function() {
    return s.graph.nodes.length;
  }

  this.getEdgesCount = function() {
    return s.graph.edges.length;
  }
}
