var sigma = (function() {
// Define local shortcut:
var s = {};
var id = 0;

// Define packages:
s.tools = {};
s.classes = {};
s.instances = {};

s.init = function(dom) {
  var inst = new Sigma(dom, (id++).toString());
  s.instances[id.toString()] = inst;
  return new SigmaPublic(inst);
};
