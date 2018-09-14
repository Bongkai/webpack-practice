## 编译 ES6

* 安装并配置 babel：
```
$ npm i babel-loader babel-core -D

// 最新版（下同，名称变动为：babel-xxx 改为 @babel/xxx）
$ npm i @babel/loader @babel/core -D
```

* 安装并配置 ES6 编译插件：
```
$ npm i babel-preset-env -D
```

* 配置代码：（关于 targets 的配置详情可查看 [browserslist](https://www.npmjs.com/package/browserslist)）
```
// webpack.conf.js 代码

module.exports = {
  ...,
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader'
        },
        exclude: '/node_modules/'
      }
    ]
  },
  ...
};
```

```
// .babelrc 代码

{
  "presets": [
    ["@babel/preset-env", {
      "targets": {
        "browsers": ["last 2 versions"]
      }
    }]
  ]
}
```

* 其他可用插件：
```
// 全局 polyfill 插件：（多用于应用开发）
$ npm i babel-polyfill -S

// 局部 polyfill 插件：（多用于框架开发）
$ npm i babel-runtime -S
$ npm i babel-plugin-transform-runtime -D
```