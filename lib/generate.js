const path = require('path')
const chalk = require('chalk')
const Metalsmith = require('metalsmith')
const Handlebars = require('handlebars')
const render = require('consolidate').handlebars.render
const logger = require('./logger')
const ask = require('./ask');
const getOptions = require('./options')


// register handlebars helper

Handlebars.registerHelper('if_eq', function(a, b, opts) {
  return a === b
    ? opts.fn(this)
    : opts.inverse(this)
});

Handlebars.registerHelper('unless_eq', function(a, b, opts) {
  return a === b
    ? opts.fn(this)
    : opts.inverse(this)
});

/**
 * 给定一个 src dest 生成一个模板
 */
module.exports = function generate (name, src, dest, done) {

  const opts = getOptions(name, src);

  const metalsmith = Metalsmith(path.join(src, 'template'))
  const data = Object.assign(metalsmith.metadata(), {
    destDirName: name,
    inPlace: dest == process.cwd(),
    noEscape: false
  })

  // 注册的 helper
  opts.helpers && Object.keys(opts.helpers).map(key => {
    Handlebars.registerHelper(key, opts.helpers[key])
  })

  // 内置 console
  const helpers = { chalk, logger }


  // 使用插件
  // metalsmith.use(askQuestions)
  //   .use(renderTemplateFiles)


  metalsmith.clean(false)
    .source('.') // start from template root instead of `./src` which is Metalsmith's default for `source`
    .destination(dest)
    .build((err, files) => {
      done(err)
    })
}


function askQuestions(prompts) {
  return (files, metalsmith, done) => {
    ask(prompts, metalsmith.metadata(), done)
  }
}

function renderTemplateFiles() {
  return (files, metalsmith, done) => {
    // render()
  }
}
