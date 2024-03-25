export const HTML_COLORS: Record<string, string> = {
  black: "#000000",
  silver: "#C0C0C0",
  gray: "#808080",
  grey: "#808080",
  white: "#FFFFFF",
  maroon: "#800000",
  red: "#FF0000",
  purple: "#800080",
  fuchsia: "#FF00FF",
  green: "#008000",
  lime: "#00FF00",
  olive: "#808000",
  yellow: "#FFFF00",
  navy: "#000080",
  blue: "#0000FF",
  teal: "#008080",
  aqua: "#00FFFF",
  darkblue: "#00008B",
  mediumblue: "#0000CD",
  darkgreen: "#006400",
  darkcyan: "#008B8B",
  deepskyblue: "#00BFFF",
  darkturquoise: "#00CED1",
  mediumspringgreen: "#00FA9A",
  springgreen: "#00FF7F",
  cyan: "#00FFFF",
  midnightblue: "#191970",
  dodgerblue: "#1E90FF",
  lightseagreen: "#20B2AA",
  forestgreen: "#228B22",
  seagreen: "#2E8B57",
  darkslategray: "#2F4F4F",
  darkslategrey: "#2F4F4F",
  limegreen: "#32CD32",
  mediumseagreen: "#3CB371",
  turquoise: "#40E0D0",
  royalblue: "#4169E1",
  steelblue: "#4682B4",
  darkslateblue: "#483D8B",
  mediumturquoise: "#48D1CC",
  indigo: "#4B0082",
  darkolivegreen: "#556B2F",
  cadetblue: "#5F9EA0",
  cornflowerblue: "#6495ED",
  rebeccapurple: "#663399",
  mediumaquamarine: "#66CDAA",
  dimgray: "#696969",
  dimgrey: "#696969",
  slateblue: "#6A5ACD",
  olivedrab: "#6B8E23",
  slategray: "#708090",
  slategrey: "#708090",
  lightslategray: "#778899",
  lightslategrey: "#778899",
  mediumslateblue: "#7B68EE",
  lawngreen: "#7CFC00",
  chartreuse: "#7FFF00",
  aquamarine: "#7FFFD4",
  skyblue: "#87CEEB",
  lightskyblue: "#87CEFA",
  blueviolet: "#8A2BE2",
  darkred: "#8B0000",
  darkmagenta: "#8B008B",
  saddlebrown: "#8B4513",
  darkseagreen: "#8FBC8F",
  lightgreen: "#90EE90",
  mediumpurple: "#9370DB",
  darkviolet: "#9400D3",
  palegreen: "#98FB98",
  darkorchid: "#9932CC",
  yellowgreen: "#9ACD32",
  sienna: "#A0522D",
  brown: "#A52A2A",
  darkgray: "#A9A9A9",
  darkgrey: "#A9A9A9",
  lightblue: "#ADD8E6",
  greenyellow: "#ADFF2F",
  paleturquoise: "#AFEEEE",
  lightsteelblue: "#B0C4DE",
  powderblue: "#B0E0E6",
  firebrick: "#B22222",
  darkgoldenrod: "#B8860B",
  mediumorchid: "#BA55D3",
  rosybrown: "#BC8F8F",
  darkkhaki: "#BDB76B",
  mediumvioletred: "#C71585",
  indianred: "#CD5C5C",
  peru: "#CD853F",
  chocolate: "#D2691E",
  tan: "#D2B48C",
  lightgray: "#D3D3D3",
  lightgrey: "#D3D3D3",
  thistle: "#D8BFD8",
  orchid: "#DA70D6",
  goldenrod: "#DAA520",
  palevioletred: "#DB7093",
  crimson: "#DC143C",
  gainsboro: "#DCDCDC",
  plum: "#DDA0DD",
  burlywood: "#DEB887",
  lightcyan: "#E0FFFF",
  lavender: "#E6E6FA",
  darksalmon: "#E9967A",
  violet: "#EE82EE",
  palegoldenrod: "#EEE8AA",
  lightcoral: "#F08080",
  khaki: "#F0E68C",
  aliceblue: "#F0F8FF",
  honeydew: "#F0FFF0",
  azure: "#F0FFFF",
  sandybrown: "#F4A460",
  wheat: "#F5DEB3",
  beige: "#F5F5DC",
  whitesmoke: "#F5F5F5",
  mintcream: "#F5FFFA",
  ghostwhite: "#F8F8FF",
  salmon: "#FA8072",
  antiquewhite: "#FAEBD7",
  linen: "#FAF0E6",
  lightgoldenrodyellow: "#FAFAD2",
  oldlace: "#FDF5E6",
  magenta: "#FF00FF",
  deeppink: "#FF1493",
  orangered: "#FF4500",
  tomato: "#FF6347",
  hotpink: "#FF69B4",
  coral: "#FF7F50",
  darkorange: "#FF8C00",
  lightsalmon: "#FFA07A",
  orange: "#FFA500",
  lightpink: "#FFB6C1",
  pink: "#FFC0CB",
  gold: "#FFD700",
  peachpuff: "#FFDAB9",
  navajowhite: "#FFDEAD",
  moccasin: "#FFE4B5",
  bisque: "#FFE4C4",
  mistyrose: "#FFE4E1",
  blanchedalmond: "#FFEBCD",
  papayawhip: "#FFEFD5",
  lavenderblush: "#FFF0F5",
  seashell: "#FFF5EE",
  cornsilk: "#FFF8DC",
  lemonchiffon: "#FFFACD",
  floralwhite: "#FFFAF0",
  snow: "#FFFAFA",
  lightyellow: "#FFFFE0",
  ivory: "#FFFFF0",
};

/**
 * Function extracting the color at the given pixel.
 */
