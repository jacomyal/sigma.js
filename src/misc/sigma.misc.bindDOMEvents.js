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

    // Click
    function click(e) {
      if (!self.settings('eventsEnabled'))
          return;

      // Generic event
      self.dispatchEvent('click', e);

      // Are we on a node?
      var targetClass = e.target.getAttributeNS(null, 'class');

      if (targetClass === self.settings('classPrefix') + '-node')
        self.dispatchEvent('clickNode', {
          node: graph.nodes(e.target.getAttributeNS(null, 'data-node-id'))
        });
      else
        self.dispatchEvent('clickStage');
    }

    // Double click
    function doubleClick(e) {
      if (!self.settings('eventsEnabled'))
          return;

      // Generic event
      self.dispatchEvent('doubleClick', e);

      // Are we on a node?
      var targetClass = e.target.getAttributeNS(null, 'class');

      if (targetClass === self.settings('classPrefix') + '-node')
        self.dispatchEvent('doubleClickNode', {
          node: graph.nodes(e.target.getAttributeNS(null, 'data-node-id'))
        });
      else
        self.dispatchEvent('doubleClickStage');
    }

    // Registering events
    container.addEventListener('click', click);
    sigma.utils.doubleClick(container, 'click', doubleClick);

    // function bindCaptor(captor) {
    //   var nodes,
    //       over = {};

    //   function onOut(e) {
    //     if (!self.settings('eventsEnabled'))
    //       return;

    //     var k,
    //         i,
    //         l,
    //         out = [];

    //     for (k in over)
    //       out.push(over[k]);

    //     over = {};
    //     // Dispatch both single and multi events:
    //     for (i = 0, l = out.length; i < l; i++)
    //       self.dispatchEvent('outNode', {
    //         node: out[i]
    //       });
    //     if (out.length)
    //       self.dispatchEvent('outNodes', {
    //         nodes: out
    //       });
    //   }

    //   function onMove(e) {
    //     if (!self.settings('eventsEnabled'))
    //       return;

    //     nodes = getNodes(e);

    //     var i,
    //         k,
    //         n,
    //         newOut = [],
    //         newOvers = [],
    //         currentOvers = {},
    //         l = nodes.length;

    //     // Check newly overred nodes:
    //     for (i = 0; i < l; i++) {
    //       n = nodes[i];
    //       currentOvers[n.id] = n;
    //       if (!over[n.id]) {
    //         newOvers.push(n);
    //         over[n.id] = n;
    //       }
    //     }

    //     // Check no more overred nodes:
    //     for (k in over)
    //       if (!currentOvers[k]) {
    //         newOut.push(over[k]);
    //         delete over[k];
    //       }

    //     // Dispatch both single and multi events:
    //     for (i = 0, l = newOvers.length; i < l; i++)
    //       self.dispatchEvent('overNode', {
    //         node: newOvers[i]
    //       });
    //     for (i = 0, l = newOut.length; i < l; i++)
    //       self.dispatchEvent('outNode', {
    //         node: newOut[i]
    //       });
    //     if (newOvers.length)
    //       self.dispatchEvent('overNodes', {
    //         nodes: newOvers
    //       });
    //     if (newOut.length)
    //       self.dispatchEvent('outNodes', {
    //         nodes: newOut
    //       });
    //   }

    //   // Bind events:
    //   captor.bind('click', onClick);
    //   captor.bind('mouseup', onMove);
    //   captor.bind('mousemove', onMove);
    //   captor.bind('mouseout', onOut);
    //   captor.bind('doubleclick', onDoubleClick);
    //   self.bind('render', onMove);
    // }
  };
}).call(this);
