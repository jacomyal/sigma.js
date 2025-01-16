---
title: Publishing new versions
sidebar_position: 9
---

As the code is structured as a monorepo, we use [Lerna](https://github.com/lerna/lerna) to help version and publish the different packages handled in the repository.

To check packages that require a new version, you can run:

```bash
lerna version
```

This will ask you, for each package that has been edited since its last release, to specify a new version. Once it's done, a new commit has been added locally, with new tags, matching each package new version. It does not push by default.

To publish these new versions on [NPM](https://www.npmjs.com/), you can run:

```bash
lerna publish from-package
```

Once you validate the new versions to publish, it will publish each of these versions to NPM.

If you name your remote differently than `origin`, you need to add the option `--git-remote=<REMOTE_NAME>` to both commands;
