const path = require('path');
const fs = require('fs');
const { loadConfig } = require('./config.utils');

const projectRoot = process.mainModule.paths[0].split('node_modules')[0].slice(0, -1);

const configPath = path.resolve(projectRoot, 'reporter.config.js');
const config = loadConfig(configPath);

const reporterPath = path.resolve(projectRoot, config.path);
if (!fs.existsSync()) {
    console.error(`File "${reporterPath}" doesn't exist`);
    process.exit(1);
}

if (reporterPath.endsWith('.ts')) {
    require('ts-node').register(config.tsOptions);
}

module.exports = function () {
    let logic = require(reporterPath);

    if (logic.default) {
        logic = logic.default;
    }

    if (logic instanceof Function) {
        logic = logic();
    }

    return logic;
}