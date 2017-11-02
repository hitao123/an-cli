module.exports =  {
  //路径定义
  path: '/',
  //获取模块回调
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      //获取模块
      let Module = require('../pages/index');
      cb(null, Module.default)
    })
  }
}
