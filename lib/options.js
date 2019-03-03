const path = require('path')
const metadata = require('read-metadata')
const exists = require('fs').existsSync
const getGitUser = require('./git-user')
const validateName = require('validate-npm-package-name')


module.exports = function options (name, src) {

  const opts = getMetaData(dir)

  setDefault(opts, 'name', name)
  const its = validateName(name) // 验证 project name 是否符合 npm package 规范
  if (!its.validForNewPackages) {
    const errors = (its.errors || []).concat(its.warnings || [])
    return 'Sorry, ' + errors.join(' and ') + '.'
  }

  const author = getGitUser()
  if (author) {
    setDefault(opts, 'author', author)
  }

  return opts;
}
/**
 * 获取 meta.js 或者 meta.json 数据
 * @param {*} dir
 */
function getMetaData(dir) {
  const json = path.join(dir, 'meta.json');
  const js = path.join(dir, 'meta.js')

  let opts = {}

  if (exists(json)) {
    opts = metadata.sync(json)
  } else if (exists(js)) {
    const req = require(path.resolve(js))
    if (req !== Object(req)) {
      throw new Error('meta.js need to be exposed to a object')
    }
    opts = req;
  }

  return opts
}
/**
 * 设置 prompts 默认值
 * @param {*} opts
 * @param {*} key
 * @param {*} val
 */
function setDefault(opts, key, val) {
  const prompts = opts.prompts || (opts.prompts = {})

  prompts[key]['default'] = val
}
