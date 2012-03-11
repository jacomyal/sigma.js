/**
 * sigma.js custom event dispatcher class.
 * @constructor
 * @this {sigma.classes.EventDispatcher}
 */
sigma.classes.EventDispatcher = function() {
  /**
   * An object containing all the different handlers bound to one or many
   * events, indexed by these events.
   * @private
   * @type {Object.<string,Object>}
   */
  var _h = {};

  /**
   * Represents "this", without the well-known scope issue.
   * @private
   * @type {sigma.classes.EventDispatcher}
   */
  var _self = this;

  /**
   * Will execute the handler the next (and only the next) time that the
   * indicated event (or the indicated events) will be triggered.
   * @param  {string} events            The name of the event (or the events
   *                                    separated by spaces).
   * @param  {function(Object)} handler The handler to bind.
   * @return {sigma.classes.EventDispatcher} Returns itself.
   */
  function one(events, handler) {
    if (!handler || !events) {
      return _self;
    }

    var eArray = ((typeof events) == 'string') ? events.split(' ') : events;

    eArray.forEach(function(event) {
      if (!_h[event]) {
        _h[event] = [];
      }

      _h[event].push({
        'h': handler,
        'one': true
      });
    });

    return _self;
  }

  /**
   * Will execute the handler everytime that the indicated event (or the
   * indicated events) will be triggered.
   * @param  {string} events            The name of the event (or the events
   *                                    separated by spaces).
   * @param  {function(Object)} handler The handler to bind.
   * @return {sigma.classes.EventDispatcher} Returns itself.
   */
  function bind(events, handler) {
    if (!handler || !events) {
      return _self;
    }

    var eArray = ((typeof events) == 'string') ? events.split(' ') : events;

    eArray.forEach(function(event) {
      if (!_h[event]) {
        _h[event] = [];
      }

      _h[event].push({
        'h': handler,
        'one': false
      });
    });

    return _self;
  }

  /**
   * Unbinds the handler from a specified event (or specified events).
   * @param  {?string} events            The name of the event (or the events
   *                                     separated by spaces). If undefined,
   *                                     then all handlers are unbound.
   * @param  {?function(Object)} handler The handler to unbind. If undefined,
   *                                     each handler bound to the event or the
   *                                     events will be unbound.
   * @return {sigma.classes.EventDispatcher} Returns itself.
   */
  function unbind(events, handler) {
    if (!events) {
      _h = {};
    }

    var eArray = typeof events == 'string' ? events.split(' ') : events;

    if (handler) {
      eArray.forEach(function(event) {
        if (_h[event]) {
          _h[event] = _h[event].filter(function(e) {
            return e['h'] != handler;
          });
        }

        if (_h[event] && _h[event].length == 0) {
          delete _h[event];
        }
      });
    }else {
      eArray.forEach(function(event) {
        delete _h[event];
      });
    }

    return _self;
  }

  /**
   * Executes each handler bound to the event
   * @param  {string} type     The type of the event.
   * @param  {?Object} content The content of the event (optional).
   * @return {sigma.classes.EventDispatcher} Returns itself.
   */
  function dispatch(type, content) {
    if (_h[type]) {
      _h[type].forEach(function(e) {
        e['h']({
          'type': type,
          'content': content,
          'target': _self
        });
      });

      _h[type] = _h[type].filter(function(e) {
        return !e['one'];
      });
    }

    return _self;
  }

  /* PUBLIC INTERFACE: */
  this.one = one;
  this.bind = bind;
  this.unbind = unbind;
  this.dispatch = dispatch;
};

