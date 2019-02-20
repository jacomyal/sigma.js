import conrad from "conrad";
import sigma from "./sigma.core";
import utils from "./utils/sigma.utils";
import "./utils/sigma.polyfills";
import settings from "./sigma.settings";
import dispatcher from "./classes/sigma.classes.dispatcher";
import configurable from "./classes/sigma.classes.configurable";
import graph from "./classes/sigma.classes.graph";
import camera from "./classes/sigma.classes.camera";
import quad from "./classes/sigma.classes.quad";
import edgequad from "./classes/sigma.classes.edgequad";
import captorMouse from "./captors/sigma.captors.mouse";
import captorTouch from "./captors/sigma.captors.touch";
import rendererCanvas from "./renderers/sigma.renderers.canvas";
import rendererWebgl from "./renderers/sigma.renderers.webgl";
import rendererSvg from "./renderers/sigma.renderers.svg";
import rendererDef from "./renderers/sigma.renderers.def";

// Sub functions per engine:
import renderFnWebGLNodesDef from "./renderers/webgl/sigma.webgl.nodes.def";
import renderFnWebGLNodesFast from "./renderers/webgl/sigma.webgl.nodes.fast";
import renderFnWebGLEdgesDef from "./renderers/webgl/sigma.webgl.edges.def";
import renderFnWebGLEdgesFast from "./renderers/webgl/sigma.webgl.edges.fast";
import renderFnWebGLEdgesArrow from "./renderers/webgl/sigma.webgl.edges.arrow";
import renderFnCanvasLabelsDef from "./renderers/canvas/sigma.canvas.labels.def";
import renderFnCanvasHoversDef from "./renderers/canvas/sigma.canvas.hovers.def";
import renderFnCanvasNodesDef from "./renderers/canvas/sigma.canvas.nodes.def";
import renderFnCanvasEdgesDef from "./renderers/canvas/sigma.canvas.edges.def";
// import renderFnCanvasEdgesDotCurve from "./renderers/canvas/sigma.canvas.edges.dotCurve";
import renderFnCanvasEdgesArrow from "./renderers/canvas/sigma.canvas.edges.arrow";
// import renderFnCanvasDotCurvedArrow from "./renderers/canvas/sigma.canvas.edges.dotCurvedArrow";
import renderFnCanvasEdgeHoversDef from "./renderers/canvas/sigma.canvas.edgehovers.def";
import renderFnCanvasEdgeHoversCurve from "./renderers/canvas/sigma.canvas.edgehovers.curve";
import renderFnCanvasEdgeHoversArrow from "./renderers/canvas/sigma.canvas.edgehovers.arrow";
import renderFnCanvasEdgeHoversCurvedARrow from "./renderers/canvas/sigma.canvas.edgehovers.curvedArrow";
import renderFnCanvasCanvasExtremities from "./renderers/canvas/sigma.canvas.extremities.def";
import renderFnSvgUtils from "./renderers/svg/sigma.svg.utils";
import renderFnSvgNodesDef from "./renderers/svg/sigma.svg.nodes.def";
import renderFnSvgEdgesDef from "./renderers/svg/sigma.svg.edges.def";
import renderFnSvgEdgesCurve from "./renderers/svg/sigma.svg.edges.curve";
import renderFnSvgLabelsDef from "./renderers/svg/sigma.svg.labels.def";
import renderFnSvgHoversDef from "./renderers/svg/sigma.svg.hovers.def";
import rescale from "./middlewares/sigma.middlewares.rescale";
import copy from "./middlewares/sigma.middlewares.copy";
import animation from "./misc/sigma.misc.animation";
import bindEvents from "./misc/sigma.misc.bindEvents";
import bindDOMEvents from "./misc/sigma.misc.bindDOMEvents";
import drawHovers from "./misc/sigma.misc.drawHovers";

sigma.conrad = conrad;
utils(sigma);
settings(sigma);

// Main Classes
dispatcher(sigma);
configurable(sigma);
graph(sigma);
camera(sigma);
quad(sigma);
edgequad(sigma);

// Captors
captorMouse(sigma);
captorTouch(sigma);

// Renderers
rendererCanvas(sigma);
rendererWebgl(sigma);
rendererSvg(sigma);
rendererDef(sigma, window);

// Engine Functions
renderFnWebGLNodesDef(sigma);
renderFnWebGLNodesFast(sigma);
renderFnWebGLEdgesDef(sigma);
renderFnWebGLEdgesFast(sigma);
renderFnWebGLEdgesArrow(sigma);
renderFnCanvasLabelsDef(sigma);
renderFnCanvasHoversDef(sigma);
renderFnCanvasNodesDef(sigma);
renderFnCanvasEdgesDef(sigma);
// renderFnCanvasEdgesDotCurve(sigma);
renderFnCanvasEdgesArrow(sigma);
// renderFnCanvasDotCurvedArrow(sigma);
renderFnCanvasEdgeHoversDef(sigma);
renderFnCanvasEdgeHoversCurve(sigma);
renderFnCanvasEdgeHoversArrow(sigma);
renderFnCanvasEdgeHoversCurvedARrow(sigma);
renderFnCanvasCanvasExtremities(sigma);
renderFnSvgUtils(sigma);
renderFnSvgNodesDef(sigma);
renderFnSvgEdgesDef(sigma);
renderFnSvgEdgesCurve(sigma);
renderFnSvgLabelsDef(sigma);
renderFnSvgHoversDef(sigma);

// Middlewares
rescale(sigma);
copy(sigma);

// Miscellaneous
animation(sigma);
bindEvents(sigma);
bindDOMEvents(sigma);
drawHovers(sigma);

export default sigma;
