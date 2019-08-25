const Path = require('path');
const Webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  mode: 'development',
  devtool: 'cheap-eval-source-map',
  devServer: {
    inline: true,
    overlay:true,
    host: '0.0.0.0',
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
    },
  },
  entry: {
    example: Path.resolve(__dirname, 'src/example.js'),
  },
  output: {
    path: Path.join(__dirname, 'examples'),
    filename: '[name].js',
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title:'WebApp Menu Development',
      inject:'head',
      name:'[name].html',
      meta:{viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no'}
    })
  ],
  module: {
    rules:
      [
      {
        test: /\.s?css$/,
        use: ['style-loader', 'css-loader?sourceMap=true', 'sass-loader?sourceMap=true']
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      }
    ]
  }
};

