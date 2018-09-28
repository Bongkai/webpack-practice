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

  resolve: {
    alias: {
      jquery$: path.resolve(__dirname, 'src/libs/jquery-3.3.1.min.js')
    }
  },

  devServer: {
    port: 9001,
    hot: true,
    hotOnly: true,
    overlay: true,
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
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, 'src')],
        exclude: [path.resolve(__dirname, 'src/libs')],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/env'],  // ['env']
              plugins: ['lodash']
            }
          },
          // eslint-loader 必须放在 babel-loader 的后面
          {
            loader: 'eslint-loader',
            options: {
              formatter: require('eslint-friendly-formatter')
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
      // {
      //   test: path.resolve(__dirname, 'src/app.js'),
      //   use: [
      //     {
      //       loader: 'imports-loader',
      //       options: {
      //         $: 'jquery'
      //       }
      //     }
      //   ]
      // }
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

    // new ExtractTextWebpackPlugin({
    //   filename: 'css/[name]_[hash:8].min.css'
    // }),

    // PurifyCSS 必须放在 ExtractTextWebpackPlugin 的后面
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

    new Webpack.ProvidePlugin({
      // 解析时会先去找 node_modules 对应的模块，没有的话就去找 resolve.alias 指定的文件
      $: 'jquery'
    }),
  ],
};