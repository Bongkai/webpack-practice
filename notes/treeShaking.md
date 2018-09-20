# 摇树优化（Tree Shaking）

可以使用 Tree Shaking 功能在打包时把未使用的代码移除掉，减少打包后的代码体积。

该操作分两部分：
1. JS Tree Shaking
2. CSS Tree Shaking

使用场景：
* 常规优化
* 引入第三方库的某一个功能（例如 Lodash 等）

## JS 的 Tree Shaking 操作

webpack 在打包时会自动帮我们把代码标示为 **已使用的** 和 **未使用的**，然后可以通过 webpack 内置的 Webpack.optimize.UglifyJsPlugin 这个 plugin 来压缩并移除未使用的代码：

```js
{
  // ... ,
  plugins: [
    // ... ,
    new Webpack.optimize.UglifyJsPlugin()
  ]
}
```

**注**：某些第三方库如 Lodash 并不能直接通过 Tree Shaking 进行多余代码的移除，需要安装插件来解决：

```shell
npm i babel-plugin-lodash -D    # 记得安装 babel 核心插件
```

## CSS 的 Tree Shaking 操作

可以使用 PurifyCSS 插件来移除多余的 CSS 代码。<br/>

```shell
npm i purifycss-webpack -D
```

PurifyCSS 的 options:
* paths：针对指定路径上的 CSS 文件做 Tree Shaking 操作

使用 glob-all 插件的 sync() 能同时加载多个路径的 CSS 文件：

```shell
npm i glob-all -D
```

<br/>

## 示例代码

```js
// webpack.config.js

const Webpack = require('webpack');
const path = require('path');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const PurifyCSS = require('purifycss-webpack');
const glob = require('glob-all');

module.exports = {
  entry: {
    app: './src/app.js'
  },

  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: './dist/',
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js'
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextWebpackPlugin.extract({
          // 当不提取时使用下列方法来处理 CSS
          fallback: {
            loader: 'style-loader',
            options: {
              singleton: true
            }
          },
          // 如果提取成单独文件的话还需要使用下列方法去处理
          use: [
            {
              loader: 'css-loader',
              
              // PurifyCSS 不能直接和 CSS Modules 一起使用，需要设置白名单来解决
              
              // options: {
              //   minimize: true,
              //   modules: true,
              //   localIdentName: '[path][name]_[local]_[hash:base64:5]'
              // }
            }
          ]
        })
      },
      // 实现对 Lodash 的 Tree Shaking 操作
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/env'],  // ['env']
              plugins: ['lodash']
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new ExtractTextWebpackPlugin({
      filename: '[name].min.css'
    }),
    // PurifyCSS 必须放在 ExtractTextWebpackPlugin 的后面
    new PurifyCSS({
      paths: glob.sync([
        path.join(__dirname, './*.html'),
        path.join(__dirname, './src/*.js')
      ])
    }),
    new Webpack.optimize.UglifyJsPlugin()
  ]
};
```