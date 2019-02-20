/* eslint-disable no-param-reassign */

export default function configure(sigma) {
  /**
   * Takes a package name as parameter and checks at each lebel if it exists,
   * and if it does not, creates it.
   *
   * Example:
   * ********
   *  > pkg('a.b.c');
   *  > a.b.c;
   *  > // Object {};
   *  >
   *  > pkg('a.b.d');
   *  > a.b;
   *  > // Object { c: {}, d: {} };
   *
   * @param  {string} pkgName The name of the package to create/find.
   * @return {object}         The related package.
   */
  function getPackageObject(pkgName) {
    const getPackage = (levels, root) => {
      return levels.reduce((context, objName) => {
        if (!context[objName]) {
          context[objName] = {};
        }
        return context[objName];
      }, root);
    };
    const levels = (pkgName || "").split(".");
    if (levels[0] === "sigma") {
      return getPackage(levels.slice(1), sigma);
    }
    return getPackage(levels, sigma.packages);
  }

  sigma.register = (packageName, item) => {
    const parentPath = packageName.substring(0, packageName.lastIndexOf("."));
    const itemName = packageName.substring(packageName.lastIndexOf(".") + 1);
    const pkg = getPackageObject(parentPath);
    pkg[itemName] = pkg[itemName] || item;
  };

  sigma.register("sigma.utils.pkg", getPackageObject);
}
