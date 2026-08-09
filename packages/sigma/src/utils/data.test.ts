import { describe, expect, test } from "vitest";

import { hasNewPartialProps, shallowEqual } from "./data";

describe("hasNewPartialProps", () => {
  test("returns false when partial is empty", () => {
    expect(hasNewPartialProps({ a: 1, b: 2 }, {})).toBe(false);
  });

  test("returns false when all partial values match", () => {
    expect(hasNewPartialProps({ a: 1, b: "hello", c: true }, { a: 1, c: true })).toBe(false);
  });

  test("returns true when a value differs", () => {
    expect(hasNewPartialProps({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(true);
  });

  test("returns true on first differing key (short-circuits)", () => {
    let accessCount = 0;
    const partial = new Proxy(
      { a: 999, b: 1 },
      {
        get(target, prop) {
          accessCount++;
          return target[prop as keyof typeof target];
        },
        ownKeys(target) {
          return Object.keys(target);
        },
        getOwnPropertyDescriptor(target, prop) {
          return Object.getOwnPropertyDescriptor(target, prop);
        },
      },
    );
    hasNewPartialProps({ a: 1, b: 1 }, partial);
    // Should access "a" and return true immediately, not check "b"
    expect(accessCount).toBe(1);
  });

  test("distinguishes null, undefined, and missing keys", () => {
    expect(hasNewPartialProps({ a: null }, { a: null })).toBe(false);
    expect(hasNewPartialProps({ a: undefined }, { a: undefined })).toBe(false);
    expect(hasNewPartialProps({ a: null }, { a: undefined })).toBe(true);
    expect(hasNewPartialProps({}, { a: undefined })).toBe(false);
  });

  test("uses strict equality (no coercion)", () => {
    expect(hasNewPartialProps({ a: 0 }, { a: false as unknown as number })).toBe(true);
    expect(hasNewPartialProps({ a: "" }, { a: 0 as unknown as string })).toBe(true);
  });
});

describe("shallowEqual", () => {
  test("returns true for two empty objects", () => {
    expect(shallowEqual({}, {})).toBe(true);
  });

  test("returns true when all values match", () => {
    expect(shallowEqual({ a: 1, b: "hello", c: true }, { a: 1, b: "hello", c: true })).toBe(true);
  });

  test("returns false when a value differs", () => {
    expect(shallowEqual({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false);
  });

  test("checks both directions", () => {
    expect(shallowEqual<Record<string, number>>({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    expect(shallowEqual<Record<string, number>>({ a: 1, b: 2 }, { a: 1 })).toBe(false);
  });

  test("treats missing keys and undefined values as equal", () => {
    expect(shallowEqual({ a: undefined }, { a: undefined })).toBe(true);
    expect(shallowEqual<Record<string, undefined>>({ a: undefined }, {})).toBe(true);
    expect(shallowEqual<Record<string, undefined>>({}, { a: undefined })).toBe(true);
  });

  test("only compares the top level", () => {
    const nested = { a: 1 };
    expect(shallowEqual({ nested }, { nested })).toBe(true);
    expect(shallowEqual({ nested: { a: 1 } }, { nested: { a: 1 } })).toBe(false);
  });

  test("uses strict equality (no coercion)", () => {
    expect(shallowEqual({ a: 0 }, { a: false as unknown as number })).toBe(false);
    expect(shallowEqual({ a: "" }, { a: 0 as unknown as string })).toBe(false);
  });
});
