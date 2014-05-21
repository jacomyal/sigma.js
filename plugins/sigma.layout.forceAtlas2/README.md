sigma.layout.forceAtlas2
========================

Algorithm by [Mathieu Jacomy](https://github.com/jacomyma).

Plugin by [Guillaume Plique](https://github.com/Yomguithereal).

---

This plugin implements [ForceAtlas2](http://www.medialab.sciences-po.fr/publications/Jacomy_Heymann_Venturini-Force_Atlas2.pdf), a force-directed layout algorithm.

For optimization purposes, the algorithm's computations are delegated to a web worker.

## Methods

**sigma.startForceAtlas2**

Start or unpause the layout. It is possible to pass a configuration if this is the first time you start the layout.

```js
sigmaInstance.startForceAtlas2(config);
```

**sigma.stopForceAtlas2**

Pause the layout.

```js
sigmaInstance.stopForceAtlas2();
```

**sigma.configForceAtlas2**

Change the layout's configuration after this one has started or is paused.

```js
sigmaInstance.configForceAtlas2(config);
```

**sigma.killForceAtlas2**

Completely stop the layout and terminate the assiociated worker. You can still restart it later, but a new worker will have to initialize.

```js
sigmaInstance.killForceAtlas2();
```

## Configuration

* **linLogMode**: *boolean* `false`
* **outboundAttractionDistribution** *boolean* `false`
* **adjustSizes** *boolean* `false`
* **edgeWeightInfluence** *number* `0`
* **scalingRatio** *number* `1`
* **strongGravityMode** *boolean* `false`
* **gravity** *number* `1`

## Notes
1. *Barnes-Hut* optimizations are disabled for the time being. We need time to develop a low-level version of the optimization in order to scale efficiently.

2. The layout won't stop by itself, so I you want it to stop, you have to trigger it explicitely.
