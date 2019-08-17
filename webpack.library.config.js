const Path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  entry: {
    "webapp-menu": Path.resolve(__dirname, 'src/bundle.js'),
    "webapp-menu.min": Path.resolve(__dirname, 'src/bundle.js'),
  },
  output: {
    path: Path.join(__dirname, 'dist'),
    filename: '[name].js',
    library: 'WebappMenu',
    libraryTarget:'umd'
  },
  plugins:[
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin()
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserJSPlugin({
        test: /\.min\.js$/
      }),
     new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.min\.css$/
      })
    ],
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          } 
        }
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      },
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ],
      }
    ]
  },
  stats: {
    all:false,
    errors:true,
    assets:true,
  }
};

