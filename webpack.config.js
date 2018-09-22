const Webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const PurifyCSS = require('purifycss-webpack');
const glob = require('glob-all');

module.exports = {
  entry: {
    app: './src/app.js'
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    // publicPath: 'dist/',
    filename: '[name]_[hash:8].bundle.js',
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
      // },
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
      template: path.resolve(__dirname, './index.html'),
      minify: {
        collapseWhitespace: true
      }
    }),
    new ExtractTextWebpackPlugin({
      filename: 'css/[name]_[hash:8].min.css'
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