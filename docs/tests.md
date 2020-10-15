# Sigma test feature

Sigma has two kinds of test, unit and e2e tests.

## Unit tests

They are located under the folder `./test/unit`.
To run them, just run the command `npm test`.

## E2E tests

They are located under the folder `./test/e2e` and must be suffixed by `.spec.ts`.
To run them, just run the command `npm run e2e:test`.

### How it works ?

Those tests perform a screenshot of each url in the tests defined `./test/e2e/config.ts`, and make a diff with
the reference screenshot saved in the folder `./test/e2e/screenshots/` (with the suffix `.valid.png`).

If there is a difference, the test failed.

At the end of the tests, the `./test/e2e/screenshots/` folder should contains three files for each files :

- `${name}.valid.png` : the reference that is committed
- `${name}.current.png` : the screenshot that has been taken during the test
- `${name}.diff.png` : the diff image between the valid and current one

### How to add a new test ?

You have to edit the file `./test/e2e/config.ts` and add a new entry in the `tests` array
where :

- `name` : is the name of the test. (please avoid spaces and special characters)
- `url`: the full url of the page to take in screenshot
- (optional) `failureThreshold` : The diff threshold in percent (between 0 & 1) for which we consider that the test failed (default is 0).
- (optional) `waitFor` : the number of millisecond the test should wait before to take the screenshot. This can be useful to test layouts (default is 0).
- (optional) `scenario` : a function that allows you to implement a user scenario before to take a screenshot, like for example to perform a zoom (check the config file to see an example).

### How to generate the references screenshot ?

You just have to run the command `npm run e2e:generate`.

This task do :

- start the server of the examples
- for each test in the configuration it takes a screenshot and saved it as `./test/e2e/screenshots/${name}.valid.png`
- stop the server
