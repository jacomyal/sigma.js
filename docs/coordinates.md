# Sigma Current Coordinate System

## Referentials

1. Graph coordinates `graph`: arbitrary, range from `-Infinity` to `Infinity`.
2. Rescaled graph coordinates `rescaled`: centered on `0.5`, proportion between min/max of `graph`. Ranges naturally from `0` to `1`.
3. Container pixel coordinates `container`: origin is top left and range from `0` to max pixel width/height.
4. Webgl coordinates `webgl`: centered on `0`, screen space ranges from `-1` to `1`.
5. Quadtree coordinates `quadtree`: same as `rescaled` with `-1`. Can't remember why but won't work else. `quadtree` also normalize sizes by dividing them by container width.

## Translations

* `renderers/utils.createNormalizationFunction`: creates a function mapping `graph` to `rescaled`. It also returns an inverse function mappping `rescaled` to `graph`. It must be actualized every time `graph` coordinates are updated (can be optimized by recomputing only if bounds changed).
* `camera.graphToViewport`: maps `rescaled` to `container`.
* `camera.viewportToGraph`: maps the inverse `container` to `rescaled`.
* `renderers/webgl/utils.matrixFromCamera`: return a translation matrix to map `rescaled` to `webgl` and used in vertex shaders.

## Examples

### Click detection

1. Find nodes in the quadtree using event positions.
2. Apply size ratio of the camera.
3. Map node positions from `rescaled` (cache) to `container`.
4. Compute collisions.

### Drag

1. Map event positions from `container` to `rescaled`.
2. Use inverse normalization function to map `rescaled` to `graph`.
3. Set position in `graph`.
