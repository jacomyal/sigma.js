sigma.monitor = (function() {
  this.getFPS = function() {
    return sigma.scheduler.getFPS();
  }

  this.getWorkersCount = function() {
    return sigma.scheduler.workers.length;
  }

  return this;
})();
