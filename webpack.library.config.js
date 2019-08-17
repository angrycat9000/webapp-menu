const Path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode:'production',
  entry: {
    "webapp-menu": Path.resolve(__dirname, 'src/bundle.js'),
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
  }
};

