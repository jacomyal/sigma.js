/**
 * Unit tests for the label-events resolver helpers.
 */
import { describe, expect, test } from "vitest";

import { hasAnyEnabled, hasAnySeparate, resolveLabelMode } from "./label-events";

describe("resolveLabelMode", () => {
  test("string forms apply to every interaction", () => {
    expect(resolveLabelMode(false, "click")).toBe(false);
    expect(resolveLabelMode("extend", "click")).toBe("extend");
    expect(resolveLabelMode("extend", "wheel")).toBe("extend");
    expect(resolveLabelMode("separate", "enter")).toBe("separate");
  });

  test("explicit per-interaction entries win over default", () => {
    expect(resolveLabelMode({ click: "extend", default: "separate" }, "click")).toBe("extend");
    expect(resolveLabelMode({ click: "extend", default: "separate" }, "doubleClick")).toBe("separate");
  });

  test("missing entries with no default resolve to false", () => {
    expect(resolveLabelMode({ click: "extend" }, "doubleClick")).toBe(false);
  });

  test("default applies to unspecified interactions only", () => {
    const s = { default: "extend" as const, enter: "separate" as const };
    expect(resolveLabelMode(s, "click")).toBe("extend");
    expect(resolveLabelMode(s, "enter")).toBe("separate");
  });
});

describe("hasAnyEnabled", () => {
  test("false is empty; truthy string forms are enabled", () => {
    expect(hasAnyEnabled(false)).toBe(false);
    expect(hasAnyEnabled("extend")).toBe(true);
    expect(hasAnyEnabled("separate")).toBe(true);
  });

  test("Record forms inspect default and explicit entries", () => {
    expect(hasAnyEnabled({})).toBe(false);
    expect(hasAnyEnabled({ default: false })).toBe(false);
    expect(hasAnyEnabled({ click: false })).toBe(false);
    expect(hasAnyEnabled({ click: "extend" })).toBe(true);
    expect(hasAnyEnabled({ default: "separate" })).toBe(true);
  });
});

describe("hasAnySeparate", () => {
  test("only 'separate' anywhere returns true", () => {
    expect(hasAnySeparate(false)).toBe(false);
    expect(hasAnySeparate("extend")).toBe(false);
    expect(hasAnySeparate("separate")).toBe(true);
    expect(hasAnySeparate({ click: "extend" })).toBe(false);
    expect(hasAnySeparate({ click: "extend", default: "extend" })).toBe(false);
    expect(hasAnySeparate({ click: "extend", enter: "separate" })).toBe(true);
    expect(hasAnySeparate({ default: "separate" })).toBe(true);
  });
});
