const {CleanWebpackPlugin} = require('clean-webpack-plugin');//每次运行前清理目录的插件
const path = require('path');

module.exports = {
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name]/[name]_[chunkhash:8].js'
  },
  plugins: [
    new CleanWebpackPlugin()
  ],
  // devtool: 'cheap-source-map'
  devtool: 'cheap-source-map'
}