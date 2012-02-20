/**
 * Add a function to the prototype of SigmaPublic, but with access to the
 * Sigma class properties.
 * @param {string} pluginName        [description].
 * @param {function} caller          [description].
 * @param {function(Sigma)} launcher [description].
 */
sigma.addPlugin = function(pluginName, caller, launcher) {
  SigmaPublic.prototype[pluginName] = caller;
  local.plugins.push(launcher);
};
