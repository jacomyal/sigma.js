/**
 * Sigma.js Gesture Hint
 * =====================
 *
 * Overlay displayed over the stage when `gestureTarget` is "shared" and a
 * plain gesture reaches the graph. It then tells users how to actually
 * zoom the graph (Ctrl/⌘ + wheel on desktop, two fingers on touch devices).
 * Restylable through the "sigma-gesture-hint" class.
 * @module
 */
import { Settings } from "../settings";
import { createElement } from "../utils";

export type GestureHintMessages = Pick<
  Settings,
  "sharedGestureWheelMessage" | "sharedGestureAppleWheelMessage" | "sharedGestureTouchMessage"
>;

// ⌘ is the conventional modifier on Apple devices, Ctrl everywhere else:
const IS_APPLE_PLATFORM = typeof navigator !== "undefined" && /Mac|iP(hone|ad|od)/.test(navigator.platform);

// How long the hint stays visible after the last plain gesture:
const HIDE_DELAY = 1500;

// Only the opacity (the show/hide mechanism) is inline:
// language=CSS
const RULES = /*css*/ `.sigma-gesture-hint {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1em;
  background: #00000066;
  color: #ffffff;
  font-size: 1em;
  pointer-events: none;
  transition: opacity 0.1s;
}`;

// Checks whether the browser's CSS parser keeps a given rule (the <style>
// element must be connected for its sheet to exist):
function cssRuleParses(rule: string): boolean {
  const style = createElement<HTMLStyleElement>("style");
  style.textContent = rule;
  document.head.appendChild(style);
  const parses = (style.sheet?.cssRules.length ?? 0) > 0;
  style.remove();
  return parses;
}

// Wrap the rules in @layer and @scope, each only when the browser supports it:
// - @layer makes it easier to override the rules, without using !important
// - @scope makes the CSS only affect what's in sigma's container
let stylesCache: string | null = null;
function getStyles(): string {
  if (stylesCache === null) {
    stylesCache = RULES;
    if (cssRuleParses("@scope {}")) stylesCache = `@scope {\n${stylesCache}\n}`;
    if (cssRuleParses("@layer sigma-gesture-hint {}")) stylesCache = `@layer sigma-gesture-hint {\n${stylesCache}\n}`;
  }
  return stylesCache;
}

export default class GestureHint {
  private styleElement: HTMLStyleElement;
  private element: HTMLElement;
  private hideTimeout: number | null = null;

  constructor(container: HTMLElement) {
    this.styleElement = createElement<HTMLStyleElement>("style");
    this.styleElement.textContent = getStyles();
    container.appendChild(this.styleElement);

    this.element = createElement<HTMLDivElement>("div", { opacity: "0" }, { class: "sigma-gesture-hint" });
    container.appendChild(this.element);
  }

  show(gesture: "wheel" | "touch", messages: GestureHintMessages): void {
    const message =
      gesture === "touch"
        ? messages.sharedGestureTouchMessage
        : IS_APPLE_PLATFORM
          ? messages.sharedGestureAppleWheelMessage
          : messages.sharedGestureWheelMessage;
    if (!message) return;

    this.element.textContent = message;
    this.element.style.opacity = "1";

    if (typeof this.hideTimeout === "number") clearTimeout(this.hideTimeout);
    this.hideTimeout = window.setTimeout(() => {
      this.hideTimeout = null;
      this.element.style.opacity = "0";
    }, HIDE_DELAY);
  }

  kill(): void {
    if (typeof this.hideTimeout === "number") clearTimeout(this.hideTimeout);
    this.styleElement.remove();
    this.element.remove();
  }
}
