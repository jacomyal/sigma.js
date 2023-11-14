/**
 * Sigma.js Easings
 * =================
 *
 * Handy collection of easing functions.
 * @module
 */
export const linear = (k: number): number => k;

export const quadraticIn = (k: number): number => k * k;

export const quadraticOut = (k: number): number => k * (2 - k);

export const quadraticInOut = (k: number): number => {
  if ((k *= 2) < 1) return 0.5 * k * k;
  return -0.5 * (--k * (k - 2) - 1);
};

export const cubicIn = (k: number): number => k * k * k;

export const cubicOut = (k: number): number => --k * k * k + 1;

export const cubicInOut = (k: number): number => {
  if ((k *= 2) < 1) return 0.5 * k * k * k;
  return 0.5 * ((k -= 2) * k * k + 2);
};

const easings: { [key: string]: (k: number) => number } = {
  linear,
  quadraticIn,
  quadraticOut,
  quadraticInOut,
  cubicIn,
  cubicOut,
  cubicInOut,
};
export default easings;
