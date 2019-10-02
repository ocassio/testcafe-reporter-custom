# testcafe-reporter-custom


This is the **custom** reporter plugin for [TestCafe](http://devexpress.github.io/testcafe).

## Install

```sh
npm install testcafe-reporter-custom
```

## Usage

When you run tests from the command line, specify the reporter name by using the `--reporter` option:

```sh
testcafe chrome 'path/to/test/file.js' --reporter custom
```


When you use API, pass the reporter name to the `reporter()` method:

```js
testCafe
    .createRunner()
    .src('path/to/test/file.js')
    .browsers('chrome')
    .reporter('custom') // <-
    .run();
```


After that you can define your custom logic in `reporter/index.js` file.  
It can be defined as an object or factory function.

For example:

```js
module.exports = function () {
    return {
        async reportTaskStart (/* startTime, userAgents, testCount */) {
            throw new Error('Not implemented');
        },

        async reportFixtureStart (/* name, path, meta */) {
            throw new Error('Not implemented');
        },

        async reportTestStart (/* name, meta */) {
            // NOTE: This method is optional.
        },

        async reportTestDone (/* name, testRunInfo, meta */) {
            throw new Error('Not implemented');
        },

        async reportTaskDone (/* endTime, passed, warnings, result */) {
            throw new Error('Not implemented');
        }
    };
}
```

API is completely the same as for regular reporter.