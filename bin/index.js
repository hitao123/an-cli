#!/usr/bin/env node
const commander = require("commander");
const packageJson = require("../package.json");

let projectName;
const program = new commander.Command(packageJson.name)
  .version(packageJson.version)
  // .usage("[options] <project name>")
  // .option("v, vue", "init vue spa project")
  // .option("r, react", "init react spa project")
  // .option("vs, vuessr", "init vue ssr project")
  // .option("rs, reactssr", "init react ssr project")
  // .option("need, needRequire", "是否需要按需加载")
  // .action(name => {
  //   projectName = name;
  // })


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

program.parse(process.argv);

// 提示信息
if(!program.args.length){
  program.help();
}
