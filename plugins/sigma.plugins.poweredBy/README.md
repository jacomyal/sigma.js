sigma.plugins.poweredBy
=====================

Plugin developed by [Sébastien Heymann](https://github.com/sheymann) for [Linkurious](https://github.com/Linkurious) and published under the [MIT](LICENSE) license.

Contact: seb@linkurio.us

---

This plugin provides a method to display a clickable "powered by" text on the canvas.

See the following [example code](../../examples/plugin-poweredby.html) for full usage.

To use, include all .js files under this folder. Then call the renderer method as follows:

````javascript
// Render the "powered by" text:
myRenderer.poweredBy();
````

## Configuration

This plugin adds new settings to sigma. Initialize sigma as follows:

````javascript
s = new sigma({
  graph: g,
  container: 'graph-container',
  settings: {
    poweredByHTML: 'Powered by Linkurious.js',
    poweredByURL: 'https://github.com/Linkurious/linkurious.js',
    poweredByPingURL: ''
  }
});
````

Override these settings anytime `poweredBy` is called:

````javascript
myRenderer.poweredBy({
  poweredByPingURL: 'http://127.0.0.1:3001'
});
````

#### Options

 * **poweredByHTML**
   * The text or HTML content to be displayed.
   * type: *string*
   * default value: `Powered by Linkurious.js`
 * **poweredByURL**
   * The URL clicked by the user.
   * type: *string*
   * default value: `https://github.com/Linkurious/linkurious.js`
 * **poweredByPingURL**
   * Another URL accessed, may be used to "ping" a server.
   * type: *string*
   * default value: ``
