sigma.layout.forceLink
========================

Algorithm by [Mathieu Jacomy](https://github.com/jacomyma).

Plugin by [Guillaume Plique](https://github.com/Yomguithereal).

Auto-stop and node sibling alignment by [Sébastien Heymann](https://github.com/sheymann).

---

This plugin implements and extends [ForceAtlas2](http://www.plosone.org/article/info%3Adoi%2F10.1371%2Fjournal.pone.0098679), a force-directed layout algorithm.

For optimization purposes, the algorithm's computations are delegated to a web worker.

#### Toy example

![forceatlas1](https://github.com/Linkurious/linkurious.js/wiki/media/forceatlas1.gif)

#### Real-world example

Dataset of 1700 nodes and 6700 edges:

![layout-arctic](https://github.com/Linkurious/linkurious.js/wiki/media/layout-arctic.gif)

## Methods

**startForceLink**

Starts or resumes the layout. It is possible to pass a configuration if this is the first time you start the layout.

```js
var fa = sigma.layouts.startForceLink(sigInst, config);
```

**stopForceLink**

Stops the layout.

```js
sigma.layouts.stopForceLink();
```

**configForceLink**

Changes the layout's configuration.

```js
sigma.layouts.configForceLink(sigInst, config);
```

**killForceLink**

Stops the layout and terminates the associated worker. You can still restart it later, but a new worker will have to be initialized.

```js
sigma.layouts.killForceLink();
```

**isForceLinkRunning**

Returns whether ForceLink is running.

```js
sigma.layouts.isForceLinkRunning();
```

## Configuration

*ForceAtlas2 algorithm*

* **linLogMode**: *boolean* `false`: alternative energy model with linear repulsion force and logarithmic attraction force.
* **outboundAttractionDistribution** *boolean* `false`
* **adjustSizes** *boolean* `false`
* **edgeWeightInfluence** *number* `0`
* **scalingRatio** *number* `1`
* **strongGravityMode** *boolean* `false`
* **gravity** *number* `1`
* **barnesHutOptimize** *boolean* `false`: should we use the algorithm's Barnes-Hut to improve repulsion's scalability (`O(n²)` to `O(nlog(n))`)? This is useful for large graph but harmful to small ones.
* **barnesHutTheta** *number* `0.5`
* **slowDown** *number* `1`

*Rendering*

* **startingIterations** *integer* `1`: number of iterations to be run before the first render.
* **iterationsPerRender** *integer* `1`: number of iterations to be run before each render.

*Stopping condition*

* **maxIterations** *number* `1000`: set a limit if `autoStop: true`.
* **avgDistanceThreshold** *number* `0.01`: this is the normal stopping condition of `autoStop: true`. When the average displacements of nodes is below this threshold, the layout stops.
* **autoStop** *boolean* `false`

*Node sibling alignment*

* **alignNodeSiblings** *boolean* `false`: align nodes that are linked to the same two nodes only. It enhances readability. This operation is performed once the main layout is finished.
* **nodeSiblingsScale** *number* `1`: Distance multiplicator between the aligned nodes.
* **nodeSiblingsAngleMin** *number* `0`: force a minimal angle between aligned nodes (from 0 to PI / 2). Node labels may indeed overlap on horizontally aligned nodes.

*Supervisor*

* **worker** *boolean* `true`: should the layout use a web worker?
* **workerUrl** *string* : path to the worker file if needed because your browser does not support blob workers.
* **background** *boolean* `false`: run the layout on background, apply the new nodes position on stop.
* **easing** *string*: if specified, ease the transition between nodes positions if background is `true`. The duration is specified by the Sigma settings `animationsTime`.
* **randomize** *string*: randomize the initial `x` and `y` coordinates of the nodes. Available values: `globally` will generate random node positions (useful to generate completely new positions) ; `locally` will randomize positions around the existing positions (useful to overcome local minima).
* **randomizeFactor** *number* `1`: multiplicator of the `Math.random()` function if the `randomize` setting is used.

## Events

The plugin dispatches the following events:

- `start`: on layout start.
- `interpolate`: at the beginning of the layout animation if an *easing* function is specified and the layout is ran on background.
- `stop`: on layout stop, will be dispatched after `interpolate`.

Example:

```js
// Start the ForceLink algorithm:
var fa = sigma.layouts.startForceLink(s);
// Bind all events:
fa.bind('start stop interpolate', function(event) {
  console.log(event.type);
});
```

## Usage

### Infinite layout

By default, the layout won't stop by itself, so if you want it to stop, you have to trigger it explicitely. Use it for a full control on the layout process.

### Automatic layout

Set the *autoStop* option to `true` to let the layout stop automatically when it reaches a "reasonnably good readability" as fast as possible.

The nodes positions are updated on screen at each iteration of the algorithm. You may set *background* to `true` to apply the nodes positions when the layout is complete. It will speed up the layout process and avoid the "seasick" feeling. Once the layout is complete, you may animate the transition between nodes positions with an *easing* function (see [sigma.utils.easing](../../src/utils/sigma.utils.js)).
