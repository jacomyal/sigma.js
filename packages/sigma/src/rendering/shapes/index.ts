/**
 * Sigma.js Shape Registry - Exports
 * ==================================
 *
 * Re-exports shape instance registry and factory helpers.
 *
 * @module
 */
export {
  registerShapeInstance,
  getRegisteredShapeInstance,
  getShapeFromSlug,
  getShapeId,
  getRegisteredShapeSlugs,
  getShapeGLSL,
  getAllShapeGLSL,
  getShapeGLSLForShapes,
  dedupeShapeUniforms,
  generateShapeSelectorGLSL,
  generateNodeShapeSelectorGLSL,
  getStaticAttributeDefault,
  generateSDFCall,
  clearShapeInstanceRegistry,
} from "../nodes/shapes/instance-registry";
