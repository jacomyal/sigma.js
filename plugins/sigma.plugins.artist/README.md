sigma.plugins.artist
==================

Plugin developed by [Sébastien Heymann](https://github.com/sheymann) for [Linkurious](https://github.com/Linkurious) and published under the licence [GNU GPLv3](LICENSE) unless otherwise noticed by Linkurious.

Contact: seb@linkurio.us

---
## General
This plugin provides an artist for you to paint the graph like a boss. The artist will use a set of **styles** and a **color palette**. A style is a mapping between a **node or edge property** and a **visual variable** (color, size, label, etc.), with optional parameters depending on the visual variable. Available visual variables are `color`, `label`, `size`.

The artist is **lazy**: she will not look for changes on the graph. Deprecate the artist yourself so that she will paint the graph correctly the next time you will ask it.

The artist is **open minded**: the color palette may contain sequential and qualitative data schemes, and the styles can be bound to any node or edge attribute.

This plugin comes with fancy developer features:
- Define your own styles on nodes and edges.
- Use accessors to find the properties of nodes and edges.
- Use accessors to find the right color schemes in palettes.
- Register multiple styles before applying them anytime at once.
- Undo any style. 
- Chain all methods for concise (coding) style.

See the following [example code](../../examples/artist.html) and [unit tests](../../test/unit.plugins.artist.js) for full usage.

To use, include all .js files under this folder. Then initialize it as follows:

````javascript
var theArtist = sigma.plugins.artist(sigInst, styles, palette);
````

Kill the plugin instance as follows:

````javascript
sigma.plugins.killArtist();
````

## Configuration
This is an example of palette and styles:

```js
var myPalette = {
  aQualitativeScheme: { 
    'A': '#7fc97f',
    'B': '#beaed4',
    'C': '#fdc086'
  },
  sequentialGreen: {
    7: ["#edf8fb","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#005824"]
  }
};

var myStyles = {
  nodes: {
    label: {
      by: function(node) { return node.id; },
      format: function(value) { return '#' + value; }
    },
    size: {
      by: function(node) { return node.data.quantity; },
      // min/max used if sigma settings {autoRescale: false}
      min: 1,
      max: 10
    },
    color: {
      by: function(node) { return node.data.quality; },
      scheme: function(palette) { return palette.aQualitativeScheme; }
    },
  },
  edges: {
    color: {
      by: function(edge) { return edge.data.quantity; },
      scheme: function(palette) { return palette.sequentialGreen[7]; }
    },
    size: {
      by: function(edge) { return edge.data.quantity; },
      // min/max used if sigma settings {autoRescale: false}
      min: 0.5,
      max: 4
    },
  }
};

var theArtist = sigma.plugins.artist(sigInst, myStyles, myPalette);
```

The [ColorBrewer palette](colorbrewer/colorbrewer.js) is provided to get started quickly with good color schemes.

## Apply styles
Apply all styles:

```js
theArtist.paintAll();
```

Apply all nodes styles:

```js
theArtist.paint('nodes');
```

Apply a specified nodes style like the color:

```js
theArtist.paint('nodes', 'color');
```

Apply all edges styles:

```js
theArtist.paint('edges');
```

Apply a specified edges style like the size:

```js
theArtist.paint('edges', 'size');
```

## Restore original styles
Undo all styles:

```js
theArtist.omitAll();
```

Undo all nodes styles:

```js
theArtist.omit('nodes');
```

Undo a specified nodes style like the color:

```js
theArtist.omit('nodes', 'color');
```

Undo all edges styles:

```js
theArtist.omit('edges');
```

Undo a specified nodes style like the size:

```js
theArtist.omit('nodes', 'size');
```

## Deprecate the artist's vision
The artist will check the graph anew the next time `.paint()`, `.paintAll()`, `.nodes()`, or `.edges()` are called:

```js
theArtist.deprecate();
theArtist.paint('nodes', 'color'); // refresh node colors
theArtist.paintAll(); // refresh all styles but node colors
```

## Clear all styles
All styles are cleared and the artist forgets the palette and styles:

```js
theArtist.disown();
theArtist.paintAll(); // does nothing
```

## Import styles and palette
Teach your artist new palette and styles:

```js
theArtist
  .learnColors(myPalette)
  .learnStyles(myStyles);
```

## Export styles and palette
Dump the palette and styles to save and restore them later:

```js
var o = theArtist.talk();

theArtist.disown();
theArtist
  .learnColors(o.palette)
  .learnStyles(o.styles);
theArtist.paintAll(); // it works, bitches!

// or:
sigma.plugins.killArtist();
var rebornArtist = sigma.plugins.artist(sigInst, o.styles, o.palette);
rebornArtist.paintAll(); // yeah!
```
