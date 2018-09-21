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
    path: path.resolve(__dirname, 'dist'),
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
          // {
          //   loader: 'file-loader',
          //   options: {
          //     name: '[name]_[hash:8].[ext]',
          //     publicPath: '../assets/imgs/',
          //     useRelativePath: true
          //   }
          // },
          {
            loader: 'url-loader',
            options: {
              name: '[name]_[hash:8].[ext]',
              // outputPath: 'assets/imgs/',
              publicPath: '../assets/imgs/',
              // 为每个文件生成一个相对 URL 的路径
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
          //     // publicPath：默认为 output.publicPath
          //     publicPath: '../assets/imgs/',
          //     // useRelativePath: true,
          //     limit: 10000
          //   }
          // },

          // {
          //   loader: 'img-loader',
          //   options: {
          //     pngquant: {
          //       quality: 80
          //     }
          //   }
          // }
        ]
      },
      // {
      //   test: /\.js$/,
      //   use: [
      //     {
      //       loader: 'babel-loader',
      //       options: {
      //         presets: ['@babel/env'],  // ['env']
      //         plugins: ['lodash']
      //       }
      //     }
      //   ]
      // }
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