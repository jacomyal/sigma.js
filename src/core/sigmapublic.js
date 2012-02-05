function SigmaPublic(inst) {
  var s = inst;

  this.sigmaConfig = function(a1, a2) {
    var res = s.config(a1, a2);
    return res == s ? this : res;
  }

  this.drawConfig = function(a1, a2) {
    var res = s.plotter.config(a1, a2);
    return res == s.plotter ? this : res;
  }

  this.layoutConfig = function(a1, a2) {
    var res = s.forceatlas2.config(a1, a2);
    return res == s.forceatlas2 ? this : res;
  }

  this.draw = function(nodes, edges, labels) {
    s.draw(nodes, edges, labels);
    return this;
  }

  this.getMouse = function() {
    return {
      mouseX: s.mousecaptor.mouseX,
      mouseY: s.mousecaptor.mouseY,
      down: s.mousecaptor.isMouseDown
    };
  }

  this.getStage = function(a1, a2) {
    return {
      stageX: s.mousecaptor.stageX,
      stageY: s.mousecaptor.stageY,
      ratio: s.mousecaptor.ratio
    };
  }

  this.resize = function(w, h) {
    s.resize(w, h);
    return this;
  }

  this.startLayout = function() {
    s.startLayout();
  }

  this.stopLayout = function() {
    s.stopLayout();
  }

  this.graph = s.graph;
}
