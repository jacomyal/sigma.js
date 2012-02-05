sigma.classes.Cascade = function() {
  this.p = {};

  this.config = function(a1, a2) {
    if (typeof a1 == 'string' && a2 == undefined) {
      return this.p[a1];
    } else {
      var o = (typeof a1 == 'object' && a2 == undefined) ? a1 : {};
      if (typeof a1 == 'string') {
        o[a1] = a2;
      }

      for (var k in o) {
        if (this.p[k] != undefined) {
          this.p[k] = o[k];
        }
      }
      return this;
    }
  };
};
