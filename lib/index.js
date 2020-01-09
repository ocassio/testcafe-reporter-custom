const path = require('path');
const fs = require('fs');
const { loadConfig } = require('./utils/config.utils');
const { registerTsNode } = require('./utils/typescript.utils');

const projectRoot = process.mainModule.paths[0].split('node_modules')[0].slice(0, -1);

const configPath = path.resolve(projectRoot, 'reporter.config.js');
const config = loadConfig(configPath);

const reporterPath = path.resolve(projectRoot, config.path);
if (!fs.existsSync(reporterPath)) {
    console.error(`File "${reporterPath}" doesn't exist`);
    process.exit(1);
}

if (reporterPath.endsWith('.ts')) {
    try {
        registerTsNode(projectRoot, config);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}

console.log('Using reporter: ' + reporterPath);

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