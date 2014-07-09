/*
 * DOMParser HTML extension
 * 2012-09-04
 * 
 * By Eli Grey, http://eligrey.com
 * Public domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

/*! @source https://gist.github.com/1129031 */
/*global document, DOMParser*/

/*(function(DOMParser) {
  "use strict";

  var
    DOMParser_proto = DOMParser.prototype
  , real_parseFromString = DOMParser_proto.parseFromString
  ;

  // Firefox/Opera/IE throw errors on unsupported types
  try {
    // WebKit returns null on unsupported types
    if ((new DOMParser).parseFromString("", "text/html")) {
      // text/html parsing is natively supported
      return;
    }
  } catch (ex) {}

  DOMParser_proto.parseFromString = function(markup, type) {
    if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {
      var
        doc = document.implementation.createHTMLDocument("")
      ;
            if (markup.toLowerCase().indexOf('<!doctype') > -1) {
              doc.documentElement.innerHTML = markup;
            }
            else {
              doc.body.innerHTML = markup;
            }
      return doc;
    } else {
      return real_parseFromString.apply(this, arguments);
    }
  };
}(DOMParser));*/

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
      delay: 300, // TODO
      cssClass: '',
      template: ''
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
  }


  var popup;
      //parser = new DOMParser();

  function createNodePopup(container, options, node, x, y) {
    removePopup();

    // Create the DOM element:
    //popup = parser.parseFromString(template, "text/html"); //HTMLDocument
    popup = document.createElement('div');
    popup.innerHTML = options.template;

    // Style it:
    popup.className = options.cssClass || '';
    popup.style.position = 'absolute';
    popup.style.left = x;
    popup.style.top = y;

    // Insert the element in the DOM:
    container.parentNode.appendChild(popup);
    //container.parentNode.insertBefore(popup, container.parentNode.firstChild);
  };

  function removePopup() {
    if (popup) {
      // Remove from the DOM:
      popup.parentNode.removeChild(popup);
      popup = null;
    }
  };

  sigma.plugins.popup.nodes = function(s, options) {
    var o = extend(options, settings.node);

    s.bind(o.show, function(event) {
      console.log(event);

      var n = event.data.node || event.data.nodes[0];

      createNodePopup(
        s.renderers[0].container, 
        o,
        n,
        event.clientX,
        event.clientY);
    });

    s.bind(o.hide, function(event) {
      setTimeout(removePopup, 1);
//      removePopup();
    });
  };

}).call(window);
