# Sigma.js examples

These examples aim to demonstrate how to address various issues using sigma.js, and to showcase its API.

### How to live-edit an example in CodeSandbox

Each example is a valid mini project usable as a standalone application. This allows opening an example in [CodeSandbox.com](https://codesandbox.io/) using [their GitHubBox.com feature](https://codesandbox.io/docs/importing#using-githubboxcom):

1. Open in GitHub the root directory of a given example
2. Change the `github.com` by `githubbox.com` in the URL bar then validate

It will create a new working code sandbox where you can live edit the code to see better how it works.

### How to live-edit an example locally

Since each example declares `"sigma": "latest"` in its dependencies, if you want to edit an example using local sigma source code, you need to bypass this declaration.

Our solution to this problem is that you can run an example from this directory:

1. Open a terminal in this examples listing directory: `cd path/to/sigma/examples`
2. Run `npm install` to install examples dependencies
3. Run `npm start --example=my-example`, with `my-example` being the name of an example subdirectory
4. Open [localhost:3000](http://localhost:3000/) in your browser

You should see the example live, using local sigma sources.

### How to create a new example

1. Copy the full `template` directory (let's say as `my-example`)
2. Rename the `examples/my-example/package.json` value for `"name"`
3. Rename the `examples/my-example/index.html` value for `html > head > title`
4. Update `examples/my-example/index.ts` so that it does what you want
5. Don't forget to port the eventual dependencies you declared in `examples/my-example/package.json` to this directory's `examples/package.json` (so that it can be started with local sigma code)

If you need public files, accessible from the example through a permalink, you need to put them in a `my-example/public` subfolder.

### Caveats

The examples rely on [`kotatsu`](https://github.com/Yomguithereal/kotatsu) because of its out-of-the-box compatibility with `webpack` which is also used in this repository to build the sources (especially to handle shaders).

However, since it is not completely straightforward to serve static file in a CodeSandbox example which does not use a well-known tool such as `create-react-app` we have to cheat a little by using the following `sandbox.config.json` file to force CodeSandbox to consider our examples as using `create-react-app` just so our `public` files are correctly served:

```json
{
  "infiniteLoopProtection": true,
  "hardReloadOnChange": false,
  "view": "browser",
  "template": "create-react-app"
}
```

Note that this is not required for examples that don't rely on static assets.
