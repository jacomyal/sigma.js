// Hardcoded export for the node.js version:
const sigma = this.sigma;

const conrad = this.conrad;

sigma.conrad = conrad;

// Dirty polyfills to permit sigma usage in node
if (typeof HTMLElement === "undefined") HTMLElement = function() {};

if (typeof window === "undefined")
  window = {
    addEventListener() {}
  };

if (typeof exports !== "undefined") {
  if (typeof module !== "undefined" && module.exports)
    exports = module.exports = sigma;
  exports.sigma = sigma;
}
