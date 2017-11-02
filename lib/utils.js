'use strict';

const validateProjectName = require("validate-npm-package-name"); // 验证包名是否合法
const chalk = require("chalk"); // 使控制台输出有颜色
const commander = require("commander"); // 命令
const inquirer = require("inquirer"); // 交互
const fs = require("fs-extra"); // 文件操作扩展 用来拷贝模板文件
const path = require("path");
const execSync = require("child_process").execSync; // 创建同步进程
const spawn = require("cross-spawn"); // 跨平台创建进程
const semver = require("semver"); // 检查版本号
const dns = require("dns"); // node 模块 检查是否有网 DNS解析
const tmp = require("tmp"); // 创建 tmp 文件夹
const unpack = require("tar-pack").unpack; // 解压打包相关
const url = require("url"); // node 模块
const hyperquest = require("hyperquest"); // 请求
// const config = require('../config/index');

// 是否可以使用 Yarn 安装 依赖
function shouldUseYarn() {
  try {
    // 创建同步进程
    execSync('yarnpkg --version', { stdio: 'ignore'})
    return true;
  } catch(e) {
    return false;
  }
}

// 启动异步子进程 安装依赖
function install(useYarn, dependencies, verbose, isOnline) {
  return new Promise((resolve, reject) => {
    let command, args;
    if (useYarn) {
      command = 'yarnpkg';
      args = ['add', '--exact'];
      // 如果没有网 给出提示 从缓存安装
      if(!isOnline) {
        args.push('--offline');
        console.log(chalk.yellow('you apper to be offline'));
        console.log(chalk.yellow('Falling back to local yarn cache'));
        console.log();
      }
      args.push(dependencies);
    } else {
      command = 'npm';
      // --save-exact 会安装确切版本
      args = ['install', '--save', '--save-exact'].concat(dependencies);
    }
    // 创建异步进程
    const child = spawn(command, args, { stdio: 'inherit'});
    child.on('close', code => {
      if(code !== 0) {
        reject({
          command: `${command} ${args.join(' ')}`
        });
        return;
      }
      resolve();
    });
  });
}

// 获得安装依赖名称
// function getInstallPackage(options) {
//   return config(options);
// }

// 检查是否联网
function checkIfOnline(useYarn) {
  // 不适用 yarn 安装 直接返回 true npm 安装自己有报错机制
  if(!useYarn) {
    return Promise.resolve(true);
  }
  return new Promise(resolve => {
    dns.lookup('registry.npm.taobao.org', err => {
      if(err != null && process.env.https_proxy) {
        // 设置代理的情况
        dns.lookup(url.parse(process.env.https_proxy).hostname, proxyErr => {
          resolve(proxyErr == null);
        });
      } else {
        resolve(err == null);
      }
    });
  });
}

// 是否能安全创建工程
function isSafeToCreateProject(root, name) {
  const validateFiles = [
    '.DS_Store',
    '.git',
    '.gitignore',
    '.idea',
    'README.md',
    'Thumbs.db',
    'LICENSE',
  ];
  const conflicts = fs
    .readdirSync(root)
    .filter(file => !validateFiles.includes(file));
  if(conflicts.length < 1) {
    return true;
  }
  // 给一些建议为什么不能在包含这些文件目录下 创建文件
  console.log(`The directory ${chalk.blue(name)} contains file could conflict`);
  return false;
}

// 打印输出 出错信息 results 是一个数组
function printValidationResults(results) {
  if(typeof results !== 'undefined') {
    results.forEach(error => {
      console.error(chalk.red(`${error}`));
    });
  }
}

// 是否能使用 App 名字作为 npm 包名
function checkAppName(appName) {
  const validationResult = validateProjectName(appName);
  if(!validationResult.validForNewPackages) {
    console.error(`Could not create ${chalk.blue(`"${appName}"`)} because of npm naming restrictions`);
    printValidationResults(validationResult.errors);
    printValidationResults(validationResult.warnings);
    process.exit(1);
  }
}
// 检查 npm 版本
function checkNpmVersion() {
  let min = false;
  let npmVersion = null;
  try {
    npmVersion = execSync('npm --version')
      .toString()
      .trim();
    min = semver.gte(npmVersion, '3.0.0');
  } catch(e) {
    // ignore
  }
  return {
    min: min,
    npmVersion: npmVersion
  }
}

// 检查 node 版本
function checkNodeVersion(packageName) {
  const packageJsonPath = path.resolve(
    process.cwd(),
    'node_modules',
    packageName,
    'package.json',
  );
  const packageJson = require(packageJsonPath);
  if(!packageJson.engines || !packageJsonPath.engines.node) {
    return;
  }
  if(!semver.satisfies(process.version, packageJson.engines.node)) {
    console.error(chalk.red('You are running Node %s , init project need higher node version'), process.version);
    process.exit(1); // 退出进程
  }
}


// 获取暂时目录
function getTemporaryDirectory() {
  return new Promise((resolve, reject) => {
    tmp.dir({unsafeCleanup: true}, (err, tmpdir, callback) => {
      if(err) {
        reject(err);
      } else {
        resolve({tmpdir: tmpdir, cleanup: () => {
          try {
            callback();
          } catch (e) {
            console.log(e)
          }}
        });
      }
    });
  });
}

// 获取包名
function getPackageName(installPackage) {
  if(installPackage.indexOf('.tgz') > -1) {
    return getTemporaryDirectory()
      .then(obj => {
        let stream;
        if(/^http/.test(installPackage)) {
          stream = hyperquest(installPackage);
        } else {
          stream = fs.createReadStream(installPackage);
        }
        return extractStream(stream, obj.tmpdir).then(() => obj)
      })
      .then(obj => {
        const packageName = require(path.join(obj.tmpdir, 'package.json')).name;
        obj.cleanup();
        return packageName;
      })
      .catch(err => {
        console.log(`Could not extract the package from the archive: ${err.message}`)
        const assumeProjectName = installPackage.match(/^.+\/(.+?)(?:-\d+.+)?\.tgz$/)[1];
        return Promise.resolve(assumeProjectName);
      });
  } else if(installPackage.indexOf('git+') === 0) {
    // pull package name out of git urls
    // git+https://github.com/company/test.git
    return Promise.resolve(installPackage.match(/([^/]+)\.git(#.*)?$/[1]));
  } else if(installPackage.match(/.+@/)) {
    return Promise.resolve(installPackage);
  }
}

// 运行函数
function run(root, appName, version, verbose, originalDir, template, useYarn) {
  const packageToInstall = getInstallPackage('react');
  console.log('Installing packages, This might take a couple of minutes');

}

module.exports = {
  checkAppName,
  checkNodeVersion,
  checkNpmVersion,
  checkIfOnline
}
