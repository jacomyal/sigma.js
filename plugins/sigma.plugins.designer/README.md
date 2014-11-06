sigma.plugins.designer
==================

Plugin developed by [Sébastien Heymann](https://github.com/sheymann) for [Linkurious](https://github.com/Linkurious) and published under the licence [GNU GPLv3](LICENSE) unless otherwise noticed by Linkurious.

Contact: seb@linkurio.us

---
## General
This plugin provides an designer for you to craft the graph like a boss. The designer will use a set of **styles** and a **color palette**. A style is a mapping between a **node or edge property** and a **visual variable** (color, size, label, etc.), with optional parameters depending on the visual variable. Available visual variables are `color`, `label`, `size`.

The designer is **lazy**: she will not look for changes on the graph. Deprecate the designer yourself so that she will make the graph correctly the next time you will ask it.

The designer is **open minded**: the color palette may contain sequential, diverging and qualitative data schemes, and the styles can be bound to any node or edge attribute.

This plugin comes with fancy developer features:
- Define the styles to apply on nodes and edges.
- Use accessors to find the properties of nodes and edges.
- Use accessors to find the right color schemes in the palette.
- Register multiple styles before applying them anytime at once.
- Index the nodes and edges properties on demand only, for performance reasons.
- Undo any style.
- Chain all methods for concise (coding) style.

See the following [example code](../../examples/designer.html) and [unit tests](../../test/unit.plugins.designer.js) for full usage.

To use, include all .js files under this folder. Then initialize it as follows:

````javascript
var designer = sigma.plugins.designer(sigInst, specs);
````

Kill the plugin instance as follows:

````javascript
sigma.plugins.killDesigner();
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
  colorbrewer: {
    sequentialGreen: {
      7: ["#edf8fb","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#005824"]
    }
  }
};

var myStyles = {
  nodes: {
    label: {
      by: 'id',
      format: function(value) { return '#' + value; }
    },
    size: {
      by: 'data.quantity',
      bins: 7,
      min: 2,
      max: 20
    },
    color: {
      by: 'data.quality',
      scheme: 'aQualitativeScheme'
    },
  },
  edges: {
    color: {
      by: 'data.quantity',
      scheme: 'colorbrewer.sequentialGreen',
      bins: 7
    },
    size: {
      by: 'data.quantity',
      bins: 7,
      min: 1,
      max: 5
    },
  }
};

var designer = sigma.plugins.designer(sigInst, {
  styles: myStyles,
  palette: myPalette
});
```

The [ColorBrewer palette](colorbrewer/colorbrewer.js) is provided to get started quickly with good color schemes.

## API

### Get bound styles
The styles are bound to each node or edge of the graph, for the specified properties, before being applied at will. You may get them anytime with the `.nodes()` and `.edges()` method. For instance, get the styles of the nodes which have the property used to color them:

```js
var boundStyles = designer.nodes(myStyles.nodes.color.by);
/* {
  propA: {
    items: *array*
    ratio: *number*
    orig_styles: *object*
    styles: {
      color: *function*
    }
  },
  propB: ...
} */
```

Same example with edges:

```js
var boundStyles = designer.edges(myStyles.edges.color.by);
```

### Apply styles
Apply all styles:

```js
designer.makeAll();
```

Apply all nodes styles:

```js
designer.make('nodes');
```

Apply a specified nodes style like the color:

```js
designer.make('nodes', 'color');
```

Apply all edges styles:

```js
designer.make('edges');
```

Apply a specified edges style like the size:

```js
designer.make('edges', 'size');
```

### Restore original styles
Undo all styles:

```js
designer.omitAll();
```

Undo all nodes styles:

```js
designer.omit('nodes');
```

Undo a specified nodes style like the color:

```js
designer.omit('nodes', 'color');
```

Undo all edges styles:

```js
designer.omit('edges');
```

Undo a specified nodes style like the size:

```js
designer.omit('nodes', 'size');
```

### Deprecate the designer's vision
The designer will check the graph anew the next time `.make()`, `.makeAll()`, `.nodes()`, or `.edges()` are called.

```js
designer.deprecate();
designer.make('nodes', 'color'); // refresh node colors
designer.makeAll(); // refresh all styles but node colors
```

Deprecate all node styles as follows:

```js
designer.deprecate('nodes');
designer.make('nodes'); // refresh node styles
designer.makeAll(); // refresh all styles but node colors
```

Deprecate a specified style as follows:

```js
designer.deprecate('nodes', 'color');
designer.make('nodes', 'color'); // refresh node colors
designer.makeAll(); // refresh all styles but node colors
```

### Clear all styles
All styles are cleared and the designer forgets the palette and styles:

```js
designer.disown();
designer.makeAll(); // does nothing
```

### Import styles and palette
Set a new palette and new styles:

```js
designer.extendSpecs({
  styles: myStyles,
  palette: myPalette
});
```

### Remove a style from the specs
For instance, removes the node size:

```js
designer.specs().styles.nodes.size = null;
designer.deprecate();
```

### Export styles and palette
Dump the palette and styles, to save and restore them later:

```js
var specs = designer.specs();

designer.disown();
designer.extendSpecs({
  styles: specs.styles,
  palette: specs.palette
});
designer.makeAll(); // it works, bitches!

// or:
sigma.plugins.killDesigner();
var newDesigner = sigma.plugins.designer(sigInst, {
  styles: specs.styles,
  palette: specs.palette
});
newDesigner.makeAll(); // yeah!
```

## Utils

### Data type of a property on nodes or edges

```js
designer.utils.isSequential('nodes', 'data.quantity');
// true

designer.utils.isSequential('nodes', 'data.quality');
// false
```

### Styles currently applied

Styles applied on nodes:

```js
var arr = designer.utils.appliedStyles('nodes');
// ['color', 'size']
```

Styles applied on edges:

```js
var arr = designer.utils.appliedStyles('edges');
// ['color', 'size']
```

### Histograms

Histograms are values, grouped by bins, on a specified property of nodes or edges computed for a visual variable (sizes and colors only).

The result is an array of objects ordered by bins. Each object contains the list of `values` in the `bin`, the `min` and `max` values, and the `ratio` of values in the `bin` compared to the largest `bin`. If the visual variable is the `color`, it also contains the `color` of the `bin`.

Example on the histogram of edge colors by the property 'data.quantity':

```js
designer.utils.histogram('edges', 'color', 'data.quantity');
// [
//   {
//     bin: 0,
//     min: 1,
//     max: 5,
//     values: [0.1, 0.42, ...],
//     ratio: 0.7,
//     color: '#ff0000'
//   },
//   ...
// ]
```

## Changelog

**0.2**
 * Add `.appliedStyles()` to list the styles currently applied to nodes or edges.
 * Add the `bins` setting to size.
 * Bind the `min` size and `max` size settings to sigma settings.
 * Fix a specified style can be undone only once.
 * Add function `.utils.histogram()`.

**0.1**
 * Initial release.
