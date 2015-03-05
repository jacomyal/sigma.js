## linkurious.js - changelog:

#### 1.0.6 - draft (March 05, 2015)

  - Update Sigma to [jacomyal/sigma.js#287f49616a5674ddcf30775d37f9c564cacf8e2a](https://github.com/jacomyal/sigma.js/commit/287f49616a5674ddcf30775d37f9c564cacf8e2a)

  - New plugin `sigma.pathfinding.astar` to find shortest paths (thanks to [@A----](https://github.com/A----))
  - New plugin `sigma.statistics.louvain` for community detection (thanks to [@upphiminn](https://github.com/upphiminn))
  - Revamp plugin `sigma.plugins.dragNodes` to support multiple nodes (thanks to [@martindelataille](https://github.com/martindelataille))

Improvements:

  - #69 sigma.layout.forceAtlas2: make maxIterations and avgDistanceThreshold configurable
  - #66 sigma.plugins.design: add support of type, icon, and image
  - #62 sigma.plugins.design: add color generation for qualitative data
  - add label alignment settings for canvas (thanks to [@qinfchen](https://github.com/qinfchen))

Bug fixes:

  - #78 sigma.plugins.image: sized images with zoom false are blurred
  - #74 sigma.plugins.locate.nodes() zooms out instead of zooming in
  - #72 sigma.plugins.design Histograms are not generated when there is only one value for a sequential property (thanks to [@callicles](https://github.com/callicles))
  - #60-#61 sigma.plugins.designer documentation
  - #59 sigma.plugins.designer doesn't support multiple sigma instances
  - #57 sigma.plugins.locate doesn't support multiple sigma instances
  - #56 sigma.plugins.tooltips doesn't support multiple sigma instances

#### 1.0.5 - draft (January 16, 2015)

  - New plugin `sigma.exporters.xlsx`
  - New plugin `sigma.plugins.lasso` (thanks to [@Flo-Schield-Bobby](https://github.com/Flo-Schield-Bobby))
  - New plugin `sigma.renderers.glyphs` (thanks to [@Flo-Schield-Bobby](https://github.com/Flo-Schield-Bobby))
  - Revamp plugin `sigma.renderers.customShapes` (thanks to [@jbilcke](https://github.com/jbilcke))
  - New plugin `sigma.renderers.linkurious` (thanks to [@jbilcke](https://github.com/jbilcke))
  - Add an option to animate a given set of nodes in `sigma.plugins.animate`

#### 1.0.4 - draft (November 27, 2014)

  - New plugin `sigma.exporters.gexf`
  - New plugin `sigma.exporters.spreadsheet`
  - New plugin `sigma.exporters.svg` (thanks to [@Yomguithereal](https://github.com/Yomguithereal))
  - New plugin `sigma.plugins.image`, fork of `sigma.renderers.snapshot` (thanks to [@martindelataille](https://github.com/martindelataille))
  - New plugin `sigma.plugins.keyboard`
  - New plugin `sigma.plugins.poweredBy`


#### 1.0.3 - draft (October 17, 2014)

  - Merge sigma.js 1.0.3
  - New plugin `sigma.plugins.colorbrewer`
  - New plugin `sigma.plugins.designer`
  - New plugin `sigma.plugins.fullScreen` (thanks to [@martindelataille](https://github.com/martindelataille))
  - New plugin `sigma.renderers.halo`
  - Add background execution and easing transition to `sigma.layout.forceAtlas2`
  - Improve `sigma.plugins.dragNodes`

#### 1.0.2 - draft (August 22, 2014)

  - Merge sigma.js 1.0.2
  - Add method `graph.attachBefore` to the core
  - Add spatial indexing of edges using a quad tree to the core
  - Add events on edges to the core
  - Add edge hovering to the core
  - New plugin `sigma.helpers.graph`
  - New plugin `sigma.plugin.activeState`
  - New plugin `sigma.plugin.edgeSiblings`
  - New plugin `sigma.plugin.filter`
  - New plugin `sigma.plugin.locate`
  - New plugin `sigma.plugin.select`
  - New plugin `sigma.plugin.tooltips`
  - New plugin `sigma.renderers.customEdgeShapes`
  - New plugin `sigma.renderers.edgeLabels`
  - Add auto-stop condition to `sigma.layout.forceAtlas2`
