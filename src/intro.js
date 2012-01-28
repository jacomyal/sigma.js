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
