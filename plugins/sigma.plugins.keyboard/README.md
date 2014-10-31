sigma.plugins.keyboard
=====================

Plugin developed by [Sébastien Heymann](https://github.com/sheymann) for [Linkurious](https://github.com/Linkurious) and published under the [MIT](LICENSE) license.

Contact: seb@linkurio.us

---

The aim of this plugin is to bind any function to a combinaison of keys, and to control the camera zoom and position with the keyboard.

* Use (Alt +) Arrow to move in any direction.
* Use (Alt +) Space + Top/Bottom Arrow to zoom in/out.

See the following [example code](../../examples/plugin-keyboard.html) for full usage.

To use, include all .js files under this folder. Then call the exporter method as follows:

````javascript
var kbd = sigma.plugins.keyboard(s);
````

### Advanced usage

````javascript
var kbd = sigma.plugins.keyboard(s, {
  displacement: 200,
  duration: 300,
  zoomingRatio: 1.3
});
````

#### Options

 * **displacement**
   * The camera displacement in pixels.
   * type: *number*
   * default value: `100`
 * **duration**
   * Override the `mouseZoomDuration` setting of Sigma
   * type: *number*
   * default value: `200`
 * **zoomingRatio**
   * Override the `zoomingRatio` setting of Sigma
   * type: *number*
   * default value: `1.7`

### Event binding

Bind functions any combinaison of keys pressed using their key code as follows:

````javascript
// Bind a function to a single key pressed
kbd.bind('32', function() {
  console.log('"Space" key pressed');
});

// Bind a function to a combinaison of keys pressed
kbd.bind('32+65', function() {
  console.log('"Space + A" pressed');
});

// Bind a function to multiple combinaisons of keys pressed
kbd.bind('17+65 32+65', function() {
  console.log('"Ctrl + A"  or "Space + A" pressed');
});
````

Don't forget to `.unbind()` the functions when necessary to avoid memory leaks.
