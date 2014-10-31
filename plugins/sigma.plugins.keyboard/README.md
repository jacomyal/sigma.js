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
// Init
var kbd = sigma.plugins.keyboard(s);

// Init with options
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

### Keyboard shortcuts

The plugin provides the following keyboard shortcuts:
- <kbd>←</kbd>: move camera left
- <kbd>↑</kbd>: move camera up
- <kbd>→</kbd>: move camera right
- <kbd>↓</kbd>: move camera down
- <kbd>spacebar</kbd> + <kbd>↑</kbd>: zoom in
- <kbd>spacebar</kbd> + <kbd>↓</kbd>: zoom out

### Event binding

Bind functions any combinaison of keys pressed using their key code as follows:

````javascript
// Bind a function to a single key pressed
kbd.bind('32', function() {
  console.log('"Spacebar" key pressed');
});

// Bind a function to a combinaison of keys pressed
kbd.bind('32+65', function() {
  console.log('"Spacebar + A" pressed');
});

// Bind a function to multiple combinaisons of keys pressed
kbd.bind('17+65 32+65', function() {
  console.log('"Ctrl + A"  or "Spacebar + A" pressed');
});
````

Don't forget to `.unbind()` the functions when necessary to avoid memory leaks.
