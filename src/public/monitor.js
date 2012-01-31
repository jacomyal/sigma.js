sigma.monitor = (function() {
  this.getFPS = function() {
    return sigma.scheduler.getFPS();
  }

  this.getWorkersCount = function() {
    return sigma.scheduler.workers.length;
  }

  this.getQueueLength = function() {
    return sigma.scheduler.queue.length;
  }

  return this;
})();
