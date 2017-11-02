module.exports = {
  extends: ["eslint-config-alloy/react"],
  globals: {
    React: false,
    ReactDOM: false
  },
  rules: {
    // 这里可以覆盖 eslint-config-alloy eslint 基础配置
    // @fixable 一个缩进必须用2个空格替代
    indent: [
      "error",
      2,
      {
        SwitchCase: 1,
        flatTernaryExpressions: true
      }
    ],
    // @fixable jsx 的 children 缩进必须为两个空格
    "react/jsx-indent": ["error", 2],
    // @fixable jsx 的 props 缩进必须为两个空格
    "react/jsx-indent-props": ["error", 2],
    // 禁止变量申明时用逗号一次申明多个 @off
    "one-var": 'off',
    // @fixable 变量申明必须每行一个 @ff
    "one-var-declaration-per-line": 'off'
  }
};
