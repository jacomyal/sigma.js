sigma.layout.forceAtlas2
========================

Algorithm by [Mathieu Jacomy](https://github.com/jacomyma).

Plugin by [Guillaume Plique](https://github.com/Yomguithereal).

---

This plugin implements [ForceAtlas2](http://www.plosone.org/article/info%3Adoi%2F10.1371%2Fjournal.pone.0098679), a force-directed layout algorithm.

For optimization purposes, the algorithm's computations are delegated to a web worker.

## Methods

**sigma.startForceAtlas2**

Starts or unpauses the layout. It is possible to pass a configuration if this is the first time you start the layout.

```js
sigmaInstance.startForceAtlas2(config);
```

**sigma.stopForceAtlas2**

Pauses the layout.

```js
sigmaInstance.stopForceAtlas2();
```

**sigma.configForceAtlas2**

Changes the layout's configuration.

```js
sigmaInstance.configForceAtlas2(config);
```

**sigma.killForceAtlas2**

Completely stops the layout and terminates the assiociated worker. You can still restart it later, but a new worker will have to initialize.

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
* **barnesHutOptimize** *boolean* `true`: should we use the algorithm's Barnes-Hut to improve repulsion's scalability (`O(n²)` to `O(nlog(n))`)? This is useful for large graph but harmful to small ones.
* **barnesHutTheta** *number* `0.5`
* **slowDown** *number* `1`
* **startingIterations** *integer* `1`: number of iterations to be run before the first render.
* **iterationsPerRender** *integer* `1`: number of iterations to be run before each render.

*Supervisor configuration*

* **worker** *boolean* `true`: should the layout use a web worker?
* **workerUrl** *string* : path to the worker file if needed because your browser does not support blob workers.

## Notes
1. The layout won't stop by itself, so if you want it to stop, you will have to trigger it explicitly.
