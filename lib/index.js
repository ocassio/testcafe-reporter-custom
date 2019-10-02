const path = require('path');

const projectRoot = process.mainModule.paths[0].split('node_modules')[0].slice(0, -1);
const configFile = path.resolve(projectRoot, 'reporter/index.js');

module.exports = function () {
    let logic = require(configFile);
    if (logic instanceof Function) {
        logic = logic();
    }

    return logic;
}