const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const util = require('../lib/utils');



const appPackage = require('../config/react-package.json');
const appPath = path.join(__dirname, '../template/react');

module.exports = function(name) {
  // // 包名必须满足 npm 包名规范
  // util.checkAppName(name);
  // // 创建 package.json 并将配置文件写入其中
  // appPackage.name = name;
  // appPackage.version = "0.0.1";
  // appPackage.scripts = {
  //   "start": "cross-env NODE_ENV=development webpack-dev-server",
  //   "build": "cross-env NODE_ENV=production webpack",
  //   "test": "echo \"Error: no test specified\" && exit 1"
  // };
  // appPackage.dependencies = appPackage.dependencies || {};
  // appPackage.devDependencies = appPackage.devDependencies || {};

  // fs.writeFileSync(
  //   path.join(appPath, 'package.json'),
  //   JSON.stringify(appPackage, null, 2)
  // );
  // // 复制模板文件
  // fs.copy(appPath, name, (err) => {
  //   if(err) console.log(err)
  //   console.log(chalk.blue(`create ${name} project success!`))
  // })

  // 安装本地 node_modules

  // npm start 启动项目
  util.createAppTemplate(name, '../template/react', 'react-package.json');
}

