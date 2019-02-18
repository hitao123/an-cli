# 脚手架

## 功能介绍

> 通过脚手架命令 `an-cli <template-name> [project-name]` 可以生成 vue react 不同的项目模板，免去你在开发应用的时候建目录的烦恼，这之前你也许更需要 react 官方脚手架[create-react-app](https://github.com/facebook/create-react-app) vue 官方脚手架 [vue-cli](https://github.com/vuejs/vue-cli) 你自己也可以写模板，通过脚手架来帮你一键生成你想要的模板

## 安装

```bash
  $ npm i -g an-cli
```

## 用法

```bash
  $ an-cli init <template-name> [project-name]

  # an-cli vue <project-name>
  # an-cli react <project-name>
  # an-cli vue-ssr <project-name>
  # an-cli react-ssr <project-name>

```

## 例子

```bash
  an-cli init vue vue-demo
```

上面的例子从 [rvs-template/vue](https://github.com/rvs-template/vue.git), 提示输入一些信息，生成项目到 `./vue-demo`

## 常用模板

当前可用的有

- [vue](https://github.com/rvs-template/vue.git) - vue spa 项目模板
- [vue-ssr](https://github.com/rvs-template/vue-ssr.git) - vue ssr 项目模板
- [react](https://github.com/rvs-template/react.git) - react 项目模板
- [react-ssr](https://github.com/rvs-template/react-ssr.git) - react ssr 模板

## 定制模板

上面几种模板不一定会满足日常的业务需求，你也可以定制自己的模板，通过脚手架命令也能实现初始化项目的功能

```bash
  $ an-cli username/repo my-project
```

`username/repo` 这个会传递给 ([download-git-repo](https://github.com/flipxfx/download-git-repo)), 你也可以使用 gitlab, 具体用法可以查阅 `download-git-repo` api

## 从头开始写定制模板

- 模板 repo 必须有一个 `template` 目录包裹着模板
- 模板 repo 必须拥有一个 `meta.js` 或者 `meta.json` 包含以下字段的文件

```js
  - `prompts`: 用来收集用户可选字段

  - `filters`: 用来条件过滤文件去渲染
  
  - `metalsmith`: 用来定制链路 metalsmith 插件

  - `completeMessage`: 用来展示当模板已经生成以后， 消息展示

  - `complete`: Instead of using `completeMessage`, you can use a function to run stuffs when the template has been generated.
```

### prompts

`prompts` 字段在 meta 文件对于用户来说必须包含询问的对象， 详细用法见 [Inquirer.js question object](https://github.com/SBoudrias/Inquirer.js/#question)，例子

```js
{
  "prompts": {
    "name": {
      "type": "string",
      "required": true,
      "message": "Project name"
    }
  }
}
```

在所有的询问完成之后，所有在 template 目录的模板文件将通过 [Handlebars](http://handlebarsjs.com/) 来进行渲染

### 条件询问

```js
{
  "prompts": {
    "lint": {
      "type": "confirm",
      "message": "Use a linter?"
    },
    "lintConfig": {
      "when": "lint",
      "type": "list",
      "message": "Pick a lint config",
      "choices": [
        "standard",
        "airbnb",
        "none"
      ]
    }
  }
}
```

### 预注册 Handlebars Helpers

`if_eq` 和 `unless_eq` 是预注册两个通用的 Handlebars helpers:

``` handlebars
{{#if_eq lintConfig "airbnb"}};{{/if_eq}}
```

### metalsmith

`an-cli` 使用 [metalsmith](https://github.com/segmentio/metalsmith) 来生成项目
