sigma.layout.forceAtlas2
========================

Plugin developed by [Mathieu Jacomy](https://github.com/jacomyma).

---

This plugin adds two methods to every sigma instances, `startForceAtlas2` and `stopForceAtlas2`. It implements [ForceAtlas2](http://webatlas.fr/tempshare/ForceAtlas2_Paper.pdf), a force-directed layout algorithm.

Basically, `myInstance.startForceAtlas2()` will start running the layout: It will spawn an atomic job in [conrad](http://jacomyal.github.io/conrad.js/) that will compute the next step. When the job is done, the `refresh` method of the instance will be called, and everything starts again.

The layout will not stop by itself, and it is necessary to call `myInstance.stopForceAtlas2()`.
