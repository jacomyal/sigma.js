(function() {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  sigma.utils.pkg('sigma.plugins');

  var _id = 0,
      _cache = {};

  /**
   * This function will change size for all nodes depending to their degree
   *
   * @param  {sigma}   s       		The related sigma instance.
   * @param  {object}  initialSize 	Start size property
   */
  sigma.plugins.relativeSize = function(s, initialSize) {
    var nodes = s.graph.nodes();

    // second create size for every node
    for(var i = 0; i < nodes.length; i++) {
      var degree = s.graph.degree(nodes[i].id);
      nodes[i].size = initialSize * Math.sqrt(degree);
    }
    s.refresh();
  };
}).call(window);
