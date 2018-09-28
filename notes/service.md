# 搭建本地 web 服务器

在真实的项目中，项目代码往往是运行在线上 web 服务器中，所以需要在本地搭建一个开发环境，即搭建一个本地 web 服务器，这样可以使开发中的代码运行环境与线上环境相似，方便开发调试。

在线上环境和开发环境中，请求借口或者访问本地资源，都是以发送 http 请求去获取的；而直接打开 dist 目录中的 index.html 来运行代码，则不是通过 http 请求去访问的。

**Tips**：每次打包时自动删除之前的打包文件：
```shell
$ npm i clean-webpack-plugin -D
```

```js
  // 在 plugins 中添加
  new CleanWebpackPlugin(['dist'])
```

## Webpack Dev Server

devServer 是 webpack 官方提供的开发服务器，集成了非常多的功能：

```shell
$ npm i webpack-dev-server -D
```

### devServer 的使用：

```js
// webpack.config.js

module.exports = {
  entry: { /* ...... */ },
  output: { /* ...... */ },

  // 与四大核心配置项同级
  devServer: {
    /* 配置项 */
  },

  module: { /* ...... */ },
  plugins: [ /* ...... */ ],
};
```

```js
// package.json

{
  "scripts": {
    "start": "webpack-dev-server --open"
  },
}
```

然后在命令行启动服务器：

```shell
$ npm start

# 不配置 package.json 的命令行写法
$ node_modules/.bin/webpack-dev-server --open
```

### devServer 的功能特点：
* live reloading：自动触发浏览器的刷新
* 不能打包文件：devServer 打包的文件是存在 webpack 运行的内存中，不是在开发目录里
* 路径重定向：可在 historyApiFallback 里设置重定向的规则
* https
* 在浏览器中显示编译错误
* 接口代理
* 模块热更新

### devServer 的 options：
* inline：默认为 true，设为 false 可在页面顶端显示打包状态
* contentBase
* port：指定服务器运行的端口
* historyApiFallback：避免访问一个不存在的路径时导致 404。设为 true 可重定向到 index.html；也可以在 rewrites 参数中自定义路径重定向的规则
* https
* proxy：代理远程接口请求，解决开发中的跨域问题
* hot：默认为 false，热更新需要设为 true
* hotOnly
* openpage
* lazy
* overlay：默认为 false，设为 true 可在打包后的页面上添加一个显示编译错误提示的遮罩层

## 代理远程接口请求

```shell
$ npm i http-proxy-middleware -D
```

### devServer.proxy 的 options：
* target：指定访问某个路径的时候代理的地址指向
* changeOrigin：默认为 false，设为 true 可以改变源到 url 上
* headers：给代理的请求添加请求头（添加 Cookie，或自定义 UA 仿造特定浏览器发送的请求等）
* logLevel：设为 'debug' 可在浏览器或命令行工具中显示代理的信息
* pathRewrite：可以把高频使用的很长的 url 地址简写成指定形式

historyApiFallback 和 proxy 示例代码：
```js
// webpack.config.js

module.exports = {
  entry: { /* ...... */ },
  output: { /* ...... */ },

  devServer: {
    port: 9001,
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

  module: { /* ...... */ },
  plugins: { /* ...... */ },
}
```

```js
// app.js

// 想请求的 API：
// 'https://m.weibo.cn/api/comments/show?id=4193586758833502&page=1'

// 不设置 proxy 的 target 和 pathRewrite
// const api = 'https://m.weibo.cn/api/comments/show?id=4193586758833502&page=1';

// 设置了 proxy 的 target
// const api = '/api/comments/show?id=4193586758833502&page=1';

// 设置了 proxy 的 target 和 pathRewrite
const api = '/comments/show?id=4193586758833502&page=1';

fetch(api).then(res=> {
  return res.json();
}).then(resJson=> {
  console.log(resJson);
});
```

## 模块热更新

热更新的优势：
* 保持应用的数据状态（不会刷新页面）
* 节省调试时间
* 样式调试更快

热更新的配置：
1. devServer.hot 设为 true
2. devServer.hotOnly 设为 true
3. plugins 中添加 new webpack.HotModuleReplacementPlugin()
4. plugins 中添加 new webpack.NamedModulesPlugin()
5. 如果没有使用 React 或 Vue 等框架，则需自己编写热更新的代码：
```js
// app.js

/* 其他 js 代码 */

// 热更新代码
if(module.hot) {
  module.hot.accept();
}
```

热更新的注意项：
1. HMR 时不能使用 ExtractTextWebpackPlugin，否则 CSS 的修改不能触发热更新
2. devServer.hotOnly 设为 true 时才能进行 js 的热更新，否则 js 的修改会直接刷新页面
3. HTML 的变动无法触发热更新

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

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              singleton: true
            }
          },
          {
            loader: 'css-loader'
          }
        ]
      },
      // HMR 时不能使用 ExtractTextWebpackPlugin，否则 CSS 的修改不能触发热更新
      // {
      //   test: /\.css$/,
      //   use: ExtractTextWebpackPlugin.extract({
      //     // 当不提取时使用下列方法来处理 CSS
      //     fallback: {
      //       loader: 'style-loader',
      //       options: {
      //         singleton: true
      //       }
      //     },
      //     // 如果提取成单独文件的话还需要使用下列方法去处理
      //     use: [
      //       {
      //         loader: 'css-loader'
      //       }
      //     ]
      //   })
      // },
      {
        test: /\.(jpg|png|jpeg|gif)$/,
        use: [
          // {
          //   loader: 'file-loader',
          //   options: {
          //     name: '[name]_[hash:8].[ext]',
          //     // outputPath: 'assets/imgs/',
          //     publicPath: '../assets/imgs/',
          //     useRelativePath: true,
          //   }
          // },

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

```js
// app.js

import base from './css/base.css';
import common from './css/common.css';
import { componentA } from './components/a.js';

const app = document.getElementById('app');
// const div = document.createElement('div');
let list = componentA();
// div.className = 'box1';
// app.appendChild(div);
app.appendChild(list);

import { a } from './common/util.js';
console.log(a());

// const api = 'https://m.weibo.cn/api/comments/show?id=4193586758833502&page=1';
// const api = '/api/comments/show?id=4193586758833502&page=1';
const api = '/comments/show?id=4193586758833502&page=1';

fetch(api).then(res=> {
  return res.json();
}).then(resJson=> {
  console.log(resJson);
});

// renderA();

if(module.hot) {
  // module.hot.accept();
  
  module.hot.accept('./components/a.js', function() {
    app.removeChild(list);

    const compA = require('./components/a.js').componentA;
    let newList = compA();

    app.appendChild(newList);
    list = newList;
  });
}

```