var sigma = (function() {
// Define local shortcut:
var s = {};
var id = 0;

// Define packages:
s.tools = {};
s.classes = {};

s.init = function(dom) {
  return new Sigma(dom, (id++).toString());
};

s.fps = function(v) {
  if (v != undefined) {
    this.scheduler.fps(v);
    return this;
  }else {
    this.scheduler.fps(v);
  }
}
