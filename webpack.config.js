const path = require('path');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

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
              options: {
                minimize: true,
                modules: true,
                localIdentName: '[path][name]_[local]_[hash:base64:5]'
              }
            }
          ]
        })
      }
    ]
  },

  plugins: [
    new ExtractTextWebpackPlugin({
      filename: '[name].min.css',
      
      /* 对 allChunks 参数的讲解：

      allChunks可以控制有哪些css，是在一开始把所有css都打包到页面中，
      还是留一些样式（比如动态加载的样式），让它放在各自的模块中；

      如果配合上之前的commonsChunk，也就是提取公共chunk的模块，
      当js公共模块被提取时，里面的css模块也会跟着一块被提取，
      因为css模块也会被当作js模块去处理，这时候css就被写在js中了；

      这也是css的一种代码切割方式，也就是把初始化加载和动态加载区分开，
      既是借助了动态加载的代码切分，也是借助了css-in-js的概念，
      其实是把css放在了js里面一起切分的；

      提取功能模块其实也是一样的，就是把css文件放在js模块里面一起被提取的。
      */

      // 如果 allChunks 为 false，则各模块中的 CSS 将和各自模块的 js 代码一起打包（默认）
      // 如果 allChunks 为 true，则各模块中的 CSS 将和 [name].min.css 一起打包
      allChunks: false
    })
  ]
};