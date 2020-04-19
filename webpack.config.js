"use strict";

const path = require('path');
const isDev = process.env.NODE_ENV === 'development';
const merge= require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const glob = require('glob');
const webpack = require('webpack');

const getMultipleConfig = () => {
  const entryMap = {};
  const pagePlugins = [];
  const entryPages = glob.sync('./src/Pages/*/index.js');
  entryPages.forEach(pageUrl => {
    const pageName = pageUrl.match(/src\/Pages\/(.*)\/index/i)[1];
    entryMap[pageName] = pageUrl;
    pagePlugins.push(
      new HtmlWebpackPlugin({ 
        template: './src/index.html',
        title: pageName,
        filename: `${pageName}.html`,
        chunks: [pageName, 'vendor'],
        minify: { // 压缩HTML文件
          html5: true,
          removeComments: true, // 移除HTML中的注释
          collapseWhitespace: true, // 删除空白符与换行符
          minifyCSS: true// 压缩内联css
        },
      }),
    );
  });
  return { entryMap, pagePlugins };
}

const { entryMap, pagePlugins } = getMultipleConfig();

const config = {
  mode: isDev ? 'development' : 'production',
  entry: entryMap,
  optimization: {
// 新代码块可以被共享引用，或这些模块都是来自node_modules
// 新产出的vendor-chunk的大小得大于30kb
// 按需加载的代码块（vendor-chunk）并行请求的数量小于或等于5个
// 初始加载的代码块，并行请求的数量小于或者等于3个
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
        },
      }
    },
    // runtimeChunk: {
    //   name: 'runtime'
    // }
  },
  resolve: {
    extensions: ['.wasm', '.mjs', '.js', '.json', 'jsx', '*']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.sc?ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev
            }
          },
          {
            loader: 'css-loader', // 将 CSS 转化成 CommonJS 模块
            options: {
              modules: {
                // 重新生成的 css 类名
                localIdentName: '[local]--[contenthash:base64:8]'
              },
            }
          },
          'sass-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => {
                return require('autoprefixer')({
                  browsers: ['last 2 version', '>1%', 'ios 7']
                });
              }
            }
          },
        ],
        exclude:[path.resolve(__dirname, '..', 'node_modules')]
      },
      {
        test: /\.(jpg|png|gif|jpeg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240
            }
          }
        ]
      },
      {
        test: /\.txt$/i,
        use: 'raw-loader'
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // all options are optional
      filename: 'css/[name]/[name]_[contenthash:8].css',
      chunkFilename: 'css/[name]/[id]_[contenthash:8].css',
      ignoreOrder: false // Enable to remove warnings about conflicting order
    }),
    // new HtmlWebpackExternalsPlugin({
    //   externals: [
    //     {
    //       module: 'react',
    //       entry: "https://unpkg.com/react@16/umd/react.production.min.js",
    //       global: 'React'
    //     },
    //     {
    //       module: 'react-dom',
    //       entry: "https://unpkg.com/react-dom@16/umd/react-dom.production.min.js",
    //       global: 'ReactDOM'
    //     },
    //   ]
    // }),
    // new webpack.optimize.ModuleConcatenationPlugin()
  ].concat(pagePlugins)
};

module.exports = merge(config, require(`./config/webpack.config.${isDev ?　'dev': 'prod'}`));
