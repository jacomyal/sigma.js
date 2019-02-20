/* eslint-disable no-param-reassign */
import extend from "./domain/utils/misc/extend";
import DEFAULT_SETTINGS from "./domain/default_settings";

export default function configure(sigma) {
  // Export the previously designed settings:
  sigma.settings = extend(sigma.settings || {}, DEFAULT_SETTINGS);
}
