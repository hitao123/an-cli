const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const util = require('../lib/utils');



const appPackage = require('../config/react-package.json');
const appPath = path.join(__dirname, '../template/react');

module.exports = function(name) {
  // npm start 启动项目
  util.createAppTemplate(name, '../template/react', 'react-package.json');
  console.log("使用 npm start 启动你的项目");
  console.log();
}

