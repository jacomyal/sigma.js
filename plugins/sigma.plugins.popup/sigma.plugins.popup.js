/**
 * This plugin provides a method to display a popup at a specific event, e.g.
 * to display some node properties on node hover. Check the sigma.plugins.popup
 * function doc or the examples/popup.html code sample to know more.
 */
(function() {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize package:
  sigma.utils.pkg('sigma.plugins');
  sigma.utils.pkg('sigma.plugins.popup');

  /**
   * Sigma Popup
   * =============================
   *
   * @author Sébastien Heymann <seb@linkurio.us> (Linkurious)
   * @version 0.1
   */

  var settings = {
    stage: {
      show: 'rightClickStage',
      hide: 'clickStage',
      cssClass: 'sigma-popup',
      position: '',       // top | bottom | left | right
      autoadjust: false,
      delay: 0,
      template: '',       // HTML string
      renderer: null      // function
    },
    node: {
      show: 'clickNode',
      hide: 'clickStage',
      cssClass: 'sigma-popup',
      position: '',       // top | bottom | left | right
      autoadjust: false,
      delay: 0,
      template: '',       // HTML string
      renderer: null      // function
    },
    edge: {
      show: 'clickEdge',
      hide: 'clickStage',
      cssClass: 'sigma-popup',
      position: '',       // top | bottom | left | right
      autoadjust: false,
      delay: 0,
      template: '',       // HTML string
      renderer: null      // function
    },
    doubleClickDelay: 800
  };

  var _popup,
      _timeoutHandle,
      _doubleClick = false;


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

  /**
   * This function removes the existing popup and creates a new popup for a
   * specified node or edge.
   *
   * Recognized parameters:
   * **********************
   * Here is the exhaustive list of every accepted parameters in the settings
   * object:
   *
   *   {?string}   template   The HTML template. It is directly inserted inside
   *                          a div element unless a renderer is specified.
   *   {?function} renderer   This function may process the template or be used
   *                          independently. It should return an HTML string.
   *                          It is executed at runtime. Its context is
   *                          sigma.graph.
   *   {?string}   cssClass   The CSS class attached to the top div element.
   *                          Default value: "sigma-popup".
   *   {?string}   position   The position of the popup regarding the mouse. If
   *                          it is not specified, the popup top-left corner is
   *                          positionned at the mouse position. Available
   *                          values: "top", "bottom", "left", "right".
   *   {?boolean}  autoadjust [EXPERIMENTAL] If true, tries to adjust the popup
   *                          position to be fully included in the body area.
   *                          Doesn't work on Firefox 30.
   *
   * @param {sigma}  s       The related sigma instance.
   * @param {object} o       The node or the edge.
   * @param {object} options The options related to the object.
   * @param {number} x       The X coordinate of the mouse.
   * @param {number} y       The Y coordinate of the mouse.
   */
  function createPopup(s, o, options, x, y) {
    removePopup();

    // Create the DOM element:
    _popup = document.createElement('div');
    if (options.renderer) {
      // Copy the object:
      var clone = Object.create(null),
          renderer, 
          k;
      for (k in o)
        clone[k] = o[k];

      renderer = options.renderer.call(s.graph, clone, options.template);

      if (typeof renderer === 'string')
         _popup.innerHTML = renderer;
      else
          // renderer is a dom element:
         _popup.appendChild(renderer);
    } else {
      _popup.innerHTML = options.template;
    }

    // Style it:
    _popup.className = options.cssClass;
    _popup.style.position = 'absolute';

    // Default position is mouse position:
    _popup.style.left = x + 'px';
    _popup.style.top = y + 'px';

    // Insert the element in the DOM:
    s.renderers[0].container.appendChild(_popup);

    // Find offset:
    var bodyRect = document.body.getBoundingClientRect(),
        popupRect = _popup.getBoundingClientRect(),
        offsetTop =  popupRect.top - bodyRect.top,
        offsetBottom = bodyRect.bottom - popupRect.bottom,
        offsetLeft =  popupRect.left - bodyRect.left,
        offsetRight = bodyRect.right - popupRect.right;

    if (options.position === 'top') {
      // New position vertically aligned and on top of the mouse:
      _popup.className = options.cssClass + ' top';
      _popup.style.left = x - (popupRect.right - popupRect.left) / 2 + 'px';
      _popup.style.top = y - (popupRect.bottom - popupRect.top) + 'px';
    }
    else if (options.position === 'bottom') {
      // New position vertically aligned and on bottom of the mouse:
      _popup.className = options.cssClass + ' bottom';
      _popup.style.left = x - (popupRect.right - popupRect.left) / 2 + 'px';
      _popup.style.top = y + 'px';
    }
    else if (options.position === 'left') {
      // New position vertically aligned and on bottom of the mouse:
      _popup.className = options.cssClass+ ' left';
      _popup.style.left = x - (popupRect.right - popupRect.left) + 'px';
      _popup.style.top = y - (popupRect.bottom - popupRect.top) / 2 + 'px';
    }
    else if (options.position === 'right') {
      // New position vertically aligned and on bottom of the mouse:
      _popup.className = options.cssClass + ' right';
      _popup.style.left = x + 'px';
      _popup.style.top = y - (popupRect.bottom - popupRect.top) / 2 + 'px';
    }
    
    // Update offset
    popupRect = _popup.getBoundingClientRect();
    offsetTop = popupRect.top - bodyRect.top;
    offsetBottom = bodyRect.bottom - popupRect.bottom;
    offsetLeft = popupRect.left - bodyRect.left;
    offsetRight = bodyRect.right - popupRect.right;

    // Adjust position to keep the popup inside body:
    // FIXME: doesn't work on Firefox
    if (options.autoadjust) {
      if (offsetBottom < 0) {
        _popup.className = options.cssClass;
        if (options.position === 'top' || options.position === 'bottom') {
          _popup.className = options.cssClass + ' top';
        }
        _popup.style.top = y - popupRect.bottom + popupRect.top + 'px';
      }
      else if (offsetTop < 0) {
        _popup.className = options.cssClass;
        if (options.position === 'top' || options.position === 'bottom') {
          _popup.className = options.cssClass + ' bottom';
        }
        _popup.style.top = y + 'px';
      }
      if (offsetRight < 0) {
        _popup.className = options.cssClass;
        if (options.position === 'left' || options.position === 'right') {
          _popup.className = options.cssClass + ' left';
        }
        _popup.style.left = x - popupRect.right + popupRect.left + 'px';
      }
      else if (offsetLeft < 0) {
        _popup.className = options.cssClass;
        if (options.position === 'left' || options.position === 'right') {
          _popup.className = options.cssClass + ' right';
        }
        _popup.style.left = x + 'px';
      }
    }
  };

  /**
   * This function removes the popup element from the DOM.
   */
  function removePopup() {
    if (_popup && _popup.parentNode) {
      // Remove from the DOM:
      _popup.parentNode.removeChild(_popup);
      _popup = null;
    }
  };

  /**
   * This function clears a potential timeout function related to the popup
   * and removes the popup.
   */
  function cancelPopup() {
    clearTimeout(_timeoutHandle);
    _timeoutHandle = false;
    removePopup();
  };

  /**
   * This function will display a popup when a sigma event is fired. It will
   * basically create a DOM element, fill it with the template or the result of
   * the renderer function, set its position and CSS class, and insert the
   * element as a child of the sigma container. Only one popup may exist.
   *
   * Recognized parameters of options:
   * *********************************
   * Enable node popups by adding the "node" key to the options object.
   * Enable edge popups by adding the "edge" key to the options object.
   * Each value must be an object. Here is the exhaustive list of every accepted
   * parameters in these objects:
   *
   *   {?string}   show       The event that triggers the popup. Default values:
   *                          "clickNode", "clickEdge". Other suggested values:
   *                          "overNode", "doubleClickNode", "rightClickNode",
   *                          "overEdge", "doubleClickEdge", "rightClickEdge".
   *                          "doubleClickNode", "rightClickNode".
   *   {?string}   hide       The event that hides the popup. Default value:
   *                          "clickStage". Other suggested values: "outNode",
   *                          "outEdge".
   *   {?string}   template   The HTML template. It is directly inserted inside
   *                          a div element unless a renderer is specified.
   *   {?function} renderer   This function may process the template or be used
   *                          independently. It should return an HTML string or
   *                          a DOM element. It is executed at runtime. Its
   *                          context is sigma.graph.
   *   {?string}   cssClass   The CSS class attached to the top div element.
   *                          Default value: "sigma-popup".
   *   {?string}   position   The position of the popup regarding the mouse. If
   *                          it is not specified, the popup top-left corner is
   *                          positionned at the mouse position. Available
   *                          values: "top", "bottom", "left", "right".
   *   {?number}   delay      The delay in milliseconds to show the popup.
   *   {?boolean}  autoadjust [EXPERIMENTAL] If true, tries to adjust the popup
   *                          position to be fully included in the body area.
   *                          Doesn't work on Firefox 30.
   *
   * > sigma.plugins.popup(s, {
   * >   node: {
   * >     template: 'Hello node!'
   * >   },
   * >   edge: {
   * >     template: 'Hello edge!'
   * >   }
   * > });
   *
   * @param {sigma}  s       The related sigma instance.
   * @param {object} options An object with options.
   */
  sigma.plugins.popup = function(s, options) {
    var _self = this;
    var so = extend(options.stage, settings.stage);
    var no = extend(options.node, settings.node);
    var eo = extend(options.edge, settings.edge);

    sigma.classes.dispatcher.extend(this);

    // STAGE POPUP:
    if (options.stage) {
      if (options.stage.renderer !== undefined && typeof options.stage.renderer !== 'function')
        throw 'The render of the stage popup must be a function.';

      if (options.stage.position !== undefined) {
        if (options.stage.position !== 'top' &&
            options.stage.position !== 'bottom' &&
            options.stage.position !== 'left' &&
            options.stage.position !== 'right') {
          throw 'The value of options.position must be either: top, bottom, left, right.';
        }
      }

      s.bind(so.show, function(event) {
        if (so.show !== 'doubleClickStage' && _doubleClick) {
          return;
        }

        var clientX = event.data.captor.clientX,
            clientY = event.data.captor.clientY;

        clearTimeout(_timeoutHandle);
        _timeoutHandle = setTimeout(function() {
          createPopup(
            s,
            null,
            so,
            clientX,
            clientY);

          _self.dispatchEvent('shown');
        }, so.delay);     
      });

      s.bind(so.hide, function(event) {
        var p = _popup;
        cancelPopup();
        if (p)
          _self.dispatchEvent('hidden');
      });

      if (so.show !== 'doubleClickStage') {
        s.bind('doubleClickStage', function(event) {
          cancelPopup();
          _doubleClick = true;
          _self.dispatchEvent('hidden');
          setTimeout(function() {
            _doubleClick = false;
          }, settings.doubleClickDelay);
        })
      }
    }

    // NODE POPUP:
    if (options.node) {
      if (options.node.renderer !== undefined && typeof options.node.renderer !== 'function')
        throw 'The render of the node popup must be a function.';

      if (options.node.position !== undefined) {
        if (options.node.position !== 'top' &&
            options.node.position !== 'bottom' &&
            options.node.position !== 'left' &&
            options.node.position !== 'right') {
          throw 'The value of options.position must be either: top, bottom, left, right.';
        }
      }

      s.bind(no.show, function(event) {
        if (no.show !== 'doubleClickNode' && _doubleClick) {
          return;
        }

        var n = event.data.node || event.data.nodes[0],
            clientX = event.data.captor.clientX,
            clientY = event.data.captor.clientY;

        clearTimeout(_timeoutHandle);
        _timeoutHandle = setTimeout(function() {
          createPopup(
            s,
            n,
            no,
            clientX,
            clientY);

          _self.dispatchEvent('shown');
        }, no.delay);     
      });

      s.bind(no.hide, function(event) {
        var p = _popup;
        cancelPopup();
        if (p)
          _self.dispatchEvent('hidden');
      });

      if (no.show !== 'doubleClickNode') {
        s.bind('doubleClickNode', function(event) {
          cancelPopup();
          _doubleClick = true;
          _self.dispatchEvent('hidden');
          setTimeout(function() {
            _doubleClick = false;
          }, settings.doubleClickDelay);
        })
      }
    }

    // EDGE POPUP:
    if (options.edge) {
      if (options.edge.renderer !== undefined && typeof options.edge.renderer !== 'function')
        throw 'The render of the edge popup must be a function.';

      if (options.edge.position !== undefined) {
        if (options.edge.position !== 'top' &&
            options.edge.position !== 'bottom' &&
            options.edge.position !== 'left' &&
            options.edge.position !== 'right') {
          throw 'The value of options.position must be either: top, bottom, left, right.';
        }
      }

      s.bind(eo.show, function(event) {
        if (eo.show !== 'doubleClickEdge' && _doubleClick) {
          return;
        }

        var e = event.data.edge || event.data.edges[0],
            clientX = event.data.captor.clientX,
            clientY = event.data.captor.clientY;

        clearTimeout(_timeoutHandle);
        _timeoutHandle = setTimeout(function() {
          createPopup(
            s,
            e,
            eo,
            clientX,
            clientY);

          _self.dispatchEvent('shown');
        }, eo.delay);     
      });

      s.bind(eo.hide, function(event) {
        var p = _popup;
        cancelPopup();
        if (p)
          _self.dispatchEvent('hidden');
      });

      if (eo.show !== 'doubleClickEdge') {
        s.bind('doubleClickEdge', function(event) {
          cancelPopup();
          _doubleClick = true;
          _self.dispatchEvent('hidden');
          setTimeout(function() {
            _doubleClick = false;
          }, settings.doubleClickDelay);
        })
      }
    }

    // Prevent the browser context menu to appear
    // if the right click event is already handled:
    if (no.show === 'rightClickNode' || eo.show === 'rightClickEdge') {
      s.renderers[0].container.addEventListener('contextmenu', function(event) {
        event.preventDefault();
      });
    }

    return this;
  };

}).call(window);
