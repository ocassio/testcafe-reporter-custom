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
        async reportTaskStart(/* startTime, userAgents, testCount */) {
            throw new Error('Not implemented');
        },

        async reportFixtureStart(/* name, path, meta */) {
            throw new Error('Not implemented');
        },

        async reportTestStart(/* name, meta */) {
            // NOTE: This method is optional.
        },

        async reportTestDone(/* name, testRunInfo, meta */) {
            throw new Error('Not implemented');
        },

        async reportTaskDone(/* endTime, passed, warnings, result */) {
            throw new Error('Not implemented');
        }
    };
}
```

API is completely the same as for regular reporter.

## Configuration

Reporter can be configured using `reporter.config.js` file, which should be placed in a project root folder.

```js
module.exports = {
    path: 'reporter/main.js'
};
```

Possible options are presented in the table below.

| Option       | Default Value            | Description                                                                                                          |
| ------------ | ------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| `path`       | `'reporter/index.js'`    | Path to your reporter                                                                                                |
| `tsNodePath` | `'node_modules/ts-node'` | Path to your `ts-node` installation (only used for `*.ts` files)                                                     |
| `tsOptions`  | `undefined`              | [`ts-node` options](https://github.com/TypeStrong/ts-node#cli-and-programmatic-options) (only used for `*.ts` files) |

## TypeScript Usage

In order to use TypeScript with this reporter, at least `ts-node` and `typescript` packages should be installed.  

```sh
npm install --save-dev ts-node typescript
```

After that you need to create `reporter.config.ts` file and specify `path` to your reporter.
```js
module.exports = {
    path: 'reporter/index.ts'
};
```

As `testcafe-reporter-custom` use `ts-node` in order to execute TypeScript files, all it's rules are applied.

If you want to provide additional `ts-node` options, you can use `tsOptions` in the reporter configuration file.  
For example, you can specify custom `tsconfig` file using the following configuration:

```js
module.exports = {
    path: 'reporter/index.ts',
    tsOptions: {
        project: 'tsconfig.reporter.json'
    }
};
```

## Usage Examples

There is a couple of usage examples available in this repository:

* [Basic](examples/basic)
* [TypeScript](examples/typescript)
