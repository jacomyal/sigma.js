# sigma.js - changelog:

## 2.0.0

- Complete rewrite of the library.

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
