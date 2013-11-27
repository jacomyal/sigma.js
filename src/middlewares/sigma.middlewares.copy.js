;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize packages:
  sigma.utils.pkg('sigma.middlewares');

  /**
   * This middleware will just copy the graphic properties.
   *
   * @param {?string} readPrefix  The read prefix.
   * @param {?string} writePrefix The write prefix.
   */
  sigma.middlewares.copy = function(readPrefix, writePrefix) {
    var i,
        l,
        a;

    if (writePrefix + '' === readPrefix + '')
      return;

    a = this.graph.nodes();
    for (i = 0, l = a.length; i < l; i++) {
      a[i][writePrefix + 'x'] = a[i][readPrefix + 'x'];
      a[i][writePrefix + 'y'] = a[i][readPrefix + 'y'];
      a[i][writePrefix + 'size'] = a[i][readPrefix + 'size'];
    }

    a = this.graph.edges();
    for (i = 0, l = a.length; i < l; i++)
      a[i][writePrefix + 'size'] = a[i][readPrefix + 'size'];
  };
}).call(this);
