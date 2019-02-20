/**
 * Simulates a "double click" event.
 *
 * @param  {HTMLElement} target   The event target.
 * @param  {string}      type     The event type.
 * @param  {function}    callback The callback to execute.
 */
export default sigma =>
  function doubleClick(target, type, callback) {
    let clicks = 0;

    const self = this;

    let handlers;

    target._doubleClickHandler = target._doubleClickHandler || {};
    target._doubleClickHandler[type] = target._doubleClickHandler[type] || [];
    handlers = target._doubleClickHandler[type];

    handlers.push(function(e) {
      clicks++;

      if (clicks === 2) {
        clicks = 0;
        return callback(e);
      }
      if (clicks === 1) {
        setTimeout(function() {
          clicks = 0;
        }, sigma.settings.doubleClickTimeout);
      }
    });

    target.addEventListener(type, handlers[handlers.length - 1], false);
  };
