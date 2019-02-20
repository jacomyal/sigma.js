/* eslint-disable no-param-reassign */

export default function configure(sigma) {
  sigma.register = (packageName, item) => {
    const parentPath = packageName.substring(0, packageName.lastIndexOf("."));
    const itemName = packageName.substring(packageName.lastIndexOf(".") + 1);
    const pkg = sigma.utils.pkg(parentPath);
    pkg[itemName] = pkg[itemName] || item;
  };
}
