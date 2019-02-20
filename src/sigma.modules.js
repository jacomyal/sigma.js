import MouseCaptor from "./domain/classes/MouseCaptor";
import TouchCaptor from "./domain/classes/TouchCaptor";
import Camera from "./domain/classes/Camera";
import Configurable from "./domain/classes/Configurable";
import Dispatcher from "./domain/classes/Dispatcher";
import extend from "./domain/utils/misc/extend";
import dateNow from "./domain/utils/misc/dateNow";
import id from "./domain/utils/misc/id";
import floatColor from "./domain/utils/misc/floatColor";
import zoomTo from "./domain/utils/misc/zoomTo";
import getQuadraticControlPoint from "./domain/utils/geometry/getQuadraticControlPoint";
import getPointsOnQuadraticCurve from "./domain/utils/geometry/getPointOnQuadraticCurve";
import getPointOnBezierCurve from "./domain/utils/geometry/getPointOnBezierCurve";
import getSelfLoopControlPoints from "./domain/utils/geometry/getSelfLoopControlPoints";
import getDistance from "./domain/utils/geometry/getDistance";
import getCircleIntersection from "./domain/utils/geometry/getCircleIntersection";
import isPointOnSegment from "./domain/utils/geometry/isPointOnSegment";
import isPointOnQuadraticCurve from "./domain/utils/geometry/isPointOnQuadraticCurve";
import isPointOnBezierCurve from "./domain/utils/geometry/isPointOnBezierCurve";
import getX from "./domain/utils/events/getX";
import getY from "./domain/utils/events/getY";
import getPixelRatio from "./domain/utils/events/getPixelRatio";
import getWidth from "./domain/utils/events/getWidth";
import getHeight from "./domain/utils/events/getHeight";
import getCenter from "./domain/utils/events/getCenter";
import mouseCoords from "./domain/utils/events/mouseCoords";
import getDelta from "./domain/utils/events/getDelta";
import getOffset from "./domain/utils/events/getOffset";
import doubleClick from "./domain/utils/events/doubleClick";
import unbindDoubleClick from "./domain/utils/events/unbindDoubleClick";
import {
  linearNone,
  quadraticIn,
  quadraticOut,
  quadraticInOut,
  cubicIn,
  cubicOut,
  cubicInOut
} from "./domain/utils/misc/easings";
import loadShader from "./domain/utils/webgl/loadShader";
import loadProgram from "./domain/utils/webgl/loadProgram";
import translation from "./domain/utils/matrices/translation";
import rotation from "./domain/utils/matrices/rotation";
import scale from "./domain/utils/matrices/scale";
import multiply from "./domain/utils/matrices/multiply";
import EdgeQuad from "./domain/classes/EdgeQuad";
import Graph from "./domain/classes/Graph";
import Quad from "./domain/classes/Quad";
import edgeHoversArrowCanvas from "./domain/renderers/canvas/edgeHoversArrow";
import edgeHoversCurveCanvas from "./domain/renderers/canvas/edgeHoversCurve";
import edgeHoversCurvedArrowCanvas from "./domain/renderers/canvas/edgeHoversCurvedArrow";
import edgeHoversDefCanvas from "./domain/renderers/canvas/edgeHoversDef";
import edgesArrowCanvas from "./domain/renderers/canvas/edgesArrow";
import edgesCurveCanvas from "./domain/renderers/canvas/edgesCurve";
import edgesCurvedArrowCanvas from "./domain/renderers/canvas/edgesCurvedArrow";
import edgesDefCanvas from "./domain/renderers/canvas/edgesDef";
import extremitiesDefCanvas from "./domain/renderers/canvas/extremitiesDef";
import hoversDefCanvas from "./domain/renderers/canvas/hoversDef";
import labelsDefCanvas from "./domain/renderers/canvas/labelsDef";
import nodesDefCanvas from "./domain/renderers/canvas/nodesDef";
import CanvasRenderer from "./domain/renderers/canvas/index";
import SvgRenderer from "./domain/renderers/svg/index";
import edgesCurveSvg from "./domain/renderers/svg/edgesCurve";
import edgesDefSvg from "./domain/renderers/svg/edgesDef";
import hoversDefSvg from "./domain/renderers/svg/hoversDef";
import labelsDefSvg from "./domain/renderers/svg/labelsDef";
import nodesDefSvg from "./domain/renderers/svg/nodesDef";
import { show, hide } from "./domain/renderers/svg/utils";
import WebGLRenderer from "./domain/renderers/webgl/index";
import webglEdgesArrow from "./domain/renderers/webgl/edgesArrow";
import webglEdgesDef from "./domain/renderers/webgl/edgesDef";
import webglEdgesFast from "./domain/renderers/webgl/edgesFast";
import webglNodesDef from "./domain/renderers/webgl/nodesDef";
import webglNodesFast from "./domain/renderers/webgl/nodesFast";
import webglEdgesThickLine from "./domain/renderers/webgl/thickLine";
import webglThickLineCPU from "./domain/renderers/webgl/thickLineCPU";
import webglThickLineGPU from "./domain/renderers/webgl/thickLineGPU";
import copy from "./domain/middleware/copy";
import rescale from "./domain/middleware/rescale";
import getBoundaries from "./domain/utils/geometry/getBoundaries";

