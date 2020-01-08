const fs = require('fs');

const defaultConfig = {
    path: './reporter/index.js',
    tsOptions: undefined
};

function loadConfig(configPath) {
    const config = fs.existsSync(configPath) ? require(configPath) : {};
    return Object.assign({}, defaultConfig, config);
}

module.exports = {
    loadConfig
};
