const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const path = require('path');
const port = 8000;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


module.exports = {
  devServer: {
    port,
    compress: true,
    open: true,
    quiet: true,
    // stats: 'errors-only'
  },
  output: {
    path: path.resolve(__dirname, '../build'),
    filename: 'js/[name]/[name]_[hash:8].js'
  },
  devtool: 'source-map',
  plugins: [
    // new BundleAnalyzerPlugin(),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [
          `You application is running here http://localhost:${port}`
        ],
        // notes: ['Some additionnal notes to be displayed unpon successful compilation']
      }
    }),
  ]
}