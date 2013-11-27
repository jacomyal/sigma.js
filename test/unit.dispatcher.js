module('sigma.classes.dispatcher');

test('Basics', function() {
  // 1. Basics
  var dispatched = 0,
      instance = new sigma.classes.dispatcher(),
      listener = function() { dispatched++; };

  instance.dispatchEvent('myEvent');
  strictEqual(dispatched, 0, 'Dispatching an event with no listener does nothing.');

  instance.bind('myEvent', listener);
  instance.dispatchEvent('myEvent');
  strictEqual(dispatched, 1, 'Dispatching an event with a listener executes the listener.');

  instance.unbind('myEvent', listener);
  instance.dispatchEvent('myEvent');
  strictEqual(dispatched, 1, 'Dispatching an event with a listener than has been unbound does nothing.');
});

test('API', function() {
  // 1. "unbind" polymorphism
  var dispatched = 0,
      instance = new sigma.classes.dispatcher(),
      listener = function() { dispatched++; };

  instance.bind('myEvent', listener);
  instance.unbind('myEvent', listener);
  instance.dispatchEvent('myEvent');
  strictEqual(dispatched, 0, 'unbind(event, handler) works.');

  instance.bind('myEvent', listener);
  instance.unbind('myEvent anotherEvent', listener);
  instance.dispatchEvent('myEvent');
  strictEqual(dispatched, 0, 'unbind("event1 event2", handler) works.');

  instance.bind('myEvent', listener);
  instance.unbind('  myEvent   anotherEvent  ', listener);
  instance.dispatchEvent('myEvent');
  strictEqual(dispatched, 0, 'unbind("  event1   event2  ", handler) works.');

  instance.bind('myEvent', listener);
  instance.unbind(['myEvent', 'anotherEvent'], listener);
  instance.dispatchEvent('myEvent');
  strictEqual(dispatched, 0, 'unbind(event, handler) works.');

  instance.bind('myEvent', listener);
  instance.unbind('myEvent');
  instance.dispatchEvent('myEvent');
  strictEqual(dispatched, 0, 'unbind(event) works.');

  instance.bind('myEvent', listener);
  instance.unbind();
  instance.dispatchEvent('myEvent');
  strictEqual(dispatched, 0, 'unbind() works.');

  // 2. "bind" polymorphism
  var dispatched1 = 0,
      dispatched2 = 0,
      instance = new sigma.classes.dispatcher(),
      listener1 = function() { dispatched1++; },
      listener2 = function() { dispatched2++; };

  instance.bind('myEvent1', listener1);
  instance.dispatchEvent('myEvent1');
  strictEqual(dispatched1, 1, 'bind(event, handler) works.');
  instance.unbind('myEvent1');
  dispatched1 = 0;

  instance.bind('myEvent1 myEvent2', listener1);
  instance.dispatchEvent('myEvent1');
  instance.dispatchEvent('myEvent2');
  strictEqual(dispatched1, 2, 'bind("event1 event2", handler) works.');
  instance.unbind('myEvent1 myEvent2');
  dispatched1 = 0;

  instance.bind('  myEvent1   myEvent2  ', listener1);
  instance.dispatchEvent('myEvent1');
  instance.dispatchEvent('myEvent2');
  strictEqual(dispatched1, 2, 'bind("  event1   event2  ", handler) works.');
  instance.unbind('myEvent1 myEvent2');
  dispatched1 = 0;

  instance.bind(['myEvent1', 'myEvent2'], listener1);
  instance.dispatchEvent('myEvent1');
  instance.dispatchEvent('myEvent2');
  strictEqual(dispatched1, 2, 'bind(["event1", "event2"], handler) works.');
  instance.unbind('myEvent1 myEvent2');
  dispatched1 = 0;

  instance.bind({ myEvent1: listener1, myEvent2: listener2 });
  instance.dispatchEvent('myEvent1');
  instance.dispatchEvent('myEvent2');
  deepEqual([dispatched1, dispatched2], [1, 1], 'bind({ event1: listener1, event2: listener2, }, handler) works.');
  instance.unbind('myEvent1 myEvent2');
  dispatched1 = 0;
  dispatched2 = 0;
});
