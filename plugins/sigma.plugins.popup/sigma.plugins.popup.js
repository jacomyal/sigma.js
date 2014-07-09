/**
 * This plugin provides a method to display a popup at a specific event, e.g.
 * to display some node properties on node hover. Check the sigma.plugins.popup
 * function doc or the examples/popup.html code sample to know more.
 */
(function() {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  sigma.utils.pkg('sigma.plugins');
  sigma.utils.pkg('sigma.plugins.popup');

  var settings = {
    node: {
      show: 'clickNode',
      hide: 'clickStage',
      cssClass: 'node-popup',
      template: '',   // HTML string
      renderer: null  // function
    }
  };

  /**
   * Helpers
   */
  function extend() {
    var i,
        k,
        res = {},
        l = arguments.length;

    for (i = l - 1; i >= 0; i--)
      for (k in arguments[i])
        res[k] = arguments[i][k];
    return res;
  };


  var popup;

  function createNodePopup(s, options, node, x, y) {
    console.log(node);
    removePopup();

    // Create the DOM element:
    //popup = parser.parseFromString(template, "text/html"); //HTMLDocument
    popup = document.createElement('div');
    if (options.renderer) {
      // Copy the node:
      var clonedNode = Object.create(null), 
          k;
      for (k in node)
        clonedNode[k] = node[k];

      popup.innerHTML = options.renderer.call(s.graph, clonedNode, options.template);
    } else {
      popup.innerHTML = options.template;
    }

    // Style it:
    popup.className = options.cssClass || '';
    popup.style.position = 'absolute';
    popup.style.left = x;
    popup.style.top = y;

    // Insert the element in the DOM:
    s.renderers[0].container.appendChild(popup);
    //s.renderers[0].container.parentNode.insertBefore(popup, s.renderers[0].container.parentNode.firstChild);
  };

  function removePopup() {
    if (popup && popup.parentNode) {
      // Remove from the DOM:
      popup.parentNode.removeChild(popup);
      popup = null;
    }
  };

  sigma.plugins.popup.nodes = function(s, options) {
    if (options.renderer !== undefined && typeof options.renderer !== 'function')
      throw 'The render of the node popup must be a function.';

    var o = extend(options, settings.node);

    s.bind(o.show, function(event) {
      //console.log(event);

      var n = event.data.node || event.data.nodes[0];

      createNodePopup(
        s, 
        o,
        n,
        event.data.captor.clientX,
        event.data.captor.clientY);
    });

    s.bind(o.hide, function(event) {
      setTimeout(removePopup, 1);
    });
  };

}).call(window);
