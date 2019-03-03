const inquirer = require('inquirer')
const async = require('async')
const getGit = require('./git-user')



module.exports = function ask() {
  prompt()
}


function prompt() {
  inquirer
    .prompt([
      /* Pass your questions in here */
    ])
    .then(answers => {
      // Use user feedback for... whatever!!
    });
}

