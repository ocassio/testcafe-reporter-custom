const fs = require("fs");

const defaultConfig = {
  path: "./reporter/index.js",
  tsNodePath: "./node_modules/ts-node",
  tsOptions: undefined,
};

async function loadConfig(configPath) {
  const config = fs.existsSync(configPath)
    ? await import("file://" + configPath).then(c => c.default)
    : {};
  console.log(`Custom config: ${JSON.stringify(config, null, 2)}`);
  return Object.assign({}, defaultConfig, config);
}

module.exports = {
  loadConfig,
};
