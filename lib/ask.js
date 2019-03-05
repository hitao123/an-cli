const inquirer = require('inquirer')
const async = require('async')

// Support types from prompt-for which was used before
const promptMapping = {
  string: 'input',
  boolean: 'confirm'
}

/**
 *
 * @param {*} prompts
 * @param {*} data
 * @param {*} done
 */
module.exports = function ask(prompts, data, done) {
  async.eachSeries(Object.keys(prompts), (key, next) => {
    prompt(data, key, prompts[key], next)
  }, done)
}

/**
 *
 * @param {*} data
 * @param {*} key
 * @param {*} prompt
 * @param {*} done
 */
function prompt(data, key, prompt, done) {
  if (prompt.when) {
    return done
  }

  let promptDefault = prompt.default

  inquirer
    .prompt([{
      type: promptMapping[prompt.type] || prompt.type,
      name: key,
      message: prompt.message || prompt.label || key,
      default: promptDefault,
      choices: prompt.choices || [],
      validate: prompt.validate || (() => true)
    }])
    .then(answers => {
      if (Array.isArray(answers[key])) {
        data[key] = {}
        answers[key].forEach(multiChoiceAnswer => {
          data[key][multiChoiceAnswer] = true
        })
      } else if (typeof answers[key] === 'string') {
        data[key] = answers[key].replace(/"/g, '\\"')
      } else {
        data[key] = answers[key]
      }
      done()
    }).catch(done)
}

