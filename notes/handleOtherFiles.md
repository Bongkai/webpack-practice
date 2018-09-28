# 处理其他文件

其他文件包括：
* 第三方 JS 库
* 字体文件

## 处理第三方 JS 库

第三方库的位置：
1. 第三方库在远程 CDN 上，引用时通过 script 标签把资源链接嵌入页面
2. 第三方库文件存在于 node_modules 目录中（npm install 的库）
3. 第三方库文件存在于项目的自定义目录中（自己下载的库）

webpack 有两种实现方式：
* 使用 webpack.providePlugin，通过这个插件和传参可以给所有模块注入想要的变量
* 使用 imports-loader，通过 test 匹配到目标文件或模块，再进行变量的注入

<br/>

**具体操作（以处理 jQuery 为例）**：

首先，如果有设置 ESLint，则需要设置允许的全局变量：
```js
// .eslintrc.js

module.exports = {
  root: true,
  extends: 'standard',
  plugins: ['html'],
  env: { browser: true },

  // 设置全局变量白名单
  globals: {
    $: true
  },

  rules: { /* ...... */ }
};
```

**位置一解决方法**：

使用 script 标签引入链接的方式无须配置：
```html
<!-- index.html -->

<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Page Title</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- script 标签引入链接 -->
  <script src="https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"></script>
</head>
<body>
  <!-- 内容 -->
</body>
</html>
```

**位置二解决方法**：

使用 Webpack.providePlugin 插件：
```js
// webpack.config.js

module.exports = {
  entry: { /* ...... */ },
  output: { /* ...... */ },
  module: { /* ...... */ },
  plugins: [
    /* 其他插件 */

    new Webpack.ProvidePlugin({
      // 解析时会先去找 node_modules 对应的模块，没有的话就去找 resolve.alias 指定的文件
      $: 'jquery'
    }),
  ],
}
```

**位置三解决方法**：

在 webpack 的 resolve.alias 中设置自定义的 jQuery 路径：
```js
// webpack.config.js

module.exports = {
  entry: { /* ...... */ },
  output: { /* ...... */ },

  resolve: {
    alias: {
      jquery$: path.resolve(__dirname, 'src/libs/jquery-3.3.1.min.js')
    }
  },

  module: { /* ...... */ },
  plugins: [ /* ...... */ ],
}
```

然后使用 Webpack.providePlugin 插件（同位置二的方法），

或者使用 imports-loader 来配置：
```shell
$ npm i imports-loader -D
```

```js
// webpack.config.js

module.exports = {
  entry: { /* ...... */ },
  output: { /* ...... */ },

  resolve: {
    alias: {
      jquery$: path.resolve(__dirname, 'src/libs/jquery-3.3.1.min.js')
    }
  },

  module: {
    rules: [
      /* 其他 rules */

      {
        test: path.resolve(__dirname, 'src/app.js'),
        use: [
          {
            loader: 'imports-loader',
            options: {
              $: 'jquery'
            }
          }
        ]
      }
    ]
  },

  plugins: [ /* ...... */ ],
}
```

**注**：imports-loader 方法和 ESLint 有冲突，如果使用 ESLint 时须使用 providePlugin 方法来实现。

<br/>

## 处理字体文件

处理字体文件的方式和处理图片文件大致相同：
```js
// webpack.config.js

module.exports = {
  entry: { /* ...... */ },
  output: { /* ...... */ },

  module: {
    rules: [
      {
        test: /\.(eot|woff2?|ttf|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]_[hash:8].[ext]',
              outputPath: 'assets/fonts/',
              limit: 5000
            }
          },
        ]
      },

      /* 其他 rules */
    ]
  },

  plugins: [ /* ...... */ ]
}
```

