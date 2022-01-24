const path = require("path");
const fs = require("fs");
const { loadConfig } = require("./utils/config.utils");
const { registerTsNode } = require("./utils/typescript.utils");
const { isomorphicImport } = require("./utils/module.utils");

let reporter = undefined;

async function getReporter() {
  if (reporter) {
    return reporter;
  }

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

  reporter = await isomorphicImport(reporterPath, config.moduleType).catch(e =>
    console.error(e)
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
      const reporter = await getReporter();
      if (!reporter.reportTaskStart) {
        throw new Error("Not implemented");
      }

      return await reporter.reportTaskStart.apply(this, arguments);
    },

    async reportFixtureStart() {
      const reporter = await getReporter();
      if (!reporter.reportFixtureStart) {
        throw new Error("Not implemented");
      }
      return await reporter.reportFixtureStart.apply(this, arguments);
    },

    async reportTestStart() {
      const reporter = await getReporter();
      if (reporter.reportTestStart) {
        return await reporter.reportTestStart.apply(this, arguments);
      }
    },

    async reportTestDone() {
      const reporter = await getReporter();
      if (!reporter.reportTestDone) {
        throw new Error("Not implemented");
      }
      return await reporter.reportTestDone.apply(this, arguments);
    },

    async reportTaskDone() {
      const reporter = await getReporter();
      if (!reporter.reportTaskDone) {
        throw new Error("Not implemented");
      }
      return await reporter.reportTaskDone.apply(this, arguments);
    },
  };
};
