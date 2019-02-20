/**
 * Returns a unique incremental number ID.
 *
 * Example:
 * ********
 *  > id();
 *  > // 1;
 *  >
 *  > id();
 *  > // 2;
 *  >
 *  > id();
 *  > // 3;
 *
 * @param  {string} pkgName The name of the package to create/find.
 * @return {object}         The related package.
 */
export default (() => {
  let id = 0;
  return () => ++id;
})();
