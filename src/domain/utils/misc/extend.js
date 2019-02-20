/**
 * This function takes any number of objects as arguments, copies from each
 * of these objects each pair key/value into a new object, and finally
 * returns this object.
 *
 * The arguments are parsed from the last one to the first one, such that
 * when several objects have keys in common, the "earliest" object wins.
 *
 * Example:
 * ********
 *  > var o1 = {
 *  >       a: 1,
 *  >       b: 2,
 *  >       c: '3'
 *  >     },
 *  >     o2 = {
 *  >       c: '4',
 *  >       d: [ 5 ]
 *  >     };
 *  > extend(o1, o2);
 *  > // Returns: {
 *  > //   a: 1,
 *  > //   b: 2,
 *  > //   c: '3',
 *  > //   d: [ 5 ]
 *  > // };
 *
 * @param  {object+} Any number of objects.
 * @return {object}  The merged object.
 */
export default function extend(...args) {
  const res = {};

  for (let i = args.length - 1; i >= 0; i--) {
    const arg = args[i];
    Object.keys(arg).forEach(key => {
      res[key] = arg[key];
    });
  }
  return res;
}
