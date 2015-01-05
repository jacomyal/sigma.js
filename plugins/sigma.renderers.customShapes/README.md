# sigma.renderers.customShapes

Plugin developed by:

- [Ron Peleg](https://github.com/rpeleg1970) (original idea and version)
- [Julian Bilcke](https://github.com/jbilcke) (WebGL implementation)

License: this plugin follows the same licensing terms as sigma.js library.

---
## General

This plugin let you display custom shapes, icons and images in graphs.

The most basic features are available in both Canvas and WebGL mode, as shown in [this demo](../../examples/plugin-customShapes-hybrid.html).

The WebGL and Canvas renderers work differently, so it is possible that some features have not been ported yet from one engine to the other. So please open a ticket of you believe something important is missing (or a PR if you can know how to fix it).


## Usage

### Quickstart

First make sure you are able to build the sigma.js project (see the [README](../../README.md) for more information), and understand how Sigma.js works (eg. what is a Sigma.js instance).

Then you can build the customShapes plugin by going to the `plugins/sigma.renderers.customShapes` directory and typing:

    $ grunt build

This should generate a `sigma.renderers.customShapes.min.js` file in `build/plugins`


Then you can copy this file and use it in your web project:

```html
<script src="path/to/plugin/sigma.renderers.customShapes.min.js"></script>
```

*Note: The next steps assume you already imported and initialized an instance of Sigma.js.*

The customShapes plugins works at the "add node" step of creating a graph.

You can assigning shapes to nodes by using the `type` attribute:

```javascript
mySigma.graph.addNode({
  type: 'star'
});
```

### Global configuration

The customShapes plugin extends the built-in Sigma.js configuration system with some new global settings:

```javascript
var settings = {

  // a boolean to indicate if you want to switch to a custom label display mode
  shortLabelsOnHover: false,

  // helps the browser authorize the cross domain policy (see paragraph below)
  imgCrossOrigin: 'anonymous',

  // resolution of the sprite sheet square.
  spriteSheetResolution: 2048,

  // number max of sprites
  spriteSheetMaxSprites: 128

};
```

You have to add these custom settings keys and values to the existing settings object when initializing sigma.js (please refer to the Sigma.js doc and examples for more details):

```javascript
var sigma = new sigma({
  graph: myGraph,
  settings: {
    zoomMax: 3,
    ... add your custom settings here ...
  }
});
```

#### shortLabelsOnHover : Boolean = false

A Boolean to indicate if you want to enable the a custom label display mode when hovering nodes.

Setting this to true is more than recommended, unless you do not plan to use the custom shapes (but only images or icons, for instance).

Default to false, to not interfer with normal Sigma.js behavior.

Possible improvement: in the future, the plugin might force the default value to true when initialized, so that apps not using the plugin would not be affected.


#### imgCrossOrigin : String = 'anonymous'

Controls the security policy of the image loading, from the browser's side.

Please read this page for more information:
https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image

Default to 'anonymous'.

#### spriteSheetResolution: Number = 2048
#### spriteSheetMaxSprites: Number = 128

These two settings are only used by the custom shape WebGL renderer.

In this rendering mode, a large texture is created in memory, and is used to store the sprites.

This large texture must have a fixed size, and for now cannot be resized dynamically.

The final resolution of each sprites thus depends on the resolution of this large texture, but also on the number of sprites you want to draw:

The more sprite you need to draw, the less pixels are available, so they will have a smaller resolution, so you can either increase the resolution of the sprite sheet texture, or reduce the number of images

##### spriteSheetResolution

This is the resolution of a side of the sprite sheet texture (which is a square).
Must be power of two, as this is directly linked to the size of the final WebGL texture.
Don't use a value too large. Values like 2048 or 4096 should be ok.

##### spriteSheetMaxSprites

Number max of sprites.

Defines how many sprites can fit inside the sprite sheet texture.
If you have less than 128 images then you can enter the number of max different images you will even encounter, so that each sprite can use as much pixels as possible (this gives increased resolution).




### List of shapes

#### type: 'star'

Draw a star. Example:

```javascript
{
  type: 'star',
  star: {
    numPoints: 6, // default: 5
    rotate: Math.PI / 180 // must be in radians. Default: 0
  }
}
```

Note: defining an inner star radius is not yet supported in WebGL mode.



#### type: 'cross'

Draw a `+` shaped cross.

```javascript
{
  type: 'cross',
  star: {
    lineWeight: 0.08, // default: 0.08
    rotate: Math.PI / 180 // must be in radians. Default: 0
  }
}
```

#### type: 'circle'

Draw a disc shaped node (you can also use 'disc', which is an alias).

```javascript
{
  type: 'circle'
}
```

#### type: 'square'

Draw a square. You can rotate it if needed.

```javascript
{
  type: 'square',
  square: {
    rotate: Math.PI / 180 // must be in radians. Default: 0
  }
}
```

#### type: 'diamond'

Draw a diamond. This is basically a square with a 45° rotation.

```javascript
{
  type: 'diamond'
}
```

#### type: 'equilateral'

Draw an equilateral triangle

```javascript
{
  type: 'triangle',
  triangle: {
    rotate: Math.PI / 180 // must be in radians. Default: 0
  }
}
```


### Using images

You can add an image to any node, simply by adding `node.image` property, with the following content:
````javascript
node.image = {
  url: /* mandatory image URL */,
  clip: /* Ratio of image clipping disk compared to node size (def 1.0) - see example to how we adapt this to differenmt shapes */,
  scale: /* Ratio of how to scale the image, compared to node size, default 1.0 */,
  w: /* numeric width - important for correct scaling if w/h ratio is not 1.0 */,
  h: /* numeric height - important for correct scaling if w/h ratio is not 1.0 */
}
````

Notes:

 - images must be from trusted URLs: eg. same host, or permissive CORS policy
 - The shape type will then be applied to crop the image.
 - For the moment, the `w` and `h` are not supported in WebGL mode.

### Using font-icons

Custom webfonts are supported!

You just need to make sure you custom font is actually loaded before actually using it in a graph, using the W3C CSS Font Loading API (to support non-evergreen browsers you can use a shim like https://github.com/zachleat/fontfaceonload or https://github.com/bramstein/fontloader)

The syntax to use a webfont is very simple, and can even be combined with
shapes:


```javascript
{
  type: 'circle',
  color: '#A5CFD1', // background color (pastel blue)
  icon: {
    font: 'Arial', // or 'FontAwesome' etc..
    content: '☺', // or custom fontawesome code eg. "\uF129"
    scale: 0.7, // 70% of node size
    color: '#000000' // foreground color (black)
}
```


## Renderer-specific notes

### Canvas

In canvas mode it is easy to define your own node renderers. The default
renderer implemented by sigma.js is named `def` - see also [generic custom node renderer example](../../examples/custom-node-renderer.html)

### WebGL

Current limitations:

* Fonts need to be loaded by the browser before graph is initialized
* Images must be on the same host / or CORS must be correctly configured (see doc)
* Some parameters are not supported for all shapes (eg. borders)
* The Pac-man shape had a low priority and is not supported yet


#### Additional information about image loading (and WebGL)

Dealing with images hosted on other servers is not a trivial task and must be done carefully.

Modern browsers impose restrictions regarding what kind of (image) data can be trusted or not, before "eating it" eg. load it in graphic card memory, or reading the buffer.

 WebGL applications may use images and videos that come from other domains,
 with the cooperation of the server hosting the media, using Cross-Origin Resource Sharing [CORS].
 In order to use such media, the application needs to explicitly request permission to do so,  and the server needs to explicitly grant permission.

 If an image comes from an untrusted source, it might be labeled as such (or "tainted") and its use (reading pixels values from JS etc..) forbidden.

Please read this page for more information:
https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image

Some information about how WebGL deals with texture:
http://www.khronos.org/registry/webgl/specs/latest/1.0/#4.1
