sigma.renderers.glyphs
=====================

Plugin developed by [Florent Schildknecht](https://github.com/Flo-Schield-Bobby) for [Linkurious](https://github.com/Linkurious) and published under the [MIT](LICENSE) license.

Contact: florent.schildknecht@gmail.com

---

This plugin provides a method to render glyphs at four possible positions above the nodes on screen: `top-right`, `top-left`, `bottom-left`, `bottom-right`. This plugin is compatible with **Canvas** node renderers only.

See the following [example code](../../examples/glyphs-renderer.html) for full usage.

#### Example 1
![Glyphs1](https://github.com/Linkurious/linkurious.js/wiki/media/glyphs1.png)

#### Example 2
![Glyphs2](https://github.com/Linkurious/linkurious.js/wiki/media/glyphs2.png)

## How to use it

To use, include all .js files under this folder.
Then set up glyphs settings as node keys:

````javascript
var node = {
  id: 'node-id',
  glyphs: [{
   'position': 'top-left', // ['top-left', 'top-right', 'bottom-right', 'bottom-left']
    'content': 'A'
  }, {
   'position': 'top-right', // ['top-left', 'top-right', 'bottom-right', 'bottom-left']
    'content': 'B'
  }]
}
````

Then call the renderer method as follows:

````javascript
// Render the glyphs of each nodes:
myRenderer.glyphs();
````

## Automatic rendering

Regenerate the glyphs at each rendering as follows:

````javascript
myRenderer.bind('render', function (e) {
  myRenderer.glyphs();
});
````

## Configuration

This plugin adds new settings to sigma. Initialize sigma as follows:

````javascript
s = new sigma({
  graph: g,
  container: 'graph-container',
  settings: {
    glyphScale: 0.6,
    glyphFillColor: 'white',
    glyphTextColor: 'black',
    glyphStrokeColor: 'black',
    glyphLineWidth: 4,
    glyphFontStyle: 'normal',
    glyphFontScale: 1,
    glyphFont: 'Helvetica',
    glyphTextThreshold: 6,
    glyphStrokeIfText: true,
    glyphThreshold: 1,
    drawGlyphs: true
  }
});
````

Override these settings anytime `glyphs` is called:

````javascript
myRenderer.glyphs({
  scale: 0.6,
  fillColor: 'white',
  textColor: 'black',
  strokeColor: 'black',
  lineWidth: 4,
  fontStyle: 'normal',
  fontScale: 1,
  font: 'Helvetica',
  textThreshold: 10,
  strokeIfText: true,
  threshold: 5,
  draw: true
});
````

## Settings

 * **glyphScale**
   * The glyph size proportional to the node size.
   * type: *number*
   * default value: `0.5`
 * **glyphFillColor**
   * The glyph background-color. When it is a function, `this` inside the function si bound to the node object.
   * type: *string* | *function*
   * default value: `white`
 * **glyphTextColor**
   * The glyph text-color. When it is a function, `this` inside the function si bound to the node object.
   * type: *string* | *function*
   * default value: `black`
 * **glyphStrokeColor**
   * The glyph border-color. When it is a function, `this` inside the function si bound to the node object.
   * type: *string* | *function*
   * default value: `black`
 * **glyphLineWidth**
   * The glyph border-width in pixels.
   * type: *number*
   * default value: `2`
 * **glyphFont**
   * The glyph text font-family. Should be included if needed with @font-face or equivalent.
   * type: *string*
   * default value: `Arial`
 * **glyphFontStyle**
   * The glyph text font-style.
   * type: *string*
   * default value: `normal`
 * **glyphFontScale**
   * The font size proportional to the glyph size.
   * type: *number*
   * default value: `1`
 * **glyphTextThreshold**
   * The minimum size a node must have to see its glyph text displayed.
   * type: *number*
   * default value: `6`
 * **glyphStrokeIfText**
   * A flag to display glyph strokes only if its text is displayed.
   * type: *boolean*
   * default value: `false`
 * **glyphThreshold**
   * The minimum size a node must have to see its glyph displayed.
   * type: *number*
   * default value: `1`
 * **drawGlyphs**
   * A flag to display glyphs or not.
   * type: *boolean*
   * default value: `true`

## Font-icons

![Glyphs Icons](https://github.com/Linkurious/linkurious.js/wiki/media/glyph-icons.png)

Custom webfonts are supported in glyphs!

See the following [example code](../../examples/glyphs-renderer-icons.html).

You just need to make sure your custom font is actually loaded before actually using it in a graph, using the W3C CSS Font Loading API. You can use a shim like [zachleat/fontfaceonload](https://github.com/zachleat/fontfaceonload) or [bramstein/fontloader](https://github.com/bramstein/fontloader) to support non-evergreen browsers.

The syntax to use a webfont in glyph objects is simple:

```javascript
{
  glyphs: [{
    font: 'FontAwesome',
    content: '☺', // or custom fontawesome code eg. "\uF129"
  }]
}
```

Notice that you may set the font for all glyphs:

```javascript
new sigma({
  settings: {
    glyphFont: 'FontAwesome'
  }
  ...
});
```
