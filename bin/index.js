#!/usr/bin/env node

const commander = require("commander");
const chalk = require("chalk");
const figlet = require("figlet");
const packageJson = require("../package.json");
const utils = require("../lib/utils");

let projectName;
const program = new commander.Command(packageJson.name)
  .version(packageJson.version)


program
  .command("vue")
  .description("init vue spa project")
  .alias("v")
  .action((name) => {
    require("../command/vue")(name);
  });

program
  .command("react")
  .description("init react spa project")
  .alias("r")
  .action((name) => {
    require("../command/react")(name);
  });

program
  .command("vssr")
  .description("init vue ssr project")
  .alias("vs")
  .action(() => {
    require("../command/vuessr")();
  });

program
  .command("rssr")
  .description("init react ssr project")
  .alias("rs")
  .action(() => {
    require("../command/reactssr")();
  });

program
  .command('ver')
  .action(() => {
    // utils.clear();
    console.log(chalk.yellow(figlet.textSync('AN CLI', {horizontalLayout: 'full'})));
  });

program.parse(process.argv);

// 提示信息
if(!program.args.length){
  program.help();
}
