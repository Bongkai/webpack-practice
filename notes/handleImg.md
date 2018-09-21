# 图片处理

* file-loader
* url-loader
* img-loader（未完成）
* postcss-sprites（未完成）

## file-loader & url-loader

url-loader 是在 file-loader 的基础上，加上 limit 参数控制是否把图片转成 base64 格式。

```shell
$ npm i file-loader -D
# 或者
$ npm i url-loader -D
```

## 示例代码

```js
const PurifyCSS = require('purifycss-webpack');
const glob = require('glob-all');

module.exports = {
  entry: {
    app: './src/app.js'
  },

  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: 'dist/',
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
              loader: 'css-loader'
            }
          ]
        })
      },
      {
        test: /\.(jpg|png|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]_[hash:8].[ext]',
              // publicPath：默认为 output.publicPath，若这里指定则覆盖
              publicPath: '../assets/imgs/',
              // 为每个文件生成一个相对 URL 的路径，默认为 false
              useRelativePath: true,
              limit: 10000
            }
          },

          // 不设置 useRelativePath 的写法
          // {
          //   loader: 'url-loader',
          //   options: {
          //     name: '[name]_[hash:8].[ext]',
          //     outputPath: 'assets/imgs/',
          //     publicPath: '../assets/imgs/',
          //     useRelativePath: false,
          //     limit: 10000
          //   }
          // }
        ]
      }
    ]
  },

  plugins: [
    new ExtractTextWebpackPlugin({
      filename: 'css/[name].min.css'
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


