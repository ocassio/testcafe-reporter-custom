const path = require("path");
const fs = require("fs");
const { loadConfig } = require("./utils/config.utils");
const { registerTsNode } = require("./utils/typescript.utils");
const { isomorphicImport } = require("./utils/module.utils");

async function getReporter() {
  let projectRoot;

  const processPath = process.cwd();
  if (fs.existsSync(path.resolve(processPath, "node_modules"))) {
    projectRoot = processPath;
  } else {
    const mainModule = require.main || process.mainModule;
    projectRoot = mainModule.paths[0].split("node_modules")[0].slice(0, -1);
  }

  const configPath = path.resolve(projectRoot, "reporter.config.js");
  const config = await loadConfig(configPath);

  const reporterPath = path.resolve(projectRoot, config.path);
  if (!fs.existsSync(reporterPath)) {
    console.error(`File "${reporterPath}" doesn't exist`);
    process.exit(1);
  }

  if (reporterPath.endsWith(".ts")) {
    try {
      registerTsNode(projectRoot, config);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  }

  console.log("Using reporter: " + reporterPath);

  let reporter = await isomorphicImport(reporterPath, config.moduleType).catch(
    e => console.error(e)
  );

  if (reporter.default) {
    reporter = reporter.default;
  }

  if (reporter instanceof Function) {
    reporter = reporter();
  }

  return reporter;
}

module.exports = function () {
  return {
    async reportTaskStart() {
      await this._initReporter();
      if (!this.reportTaskStart) {
        throw new Error("Not implemented");
      }

      return await this.reportTaskStart.apply(this, arguments);
    },

    async reportFixtureStart() {
      await this._initReporter();
      if (!this.reportFixtureStart) {
        throw new Error("Not implemented");
      }
      return await this.reportFixtureStart.apply(this, arguments);
    },

    async reportTestStart() {
      await this._initReporter();
      if (this.reportTestStart) {
        return await this.reportTestStart.apply(this, arguments);
      }
    },

    async reportTestDone() {
      await this._initReporter();
      if (!this.reportTestDone) {
        throw new Error("Not implemented");
      }
      return await this.reportTestDone.apply(this, arguments);
    },

    async reportTaskDone() {
      await this._initReporter();
      if (!this.reportTaskDone) {
        throw new Error("Not implemented");
      }
      return await this.reportTaskDone.apply(this, arguments);
    },

    async _initReporter() {
      const reporter = await getReporter();
      Object.assign(this, reporter);
      if (!reporter.reportTestStart) {
        delete this.reportTestStart;
      }
    },
  };
};
