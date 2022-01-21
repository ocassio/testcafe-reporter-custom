const fs = require("fs");
const { ALLOWED_TYPES, TYPE_COMMON_JS } = require("./module.utils");

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

  const mergedConfig = Object.assign({}, defaultConfig, config);
  if (
    mergedConfig.moduleType &&
    !ALLOWED_TYPES.includes(mergedConfig.moduleType)
  ) {
    const allowedTypes = ALLOWED_TYPES.join(", ");
    console.error(
      `Unsupported 'moduleType' option '${mergedConfig.moduleType}'. Supported options are: ${allowedTypes}. Falling back to 'commonjs'.`
    );
    mergedConfig.moduleType = TYPE_COMMON_JS;
  }

  return mergedConfig;
}

module.exports = {
  loadConfig,
};
