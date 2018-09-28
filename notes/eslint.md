# 配置 ESLint

设置 ESLint 的规则可以帮我们检查代码格式，在开发时统一编写规范。

```shell
$ npm i eslint eslint-loader eslint-plugin-html -D
$ npm i eslint-friendly-formatter -D
```

## ESLint 的使用

（1） 在处理 js 的 rule 中使用 eslint-loader
（2） 编写 .eslintrc.js 或 设置 package.json 中的 eslintConfig

选择一种规范，如 JavaScript Standard Style (https://standardjs.com)

```shell
$ npm i eslint-config-standard -D
$ npm i eslint-plugin-standard eslint-plugin-promise -D
$ npm i eslint-plugin-import eslint-plugin-node -D
```

还有其他规范可搜索 eslint-config-xxx。

eslint-loader.options：
* failOnWarning
* failOnError
* formatter
* outputReport

**Tips**：设置 devServer.overlay 为 true 来使 eslint 的报错提示显示在页面上，方便调试。

## 示例代码

```js
// webpack.config.js

const Webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const PurifyCSS = require('purifycss-webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const path = require('path');
const glob = require('glob-all');

module.exports = {
  entry: {
    app: './src/app.js'
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'js/[name]_[hash:8].bundle.js',
    chunkFilename: '[name].chunk.js'
  },

  devServer: {
    port: 9001,
    hot: true,
    hotOnly: true,
    overlay: true,
    proxy: {
      '/': {
        target: 'https://m.weibo.cn',
        changeOrigin: true,
        logLevel: 'debug',
        pathRewrite: {
          '^/comments': '/api/comments'
        }
      }
    },
    historyApiFallback: {
      rewrites: [
        {
          // from: '/pages/a',
          from: /^\/([a-zA-Z0-9]+\/?)([a-zA-Z0-9]+)/,
          // to: '/pages/a.html',
          to: function(context) {
            return '/' + context.match[1] + context.match[2] + '.html';
          }
        }
      ]
    }
  },

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(jpg|png|jpeg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash:8].[ext]',
              outputPath: 'assets/imgs/',
              // publicPath: '../assets/imgs/',
              // useRelativePath: true,
            }
          },
          {
            loader: 'img-loader',
            options: {
              pngquant: {
                quality: 60
              }
            }
          }
        ]
      },
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, 'src')],
        exclude: [path.resolve(__dirname, 'src/libs')],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/env'],  // ['env']
              plugins: ['lodash']
            }
          },
          // eslint-loader 必须放在 babel-loader 的后面
          {
            loader: 'eslint-loader',
            options: {
              formatter: require('eslint-friendly-formatter')
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              attrs: ['img:src']
            }
          }
        ]
      },
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html',
      minify: {
        collapseWhitespace: true
      }
    }),

    new PurifyCSS({
      paths: glob.sync([
        path.join(__dirname, './*.html'),
        path.join(__dirname, './src/*.js')
      ])
    }),

    // new Webpack.optimize.UglifyJsPlugin(),

    new CleanWebpackPlugin(['dist']),

    new Webpack.HotModuleReplacementPlugin(),

    new Webpack.NamedModulesPlugin(),

    // new Webpack.ProvidePlugin({
    //   $: 'jquery'
    // }),
  ],
};
```

```js
// .eslintrc.js

module.exports = {
  root: true,
  extends: 'standard',
  plugins: [
    'html'
  ],
  env: {
    browser: true
  },
  // 对 jQuery 等一些全局变量的配置
  // globals: {
  //   $: true
  // },
  rules: {
    'semi': [0],
    'react/jsx-filename-extension': [0],
    'react/jsx-one-expression-per-line': [0],
    'arrow-spacing': [0],
    'keyword-spacing': [0],
    'import/extensions': [0],
    'padded-blocks': [0],
    'jsx-quotes': [0],
    'no-unused-expressions': [0],
    'react/destructuring-assignment': [0],
    'space-before-function-paren': [0],
    'no-unused-vars': [0]
  }
};
```