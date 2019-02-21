/**
 * This middleware will just copy the graphic properties.
 *
 * @param {?string} readPrefix  The read prefix.
 * @param {?string} writePrefix The write prefix.
 */
export default function copy(readPrefix, writePrefix) {
  let i;
  let l;
  let a;

  if (`${writePrefix}` === `${readPrefix}`) return;

  a = this.graph.nodes();
  for (i = 0, l = a.length; i < l; i++) {
    a[i][`${writePrefix}x`] = a[i][`${readPrefix}x`];
    a[i][`${writePrefix}y`] = a[i][`${readPrefix}y`];
    a[i][`${writePrefix}size`] = a[i][`${readPrefix}size`];
  }

  a = this.graph.edges();
  for (i = 0, l = a.length; i < l; i++)
    a[i][`${writePrefix}size`] = a[i][`${readPrefix}size`];
}
