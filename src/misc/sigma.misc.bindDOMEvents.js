;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize packages:
  sigma.utils.pkg('sigma.misc');

  /**
   * This helper will bind any DOM renderer (for instance svg)
   * to its captors, to properly dispatch the good events to the sigma instance
   * to manage clicking, hovering etc...
   *
   * It has to be called in the scope of the related renderer.
   */
  sigma.misc.bindDOMEvents = function(container) {
    var self = this,
        graph = this.graph;

    // DOMElement abstraction
    function Element(domElement) {

      // Helpers
      this.attr = function(attrName) {
        return domElement.getAttributeNS(null, attrName);
      };

      // Properties
      this.tag = domElement.tagName;
      this.class = this.attr('class');
      this.id = this.attr('id');

      // Methods
      this.isNode = function() {
        return this.class === self.settings('classPrefix') + '-node';
      };

      this.isEdge = function() {
        return this.class === self.settings('classPrefix') + '-edge';
      };
    }

    // Click
    function click(e) {
      if (!self.settings('eventsEnabled'))
        return;

      // Generic event
      self.dispatchEvent('click', e);

      // Are we on a node?
      var element = new Element(e.target);

      if (element.isNode())
        self.dispatchEvent('clickNode', {
          node: graph.nodes(element.attr('data-node-id'))
        });
      else
        self.dispatchEvent('clickStage');

      e.preventDefault();
      e.stopPropagation();
    }

    // Double click
    function doubleClick(e) {
      if (!self.settings('eventsEnabled'))
        return;

      // Generic event
      self.dispatchEvent('doubleClick', e);

      // Are we on a node?
      var element = new Element(e.target);

      if (element.isNode())
        self.dispatchEvent('doubleClickNode', {
          node: graph.nodes(element.attr('data-node-id'))
        });
      else
        self.dispatchEvent('doubleClickStage');

      e.preventDefault();
      e.stopPropagation();
    }

    // On out
    function onOut(e) {
      var target = e.fromElement || e.relatedTarget;

      if (!self.settings('eventsEnabled') || target === null)
        return;

      var from = new Element(target),
          to = new Element(e.toElement || e.target);

      if (from.isNode()) {
        var fromNodeId = from.attr('data-node-id'),
            toNodeId = to.attr('data-node-id');

        if (fromNodeId === toNodeId)
          return;

        self.dispatchEvent('outNode', {
          node: graph.nodes(from.attr('data-node-id'))
        });
      }
      else if (from.isEdge()) {
        var edge = graph.edges(from.attr('data-edge-id'));
        self.dispatchEvent('outEdge', {
          edge: edge,
          source: graph.nodes(edge.source),
          target: graph.nodes(edge.target)
        });
      }

      e.preventDefault();
      e.stopPropagation();
    }

    // On move
    function onOver(e) {
      var target = e.toElement || e.target;

      if (!self.settings('eventsEnabled') || target === null)
        return;

      var to = new Element(target);

      if (to.isNode()) {
        self.dispatchEvent('overNode', {
          node: graph.nodes(to.attr('data-node-id'))
        });
      }
      else if (to.isEdge()) {
        var edge = graph.edges(to.attr('data-edge-id'));
        self.dispatchEvent('overEdge', {
          edge: edge,
          source: graph.nodes(edge.source),
          target: graph.nodes(edge.target)
        });
      }

      e.preventDefault();
      e.stopPropagation();
    }

    // Registering Events:
    var i,
        o;

    // Click
    container.addEventListener('click', click, false);
    sigma.utils.doubleClick(container, 'click', doubleClick);

    // Touch counterparts
    container.addEventListener('touchstart', click, false);
    sigma.utils.doubleClick(container, 'touchstart', doubleClick);

    // Hover
    // OPTIMIZE: This is barely optimal
    // Find a way without mergin mouseenter and mouseout events.
    container.addEventListener('mouseout', onOut, false);
    for (i in this.domElements.nodes) {
      o = this.domElements.nodes[i];

      o.addEventListener('mouseenter', onOver, false);
      // o.addEventListener('mouseleave', onOut, false);
    }

    for (i in this.domElements.edges) {
      o = this.domElements.edges[i];

      o.addEventListener('mouseenter', onOver, false);
      o.addEventListener('mouseleave', onOut, false);
    }
  };
}).call(this);
