sigma.debugMode = 0;

sigma.log = function() {
  if (sigma.debugMode == 1) {
    for (var k in arguments) {
      if (arguments.hasOwnProperty(k)) {
        console.log(arguments[k]);
      }
    }
  } else if (sigma.debugMode > 1) {
    for (var k in arguments) {
      if (arguments.hasOwnProperty(k)) {
        throw new Error(arguments[k]);
      }
    }
  }

  return sigma;
};

