sigma.easing = {
  linear: {},
  quadratic: {}
};

sigma.easing.linear.easenone = function(k) {
  return k;
};

sigma.easing.quadratic.easein = function(k) {
  return k * k;
};

sigma.easing.quadratic.easeout = function(k) {
  return - k * (k - 2);
};

sigma.easing.quadratic.easeinout = function(k) {
  if ((k *= 2) < 1) return 0.5 * k * k;
  return - 0.5 * (--k * (k - 2) - 1);
};

