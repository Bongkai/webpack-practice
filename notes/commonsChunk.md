## 提取公共代码

可通过 webpack 的内置插件 webpack.optimize.CommonsChunkPlugin 来提取公共代码。

### 应用场景

1. 单页应用
2. 单页应用 + 第三方依赖
3. 单页应用 + 第三方依赖 + webpack 生成代码（webpack 打包后自身生成的内置函数等）

### 配置须知

1. 在没有进行懒加载的配置时，需要在 entry 设置多入口才能进行公共代码的提取。
2. 可通过实例化多个 CommonsChunkPlugin 来进行复杂的提取操作。

### 示例代码
```js
const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: {
    pageA: './src/pageA.js',
    pageB: './src/pageB.js',
    // 要单独提取出来的第三方代码
    vendor: ['lodash']
  },

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js'
  },

  plugins: [
    // 把 chunks 入口中引用超过 minChunks 次数的业务代码单独打包
    // 指定 chunks 是为了不把 vendor 入口指定的第三方代码一起打包进去
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      minChunks: 2,
      chunks: ['pageA', 'pageB']
    }),

    // 把指定的第三方代码单独打包
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity
    }),

    // 把 webpack 生成代码单独打包（不配置该项则和第三方代码一起打包）
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    })

    // 上面两个能合并成下面的写法：
    // new webpack.optimize.CommonsChunkPlugin({
    //   names: ['vendor', 'manifest'],
    //   minChunks: Infinity
    // })
  ]
};
```