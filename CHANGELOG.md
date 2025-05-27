# sigma.js - changelog:

## 3.0.2

### Bug fixes

- [#1517](https://github.com/jacomyal/sigma.js/issues/1517) - Fixing calling `setGraph` with highlighted nodes (thanks to @AeternusSamurai)
- Fixing an issue, with sigma not properly cleaning WebGL contexts in its `kill()` method ([commit](https://github.com/jacomyal/sigma.js/commit/c292888d69cf5d9b111194d554df0cb3a86f4a60))

## 3.0.1

### Bug fix

- [#1500](https://github.com/jacomyal/sigma.js/issues/1500) - Fixing lag on stop dragging (thanks @ouzhou for the report and the research)

## 3.0.0

### Breaking changes

- **Completely rewrites programs API**
- **Renames all existing programs**
- **Restructures sources as a multi-package repository (using [Lerna](https://lerna.js.org/))**
- **Replaces the default node program by `NodeCircleProgram`**
- **Moves the `node.image` renderer as a new package [`@sigma/node-image`](https://www.npmjs.com/package/@sigma/node-image)**
- **Moves `labelRenderer`, `hoverRenderer` and `edgeLabelRenderer` from settings to each renderer**

### Features

- [#1386](https://github.com/jacomyal/sigma.js/issues/1386) Improves `Sigma.kill` method
- [#1382](https://github.com/jacomyal/sigma.js/issues/1382) Handles click/hover nodes and edges with [picking](https://webglfundamentals.org/webgl/lessons/webgl-picking.html) rather than with custom computations
- [#1372](https://github.com/jacomyal/sigma.js/issues/1372) Improves render/refresh lifecycle and APIs
- [#1322](https://github.com/jacomyal/sigma.js/issues/1322) Implements [WebGL instancing](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/drawArraysInstanced) in programs
- [#1346](https://github.com/jacomyal/sigma.js/issues/1346) Adds documentation in the website
- [#1034](https://github.com/jacomyal/sigma.js/issues/1034) Adds new `Sigma.setCamera` method
- [#1185](https://github.com/jacomyal/sigma.js/issues/1185) Adds new `zoomToSizeRatioFunction` and `itemSizesReference` setting
- [#1231](https://github.com/jacomyal/sigma.js/issues/1231) Adds new [`@sigma/edge-curve`](https://www.npmjs.com/package/@sigma/edge-curve) renderer, as a new package
- Adds new [`@sigma/node-border`](https://www.npmjs.com/package/@sigma/node-border) renderer, as a new package

## 2.4.0

### Features

- [#1289](https://github.com/jacomyal/sigma.js/issues/1289) - Adding `Camera.updateState`
- Program classes given in settings (`nodeProgramClasses`, `edgeProgramClasses`) are now merged with default ones for convenience
- [#1287](https://github.com/jacomyal/sigma.js/pull/1287) - Adding the `hoverNodeProgramClasses` setting so that it is possible to have different programs rendering nodes and their hover
- [#1273](https://github.com/jacomyal/sigma.js/issues/1273) - Adding the `Sigma.setGraph` method to renderers
- Adding renderer generic type to specify graph type (thanks to @lf-)

### Bug fixes

- [#1285](https://github.com/jacomyal/sigma.js/issues/1285) - Fixing label selection when camera is rotated
- [#1206](https://github.com/jacomyal/sigma.js/pull/1206), [#1257](https://github.com/jacomyal/sigma.js/issues/1257) - Fixing `node.image` program (thanks to @kaij and @boogheta)
- [#1286](https://github.com/jacomyal/sigma.js/issues/1286) - Fixing right-click erroneously triggering camera drag events
- [#1242](https://github.com/jacomyal/sigma.js/pull/1242), [#1282](https://github.com/jacomyal/sigma.js/pull/1282) - Fixing multiple issues related to touch captor (thanks to @kaij and @boogheta)
- [#1272](https://github.com/jacomyal/sigma.js/issues/1272) - Fixing quadtree-related stack overflows
- Fixing graph event leak on `Sigma.kill`
- [#1253](https://github.com/jacomyal/sigma.js/issues/1253) - Fixing `edge.fast` program not respecting `hidden`
- Fixing `edge.fast` vert shader not unpacking color correctly
- [#1251](https://github.com/jacomyal/sigma.js/pull/1251) - Fixing alpha value parsing of hex colors (thanks to @kaij)

## 2.3.1

### Feature

- [#1239](https://github.com/jacomyal/sigma.js/pull/1239) - Adds `getContainer` method to public API (thanks to @stefanprobst)

### Bug fixes

- [#1230](https://github.com/jacomyal/sigma.js/pull/1230) - Updates broken link to graphology in README.md (thanks to @alexduhem)
- [#1236](https://github.com/jacomyal/sigma.js/issues/1236) - Fixes `#.preventSigmaDefault` scoping
- [#1237](https://github.com/jacomyal/sigma.js/issues/1237) - Updates `pixelRatio` on resize
- [#1240](https://github.com/jacomyal/sigma.js/issues/1240) - Fixes click events for touch devices
- [#1244](https://github.com/jacomyal/sigma.js/issues/1244) - Stops relying on graphology for types (issue only partially fixed yet)
- [#1249](https://github.com/jacomyal/sigma.js/issues/1249) - Fixes hovered nodes layer not being cleared

## 2.3.0

### Features

- _undocumented_ - Publishes examples to the website
- [#1142](https://github.com/jacomyal/sigma.js/issues/1142) - Improves TypeScript typings for events
- [#1170](https://github.com/jacomyal/sigma.js/issues/1170) - Simplifies and optimizes `multiplyVec` internal function
- [#1196](https://github.com/jacomyal/sigma.js/issues/1196) - Adds new `allowInvalidContainer` to prevent sigma.js from throwing errors when it does not find valid width and/or height
- [#1205](https://github.com/jacomyal/sigma.js/issues/1205) - Adds a new example showcasing sigma's scalability and performances
- [#1215](https://github.com/jacomyal/sigma.js/issues/1215) - (ticket still opened) Improves `animateNodes`
- [#1224](https://github.com/jacomyal/sigma.js/issues/1224) - Adds new internal function `floatArrayColor`
- [#1225](https://github.com/jacomyal/sigma.js/issues/1225) - Adds new `beforeRender` and `resize` events
- [#1227](https://github.com/jacomyal/sigma.js/issues/1227) - Implements `#preventSigmaDefault` for mouse move events

### Bug fixes

- [#1214](https://github.com/jacomyal/sigma.js/issues/1214) - Cleans graph lifecycle events handling
- [#1216](https://github.com/jacomyal/sigma.js/issues/1216) - Fixes CodeSandbox configuration for multiple examples (and the template)
- [#1219](https://github.com/jacomyal/sigma.js/issues/1219) - Fixes hidden / excess renderings from `node.ts` program
- [#1223](https://github.com/jacomyal/sigma.js/issues/1223) - Fixes dynamic constant color in various fragment shaders
- [#1226](https://github.com/jacomyal/sigma.js/issues/1226) - Fixes broken `node.ts` program

## 2.2.0

### Features

- [#1161](https://github.com/jacomyal/sigma.js/issues/1161) - Adds `minZoom` and `maxZoom` settings
- [#1166](https://github.com/jacomyal/sigma.js/issues/1166) - Adds HTML colors support
- [#1167](https://github.com/jacomyal/sigma.js/issues/1167) - Adds events TypeScript types
- [#1176](https://github.com/jacomyal/sigma.js/issues/1176) - Cleans and improves event payloads
- [#1177](https://github.com/jacomyal/sigma.js/issues/1177) - Allows overriding arguments with `#graphToViewport` and `#viewportToGraph`
- [#1182](https://github.com/jacomyal/sigma.js/issues/1182) - Adds cached data (from custom reducers) to custom renderers
- [#1187](https://github.com/jacomyal/sigma.js/issues/1187) - Adds `forceLabel` for nodes and edges
- [#1188](https://github.com/jacomyal/sigma.js/issues/1188) - Drops `graphology-metrics` dependency

### Bug fixes

- _undocumented_ - Updates dependencies
- _undocumented_ - Fixes various bugs with the `node.image` program
- _undocumented_ - Fixes the `build/sigma.js` and `build/sigma.min.js` expositions of sigma
- [#1172](https://github.com/jacomyal/sigma.js/issues/1172) - Fixes labels grid display (changes which node labels are displayed by default)
- [#1192](https://github.com/jacomyal/sigma.js/issues/1192) - Fixes alpha blending for most recent WebGL layers
- [#1193](https://github.com/jacomyal/sigma.js/issues/1193) - Fixes dragging with mouse out of stage
- [#1194](https://github.com/jacomyal/sigma.js/issues/1194) - Fixes camera transitions to `angle: 0`
- [#1195](https://github.com/jacomyal/sigma.js/issues/1195) - Improves edge events handling (thanks to @avenzi)
- [#1199](https://github.com/jacomyal/sigma.js/issues/1199) - Fixes issue with hidden nodes and labels rendering (thanks to @avenzi)
- [#1200](https://github.com/jacomyal/sigma.js/issues/1200) - Fixes issue with node labels `""`
- [#1203](https://github.com/jacomyal/sigma.js/issues/1203) - Fixes examples build process

## 2.1.3

### Bug fixes

- [#1178](https://github.com/jacomyal/sigma.js/issues/1178) - Fixes uncaught error in Firefox when using node.image with images with no size
- [#1180](https://github.com/jacomyal/sigma.js/issues/1180) - Fixes edge events not being fired when edge size not set in the graph
- [#1183](https://github.com/jacomyal/sigma.js/issues/1183) - Moves edge labels layer behind nodes layer
- [#1186](https://github.com/jacomyal/sigma.js/issues/1186) - Fixes hovered nodes when mouse not hover sigma container

## 2.1.2

### Bug fixes

- [#1168](https://github.com/jacomyal/sigma.js/issues/1168) - Fixes hover and click events when mouse is hovering a hidden node
- [#1169](https://github.com/jacomyal/sigma.js/issues/1169) - Fixes x / y values in sigma events when mouse is not hovering the sigma container
- [#1173](https://github.com/jacomyal/sigma.js/issues/1173) - Fixes issue where unused program no longer deallocate back to zero
- [#1175](https://github.com/jacomyal/sigma.js/issues/1175) - Fixes zoom scrolling in a scrolled webpage

## 2.1.1

### Bug fix

- [#1165](https://github.com/jacomyal/sigma.js/issues/1165) - Fixes "ghost hovered nodes" issue

## 2.1.0

### Features

- _undocumented_ - Adds edge events
- _undocumented_ - Cleans and fixes all nodes and edges programs
- [#1153](https://github.com/jacomyal/sigma.js/issues/1153) - Adds double-click and wheel events for nodes and edges, with a new `#preventSigmaDefault()` method
- [#1149](https://github.com/jacomyal/sigma.js/issues/1149) - Graphology (and related libs) update to 0.22.1
- [#1102](https://github.com/jacomyal/sigma.js/issues/1102) - Allows custom node and edge label colors
- [#1150](https://github.com/jacomyal/sigma.js/issues/1150) - Adds public methods to enable implementing a proper PNG export, adds related [`png-export` example](https://codesandbox.io/s/github/jacomyal/sigma.js/tree/main/examples/png-snapshot)

### Bug fixes

- _undocumented_ - Edges thickness rendering is now pixel perfect at camera ratio 1, and no more twice bigger on Retina displays
- _undocumented_ - Cleans some browser warnings
- [#1157](https://github.com/jacomyal/sigma.js/issues/1157) - Fixes unexpected node interaction with zIndex
- [#1148](https://github.com/jacomyal/sigma.js/issues/1148) - Fixes `mousemove` unexpected behaviors
- [#1163](https://github.com/jacomyal/sigma.js/issues/1163) - Implements edge labels ellipsis

## 2.0.0

- Complete rewrite of the library.
