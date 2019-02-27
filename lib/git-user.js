const exec = require('child_process').execSync;

module.exports = () => {
  let name
  let email

  try {
    name = exec('git config --get user.name');
    email = exec('git config --get user.email');
  } catch (error) {}
  // 去除空格换行
  name = name && JSON.stringify(name.toString().trim()).slice(1, -1)
  email = email && (' <' + email.toString().trim() + '>')
  return (name || '') + (email || '')
}
