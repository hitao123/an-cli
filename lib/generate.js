const path = require('path')
const chalk = require('chalk')
const Metalsmith = require('metalsmith')
const Handlebars = require('handlebars')
const render = require('consolidate').handlebars.render


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

module.exports = function generate (name, src, dest, done) {
  const metalsmith = Metalsmith(path.join(src, 'template'))
  metalsmith.clean(false)
    .source('.') // start from template root instead of `./src` which is Metalsmith's default for `source`
    .destination(dest)
    .build((err, files) => {
      done(err)
    })
}
