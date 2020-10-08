/**
 * Sigma.js zIndex Heuristics
 * ===========================
 *
 * Miscelleneous heuristics related to z-index ordering of nodes & edges.
 */

/**
 * Function ordering the given elements in reverse z-order so they drawn
 * the correct way.
 *
 * @param  {number}   extent   - [min, max] z values.
 * @param  {function} getter   - Z attribute getter function.
 * @param  {array}    elements - The array to sort.
 * @return {array} - The sorted array.
 */
export function zIndexOrdering(extent: [number, number], getter: (e: any) => number, elements: Array<any>): Array<any> {
  // If k is > n, we'll use a standard sort
  return elements.sort(function (a, b) {
    const zA = getter(a) || 0,
      zB = getter(b) || 0;

    if (zA < zB) return -1;
    if (zA > zB) return 1;

    return 0;
  });

  // TODO: counting sort optimization
}
