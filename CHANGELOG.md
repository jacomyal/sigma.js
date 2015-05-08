## sigma.js - changelog:

#### 1.1.0 - release (May 10, 2015)

 - Added the SVG renderer.
 - Added the `minArrowSize` setting (thanks to [@ssidorchick](https://github.com/ssidorchick)).
 - Added an edge quadtree and support for edge events (thanks to [@sheymann](https://github.com/sheymann)).
 - Fixed [#362](https://github.com/jacomyal/sigma.js/issues/362): Nodes and edges can now have a number id.
 - Added the [renderers.snapshot](https://github.com/jacomyal/sigma.js/tree/master/plugins/sigma.renderers.snapshot) plugin.
 - Fixed [#403](https://github.com/jacomyal/sigma.js/issues/403): renderer string container polymorphism.
 - Added an event dispatched when instance is killed.
 - Added low-level Barnes-Hut optimization to the [layout.forceAltas2](https://github.com/jacomyal/sigma.js/tree/master/plugins/sigma.layout.forceAtlas2) plugin (thanks to [@jacomyma](https://github.com/jacomyma)).
 - Added the `mouseWheelEnabled` setting.
 - Added an option to skip quadtree indexation when refreshing an instance.
 - Added `defaultEdgeType` and `defaultNodeType` settings.
 - Added a `isDragging` flag in click event.
 - Added some features to the [layout.forceAltas2](https://github.com/jacomyal/sigma.js/tree/master/plugins/sigma.layout.forceAtlas2) plugin.
 - Fixed resizing related issues.
 - Added the [SVG exporter](https://github.com/jacomyal/sigma.js/tree/master/plugins/sigma.exporters.svg) plugin.
 - Fixed some SVG-related bugs (thanks to [@qinfchen](https://github.com/qinfchen)).
 - Added the [A*](https://github.com/jacomyal/sigma.js/tree/master/plugins/sigma.pathfinding.astar) plugin (thanks to [@A----](https://github.com/A----)).
 - Changed the `singleHover` setting to default to `true`.
 - Added the [cypher](https://github.com/jacomyal/sigma.js/tree/master/plugins/sigma.parsers.cypher) plugin (thanks to [@sim51](https://github.com/sim51)).
 - Added the [parallel edges](https://github.com/jacomyal/sigma.js/tree/master/plugins/sigma.renderers.parallelEdges) plugin (thanks to [@3ch01c](https://github.com/3ch01c))

#### 1.0.3 - release (August 22, 2014)

  - Fixed [#186](https://github.com/jacomyal/sigma.js/issues/186): NPM sigma package
  - New helper `sigma.utils.zoomTo` (thanks to [@josemazo](https://github.com/josemazo))
  - Fixed [#241](https://github.com/jacomyal/sigma.js/issues/241): Improved canvas renderer
  - Fixed [#244](https://github.com/jacomyal/sigma.js/issues/244): (min|max)(Node|Edge)Size as strings or numbers
  - Cross available in the customShapes plugin (thanks to [@csweaver](https://github.com/csweaver))
  - [Relative size](https://github.com/jacomyal/sigma.js/tree/master/plugins/sigma.plugins.relativeSize) plugin (thanks to [@tsdaemon](https://github.com/tsdaemon))
  - Fixed y positions from sigma.parsers.gexf (thanks to [@totetmatt](https://github.com/totetmatt))
  - Fixed lag problem for the dragNodes plugin on Firefox (thanks to [@apitts](https://github.com/apitts))
  - Added the `singleHover` settings (thanks to [@patrickmarabeas](https://github.com/patrickmarabeas))
  - Improved dragNodes behaviours with several hovered nodes (thanks to [@patrickmarabeas](https://github.com/patrickmarabeas))
  - Added self-loops rendering for curved edges (thanks to [@ssidorchick](https://github.com/ssidorchick))
  - Updated gexfParser.js version
  - [HITS statistics computation](https://github.com/jacomyal/sigma.js/tree/master/plugins/sigma.statistics.HITS) plugin (thanks to [@mef](https://github.com/mef))
  - Fixed [#299](https://github.com/jacomyal/sigma.js/issues/299): Fixed `npm build`
  - Fixed [#332](https://github.com/jacomyal/sigma.js/issues/332): Fixed grunt tasks for building plugins
  - Fixed [#347](https://github.com/jacomyal/sigma.js/issues/347): Added polymorphism for the autoRescale setting
  - Fixed build for Force-Atlas 2 plugin (thanks to [@luca](https://github.com/luca))
  - Fixed some typos (thanks to [@Tal-Daniel](https://github.com/Tal-Daniel))
  - [Custom edge shapes](https://github.com/jacomyal/sigma.js/tree/master/plugins/sigma.renderers.customEdgeShapes) plugin (thanks to [@sheymann](https://github.com/sheymann))
  - [Filter API](https://github.com/jacomyal/sigma.js/tree/master/plugins/sigma.plugins.filter) plugin (thanks to [@sheymann](https://github.com/sheymann))
  - Right-click support (thanks to [@sheymann](https://github.com/sheymann))
  - Event data now always dispatched by sigma.core (thanks to [@sheymann](https://github.com/sheymann))
  - Added the `attachBefore` method to `sigma.classes.graph` (thanks to [@sheymann](https://github.com/sheymann))
  - Fixed buggy behaviour with the dragNodes plugin when container is offset (thanks to [@Pie21](https://github.com/Pie21))
  - Updated NPM dev dependencies
  - Fixed a leak in `sigma.classes.graph` (details at [#340](https://github.com/jacomyal/sigma.js/issues/340))
  - **WebGL based Force-Atlas 2**

#### 1.0.2 - release (April 2, 2014)

  - Added Canvas curved edge renderer
  - Fully refactored examples
  - Fixed [#211](https://github.com/jacomyal/sigma.js/issues/211): Added default camera getter
  - Fixes on ForceAtlas2 API (thanks to [@adkatrit](https://github.com/adkatrit))
  - Added Canvas curved arrows edge renderer (thanks to [@ssidorchick](https://github.com/ssidorchick))
  - Fixed [#220](https://github.com/jacomyal/sigma.js/issues/220): WebGL edges batch rendering fixed
  - Fixed [#175](https://github.com/jacomyal/sigma.js/issues/175): Disable setAutoSettings in ForceAtlas2
  - Fixed some minor typos (thanks to [@anirvan](https://github.com/anirvan))
  - Added the `sigma.plugins.dragNodes` plugin for the Canvas renderer (thanks to [@josemazo](https://github.com/josemazo))
  - Fixed `gjslint.py does not exist` error (thanks to [@jeroencoumans](https://github.com/jeroencoumans))
  - Made it easier to build for newbies by not requiring global `grunt-cli` (thanks to [@eins78](https://github.com/eins78))
  - Some minor changes on docs and GEXF parser (thanks to [@Yomguithereal](https://github.com/Yomguithereal))
  - Added current version number as `sigma.version`
  - Fixed [#236](https://github.com/jacomyal/sigma.js/issues/236): Implemented `kill` renderers method

#### 1.0.1 - release (February 26, 2014)

  - Custom node shapes and images plug-in (thanks to [@rpeleg1970](https://github.com/rpeleg1970))
  - Fixed [#189](https://github.com/jacomyal/sigma.js/issues/189): Added doubleClick events
  - Fixed [#183](https://github.com/jacomyal/sigma.js/issues/183): Avoid using `for in` to iterate over arrays (thanks to [@cdevienne](https://github.com/cdevienne))
  - Added `http-server` dependency (thanks to [@oncletom](https://github.com/oncletom))
  - Minor fix in LICENSE.txt (thanks to [@gdi2290](https://github.com/gdi2290))
  - Added `"hidden"` nodes and edges support
  - Fixed typo in `sigma.instances` method (thanks to [@juanpastas](https://github.com/juanpastas))
  - Fixed ForceAtlas2 stopForceAtlas2 method
  - Improved captors
  - Plus some minor and various fixes...

#### 1.0.0 - release (January 30, 2014)

 - Finalization:
   * Closed issues related to the initial version that were not relevant in this new version
   * Fixed some bugs in the new version related to both versions
   * Added more plugins and code samples, to solve some actual use-cases
   * Fixed a lot of bugs for the release

#### 1.0.0 - draft (November 27, 2013)

 - Full new version of sigma from scratch, including old features:
   * ForceAtlas2 plugin
   * GEXF parser
   * Canvas renderer
 - ...and some new features:
   * WebGL renderer
   * Touch support
 - Also added some unit tests (main classes, core API, ...).
 - Architecture fully rewritten
