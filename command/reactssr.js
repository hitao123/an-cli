const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const util = require('../lib/utils');



const appPackage = require('../config/react-package.json');
const appPath = path.join(__dirname, '../template/react-ssr');

module.exports = function (name) {
  // npm start 启动项目
  util.createAppTemplate(name, '../template/react-ssr', 'react-package.json', function () {
    console.log();
    console.log("使用 npm start 构建你的项目");
    console.log("使用 node server 启动你的项目");
    console.log();
  });

}
