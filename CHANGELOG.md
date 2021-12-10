# sigma.js - changelog:

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
- _undocumented_ - Cleans some browser warnings for
- [#1157](https://github.com/jacomyal/sigma.js/issues/1157) - Fixes unexpected node interaction with zIndex
- [#1148](https://github.com/jacomyal/sigma.js/issues/1148) - Fixes `mousemove` unexpected behaviors
- [#1163](https://github.com/jacomyal/sigma.js/issues/1163) - Implements edge labels ellipsis

## 2.0.0

- Complete rewrite of the library.
