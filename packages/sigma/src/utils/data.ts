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
 * Checks whether the given value is a plain object.
 */
export function isPlainObject(value: unknown): boolean {
  return typeof value === "object" && value !== null && value.constructor === Object;
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
 * Very simple recursive `Object.assign` like function.
 */
export function assignDeep<T>(target: Partial<T> | undefined, ...objects: Array<Partial<T | undefined>>): T {
  target = target || {};

  for (let i = 0, l = objects.length; i < l; i++) {
    const o = objects[i];

    if (!o) continue;

    for (const k in o) {
      if (isPlainObject(o[k])) {
        target[k] = assignDeep(target[k], o[k]);
      } else {
        target[k] = o[k];
      }
    }
  }

  return target as T;
}
