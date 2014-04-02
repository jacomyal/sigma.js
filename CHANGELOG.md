## sigma.js - changelog:

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
