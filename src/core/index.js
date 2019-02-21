import "./polyfills";
import sigma from "./sigma.core";
import register from "./register";
import settings from "./sigma.settings";
import registerSigmaModules from "./sigma.modules";
import animation from "./misc/sigma.misc.animation";
import bindEvents from "./misc/sigma.misc.bindEvents";
import bindDOMEvents from "./misc/sigma.misc.bindDOMEvents";
import drawHovers from "./misc/sigma.misc.drawHovers";
import rendererDef from "./sigma.renderers.def";

register(sigma);
settings(sigma);
registerSigmaModules(sigma);
rendererDef(sigma, window);

// Miscellaneous
animation(sigma);
bindEvents(sigma);
bindDOMEvents(sigma);
drawHovers(sigma);

export default sigma;
