const path = require( 'path' );
const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' );

module.exports = {
  mode: 'development',
  entry: {
    homepage: [ '@babel/polyfill', './app/src/js/app.js' ],
    scrollable: [ '@babel/polyfill', './app/src/js/fixed_on_scrollV3.js' ]
  },
  output: {
    path: path.resolve( __dirname, './app/build/js' ),
    filename: '[name].js'
  },
  plugins: [
    new CleanWebpackPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: [ '@babel/preset-env' ]
        }
      }
    ]
  }
};
