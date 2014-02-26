## sigma.js - changelog:

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
