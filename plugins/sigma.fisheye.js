sigma.classes.FishEye = function(sig) {
  sigma.classes.Cascade.call(this);

  var self = this;
  var isActivated = false;

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

      if(dist < radius){
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
  this.activated = function(v) {
    if(v==undefined){
      return isActivated;
    }else{
      isActivated = v;
      return this;
    }
  };

  this.refresh = function(){};
};

sigma.publicPrototype.activateFishEye = function() {
  if(!this.fisheye) {
    var sigmaInstance = this;
    var fe = new sigma.classes.FishEye(sigmaInstance._core);
    sigmaInstance.fisheye = fe;

    fe.refresh = function refresh() {
      sigmaInstance.draw(2,2,2);
    };
  }

  if(!this.fisheye.activated()){
    this.fisheye.activated(true);
    this._core.bind('graphscaled', this.fisheye.handler);
    document.getElementById(
      'sigma_mouse_'+this.getID()
    ).addEventListener('mousemove',this.fisheye.refresh,true);
  }

  return this;
};

sigma.publicPrototype.desactivateFishEye = function() {
  if(this.fisheye && this.fisheye.activated()){
    this.fisheye.activated(false);
    this._core.unbind('graphscaled', this.fisheye.handler);
    document.getElementById(
      'sigma_mouse_'+this.getID()
    ).removeEventListener('mousemove',this.fisheye.refresh,true);
  }

  return this;
};

sigma.publicPrototype.fishEyeProperties = function(a1, a2) {
  var res = this.fisheye.config(a1, a2);
  return res == s ? this.fisheye : res;
};