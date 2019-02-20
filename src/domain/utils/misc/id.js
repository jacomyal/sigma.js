/**
 * Returns a unique incremental number ID.
 *
 * Example:
 * ********
 *  > sigma.utils.id();
 *  > // 1;
 *  >
 *  > sigma.utils.id();
 *  > // 2;
 *  >
 *  > sigma.utils.id();
 *  > // 3;
 *
 * @param  {string} pkgName The name of the package to create/find.
 * @return {object}         The related package.
 */
export default function id() {
  let i = 0;
  return () => ++i;
}
