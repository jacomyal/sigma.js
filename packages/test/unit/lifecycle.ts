import { EventEmitter } from "events";
import Graph from "graphology";
import Sigma from "sigma";
import { createElement } from "sigma/utils";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

interface SigmaTestContext {
  sigma: Sigma;
}

beforeEach<SigmaTestContext>(async (context) => {
  const graph = new Graph();
  const container = createElement("div", { width: "100px", height: "100px" });
  document.body.append(container);
  context.sigma = new Sigma(graph, container);
});

afterEach<SigmaTestContext>(async ({ sigma }) => {
  sigma.kill();
  sigma.getContainer().remove();
});

describe("Sigma #kill method", () => {
  test<SigmaTestContext>("it should unbind all event listeners", ({ sigma }) => {
    const dispatcher = sigma as EventEmitter;

    const EVENT = "custom-event";
    let count = 0;
    dispatcher.addListener(EVENT, () => count++);

    dispatcher.emit(EVENT);
    expect(count).toEqual(1);

    sigma.kill();
    dispatcher.emit(EVENT);
    expect(count).toEqual(1);
  });

  test<SigmaTestContext>("it should do nothing when called multiple times", ({ sigma }) => {
    expect(() => {
      sigma.kill();
      sigma.kill();
    }).not.toThrow();
  });

  test<SigmaTestContext>('it should emit a "kill" event only the first time it\'s called', ({ sigma }) => {
    let count = 0;
    sigma.addListener("kill", () => count++);
    sigma.kill();
    sigma.kill();
    expect(count).toBe(1);
  });

  test<SigmaTestContext>("it should empty the container", ({ sigma }) => {
    sigma.kill();
    expect(sigma.getContainer().children.length).toBe(0);
  });
});
