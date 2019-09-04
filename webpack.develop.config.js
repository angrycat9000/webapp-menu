const Path = require('path');
const Webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = {
  mode: 'development',
  devtool: 'cheap-eval-source-map',
  devServer: {
    inline: true,
    overlay:true,
    contentBase: Path.join(__dirname, 'www'),
    host: '0.0.0.0',
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
    },
  },
  entry: {
    demo: Path.resolve(__dirname, 'src/examples/demo.js'),
    "webapp-menu": Path.resolve(__dirname, 'src/bundle.js'),
  },
  output: {
    path: Path.join(__dirname, 'examples'),
    filename: '[name].js',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title:'WebApp Menu Development',
      inject:'head',
      filename:'demo.html',
      chunks: ['demo', 'webapp-menu']
    }),
    new HtmlWebpackPlugin({
      template: 'src/examples/simple-popup.html',
      inject:'head',
      filename:'simple-popup.html',
      chunks: ['webapp-menu']
    })
  ],
  module: {
    rules:
      [
      {
        test: /\.s?css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader?sourceMap=true', 'sass-loader?sourceMap=true']
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader?removeSVGTagAttrs=false'
      }
    ]
  }
};

