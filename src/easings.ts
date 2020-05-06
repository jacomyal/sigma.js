/**
 * Sigma.js Easings
 * =================
 *
 * Handy collection of easing functions.
 */
export const linear = k => k;

export const quadraticIn = k => k * k;

export const quadraticOut = k => k * (2 - k);

export const quadraticInOut = k => {
  if ((k *= 2) < 1)
    return 0.5 * k * k;
  return -0.5 * (--k * (k - 2) - 1);
};

export const cubicIn = k => k * k * k;

export const cubicOut = k => --k * k * k + 1;

export const cubicInOut = k => {
  if ((k *= 2) < 1)
    return 0.5 * k * k * k;
  return 0.5 * ((k -= 2) * k * k + 2);
};
