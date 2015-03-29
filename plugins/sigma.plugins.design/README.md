sigma.plugins.design
==================

Plugin developed by [Sébastien Heymann](https://github.com/sheymann) for [Linkurious](https://github.com/Linkurious) and published under the licence [GNU GPLv3](LICENSE) unless otherwise noticed by Linkurious.

Contact: seb@linkurio.us

---
## General
This plugin provides an API to design the graph visualization like a boss. The graph design is made of a **color palette** and a set of **styles**. A style is a mapping between a **node or edge property** and a **visual variable**, with optional parameters depending on the visual variable. Available visual variables are `color`, `label`, `size`, and `type` (i.e. shapes) for both nodes and edges, as well as `icon` and `image` for nodes.

This plugin provides **lazy** methods:
- styles are computed once to be applied and reset multiple times like a breeze.
- the plugin will not look for changes on the graph. Deprecate the design manually to refresh the styles.

The color palette may contain sequential, diverging and qualitative data schemes, and the styles can be computed regarding any node or edge property.

This plugin comes with fancy developer features:
- Configure the styles to apply on nodes and edges.
- Use accessors to find the properties of nodes and edges.
- Use accessors to find the right color schemes in the palette.
- Register multiple styles before applying them anytime at once.
- Index the nodes and edges properties on demand only, for performance reasons.
- Reset any style.
- Chain all methods for concise coding style.

See the live example using the API below:
![design](https://github.com/Linkurious/linkurious.js/wiki/media/design-live.gif)

See the following [example code](../../examples/design.html) and [unit tests](../../test/unit.plugins.design.js) for full usage.

To use, include all .js files under this folder. Then initialize it as follows:

````javascript
var design = sigma.plugins.design(sigInst, {
  styles: myStyles,  // see below
  palette: myPalette // see below
});
````

Kill the plugin instance as follows:

````javascript
sigma.plugins.killDesign(sigInst);
````

## Configuration
The configuration is made of a color palette and a set of styles, i.e. mapping between visual variables and data properties on nodes and edges.

Palettes may contain color schemes for both quantitative and qualitative properties, as well as schemes for types (i.e. shapes), icons and images. Schemes for qualitative properties are dictionaries where keys are the property values, and values are associated colors. Schemes for quantitative properties are dictionaries where keys are the number of property values, and the values are arrays of sequential colors.

Schemes may be nested in objects and be referenced in dot notation by the styles.

This is a complete example of palette:

```js
var myPalette = {
  aQualitativeScheme: { 
    'A': '#7fc97f',
    'B': '#beaed4',
    'C': '#fdc086'
  },
  colorbrewer: {
    sequentialGreen: {
      3: ["#e5f5f9","#99d8c9","#2ca25f"],
      4: ["#edf8fb","#b2e2e2","#66c2a4","#238b45"],
      5: ["#edf8fb","#b2e2e2","#66c2a4","#2ca25f","#006d2c"],
      6: ["#edf8fb","#ccece6","#99d8c9","#66c2a4","#2ca25f","#006d2c"],
      7: ["#edf8fb","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#005824"],
      8: ["#f7fcfd","#e5f5f9","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#005824"],
      9: ["#f7fcfd","#e5f5f9","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#006d2c","#00441b"]
    }
  },
  ggplot2: {
    sequentialBlue: {
      7: ['#132b43','#1d3f5d','#27547a','#326896','#3d7fb5','#4897d4','#54aef3']
    },
  },
  aSetScheme: {
    7: ["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628"]
  },
  // see sigma.renderers.linkurious
  nodeTypeScheme: {
    'A': 'square',
    'B': 'diamond',
    'C': 'star'
  },
  // see sigma.renderers.customEdgeShapes
  edgeTypeScheme: {
    'A': 'tapered'
  },
  // see sigma.renderers.linkurious
  imageScheme: {
    'A': {
      url: 'img/img1.png',
      scale: 1.3,
      clip: 0.85
    },
    'B': {
      url: 'img/img2.png',
      scale: 1.3,
      clip: 0.85
    },
    'C': {
      url: 'img/img3.png',
      scale: 1.3,
      clip: 0.85
    }
  },
  // see sigma.renderers.linkurious
  iconScheme: {
    'A': {
      font: 'FontAwesome',
      scale: 1.0,
      color: '#fff',
      content: "\uF11b"
    },
    'B': {
      font: 'FontAwesome',
      scale: 1.0,
      color: '#fff',
      content: "\uF11c"
    },
    'C': {
      font: 'FontAwesome',
      scale: 1.0,
      color: '#fff',
      content: "\uF11d"
    }
  }
};
```

Available visual variables are `color`, `label`, `size`, and `type` (i.e. shapes) for both nodes and edges, as well as `icon` and `image` for nodes. Styles map visual variables to data properties as follows:

* **label**
  * It will replace the existing label by the content of a data property.
  * **by** (*string*): the accessor to the data property.
  * **format** (*function*): the label formatter, may be used to truncate the label.
* **size**
  * It will set the `size` of nodes and edges in function of a data property.
  * **by** (*string*): the accessor to the data property.
  * **bins** (*number*, default: `7`): the number of buckets to group the property values. We recommend to set this parameter between 3 and 9 ; the human eyes can hardly distinguish more than 9 sizes at once.
  * **min** (*number*): will override `minNodeSize` or  `minEdgeSize`.
  * **max** (*number*): will override `maxNodeSize` or  `maxEdgeSize`.
* **color**
  * It will set the `color` of nodes and edges in function of a data property.
  * **by** (*string*): the accessor to the data property.
  * **scheme** (*string*): the accessor to the color scheme in the palette, using a dot notation.
  * **bins** (*number*, default: `7`): The number of buckets to group the quantitative values. It is required for a scheme on sequential data. We recommend to set this parameter between 3 and 9 ; the human eyes can hardly distinguish more than 9 colors at once.
  * **set** (*number*): The number of items in a set of colors. It is required for a scheme on qualitative data where the scheme contains arrays indexed by array length.
* **type**
  * It will set the `type` (i.e. shape) of nodes and edges in function of a data property.
  * **by** (*string*): the accessor to the data property.
  * **scheme** (*string*): the accessor to the type scheme in the palette, using a dot notation.
* **icon**
  * It will set the nodes `icon` in function of a data property.
  * **by** (*string*): the accessor to the data property.
  * **scheme** (*string*): the accessor to the icon scheme in the palette, using a dot notation.
* **image**
  * It will set the nodes `image` in function of a data property.
  * **by** (*string*): the accessor to the data property.
  * **scheme** (*string*): the accessor to the image scheme in the palette, using a dot notation.

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
    icon: {
      by: 'data.quality',
      scheme: 'iconScheme'
    }
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

The plugin is able to assign colors randomly from an array of colors for qualitative data as follows (see the scheme definition above):

```js
var myStyles = {
  nodes: {
    color: {
      by: 'data.quality',
      scheme: 'aSetScheme',
      set: 7
    },
    ...
  },
  ...
};
```

The [ColorBrewer palette](../sigma.plugins.colorbrewer/sigma.plugins.colorbrewer.js) provides good color schemes to start with .

## API

### Set or update palette and styles
You may initialize the design with no styles, then set palette and styles later:

```js
var design = sigma.plugins.design(s);
```

Set a new palette and deprecate all existing styles:

```js
design.setPalette(myPalette);
```

Set new styles, deprecate all existing styles, and apply:

```js
design.setStyles(myStyles);
```

Set a single node style:

```js
design
  .nodesBy('color', {
    by: 'data.quantity',
    scheme: 'colorbrewer.sequentialGreen',
  });
```

Set a single edge style:

```js
design
  .edgesBy('size', {
    by: 'data.quantity',
    bins: 7,
    min: 1,
    max: 5
  });
```

Set multiple styles in a concise way:

```js
design
  .setPalette(myPalette)
  .nodesBy('label', myStyles.nodes.label)
  .nodesBy('size', myStyles.nodes.size)
  .nodesBy('color', myStyles.nodes.color)
  .edgesBy('size', myStyles.edges.size)
  .edgesBy('color', myStyles.edges.color);
```

### Apply styles
The first time a style is applied, the design indexes the nodes or edges property and updates either their `label`, `color` or `size` attribute.

Apply all styles as follows:

```js
design.apply();
```

Apply all nodes styles:

```js
design.apply('nodes');
```

Apply a specified nodes style like the color:

```js
design.apply('nodes', 'color');
// design.styles.nodes.color.active === true
```

Apply nodes styles progressively:

```js
design.apply('nodes', 'color');
design.apply('nodes', 'size');

design.apply(); // apply all styles and skip node colors and size
```

Apply all edges styles:

```js
design.apply('edges');
```

Apply a specified edges style like the size:

```js
design.apply('edges', 'size');
// design.styles.edges.size.active === true
```

### Get computed styles
The styles are computed once for each node or edge of the graph, for the specified properties, to be applied on demand. Get the computed styles using the `.nodes()` and `.edges()` method. For instance, get the computed styles of the nodes which have the specified property used to color them:

```js
var computedStyles = design.nodes(myStyles.nodes.color.by);
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
var nodes = design.nodes('data.quality')['excellent'].items;
```

Same example with edges:

```js
var computedStyles = design.edges(myStyles.edges.color.by);
var edges = computedStyles['aValue'].items;
```

### Currently applied styles
Computed styles may not necessarily being applied. For instance, calling `.reset()` will deactivate all styles, however the computed styles still exist and may be applied when calling `.apply()`.

You may get all the styles applied to the nodes as follows:

```js
var activeNodeStyles = {};
Object.keys(design.styles.nodes).forEach(function (visualVariable) {
  if (design.styles.nodes[visualVariable].active) {
    activeNodeStyles[visualVariable] = design.styles.nodes[visualVariable];
  }
});
```

You may get all the styles applied to the edges as follows:

```js
var activeEdgeStyles = {};
Object.keys(design.styles.edges).forEach(function (visualVariable) {
  if (design.styles.edges[visualVariable].active) {
    activeEdgeStyles[visualVariable] = design.styles.edges[visualVariable];
  }
});
```

### Reset to original styles
The original label, color and size of nodes and edges are stored by the plugin. They may be restored using the `.reset()` method.

Reset all styles as follows:

```js
design.reset();
```

Reset all nodes styles:

```js
design.reset('nodes');
```

Reset a specified nodes style such as the color:

```js
design.reset('nodes', 'color');
// design.styles.nodes.color.active === false
```

Reset all edges styles:

```js
design.reset('edges');
```

Reset a specified nodes style such as the size:

```js
design.reset('nodes', 'size');
// design.styles.nodes.size.active === false
```

### Deprecate the styles
After calling `.deprecate()`, the design will reindex the graph and compute the styles the next time `.apply()`, `.nodes()`, or `.edges()` is called.

Deprecate all styles:

```js
design.deprecate();
design.apply(); // refresh all styles
```

Deprecate all nodes styles as follows:

```js
design.deprecate('nodes');
design.apply('nodes'); // refresh node styles
```

Deprecate a specified nodes property as follows:

```js
design.deprecate('nodes', 'data.quantity');
design.apply('nodes'); // refresh node styles computed for 'data.quantity'
```

Deprecation works the same for edges.

### Delete property styles from nodes or edges

Deprecation will work correctly if the deprecated properties still exist at the time of deprecation. In case of removed node or edge property, we must delete styles manually as follows:

```js
design.deletePropertyStylesFrom('nodes', 'n0', 'data.quantity');
```

### Remove a single style
Example:

```js
design.reset('nodes', 'size');
delete design.styles.nodes.size;
```

### Clear all styles
* Clear all references,
* the original color, size and label of nodes and edges are restored,
* the design forgets the palette and styles.

```js
design.clear();
design.apply(); // does nothing
```

### Export styles and palette
You may save the palette and styles to restore them later as follows:

```js
var oldStyles = design.styles;
var oldPalette = design.palette;

design.clear();
design.setPalette(oldPalette);
design.setStyles(oldStyles);
design.apply(); // it works, bitches!

// or:
sigma.plugins.killDesign(sigInst);
var newdesign = sigma.plugins.design(sigInst, {
  styles: oldStyles,
  palette: oldPalette
});
newdesign.apply(); // yeah!
```

## Utils

### Data type of a property on nodes or edges

```js
design.utils.isSequential('nodes', 'data.quantity');
// true

design.utils.isSequential('nodes', 'data.quality');
// false

design.utils.isSequential('nodes', 'data.missing');
// undefined
```

### Histograms

Histograms are values of a specified property of nodes or edges grouped by bins and computed for a visual variable such as sizes and colors. They are computed in a lazy manner and stored by the plugin.

The result is an array of bin objects ordered by `bin` ID. Each bin object contain the following information:

* **bin**
  * The bin ID, generally between 0 and 9. Bins group property values (see above).
  * type: *number*
* **min**
  * The minimum property value. It is equal to `Math.min(values)`.
  * type: *number*
* **max**
  * The maximum property value. It is equal to `Math.max(values)`.
  * type: *number*
* **values**
  * The property values grouped in the current bin.
  * type: *array*
* **ratio**
  * The number of values in the current bin divided by the maximum number of values in the largest bin.
  * type: *number*
* **color** (optional)
  * The color of nodes or edges in hexadecimal, rgb or rgba.
  * type: *string*
* **size** (optional)
  * The size of nodes or edges.
  * type: *number*

Example on the histogram of edge colored by the property 'data.quantity':

```js
design.utils.histogram('edges', 'color', 'data.quantity');
// [
//   {
//     bin: 0,
//     min: 1,
//     max: 6,
//     values: [1, 2, 3, 4, 6],
//     ratio: 1,
//     color: '#333'
//   },
//   {
//     bin: 1,
//     min: 6.1,
//     max: 10,
//     values: [6.1, 6.34, 10],
//     ratio: 0.6, // = 3/5
//     color: '#666'
//   }
// ]
```

## Changelog

**0.5**
* Automatic color assignment of qualitative data when the scheme is a set of colors instead of a dictionnary.
* Add node and edge types, node icons and images; fully compatible with `sigma.renderers.linkurious`

**0.4**
* Rename plugin `designer` -> `design`
* Handle multiple Sigma instances
* Rename method `.make()` -> `.apply()`
* Rename method `.makeAll()` -> `.apply()` without argument
* Rename method `.omit()` -> `.reset()`
* Rename method `.omitAll()` -> `.reset()` without argument
* Rename method `.disown()` -> `.clear()`
* Remove methods `.specs()` and `.extendSpecs()`
* Add methods `.setStyles()` and `.setPalette()`
* Add methods `.nodesBy()` and `.edgesBy()`
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
