/**
 * This function takes an hexa color (for instance "#ffcc00" or "#fc0") or a
 * rgb / rgba color (like "rgb(255,255,12)" or "rgba(255,255,12,1)") and
 * returns an integer equal to "r * 255 * 255 + g * 255 + b", to gain some
 * memory in the data given to WebGL shaders.
 *
 * Note that the function actually caches its results for better performance.
 *
 * @param  {string} val The hexa or rgba color.
 * @return {number}     The number value.
 */
const floatColorCache = {};

export default function floatColor(input) {
  let val = input;
  // Is the color already computed?
  if (floatColorCache[val]) return floatColorCache[val];

  const original = val;

  let r = 0;

  let g = 0;

  let b = 0;

  if (val[0] === "#") {
    val = val.slice(1);

    if (val.length === 3) {
      r = parseInt(val.charAt(0) + val.charAt(0), 16);
      g = parseInt(val.charAt(1) + val.charAt(1), 16);
      b = parseInt(val.charAt(2) + val.charAt(2), 16);
    } else {
      r = parseInt(val.charAt(0) + val.charAt(1), 16);
      g = parseInt(val.charAt(2) + val.charAt(3), 16);
      b = parseInt(val.charAt(4) + val.charAt(5), 16);
    }
  } else if (val.match(/^ *rgba? *\(/)) {
    val = val.match(
      /^ *rgba? *\( *([0-9]*) *, *([0-9]*) *, *([0-9]*) *(,.*)?\) *$/
    );
    r = +val[1];
    g = +val[2];
    b = +val[3];
  }

  const color = r * 256 * 256 + g * 256 + b;

  // Caching the color
  floatColorCache[original] = color;

  return color;
}
