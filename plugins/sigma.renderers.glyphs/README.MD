sigma.renderers.glyphs
=====================

Plugin developed by [Florent Schildknecht](https://github.com/Flo-Schield-Bobby) for [Linkurious](https://github.com/Linkurious) and published under the [MIT](LICENSE) license.

Contact: florent.schildknecht@gmail.com

---

This plugin provides a method to render glyphs at four possible positions on top of nodes.

See the following [example code](../../examples/glyphs-renderer.html) for full usage.

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
    glyphRadius: 12,
    glyphFillColor: 'white',
    glyphTextColor: 'black',
    glyphStrokeColor: 'black',
    glyphLineWidth: 4,
    glyphFontStyle: 'normal',
    glyphFontSize: 6,
    glyphFontName: 'Helvetica',
    glyphHidden: false
  }
});
````

Override these settings anytime `glyphs` is called:

````javascript
// Render a grey halo of size 100 behind all nodes:
myRenderer.glyphs({
  glyphRadius: 12,
  glyphFillColor: 'white',
  glyphTextColor: 'black',
  glyphStrokeColor: 'black',
  glyphLineWidth: 4,
  glyphFontStyle: 'normal',
  glyphFontSize: 6,
  glyphFontName: 'Helvetica',
  glyphHidden: false
});
````


#### Options

 * **glyphRadius**
   * The glyph radius in pixels.
   * type: *number*
   * default value: `10`
 * **glyphFillColor**
   * The glyph background-color.
   * type: *string*
   * default value: `white`
 * **glyphTextColor**
   * The glyph text-color.
   * type: *string*
   * default value: `black`
 * **glyphStrokeColor**
   * The glyph border-color.
   * type: *string*
   * default value: `black`
 * **glyphLineWidth**
   * The glyph border-width in pixels.
   * type: *number*
   * default value: `2`
 * **glyphFontStyle**
   * The glyph text font-style.
   * type: *string*
   * default value: `normal`
 * **glyphFontSize**
   * The glyph text font-size in pixels.
   * type: *number*
   * default value: `2`
 * **glyphFontName**
   * The glyph text font-family in pixels. Should be included if needed with @font-face or equivalent.
   * type: *string*
   * default value: `Arial`
 * **glyphHidden**
   * A flag to display glyphs or not.
   * type: *boolean*
   * default value: `false`
