# Contributor Guide

Thank you for investing your time in contributing to our project!

In this guide you will get an overview of the contribution workflow from opening an issue, creating a PR, reviewing, and merging the PR.

## Development Workflow

1.  If you are a first-time contributor:

    - Go to https://github.com/jacomyal/sigma.js and click on the **fork** button to create your own copy of the project.

    - Clone the project to your local computer: `git clone git@github.com:your-username/sigma.js.git`

    - Navigate to the folder sigma.js and add the upstream repository: `git remote add upstream git@github.com:jacomyal/sigma.js.git`

    - Now, you have remote repositories named:

      - `upstream`, which refers to the `sigma.js` repository
      - `origin`, which refers to your personal fork

    - Next, you need to set up your build environment: `npm install`

2.  Develop your contribution:

    - Pull the latest changes from upstream

      ```
      git checkout main
      git pull upstream main
      ```

    - Create a branch for the feature you want to work on. Since the branch name will appear in the merge message, use a sensible name such as 'bugfix-for-issue-1480': `git checkout -b bugfix-for-issue-1480`

    - Commit locally as you progress (`git add` and `git commit`)

3.  Test your contribution:

    - Run the test suite locally: `npm run test && npm run e2e:test`

4.  Submit your contribution:

    - Push your changes back to your fork on GitHub: `git push origin bugfix-for-issue-1480`

    - Go to GitHub. The new branch will show up with a green Pull Request button, just click it.

5.  Review process:

    - Every Pull Request (PR) update triggers a set of [continuous integration](https://en.wikipedia.org/wiki/Continuous_integration) services
      that check that the code is up to standards and passes all our tests.
      These checks must pass before your PR can be merged. If one of the
      checks fails, you can find out why by clicking on the "failed" icon (red
      cross) and inspecting the build and test log.

    - Reviewers (the other developers and interested community members) will
      write inline and/or general comments on your PR to help
      you improve its implementation, documentation, and style.
      It's a friendly conversation from which we all learn and the
      overall code quality benefits.Don't let the review
      discourage you from contributing, its only aim is to improve the quality
      of project, not to criticize. We are, after all, very grateful for the
      time you're donating!.

    - To update your PR, make your changes on your local repository
      and commit. As soon as those changes are pushed up (to the same branch as
      before) the PR will update automatically.

> **_NOTE:_** If the PR closes an issue, make sure that GitHub knows to automatically close the issue when the PR is merged.
> For example, if the PR closes issue number 1480, you could use the phrase "Fixes #1480" in the PR description or commit message.

## Divergence from `upstream main`

If GitHub indicates that the branch of your Pull Request can no longer
be merged automatically, merge the main branch into yours :

```
git fetch upstream main
git rebase upstream/main
```

If any conflicts occur, they need to be fixed before continuing.

> **_NOTE:_** Please use **rebase** and not **merge**,

## Bugs

Please report bugs on [GitHub](https://github.com/jacomyal/sigma.js/issues).
