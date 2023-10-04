/**
 * Extend function
 * ================
 *
 * Function used to push a bunch of values into an array at once.
 * Freely inspired by @Yomguithereal/helpers/extend.
 */

/**
 * Extends the target array with the given values.
 *
 * @param  {array} array  - Target array.
 * @param  {array} values - A set of the values to add.
 */
export function extend<T>(array: T[], values: Set<T>): void {
  const l2 = values.size;

  if (l2 === 0) return;

  const l1 = array.length;

  array.length += l2;

  let i = 0;
  values.forEach((value) => {
    array[l1 + i] = value;
    i++;
  });
}
