;(function() {
  'use strict';

  /**
   * Dispatcher constructor.
   *
   * @return {dispatcher} The new dispatcher instance.
   */
  var dispatcher = function() {
    Object.defineProperty(this, '_handlers', {
      value: {}
    });
  };




  /**
   * Will execute the handler everytime that the indicated event (or the
   * indicated events) will be triggered.
   *
   * @param  {string}           events  The name of the event (or the events
   *                                    separated by spaces).
   * @param  {function(Object)} handler The handler to bind.
   * @return {dispatcher}               Returns the instance itself.
   */
  dispatcher.prototype.bind = function(events, handler) {
    var i,
        l,
        event,
        eArray;

    if (
      arguments.length === 1 &&
      typeof arguments[0] === 'object'
    )
      for (events in arguments[0])
        this.bind(events, arguments[0][events]);
    else if (
      arguments.length === 2 &&
      typeof arguments[1] === 'function'
    ) {
      eArray = typeof events === 'string' ? events.split(' ') : events;

      for (i = 0, l = eArray.length; i !== l; i += 1) {
        event = eArray[i];

        // Check that event is not '':
        if (!event)
          continue;

        if (!this._handlers[event])
          this._handlers[event] = [];

        // Using an object instead of directly the handler will make possible
        // later to add flags
        this._handlers[event].push({
          handler: handler
        });
      }
    } else
      throw 'bind: Wrong arguments.';

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
  dispatcher.prototype.unbind = function(events, handler) {
    var i,
        n,
        j,
        m,
        k,
        a,
        event,
        eArray = typeof events === 'string' ? events.split(' ') : events;

    if (!arguments.length) {
      for (k in this._handlers)
        delete this._handlers[k];
      return this;
    }

    if (handler) {
      for (i = 0, n = eArray.length; i !== n; i += 1) {
        event = eArray[i];
        if (this._handlers[event]) {
          a = [];
          for (j = 0, m = this._handlers[event].length; j !== m; j += 1)
            if (this._handlers[event][j].handler !== handler)
              a.push(this._handlers[event][j]);

          this._handlers[event] = a;
        }

        if (this._handlers[event] && this._handlers[event].length === 0)
          delete this._handlers[event];
      }
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
  dispatcher.prototype.dispatchEvent = function(events, data) {
    var i,
        n,
        j,
        m,
        a,
        event,
        eventName,
        self = this,
        eArray = typeof events === 'string' ? events.split(' ') : events;

    data = data === undefined ? {} : data;

    for (i = 0, n = eArray.length; i !== n; i += 1) {
      eventName = eArray[i];

      if (this._handlers[eventName]) {
        event = self.getEvent(eventName, data);
        a = [];

        for (j = 0, m = this._handlers[eventName].length; j !== m; j += 1) {
          this._handlers[eventName][j].handler(event);
          if (!this._handlers[eventName][j].one)
            a.push(this._handlers[eventName][j]);
        }

        this._handlers[eventName] = a;
      }
    }

    return this;
  };

  /**
   * Return an event object.
   *
   * @param  {string}  events The name of the event.
   * @param  {?object} data   The content of the event (optional).
   * @return {object}         Returns the instance itself.
   */
  dispatcher.prototype.getEvent = function(event, data) {
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
  dispatcher.extend = function(target, args) {
    var k;

    for (k in dispatcher.prototype)
      if (dispatcher.prototype.hasOwnProperty(k))
        target[k] = dispatcher.prototype[k];

    dispatcher.apply(target, args);
  };




  /**
   * EXPORT:
   * *******
   */
  if (typeof this.sigma !== 'undefined') {
    this.sigma.classes = this.sigma.classes || {};
    this.sigma.classes.dispatcher = dispatcher;
  } else if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports)
      exports = module.exports = dispatcher;
    exports.dispatcher = dispatcher;
  } else
    this.dispatcher = dispatcher;
}).call(this);
