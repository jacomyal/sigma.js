/**
 * Extends the target array with the given values.
 */
export function extend<T>(array: T[], values: Set<T>): void {
  const l2 = values.size;

  if (l2 === 0) return;

  const l1 = array.length;

  array.length += l2;

  let i = 0;
  values.forEach((value) => {
    array[l1 + i] = value;
    i++;
  });
}

/**
 * Helper to use `Object.assign` with more than two objects.
 */
export function assign<T>(target: Partial<T> | undefined, ...objects: Array<Partial<T | undefined>>): T {
  target = target || {};

  for (let i = 0, l = objects.length; i < l; i++) {
    const o = objects[i];

    if (!o) continue;

    Object.assign(target, o);
  }

  return target as T;
}

/**
 * Returns true if any own property of `partial` differs (strict equality)
 * from the corresponding property in `current`. Uses for...in for speed
 * and short-circuits on the first difference.
 */
export function hasNewPartialProps<T extends Record<string, unknown>>(current: T, partial: Partial<T>): boolean {
  for (const k in partial) {
    if (!Object.prototype.hasOwnProperty.call(partial, k)) continue;
    if (partial[k] !== current[k]) return true;
  }
  return false;
}

/**
 * Sets whether `key` is a member of `set`. Equivalent to
 * `present ? set.add(key) : set.delete(key)`.
 */
export function setMembership<T>(set: Set<T>, key: T, present: boolean): void {
  if (present) set.add(key);
  else set.delete(key);
}
