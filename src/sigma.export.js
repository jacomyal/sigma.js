// Hardcoded export for the node.js version:
var sigma = this.sigma,
    conrad = this.conrad;

sigma.conrad = conrad;

if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports)
    exports = module.exports = sigma;
  exports.sigma = sigma;
}
