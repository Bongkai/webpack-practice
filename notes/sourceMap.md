# Source Map 调试

通过开启 Source Map 可以对 webpack 打包编译前后的代码进行定位映射，可以方便开发时快速找到目标代码的具体文件和具体行数等信息。

## JS Source Map

在 webpack 中对 devtool 参数进行配置即可：

```js
// webpack.config.js

module.exports = {
  entry: { /* ...... */ },
  output: { /* ...... */ },
  devServer: { /* ...... */ },

  // 与四大核心配置项同级
  devtool: 'eval',    // 或者其他值

  module: { /* ...... */ },
  plugins: [ /* ...... */ ],
}
```

### devtool 的值
Development 环境下主要有4种值：
* eval
* eval-source-map
* cheap-eval-source-map
* cheap-module-eval-source-map（推荐）

Production 环境下主要有3种值：
* source-map（推荐）
* hidden-source-map
* nosource-source-map

如果 webpack 中有使用 uglifyJs 的话，要把里面的 sourcemap 设置打开。

## CSS Source Map

在 webpack 中对 CSS 相关的 loader 配置 sourceMap 即可：

```js
// webpack.config.js

module.exports = {
  entry: { /* ...... */ },
  output: { /* ...... */ },
  devServer: { /* ...... */ },
  devtool: 'eval',    // 或者其他值

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              sourceMap: true,

              // singleton: true
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

      /* 其他 loaders */
  },

  plugins: [ /* ...... */ ],
}
```

**注**：style-loader 的 singleton 为 true 时不能开启 CSS Source Map

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
              // singleton 设为 true 时不能开启 CSS Source Map
              // singleton: true,
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
          // 不设置 useRelativePath 的写法
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
  ],
};
```