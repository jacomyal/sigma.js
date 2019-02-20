/**
 * Unbind simulated "double click" events.
 *
 * @param  {HTMLElement} target   The event target.
 * @param  {string}      type     The event type.
 */
export default function unbindDoubleClick(target, type) {
  const handlers = (target._doubleClickHandler || {})[type] || [];
  let handler = handlers.pop();
  while (handler) {
    target.removeEventListener(type, handler);
    handler = handlers.pop();
  }

  delete (target._doubleClickHandler || {})[type];
}
