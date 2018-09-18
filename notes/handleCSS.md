# 处理 CSS

## 在 js 中导入 CSS 并应用

在原始的代码架构中，CSS 是用 link 标签在 html 页面中插入；
而在模块化开发中，CSS 通常是在各模块中分开书写，然后在各自的 js 代码中导入。<br/>
所以打包时，需要使用 css-loader 和 style-loader 将 css 代码导入 js 文件并应用。

```shell
$ npm i style-loader css-loader -D
```

### 1. style-loader：在页面中创建一个 style 标签，将导入的 CSS 代码插入到指定位置

(1) style-loader 的 options：
* insertAt（插入位置）
* insertInto（插入到指定的 DOM 中，传入值为 DOM 节点）
* singleton（是否只使用一个 style 标签，传入值为 true 或 false）
* transform（转化，在浏览器环境下，插入页面前执行，传入值为 CSS 转化函数的位置）

(2) style-loader 还有两个小功能：style-loader/url（不常用） 和 style-loader/useable

<br/>

示例代码：

```js
// webpack.config.js

const path = require('path');

module.exports = {
  entry: {
    app: './src/app.js'
  },

  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: './dist/',
    filename: '[name].bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // 这里 loader 的顺序要注意，处理顺序为从后往前
          {
            loader: 'style-loader',
            options: {
              insertInto: '#app',
              singleton: true,
              transform: './css.transform.js'
            }
          },
          {
            loader: 'css-loader'
          }
        ]
      }
    ]
  }
};
```

```js
// css.transform.js（转化函数）

module.exports = function(css) {
  if(window.innerWidth <= 768) {
    return css;
  } else {
    return css.replace('green', 'blue');
  }
};
```

### 2. css-loader：使在 js 页面中能把 CSS 代码 import 进来

(1) css-loader 的 options：
* alias（解析的别名）
* importLoader（@import）
* minimize（是否压缩）
* modules（启用 css-modules）

(2) css-modules 常用语法：
* :local  给定一个局部的样式
* :global  给定一个全局的样式
* compose  继承一段样式
* compose ... from path  从路径为 path 的文件中引入某一个样式

<br/>

示例代码：
```css
/* base.css */

.box {
  composes: bigBox from './common.css';
  width: 200px;
  height: 200px;
  border-radius: 4px;
  background: #333;
}


/* common.css */

.bigBox {
  border: 2px solid #000;
}
```

```js
// webpack.config.js

module.exports = {
  entry: {
    app: './src/app.js'
  },

  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: './dist/',
    filename: '[name].bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              singleton: true,
              transform: './css.transform.js'
            }
          },
          {
            loader: 'css-loader',
            options: {
              minimize: true,
              modules: true,
              localIdentName: '[path][name]_[local]_[hash:base64:5]'
            }
          }
        ]
      }
    ]
  }
};
```

## 配置 Less / Sass

```shell
$ npm i less-loader less -D
$ npm i sass-loader node-sass -D
```

示例代码

```js
module.exports = {
  // entry: ......

  // output: ......

  module: {
    rules: [
      {
        test: /\.sass$/,
        use: [
          {
            loader: 'style-loader',
            // ......
          },
          {
            loader: 'css-loader',
            // ......
          },
          // 加在 style-loader 和 css-loader 后面即可
          {
            loader: 'sass-loader'  // 'less-loader'
          }
        ]
      }
    ]
  }
};
```