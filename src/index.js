import "./polyfills";
import Sigma from "./sigma.core";
import register from "./register";
import settings from "./sigma.settings";
import registerSigmaModules from "./sigma.modules";
import animation from "./misc/sigma.misc.animation";
import bindEvents from "./misc/sigma.misc.bindEvents";
import bindDOMEvents from "./misc/sigma.misc.bindDOMEvents";
import drawHovers from "./misc/sigma.misc.drawHovers";

register(Sigma);
settings(Sigma);
registerSigmaModules(Sigma);

// Miscellaneous
animation(Sigma);
bindEvents(Sigma);
bindDOMEvents(Sigma);
drawHovers(Sigma);

export default Sigma;