export function extractPixel(gl: WebGLRenderingContext, x: number, y: number, array: Uint8Array): Uint8Array {
  const data = array || new Uint8Array(4);

  gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, data);

  return data;
}

/**
 * Memoized function returning a float-encoded color from various string
 * formats describing colors.
 */
const INT8 = new Int8Array(4);
const INT32 = new Int32Array(INT8.buffer, 0, 1);
const FLOAT32 = new Float32Array(INT8.buffer, 0, 1);

const RGBA_TEST_REGEX = /^\s*rgba?\s*\(/;
const RGBA_EXTRACT_REGEX = /^\s*rgba?\s*\(\s*([0-9]*)\s*,\s*([0-9]*)\s*,\s*([0-9]*)(?:\s*,\s*(.*)?)?\)\s*$/;

type RGBAColor = { r: number; g: number; b: number; a: number };

export function parseColor(val: string): RGBAColor {
  let r = 0; // byte
  let g = 0; // byte
  let b = 0; // byte
  let a = 1; // float

  // Handling hexadecimal notation
  if (val[0] === "#") {
    if (val.length === 4) {
      r = parseInt(val.charAt(1) + val.charAt(1), 16);
      g = parseInt(val.charAt(2) + val.charAt(2), 16);
      b = parseInt(val.charAt(3) + val.charAt(3), 16);
    } else {
      r = parseInt(val.charAt(1) + val.charAt(2), 16);
      g = parseInt(val.charAt(3) + val.charAt(4), 16);
      b = parseInt(val.charAt(5) + val.charAt(6), 16);
    }
    if (val.length === 9) {
      a = parseInt(val.charAt(7) + val.charAt(8), 16) / 255;
    }
  }

  // Handling rgb notation
  else if (RGBA_TEST_REGEX.test(val)) {
    const match = val.match(RGBA_EXTRACT_REGEX);
    if (match) {
      r = +match[1];
      g = +match[2];
      b = +match[3];

      if (match[4]) a = +match[4];
    }
  }

  return { r, g, b, a };
}

const FLOAT_COLOR_CACHE: { [key: string]: number } = {};
for (const htmlColor in HTML_COLORS) {
  FLOAT_COLOR_CACHE[htmlColor] = floatColor(HTML_COLORS[htmlColor]);
  // Replicating cache for hex values for free
  FLOAT_COLOR_CACHE[HTML_COLORS[htmlColor]] = FLOAT_COLOR_CACHE[htmlColor];
}

export function rgbaToFloat(r: number, g: number, b: number, a: number, masking?: boolean): number {
  INT32[0] = (a << 24) | (b << 16) | (g << 8) | r;
  if (masking) INT32[0] = INT32[0] & 0xfeffffff;
  return FLOAT32[0];
}
export function floatColor(val: string): number {
  // The html color names are case-insensitive
  val = val.toLowerCase();

  // If the color is already computed, we yield it
  if (typeof FLOAT_COLOR_CACHE[val] !== "undefined") return FLOAT_COLOR_CACHE[val];

  const parsed = parseColor(val);
  const { r, g, b } = parsed;
  let { a } = parsed;
  a = (a * 255) | 0;

  const color = rgbaToFloat(r, g, b, a, true);

  FLOAT_COLOR_CACHE[val] = color;

  return color;
}
export function colorToArray(val: string, masking?: boolean): [number, number, number, number] {
  FLOAT32[0] = floatColor(val);
  let intValue = INT32[0];

  if (masking) {
    intValue = intValue | 0x01000000;
  }

  const r = intValue & 0xff;
  const g = (intValue >> 8) & 0xff;
  const b = (intValue >> 16) & 0xff;
  const a = (intValue >> 24) & 0xff;

  return [r, g, b, a];
}

const FLOAT_INDEX_CACHE: { [key: number]: number } = {};
export function indexToColor(index: number): number {
  // If the index is already computed, we yield it
  if (typeof FLOAT_INDEX_CACHE[index] !== "undefined") return FLOAT_INDEX_CACHE[index];

  // To address issue #1397, one strategy is to keep encoding 4 bytes colors,
  // but with alpha hard-set to 1.0 (or 255):
  const r = (index & 0x00ff0000) >>> 16;
  const g = (index & 0x0000ff00) >>> 8;
  const b = index & 0x000000ff;
  const a = 0x000000ff;

  // The original 4 bytes color encoding was the following:
  // const r = (index & 0xff000000) >>> 24;
  // const g = (index & 0x00ff0000) >>> 16;
  // const b = (index & 0x0000ff00) >>> 8;
  // const a = index & 0x000000ff;

  const color = rgbaToFloat(r, g, b, a, true);
  FLOAT_INDEX_CACHE[index] = color;

  return color;
}

export function colorToIndex(r: number, g: number, b: number, _a: number): number {
  // As for the function indexToColor, because of #1397 and the "alpha is always
  // 1.0" strategy, we need to fix this function as well:
  return b + (g << 8) + (r << 16);

  // The original 4 bytes color decoding is the following:
  // return a + (b << 8) + (g << 16) + (r << 24);
}

export function getPixelColor(
  gl: WebGLRenderingContext,
  frameBuffer: WebGLBuffer | null,
  x: number,
  y: number,
  pixelRatio: number,
  downSizingRatio: number,
): [number, number, number, number] {
  const bufferX = Math.floor((x / downSizingRatio) * pixelRatio);
  const bufferY = Math.floor(gl.drawingBufferHeight / downSizingRatio - (y / downSizingRatio) * pixelRatio);

  const pixel = new Uint8Array(4);
  gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
  gl.readPixels(bufferX, bufferY, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);

  const [r, g, b, a] = pixel;
  return [r, g, b, a];
}
