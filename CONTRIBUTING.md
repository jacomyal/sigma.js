# Contributor Guide

Thank you for investing your time in contributing to sigma.js!

Please report bugs on [GitHub](https://github.com/jacomyal/sigma.js/issues).

Before opening a pull request, check that:

- Commit messages follow [our format](#commits).
- Bug fixes come with a regression test, committed **before** the fix (see [Bug fixes](#bug-fixes)).
- Your branch has no merge commits (see [Workflow](#workflow)).
- `npm run test` passes on the last commit of your branch.

## Workflow

1. Fork the repository, clone your fork, add `git@github.com:jacomyal/sigma.js.git` as the `upstream` remote, and run
   `npm install`.
2. Create a branch from `main`, with a sensible name such as `bugfix-for-issue-1480`.
3. Commit, push with `git push -u origin <branch>`, and open a pull request.
4. If the PR closes an issue, write "Fixes #1480" in its description, so that GitHub closes the issue on merge.

If your branch diverges from `upstream/main`, rebase it, fix any conflicts, and force-push:

```
git fetch upstream main
git rebase upstream/main
git push --force-with-lease
```

CI checks must pass before merging. Reviews are friendly conversations, meant to improve the code, not to criticize:
we are very grateful for your time! Push changes to the same branch to update the PR.

## Commits

We do not use [Conventional Commits](https://www.conventionalcommits.org/). The first line is `[scope] Description`:

- The scope is the name of the package folder you changed (`sigma`, `node-image`, `website`...), `test` for
  `packages/browser-tests`, or `all` when the change spans many packages.
- The description starts with a third-person verb ("Fixes", "Adds", "Removes"...), and fits in 50 characters.

The body is optional for small changes. Otherwise, it describes precisely what the commit contains, and references
the related issue if any. Wrap lines at 72 characters.

Examples:

- Short: [`[website] Adds canonical URL to the homepage`](https://github.com/jacomyal/sigma.js/commit/d20413f3)
- Detailed: [`[sigma] Adds per-node attributes to SDF shapes`](https://github.com/jacomyal/sigma.js/commit/21d1f1e1)

Release commits (`Publish`) are created by maintainers with Lerna, and do not follow this format.

## Bug fixes

When you fix a bug, use two commits:

1. A regression test that fails without the fix. Its message mentions that it is currently failing.
2. The fix that makes the test pass. Its message references the issue.

This way, anyone can check out the first commit and see the test fail.

Examples:

1. [`[sigma] Adds regression test for #1558`](https://github.com/jacomyal/sigma.js/commit/eb624233)
2. [`[sigma] Fixes hover flicker on overlapping nodes`](https://github.com/jacomyal/sigma.js/commit/98ddf850)
