sigma.classes.EventDispatcher = function() {
  var _h = {};
  var _self = this;

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

