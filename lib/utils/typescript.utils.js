const fs = require('fs');
const path = require('path');

function registerTsNode(projectRoot, config) {
    const tsNodePath = path.resolve(projectRoot, config.tsNodePath);
    if (!fs.existsSync(tsNodePath)) {
        throw Error(`
            "ts-node" module doesn't seem to be installed in "${tsNodePath}". 
            Try installing "ts-node" module or adjusting "tsNodePath" property in configuration file.
        `);
    }
    require(tsNodePath).register(config.tsOptions);
}

module.exports = {
    registerTsNode
};
