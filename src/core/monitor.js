/**
 * A class to monitor some local / global probes directly on an instance,
 * inside a div DOM element.
 * It executes different methods (called "probes") regularly, and displays
 * the results on the element.
 * @constructor
 * @extends sigma.classes.Cascade
 * @param {Sigma} instance The instance to monitor.
 * @param {element} dom    The div DOM element to draw write on.
 * @this {Monitor}
 */
function Monitor(instance, dom) {
  sigma.classes.Cascade.call(this);

  /**
   * Represents "this", without the well-known scope issue.
   * @private
   * @type {Monitor}
   */
  var self = this;

  /**
   * {@link Sigma} instance owning this Monitor instance.
   * @type {Sigma}
   */
  this.instance = instance;

  /**
   * Determines if the monitoring is activated or not.
   * @type {Boolean}
   */
  this.monitoring = false;

  /**
   * The different parameters that define how this instance should work. It
   * also contains the different probes.
   * @see sigma.classes.Cascade
   * @type {Object}
   */
  this.p = {
    fps: 40,
    dom: dom,
    globalProbes: {
      'Time (ms)': sigma.chronos.getExecutionTime,
      'Queue': sigma.chronos.getQueuedTasksCount,
      'Tasks': sigma.chronos.getTasksCount,
      'FPS': sigma.chronos.getFPS
    },
    localProbes: {
      'Nodes count': function() { return self.instance.graph.nodes.length; },
      'Edges count': function() { return self.instance.graph.edges.length; }
    }
  };

  /**
   * Activates the monitoring: Some texts describing some values about sigma.js
   * or the owning {@link Sigma} instance will appear over the graph, but
   * beneath the mouse sensible DOM element.
   * @return {Monitor} Returns itself.
   */
  function activate() {
    if (!self.monitoring) {
      self.monitoring = window.setInterval(routine, 1000 / self.p.fps);
    }

    return self;
  }

  /**
   * Desactivates the monitoring: Will disappear, and stop computing the
   * different probes.
   * @return {Monitor} Returns itself.
   */
  function desactivate() {
    if (self.monitoring) {
      window.clearInterval(self.monitoring);
      self.monitoring = null;

      self.p.dom.innerHTML = '';
    }

    return self;
  }

  /**
   * The private method dedicated to compute the different values to observe.
   * @private
   * @return {Monitor} Returns itself.
   */
  function routine() {
    var s = '';

    s += '<p>GLOBAL :</p>';
    for (var k in self.p.globalProbes) {
      s += '<p>' + k + ' : ' + self.p.globalProbes[k]() + '</p>';
    }

    s += '<br><p>LOCAL :</p>';
    for (var k in self.p.localProbes) {
      s += '<p>' + k + ' : ' + self.p.localProbes[k]() + '</p>';
    }

    self.p.dom.innerHTML = s;

    return self;
  }

  this.activate = activate;
  this.desactivate = desactivate;
}

