(function() {
// Define local shortcut:
var id = 0;

// Define local package:
var local = {};
local.plugins = [];

sigma.init = function(dom) {
  var inst = new Sigma(dom, (++id).toString());
  sigma.instances[id] = new SigmaPublic(inst);
  return sigma.instances[id];
};

