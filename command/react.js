const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const util = require('../lib/utils');



const appPackageName = 'react-package.json';
const templatePath = path.join(__dirname, '../template/react');

module.exports = function(name) {
  // npm start 启动项目
  util.createAppTemplate(name, templatePath, appPackageName, function() {
    console.log();
    console.log("使用 npm start 启动你的项目");
    console.log();
  });

}

