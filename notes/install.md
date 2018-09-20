# 安装使用

## 安装

想要全局执行 webpack 命令：
```shell
# 全局安装 webpack 3.x
npm i webpack@3.10.0 -g

# 全局安装 webpack 4.x
npm i webpack webpack-cli -g
```

## 常用命令行

```shell
# 查看版本
webpack --version

# 查看帮助
webpack --help

# 执行打包（配置文件默认为 webpack.config.js）
webpack

# 执行打包（自定义配置文件名）
webpack --config `customFilename`
```

## 在项目中使用 Webpack

如果想统一版本或者想在项目中引入 webpack 对象：
```shell
# 如果是新建项目，要先创建 package.json
npm init

# 安装作为项目依赖的 webpack
npm i webpack@3.10.0 -D
# 或者 v4.x
npm i webpack webpack-cli -D
```

然后就可以在配置文件中引入：
```js
// webpack.config.js

const webpack = require('webpack');

module.exports = {
  // ......
};
```
