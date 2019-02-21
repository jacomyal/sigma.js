import Dispatcher from "../Dispatcher";

describe("The Dispatcher Class", () => {
  it("dispatches events correctly", () => {
    let dispatched = 0;
    const instance = new Dispatcher();
    const listener = () => dispatched++;

    instance.dispatchEvent("myEvent");
    expect(dispatched).toEqual(
      0,
      "Dispatching an event with no listener does nothing."
    );

    instance.bind("myEvent", listener);
    instance.dispatchEvent("myEvent");
    expect(dispatched).toEqual(
      1,
      "Dispatching an event with a listener executes the listener."
    );

    instance.unbind("myEvent", listener);
    instance.dispatchEvent("myEvent");
    expect(dispatched).toEqual(
      1,
      "Dispatching an event with a listener than has been unbound does nothing."
    );
  });

  it("respects unbind polymorphism", () => {
    let dispatched = 0;
    const instance = new Dispatcher();
    const listener = () => dispatched++;

    instance.bind("myEvent", listener);
    instance.unbind("myEvent", listener);
    instance.dispatchEvent("myEvent");
    expect(dispatched).toEqual(0, "unbind(event, handler) works.");

    instance.bind("myEvent", listener);
    instance.unbind("myEvent anotherEvent", listener);
    instance.dispatchEvent("myEvent");
    expect(dispatched).toEqual(0, 'unbind("event1 event2", handler) works.');

    instance.bind("myEvent", listener);
    instance.unbind("  myEvent   anotherEvent  ", listener);
    instance.dispatchEvent("myEvent");
    expect(dispatched).toEqual(
      0,
      'unbind("  event1   event2  ", handler) works.'
    );

    instance.bind("myEvent", listener);
    instance.unbind(["myEvent", "anotherEvent"], listener);
    instance.dispatchEvent("myEvent");
    expect(dispatched).toEqual(0, "unbind(event, handler) works.");

    instance.bind("myEvent", listener);
    instance.unbind("myEvent");
    instance.dispatchEvent("myEvent");
    expect(dispatched).toEqual(0, "unbind(event) works.");

    instance.bind("myEvent", listener);
    instance.unbind();
    instance.dispatchEvent("myEvent");
    expect(dispatched).toEqual(0, "unbind() works.");
  });

  describe("respects bind polymorphism", () => {
    let dispatched1 = 0;
    let dispatched2 = 0;
    const instance = new Dispatcher();

    const listener1 = () => dispatched1++;
    const listener2 = () => dispatched2++;

    instance.bind("myEvent1", listener1);
    instance.dispatchEvent("myEvent1");
    expect(dispatched1).toEqual(1, "bind(event, handler) works.");
    instance.unbind("myEvent1");
    dispatched1 = 0;

    instance.bind("myEvent1 myEvent2", listener1);
    instance.dispatchEvent("myEvent1");
    instance.dispatchEvent("myEvent2");
    expect(dispatched1).toEqual(2, 'bind("event1 event2", handler) works.');
    instance.unbind("myEvent1 myEvent2");
    dispatched1 = 0;

    instance.bind("  myEvent1   myEvent2  ", listener1);
    instance.dispatchEvent("myEvent1");
    instance.dispatchEvent("myEvent2");
    expect(dispatched1).toEqual(
      2,
      'bind("  event1   event2  ", handler) works.'
    );
    instance.unbind("myEvent1 myEvent2");
    dispatched1 = 0;

    instance.bind(["myEvent1", "myEvent2"], listener1);
    instance.dispatchEvent("myEvent1");
    instance.dispatchEvent("myEvent2");
    expect(dispatched1).toEqual(
      2,
      'bind(["event1", "event2"], handler) works.'
    );
    instance.unbind("myEvent1 myEvent2");
    dispatched1 = 0;

    instance.bind({ myEvent1: listener1, myEvent2: listener2 });
    instance.dispatchEvent("myEvent1");
    instance.dispatchEvent("myEvent2");
    expect([dispatched1, dispatched2]).toEqual(
      [1, 1],
      "bind({ event1: listener1, event2: listener2, }, handler) works."
    );
    instance.unbind("myEvent1 myEvent2");
    dispatched1 = 0;
    dispatched2 = 0;
  });
});
