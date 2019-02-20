/*
 * Dispatcher constructor.
 *
 * @return {dispatcher} The new dispatcher instance.
 */
export default function Dispatcher() {
  Object.defineProperty(this, "_handlers", {
    value: {}
  });
}

/**
 * Will execute the handler everytime that the indicated event (or the
 * indicated events) will be triggered.
 *
 * @param  {string}           events  The name of the event (or the events
 *                                    separated by spaces).
 * @param  {function(Object)} handler The handler to bind.
 * @return {dispatcher}               Returns the instance itself.
 */
Dispatcher.prototype.bind = function bind(events, handler) {
  /* eslint-disable prefer-rest-params */
  let eArray;

  if (arguments.length === 1 && typeof arguments[0] === "object") {
    const argObject = arguments[0];
    Object.keys(argObject).forEach(evts => {
      this.bind(evts, argObject[events]);
    });
  } else if (arguments.length === 2 && typeof arguments[1] === "function") {
    eArray = typeof events === "string" ? events.split(" ") : events;
    eArray
      .filter(e => !!e)
      .forEach(event => {
        if (!this._handlers[event]) this._handlers[event] = [];

        // Using an object instead of directly the handler will make possible
        // later to add flags
        this._handlers[event].push({
          handler
        });
      });
  } else throw new Error("bind: Wrong arguments.");

  return this;
};

/**
 * Removes the handler from a specified event (or specified events).
 *
 * @param  {?string}           events  The name of the event (or the events
 *                                     separated by spaces). If undefined,
 *                                     then all handlers are removed.
 * @param  {?function(object)} handler The handler to unbind. If undefined,
 *                                     each handler bound to the event or the
 *                                     events will be removed.
 * @return {dispatcher}                Returns the instance itself.
 */
Dispatcher.prototype.unbind = function unbind(events, handler) {
  let i;
  let n;
  const eArray = typeof events === "string" ? events.split(" ") : events;

  if (!arguments.length) {
    Object.keys(this._handlers).forEach(key => delete this._handlers[key]);
    return this;
  }

  if (handler) {
    eArray.forEach(event => {
      if (this._handlers[event]) {
        const savedHandlers = [];
        this._handlers[event].forEach(h => {
          if (h.handler !== handler) {
            savedHandlers.push(h);
          }
        });
        this._handlers[event] = savedHandlers;
      }

      if (this._handlers[event] && this._handlers[event].length === 0)
        delete this._handlers[event];
    });
  } else
    for (i = 0, n = eArray.length; i !== n; i += 1)
      delete this._handlers[eArray[i]];

  return this;
};

/**
 * Executes each handler bound to the event
 *
 * @param  {string}     events The name of the event (or the events separated
 *                             by spaces).
 * @param  {?object}    data   The content of the event (optional).
 * @return {dispatcher}        Returns the instance itself.
 */
Dispatcher.prototype.dispatchEvent = function dispatcHEvent(events, data) {
  const self = this;
  const eArray = typeof events === "string" ? events.split(" ") : events;
  data = data === undefined ? {} : data;

  eArray.forEach(eventName => {
    if (this._handlers[eventName]) {
      const event = self.getEvent(eventName, data);
      const savedHandlers = [];

      this._handlers[eventName].forEach(handler => {
        handler.handler(event);
        if (!handler.one) {
          savedHandlers.push(handler);
        }
      });

      this._handlers[eventName] = savedHandlers;
    }
  });

  return this;
};

/**
 * Return an event object.
 *
 * @param  {string}  events The name of the event.
 * @param  {?object} data   The content of the event (optional).
 * @return {object}         Returns the instance itself.
 */
Dispatcher.prototype.getEvent = function getEvent(event, data) {
  return {
    type: event,
    data: data || {},
    target: this
  };
};

/**
 * A useful function to deal with inheritance. It will make the target
 * inherit the prototype of the class dispatcher as well as its constructor.
 *
 * @param {object} target The target.
 */
Dispatcher.extend = function extend(target, args) {
  let k;
  /* eslint-disable-next-line no-restricted-syntax */
  for (k in Dispatcher.prototype) {
    /* eslint-disable-next-line no-prototype-builtins */
    if (Dispatcher.prototype.hasOwnProperty(k))
      target[k] = Dispatcher.prototype[k];
  }

  Dispatcher.apply(target, args);
};
