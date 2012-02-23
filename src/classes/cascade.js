/**
 * A jQuery like properties management class. It works like jQuery .css()
 * method: You can call it with juste one string to get the corresponding
 * property, with a string and anything else to set the corresponding property,
 * or directly with an object, and then each pair string / object (or any type)
 * will be set in the properties.
 * @constructor
 * @this {sigma.classes.Cascade}
 */
sigma.classes.Cascade = function() {
  /**
   * This instance properties.
   * @protected
   * @type {Object}
   */
  this.p = {};

  /**
   * The method to use to set/get any property of this instance.
   * @param  {(string|Object)} a1 If it is a string and if a2 is undefined,
   *                              then it will return the corresponding
   *                              property.
   *                              If it is a string and if a2 is set, then it
   *                              will set a2 as the property corresponding to
   *                              a1, and return this.
   *                              If it is an object, then each pair string /
   *                              object (or any other type) will be set as a
   *                              property.
   * @param  {*?} a2              The new property corresponding to a1 if a1 is
   *                              a string.
   * @return {(*|sigma.classes.Cascade)} Returns itself or the corresponding
   *                                     property.
   */
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

