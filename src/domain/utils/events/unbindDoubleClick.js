/**
 * Unbind simulated "double click" events.
 *
 * @param  {HTMLElement} target   The event target.
 * @param  {string}      type     The event type.
 */
export default function unbindDoubleClick(target, type) {
  let handler;

  const handlers = (target._doubleClickHandler || {})[type] || [];

  while ((handler = handlers.pop())) {
    target.removeEventListener(type, handler);
  }

  delete (target._doubleClickHandler || {})[type];
}
