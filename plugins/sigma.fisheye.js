sigma.classes.FishEye = function(sig) {
  sigma.classes.Cascade.call(this);

  var self = this;
  var isRunning = false;

  this.p = {
    radius: 200,
    power: 2
  };

  function applyFishEye(mouseX, mouseY) {
    var newDist, newSize, xDist, yDist, dist,
        radius   = self.p.radius,
        power    = self.p.power,
        powerExp = Math.exp(power);

    sig.graph.nodes.forEach(function(node) {
      xDist = node.displayX - mouseX;
      yDist = node.displayY - mouseY;
      dist  = Math.sqrt(xDist*xDist + yDist*yDist);

      if(dist<radius){
        newDist = powerExp/(powerExp-1)*radius*(1-Math.exp(-dist/radius*power));
        newSize = powerExp/(powerExp-1)*radius*(1-Math.exp(-dist/radius*power));

        if(!node.isFixed){
          node.displayX = mouseX + xDist*(newDist/dist*3/4 + 1/4);
          node.displayY = mouseY + yDist*(newDist/dist*3/4 + 1/4);
        }

        node.displaySize = Math.min(node.displaySize*newSize/dist,10*node.displaySize);
      }
    });
  };

  function handler() {
    applyFishEye(
      sig.mousecaptor.mouseX,
      sig.mousecaptor.mouseY
    );
  }

  this.handler = handler;
};

sigma.publicPrototype.activateFishEye = function() {
  if(!this.fisheye) {
    var fe = new sigma.classes.FishEye(this._core);
    this.fisheye = {
      isRunning: false,
      apply: fe.handler,
      config: fe.config
    };
  }

  if(!this.fisheye.isRunning){
    this._core.bind('graphscaled', this.fisheye.apply);
    this.fisheye.isRunning = true;
  }
};

sigma.publicPrototype.desactivateFishEye = function() {
  if(this.fisheye && this.fisheye.isRunning){
    this._core.unbind('graphscaled', this.fisheye.apply);
    this.fisheye.isRunning = false;
  }
};