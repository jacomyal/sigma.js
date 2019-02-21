import extend from "./extend";

/**
 * Perform a zoom into a camera, with or without animation, to the
 * coordinates indicated using a specified ratio.
 *
 * Recognized parameters:
 * **********************
 * Here is the exhaustive list of every accepted parameters in the animation
 * object:
 *
 *   {?number} duration     An amount of time that means the duration of the
 *                          animation. If this parameter doesn't exist the
 *                          zoom will be performed without animation.
 *   {?function} onComplete A function to perform it after the animation. It
 *                          will be performed even if there is no duration.
 *
 * @param {camera}     The camera where perform the zoom.
 * @param {x}          The X coordiantion where the zoom goes.
 * @param {y}          The Y coordiantion where the zoom goes.
 * @param {ratio}      The ratio to apply it to the current camera ratio.
 * @param {?animation} A dictionary with options for a possible animation.
 */
export default function zoomTo(sigma) {
  return (camera, x, y, ratio, animation) => {
    const { settings } = camera;

    // Create the newRatio dealing with min / max:
    const newRatio = Math.max(
      settings("zoomMin"),
      Math.min(settings("zoomMax"), camera.ratio * ratio)
    );

    // Check that the new ratio is different from the initial one:
    if (newRatio !== camera.ratio) {
      // Create the coordinates variable:
      ratio = newRatio / camera.ratio;
      const coordinates = {
        x: x * (1 - ratio) + camera.x,
        y: y * (1 - ratio) + camera.y,
        ratio: newRatio
      };

      if (animation && animation.duration) {
        // Complete the animation setings:
        const count = sigma.misc.animation.killAll(camera);
        animation = extend(animation, {
          easing: count ? "quadraticOut" : "quadraticInOut"
        });

        sigma.misc.animation.camera(camera, coordinates, animation);
      } else {
        camera.goTo(coordinates);
        if (animation && animation.onComplete) animation.onComplete();
      }
    }
  };
}
