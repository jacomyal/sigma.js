/**
 * This utils aims to facilitate the manipulation of each instance setting.
 * Using a function instead of an object brings two main advantages: First,
 * it will be easier in the future to catch settings updates through a
 * function than an object. Second, giving it a full object will "merge" it
 * to the settings object properly, keeping us to have to always add a loop.
 *
 * @return {configurable} The "settings" function.
 */
export default function Configurable(...args) {
  const data = {};
  const datas = Array.prototype.slice.call(args, 0);

  /**
   * The method to use to set or get any property of this instance.
   *
   * @param  {string|object}    a1 If it is a string and if a2 is undefined,
   *                               then it will return the corresponding
   *                               property. If it is a string and if a2 is
   *                               set, then it will set a2 as the property
   *                               corresponding to a1, and return this. If
   *                               it is an object, then each pair string +
   *                               object(or any other type) will be set as a
   *                               property.
   * @param  {*?}               a2 The new property corresponding to a1 if a1
   *                               is a string.
   * @return {*|configurable}      Returns itself or the corresponding
   *                               property.
   *
   * Polymorphism:
   * *************
   * Here are some basic use examples:
   *
   *  > settings = new configurable();
   *  > settings('mySetting', 42);
   *  > settings('mySetting'); // Logs: 42
   *  > settings('mySetting', 123);
   *  > settings('mySetting'); // Logs: 123
   *  > settings({mySetting: 456});
   *  > settings('mySetting'); // Logs: 456
   *
   * Also, it is possible to use the function as a fallback:
   *  > settings({mySetting: 'abc'}, 'mySetting');  // Logs: 'abc'
   *  > settings({hisSetting: 'abc'}, 'mySetting'); // Logs: 456
   */
  function settings(a1, a2) {
    if (arguments.length === 1 && typeof a1 === "string") {
      if (data[a1] !== undefined) {
        return data[a1];
      }
      for (let i = 0; i < datas.length; i++) {
        if (datas[i][a1] !== undefined) {
          return datas[i][a1];
        }
      }
      return undefined;
    }
    if (typeof a1 === "object" && typeof a2 === "string") {
      return (a1 || {})[a2] !== undefined ? a1[a2] : settings(a2);
    }
    const o = typeof a1 === "object" && a2 === undefined ? a1 : {};
    if (typeof a1 === "string") {
      o[a1] = a2;
    }

    Object.keys(o).forEach(key => {
      data[key] = o[key];
    });
    return undefined;
  }

  /**
   * This method returns a new configurable function, with new objects
   *
   * @param  {object*}  Any number of objects to search in.
   * @return {function} Returns the function. Check its documentation to know
   *                    more about how it works.
   */
  settings.embedObjects = function embedObjects(...eoArgs) {
    const callArgs = datas
      .concat(data)
      .concat(Array.prototype.splice.call(eoArgs, 0));

    return Configurable.apply({}, callArgs);
  };

  // Initialize
  args.forEach(a => settings(a));
  return settings;
}
