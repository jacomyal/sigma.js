sigma.layout.forceAtlas2
========================

Algorithm by [Mathieu Jacomy](https://github.com/jacomyma).

Plugin by [Guillaume Plique](https://github.com/Yomguithereal).

Auto-stop condition by [Sébastien Heymann](https://github.com/sheymann).

---

This plugin implements [ForceAtlas2](http://www.plosone.org/article/info%3Adoi%2F10.1371%2Fjournal.pone.0098679), a force-directed layout algorithm.

For optimization purposes, the algorithm's computations are delegated to a web worker.

#### Toy example

![forceatlas1](https://github.com/Linkurious/linkurious.js/wiki/media/forceatlas1.gif)

#### Real-world example

Dataset of 1700 nodes and 6700 edges:

![layout-arctic](https://github.com/Linkurious/linkurious.js/wiki/media/layout-arctic.gif)

## Methods

**sigma.startForceAtlas2**

Starts or resumes the layout. It is possible to pass a configuration if this is the first time you start the layout.

```js
sigmaInstance.startForceAtlas2(sigInst, config);
```

**sigma.stopForceAtlas2**

Stops the layout.

```js
sigmaInstance.stopForceAtlas2();
```

**sigma.configForceAtlas2**

Changes the layout's configuration.

```js
sigmaInstance.configForceAtlas2(sigInst, config);
```

**sigma.killForceAtlas2**

Stops the layout and terminates the associated worker. You can still restart it later, but a new worker will have to be initialized.

```js
sigmaInstance.killForceAtlas2();
```

**sigma.isForceAtlas2Running**

Returns whether ForceAtlas2 is running.

```js
sigmaInstance.isForceAtlas2Running();
```

## Configuration

*Algorithm configuration*

* **linLogMode**: *boolean* `false`
* **outboundAttractionDistribution** *boolean* `false`
* **adjustSizes** *boolean* `false`
* **edgeWeightInfluence** *number* `0`
* **scalingRatio** *number* `1`
* **strongGravityMode** *boolean* `false`
* **gravity** *number* `1`
* **barnesHutOptimize** *boolean* `false`: should we use the algorithm's Barnes-Hut to improve repulsion's scalability (`O(n²)` to `O(nlog(n))`)? This is useful for large graph but harmful to small ones.
* **barnesHutTheta** *number* `0.5`
* **slowDown** *number* `1`
* **startingIterations** *integer* `1`: number of iterations to be run before the first render.
* **iterationsPerRender** *integer* `1`: number of iterations to be run before each render.
* **autoStop** *boolean* `false`

*Supervisor configuration*

* **worker** *boolean* `true`: should the layout use a web worker?
* **workerUrl** *string* : path to the worker file if needed because your browser does not support blob workers.
* **background** *boolean* `false`: run the layout on background, apply the new nodes position on stop.
* **easing** *string* : if specified, ease the transition between nodes positions if background is `true`. The duration is specified by the Sigma settings `animationsTime`.

## Notes
1. *Barnes-Hut* optimizations are disabled for the time being. We need time to develop a low-level version of the optimization in order to scale efficiently.

## Usage

### Infinite layout

By default, the layout won't stop by itself, so if you want it to stop, you have to trigger it explicitely. Use it for a full control on the layout process.

### Automatic layout

Set the *autoStop* option to `true` to let the layout stop automatically when it reaches a "reasonnably good readability" as fast as possible.

The nodes positions are updated on screen at each iteration of the algorithm. You may set *background* to `true` to apply the nodes positions when the layout is complete. It will speed up the layout process and avoid the "seasick" feeling. Once the layout is complete, you may animate the transition between nodes positions with an *easing* function (see [sigma.utils.easing](../../src/utils/sigma.utils.js)).
