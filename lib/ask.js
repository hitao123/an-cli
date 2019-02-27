const inquirer = require('inquirer')
const getGit = require('./git-user')

inquirer
  .prompt([
    /* Pass your questions in here */
  ])
  .then(answers => {
    // Use user feedback for... whatever!!
  });

  // console.log(getGit())
