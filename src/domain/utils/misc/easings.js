export function linearNone(k) {
  return k;
}

export function quadraticIn(k) {
  return k * k;
}

export function quadraticOut(k) {
  return k * (2 - k);
}

export function quadraticInOut(k) {
  if ((k *= 2) < 1) {
    return 0.5 * k * k;
  }
  return -0.5 * (--k * (k - 2) - 1);
}

export function cubicIn(k) {
  return k * k * k;
}

export function cubicOut(k) {
  return --k * k * k + 1;
}

export function cubicInOut(k) {
  if ((k *= 2) < 1) return 0.5 * k * k * k;
  return 0.5 * ((k -= 2) * k * k + 2);
}
