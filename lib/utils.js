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
const unpack = require("tar-pack").unpack; // 解压打包相关

/**
 * 创建 APP 模板的通用方法
 * @param {any} name 名称
 * @param {any} template 模板路径
 * @param {any} configPath package.json 模板路径
 */
function createAppTemplate(name, template, configName, callback) {
  // 转换为绝对路径 1. test ---> /Users/admin/an-cli/test 2. /test/a ---> /test/a
  // https://nodejs.org/dist/latest-v8.x/docs/api/path.html#path_path_resolve_paths
  const root = path.resolve(name);
  console.log();
  const appPath = path.join(__dirname, '../template/react');
  // 有可能是路径,取最后一个 /usr/local/test 取 test
  const appName = path.basename(root);
  // 包名必须满足 npm 包名规范
  checkAppName(appName);
  // 确保存在该路径
  fs.ensureDirSync(root);
  // 如果目录存在一些隐藏文件，不能创建目录
  if(!isSafeToCreateProject(root, name)) {
    process.exit(1);
  }
  // 输出信息
  console.log(`Create a new app in ${chalk.blue(root)}`);
  console.log();

  // 在工程根目录下创建 package.json 文件
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../config/', configName), 'utf8'));
  packageJson.name = appName;
  // Writes an object to a JSON file.
  // fs.writeJSONSync() 写入文件, 好多转义字符串
  fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify(packageJson, null, 2));
  // 复制模板文件
  try {
    fs.copySync(appPath, appName);
    console.log(chalk.blue(`create ${appName} project in ${root} success!`));
  } catch (err) {
    console.error(err)
  }
  // 如果没有网 给出提示
  checkIfOnline()
    .then(isOnline =>({
      isOnline: isOnline
    }))
    .then(data => {
      const isOnline = data.isOnline;
      // 优先使用 yarn 安装
      const command = isSupportYarn() ? 'yarn' : 'npm';
      const args = ['install', '--save', '--save-exact'];
      // 安装命令
      if(isOnline) {
        console.log('Installing packages, This might take a couple of minutes.......');
        console.log();
      } else {
        args.push('--offline');
        console.log(chalk.yellow('you apper to be offline'));
        console.log(chalk.yellow(`Falling back to local ${command} cache`));
        console.log();
        // 没有网络 直接退出安装 执行回调
        process.exit(1);
      }
      // 切换到 目标目录安装
      const originDir = process.cwd();
      try {
        process.chdir(root);
      } catch (err) {
        console.error(`chdir: ${err}`);
      }
      const proc = spawn.sync(command, args, { stdio: 'inherit' });
      callback();
      if (proc.status !== 0) {
        console.error(`${command} failed`, proc);
        return;
      }
    })
    .catch(err => {
      console.log();
      console.log('Aborting installing');
      console.log('需要手动 npm install 或 yarn install');
      console.log(err);
    });
}
/**
 * @returns true 使用 Yarn 安装 依赖
 */
function isSupportYarn() {
  try {
    // 创建同步进程
    execSync('yarnpkg --version', { stdio: 'ignore'})
    return true;
  } catch(e) {
    return false;
  }
}
/**
 * 检查是否联网
 * @returns
 */
function checkIfOnline() {
  return new Promise(resolve => {
    dns.lookup('registry.npm.taobao.org', err => {
      if(err != null) {
        resolve(true)
      } else {
        resolve(err == null);
      }
    });
  });
}
/**
 * 是否能安全创建工程
 * @param {*} root
 * @param {*} name
 */
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
  // 返回数组 当前目录
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
/**
 * 打印输出 出错信息 results 是一个数组
 * @param {any} results
 */
function printValidationResults(results) {
  if(typeof results !== 'undefined') {
    results.forEach(error => {
      console.error(chalk.red(`${error}`));
    });
  }
}
/**
 * 是否能使用 App 名字作为 npm 包名
 * @param {any} appName
 */
function checkAppName(appName) {
  const validationResult = validateProjectName(appName);
  if(!validationResult.validForNewPackages) {
    console.error(`Could not create ${chalk.blue(`"${appName}"`)} because of npm naming restrictions`);
    printValidationResults(validationResult.errors);
    printValidationResults(validationResult.warnings);
    process.exit(1);
  }
}
/**
 * 检查 npm 版本 大于 3.0.0 返回 true
 * @returns
 */
function checkNpmVersion() {
  let hasMinNpm = false;
  let npmVersion = null;
  try {
    npmVersion = execSync('npm --version')
      .toString()
      .trim();
    hasMinNpm = semver.gte(npmVersion, '3.0.0');
  } catch(e) {
    // ignore
  }
  return {
    hasMinNpm: hasMinNpm,
    npmVersion: npmVersion
  }
}
/**
 * @param {any} packageName 检查 node 版本
 * @returns
 */
function checkNodeVersion(packageName) {
  const packageJsonPath = path.resolve(
    process.cwd(),
    'node_modules',
    packageName,
    'package.json'
  );
  const packageJson = require(packageJsonPath);
  if(!packageJson.engines || !packageJsonPath.engines.node) {
    return;
  }
  if(!semver.satisfies(process.version, packageJson.engines.node)) {
    console.error(chalk.red('You are running Node %s , init project need higher node version'), process.version);
    process.exit(1);
  }
}
/**
 *
 * 清除屏幕
 */
function clear() {
  process.stdout.write('\x1bc');
  // process.stdout.write('\033[2J');
  // process.stdout.write("\x1B[2J");
}

module.exports = {
  checkAppName,
  checkNodeVersion,
  checkNpmVersion,
  checkIfOnline,
  createAppTemplate,
  clear
}
