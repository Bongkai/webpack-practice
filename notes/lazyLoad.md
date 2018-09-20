# 代码分割（懒加载）

可通过 webpack 的内置插件 webpack.optimize.CommonsChunkPlugin 来提取公共代码。
代码分割实际上不是通过配置 webpack 来实现的，而是通过改变写代码的方式来实现。
（这部分其实还没怎么搞懂......）

## 应用场景

1. 分离业务代码 和 第三方依赖
2. 分离业务代码 和 业务公共代码 和 第三方依赖
3. 分离首次加载 和 访问后加载的代码

## 方式一：webpack methods

```js
// 引入模块，在 dependencies 中引入（但不执行），需在 callback 中再次引入并执行
require.ensure(dependencies, callback[, errorCallback, chunkName])

// 引入模块但不执行
require.include(commonModulePath)
```

**示例代码**：

```js
// 把之后要引入的模块中的公共模块先加载进来
require.include('./moduleA.js');

require.ensure(['./subPageA.js'], ()=> {
  const subPageA = require('./subPageA.js');
  console.log(subPageA);
}, 'subPageA');

require.ensure(['./subPageB.js'], ()=> {
  const subPageA = require('./subPageB.js');
  console.log(subPageB);
}, 'subPageB');

require.ensure(['lodash'], ()=> {
  const _ = require('lodash');
  _.join(['1', '2'], '3');
}, 'vendor');
```

## 方式二：ES 2015 Loader Spec

```js
import(commonModulePath)    // => Promise 对象

import(
  /* webpackChunkName: async-chunk-name */
  /* webpackMode: lazy */
  commonModulePath
)
```

**示例代码**：

```js
// pageA.js

import * as _ from 'lodash';

const page = 'subPageA';

if(page === 'subPageA') {
  import(/* webpackChunkName:'subPageA' */'./subPageA.js')
    .then(subPageA=> {
      console.log(subPageA);
    });
} else if(page === 'subPageB') {
  import(/* webpackChunkName:'subPageB' */'./subPageB.js')
    .then(subPageB=> {
      console.log(subPageB);
    });
}

export default 'pageA';
```

```js
// webpack.config.js

const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: {
    pageA: './src/pageA.js',
    pageB: './src/pageB.js',
    vendor: ['lodash']
  },

  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: './dist/',
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js'
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      async: 'async-common',
      children: true,
      minChunks: 2
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest'],
      minChunks: Infinity
    })
  ]
};
```