export default sigma => {
  /**
   * Miscellaneous Utilities
   */
  sigma.register("sigma.utils.extend", extend);
  sigma.register("sigma.utils.dateNow", dateNow);
  sigma.register("sigma.utils.id", id);
  sigma.register("sigma.utils.floatColor", floatColor);
  sigma.register("sigma.utils.zoomTo", zoomTo(sigma));

  /**
   * Geometry Utils
   */
  sigma.register(
    "sigma.utils.getQuadraticControlPoint",
    getQuadraticControlPoint
  );
  sigma.register(
    "sigma.utils.getPointOnQuadraticCurve",
    getPointsOnQuadraticCurve
  );
  sigma.register("sigma.utils.getPointOnBezierCurve", getPointOnBezierCurve);
  sigma.register(
    "sigma.utils.getSelfLoopControlPoints",
    getSelfLoopControlPoints
  );
  sigma.register("sigma.utils.getDistance", getDistance);
  sigma.register("sigma.utils.getCircleIntersection", getCircleIntersection);
  sigma.register("sigma.utils.isPointOnSegment", isPointOnSegment);
  sigma.register(
    "sigma.utils.isPointOnQuadraticCurve",
    isPointOnQuadraticCurve
  );
  sigma.register("sigma.utils.isPointOnBezierCurve", isPointOnBezierCurve);
  sigma.register("sigma.utils.getBoundaries", getBoundaries);

  /**
   * Event Utilities
   */
  sigma.register("sigma.utils.getX", getX);
  sigma.register("sigma.utils.getY", getY);
  sigma.register("sigma.utils.getPixelRatio", getPixelRatio);
  sigma.register("sigma.utils.getWidth", getWidth);
  sigma.register("sigma.utils.getCenter", getCenter);
  sigma.register("sigma.utils.mouseCoords", mouseCoords);
  sigma.register("sigma.utils.getHeight", getHeight);
  sigma.register("sigma.utils.getDelta", getDelta);
  sigma.register("sigma.utils.getOffset", getOffset);
  sigma.register("sigma.utils.doubleClick", doubleClick(sigma));
  sigma.register("sigma.utils.unbindDoubleClick", unbindDoubleClick);

  /**
   * Here are just some of the most basic easing functions, used for the
   * animated camera "goTo" calls.
   *
   * If you need some more easings functions, don't hesitate to add them to
   * sigma.utils.easings. But I will not add some more here or merge PRs
   * containing, because I do not want sigma sources full of overkill and never
   * used stuff...
   */
  sigma.register("sigma.utils.easings.linearNone", linearNone);
  sigma.register("sigma.utils.easings.quadraticIn", quadraticIn);
  sigma.register("sigma.utils.easings.quadraticOut", quadraticOut);
  sigma.register("sigma.utils.easings.quadraticInOut", quadraticInOut);
  sigma.register("sigma.utils.easings.cubicIn", cubicIn);
  sigma.register("sigma.utils.easings.cubicOut", cubicOut);
  sigma.register("sigma.utils.easings.cubicInOut", cubicInOut);

  /**
   * WebGL Utilities
   */
  sigma.register("sigma.utils.loadShader", loadShader);
  sigma.register("sigma.utils.loadProgram", loadProgram);

  /**
   * Matrix Utilities
   * The following utils are just here to help generating the transformation
   * matrices for the WebGL renderers.
   */
  sigma.register("sigma.utils.matrices.translation", translation);
  sigma.register("sigma.utils.matrices.rotation", rotation);
  sigma.register("sigma.utils.matrices.scale", scale);
  sigma.register("sigma.utils.matrices.multiply", multiply);

  // Register Classes
  sigma.register("sigma.classes.dispatcher", Dispatcher);
  sigma.register("sigma.classes.configurable", Configurable);
  sigma.register("sigma.classes.camera", Camera);
  sigma.register("sigma.classes.edgequad", EdgeQuad);
  sigma.register("sigma.classes.graph", Graph);
  sigma.register("sigma.classes.quad", Quad);

  // Register Captors
  sigma.register("sigma.captors.mouse", MouseCaptor(sigma));
  sigma.register("sigma.captors.touch", TouchCaptor(sigma));

  // Canvas Renderers
  sigma.register("sigma.renderers.canvas", CanvasRenderer(sigma));
  sigma.register("sigma.canvas.edgehovers.arrow", edgeHoversArrowCanvas);
  sigma.register("sigma.canvas.edgehovers.curve", edgeHoversCurveCanvas);
  sigma.register(
    "sigma.canvas.edgehovers.curvedArrow",
    edgeHoversCurvedArrowCanvas
  );
  sigma.register("sigma.canvas.edgehovers.def", edgeHoversDefCanvas);
  sigma.register("sigma.canvas.edges.arrow", edgesArrowCanvas);
  sigma.register("sigma.canvas.edges.curve", edgesCurveCanvas);
  sigma.register("sigma.canvas.edges.curvedArrow", edgesCurvedArrowCanvas);
  sigma.register("sigma.canvas.edges.def", edgesDefCanvas);
  sigma.register("sigma.canvas.extremities.def", extremitiesDefCanvas(sigma));
  sigma.register("sigma.canvas.hovers.def", hoversDefCanvas(sigma));
  sigma.register("sigma.canvas.labels.def", labelsDefCanvas);
  sigma.register("sigma.canvas.nodes.def", nodesDefCanvas);

  // SVG Renderer
  sigma.register("sigma.renderers.svg", SvgRenderer(sigma));
  sigma.register("sigma.svg.edges.curve", edgesCurveSvg);
  sigma.register("sigma.svg.edges.def", edgesDefSvg);
  sigma.register("sigma.svg.hovers.def", hoversDefSvg);
  sigma.register("sigma.svg.labels.def", labelsDefSvg);
  sigma.register("sigma.svg.nodes.def", nodesDefSvg);
  sigma.register("sigma.svg.utils.show", show);
  sigma.register("sigma.svg.utils.hide", hide);

  // WebGL Renderer
  sigma.register("sigma.renderers.webgl", WebGLRenderer(sigma));
  sigma.register("sigma.webgl.edges.arrow", webglEdgesArrow);
  sigma.register("sigma.webgl.edges.def", webglEdgesDef);
  sigma.register("sigma.webgl.edges.fast", webglEdgesFast);
  sigma.register("sigma.webgl.nodes.def", webglNodesDef);
  sigma.register("sigma.webgl.nodes.fast", webglNodesFast);
  sigma.register("sigma.webgl.edges.thickLine", webglEdgesThickLine);
  sigma.register("sigma.webgl.edges.thickLineCPU", webglThickLineCPU);
  sigma.register("sigma.webgl.edges.thickLineGPU", webglThickLineGPU);

  // Middleware
  sigma.register("sigma.middlewares.copy", copy);
  sigma.register("sigma.middlewares.rescale", rescale);
};
