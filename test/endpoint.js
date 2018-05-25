/**
 * Sigma.js Unit Tests Endpoint
 * =============================
 *
 * Registering every unit test.
 */
const util = require('util');

if (util.inspect.defaultOptions)
  util.inspect.defaultOptions.depth = null;

require('./camera.js');
require('./quadtree.js');
