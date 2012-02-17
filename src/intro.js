(function() {
// Define local shortcut:
var id = 0;
sigma.instances = {};

sigma.init = function(dom) {
  var inst = new Sigma(dom, (id++).toString());
  sigma.instances[id] = new SigmaPublic(inst);
  return sigma.instances[id];
};
