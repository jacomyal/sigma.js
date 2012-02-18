sigma.debugMode = 0;

sigma.log = function() {
  if (sigma.debugMode == 1) {
    for (var k in arguments) {
      console.log(arguments[k]);
    }
  }else if (sigma.debugMode > 1) {
    for (var k in arguments) {
      throw new Error(arguments[k]);
    }
  }

  return sigma;
};

