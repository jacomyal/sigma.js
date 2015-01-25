sigma.plugins.designer
==================

Plugin developed by [Sébastien Heymann](https://github.com/sheymann) for [Linkurious](https://github.com/Linkurious) and published under the licence [GNU GPLv3](LICENSE) unless otherwise noticed by Linkurious.

Contact: seb@linkurio.us

---
## General
This plugin provides an designer for you to craft the graph like a boss. The designer will use a set of **styles** and a **color palette**. A style is a mapping between a **node or edge property** and a **visual variable** (color, size, label, etc.), with optional parameters depending on the visual variable. Available visual variables are `color`, `label`, `size`.

The designer is **lazy**: it will not look for changes on the graph. Deprecate the designer yourself so that it will apply the styles the next time you will ask it.

The designer is **open minded**: the color palette may contain sequential, diverging and qualitative data schemes, and the styles can be bound to any node or edge property.

This plugin comes with fancy developer features:
- Configure the styles to apply on nodes and edges.
- Use accessors to find the properties of nodes and edges.
- Use accessors to find the right color schemes in the palette.
- Register multiple styles before applying them anytime at once.
- Index the nodes and edges properties on demand only, for performance reasons.
- Undo any style.
- Chain all methods for concise (coding) style.

See the live example using the API below:
![Designer](https://github.com/Linkurious/linkurious.js/wiki/media/designer-live.gif)

See the following [example code](../../examples/designer.html) and [unit tests](../../test/unit.plugins.designer.js) for full usage.

To use, include all .js files under this folder. Then initialize it as follows:

````javascript
var designer = sigma.plugins.designer(sigInst, {
  styles: myStyles,  // see below
  palette: myPalette // see below
});
````

Kill the plugin instance as follows:

````javascript
sigma.plugins.killDesigner(sigInst);
````

## Configuration
The configuration is made of a color palette and a set of styles, i.e. mapping between visual variables and data properties on nodes and edges.

Palettes may contain color schemes for both quantitative and qualitative properties. Schemes for qualitative properties are dictionaries where keys are the property values, and values are associated colors. Schemes for quantitative properties are dictionaries where keys are the number of property values, and the values are arrays of sequential colors.

Schemes may be nested in objects and be referenced in dot notation by the styles.

This is an example of a color palette with 2 schemes:

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
```

Available visual variables in styles are `color`, `label`, `size` for both nodes and edges. Styles map visual variables to data properties as follows:

* **label**
  * It will replace the existing label by the content of a data property.
  * by (*string*): the accessor to the data property.
  * format (*function*): the label formatter, may be used to truncate the label.
* **size**
  * It will set the `size` of nodes and edges in function of a data property.
  * by (*string*): the accessor to the data property.
  * bins (*number*, default: `7`): the number of buckets to group the property values. We recommend to set this parameter between 3 and 7 ; the human eyes can hardly distinguish more than 7 sizes at once.
  * min (*number*): will override `minNodeSize` or  `minEdgeSize`.
  * max (*number*): will override `maxNodeSize` or  `maxEdgeSize`.
* **color**
  * It will set the `color` of nodes and edges in function of a data property.
  * by (*string*): the accessor to the data property.
  * scheme (*string*): the accessor to the color scheme in the palette, using a dot notation.
  * bins (*number*, default: `7`): optional, the number of buckets to group the quantiative values. We recommend to set this parameter between 3 and 7 ; the human eyes can hardly distinguish more than 7 colors at once.

This is an example of styles for nodes and edges:

```js
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
```

The [ColorBrewer palette](../sigma.plugins.colorbrewer/sigma.plugins.colorbrewer.js) is provided to get started quickly with good color schemes.

## API

### Get bound styles
The styles are bound to each node or edge of the graph, for the specified properties, to be applied on demand. Get the bound styles using the `.nodes()` and `.edges()` method. For instance, get the styles of the nodes which have the property used to color them:

```js
var boundStyles = designer.nodes(myStyles.nodes.color.by);
/* {
  aValue: {
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

Get the nodes colored by a specified property value:

```js
var nodes = designer.nodes('data.quality')['excellent'].items;
```

Same example with edges:

```js
var boundStyles = designer.edges(myStyles.edges.color.by);
var edges = boundStyles['aValue'].items;
```

### Apply styles
The first time a style is applied, the designer indexes the nodes or edges property and updates either their `label`, `color` or `size` attribute.

Apply all styles as follows:

```js
designer.apply();
```

Apply all nodes styles:

```js
designer.apply('nodes');
```

Apply a specified nodes style like the color:

```js
designer.apply('nodes', 'color');
// designer.styles.nodes.color.active === true
```

Apply nodes styles progressively:

```js
designer.apply('nodes', 'color'); // apply node colors
designer.apply(); // apply all styles but node colors
```

Apply all edges styles:

```js
designer.apply('edges');
```

Apply a specified edges style like the size:

```js
designer.apply('edges', 'size');
// designer.styles.edges.size.active === true
```

### Restore original styles
The original label, color and size of nodes and edges are stored to be restored using the `.undo()` and `undo()` methods.

Undo all styles as follows:

```js
designer.undo();
```

Undo all nodes styles:

```js
designer.undo('nodes');
```

Undo a specified nodes style like the color:

```js
designer.undo('nodes', 'color');
// designer.styles.nodes.color.active === false
```

Undo all edges styles:

```js
designer.undo('edges');
```

Undo a specified nodes style like the size:

```js
designer.undo('nodes', 'size');
// designer.styles.nodes.size.active === false
```

### Deprecate the designer's vision
After calling `.deprecate()`, the designer will reindex the graph the next time `.apply()`, `.apply()`, `.nodes()`, or `.edges()` is called.

Deprecate all styles:

```js
designer.deprecate();
designer.apply(); // refresh all styles
```

Deprecate all nodes styles as follows:

```js
designer.deprecate('nodes');
designer.apply('nodes'); // refresh node styles
```

Deprecate a specified nodes property as follows:

```js
designer.deprecate('nodes', 'data.quantity');
designer.apply('nodes'); // refresh node styles bound to 'data.quantity'
```

Deprecation works the same way for edges.

### Clear all styles
All styles are cleared and the designer forgets the palette and styles:

```js
designer.clear();
designer.apply(); // does nothing
```

### Update palette and styles
Set a new palette and deprecate existing styles:

```js
designer.setPalette(myPalette);
```

Set new styles and deprecate existing styles:

```js
designer.setStyles(myStyles);
```

### Remove a single style
For instance, removes the node size:

```js
designer.undo('nodes', 'size');
delete designer.styles.nodes.size;
```

### Export styles and palette
You may save the palette and styles to restore them later as follows:

```js
var oldStyles = designer.styles;
var oldPalette = designer.palette;

designer.clear();
designer.setPalette(oldPalette);
designer.setStyles(oldStyles);
designer.apply(); // it works, bitches!

// or:
sigma.plugins.killDesigner(sigInst);
var newDesigner = sigma.plugins.designer(sigInst, {
  styles: oldStyles,
  palette: oldPalette
});
newDesigner.apply(); // yeah!
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
var activeNodeStyles = {};
Object.keys(designer.styles.nodes).forEach(function (visualVariable) {
  if (designer.styles.nodes[visualVariable].active) {
    activeNodeStyles[visualVariable] = designer.styles.nodes[visualVariable];
  }
});
```

Styles applied on edges:

```js
var activeEdgeStyles = {};
Object.keys(designer.styles.edges).forEach(function (visualVariable) {
  if (designer.styles.edges[visualVariable].active) {
    activeEdgeStyles[visualVariable] = designer.styles.edges[visualVariable];
  }
});
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

**0.4**
* Handle multiple Sigma instances
* Rename method `.make()` -> `.apply()`
* Rename method `.makeAll()` -> `.apply()` without argument
* Rename method `.omit()` -> `.undo()`
* Rename method `.omitAll()` -> `.undo()` without argument
* Rename method `.disown()` -> `.clear()`
* Remove methods `.specs()` and `.extendSpecs()`
* Add methods `setStyles()` and `setPalette()`
* Add public properties `styles` and `palette`
* Add basic unit tests

**0.3**
* The array `node.colors` is created when node attributes with an array of values are mapped to colors. In this case, `node.color` is unchanged.

**0.2**
 * Add `.appliedStyles()` to list the styles currently applied to nodes or edges.
 * Add the `bins` setting to size.
 * Bind the `min` size and `max` size settings to sigma settings.
 * Fix a specified style can be undone only once.
 * Add function `.utils.histogram()`.

**0.1**
 * Initial release.
