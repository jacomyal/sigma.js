sigma.classes.EventDispatcher = function() {
  var _h = {};
  var _self = this;

  function unbind(events, handler) {
    if (!events) {
      _h = {};
    }

    var eArray = typeof events == 'string' ? events.split(' ') : events;

    if (handler) {
      eArray.forEach(function(event) {
        while (_h[event] && _h[event].indexOf(handler) >= 0) {
          _h[event].splice(_h[event].indexOf(handler), 1);
        }

        if (_h[event] && _h[event].length == 0) {
          delete _h[event];
        }
      });
    }else {
      eArray.forEach(function(event) { delete _h[event]; });
    }

    return _self;
  }

  function bind(events, handler) {
    if (!handler || !events) return;

    var eArray = ((typeof events) == 'string') ? events.split(' ') : events;

    eArray.forEach(function(event) {
      if (!_h[event]) _h[event] = [];
      _h[event].push(handler);
    });

    return _self;
  }

  function dispatch(type, content) {
    _h[type] && _h[type].forEach(function(handler) {
      handler({
        'type': type,
        'content': content,
        'target': _self
      });
    });
    return _self;
  }

  /* PUBLIC INTERFACE: */
  this.unbind = unbind;
  this.bind = bind;
  this.dispatch = dispatch;
};
