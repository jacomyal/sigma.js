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
  sigma.register("sigma.utils.doubleClick", doubleClick);
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
  sigma.register("sigma.classes.camera", Camera(sigma));

  // Register Captors
  sigma.register("sigma.captors.mouse", MouseCaptor(sigma));
  sigma.register("sigma.captors.touch", TouchCaptor(sigma));
};
