/**
 * The pixel ratio of the screen. Taking zoom into account
 *
 * @return {number}        Pixel ratio of the screen
 */
export default function getPixelRatio() {
  let ratio = 1;
  if (
    window.screen.deviceXDPI !== undefined &&
    window.screen.logicalXDPI !== undefined &&
    window.screen.deviceXDPI > window.screen.logicalXDPI
  ) {
    ratio = window.screen.systemXDPI / window.screen.logicalXDPI;
  } else if (window.devicePixelRatio !== undefined) {
    ratio = window.devicePixelRatio;
  }
  return ratio;
}
