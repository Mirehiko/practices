const path = require( 'path' );

// const HTMLWebpackPlugin = require( 'html-webpack-plugin' );
// const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' );

module.exports = {

  // context: path.resolve( __dirname, './app/src' ),
  mode: 'development', // "production"
  // entry: './app/src/js/app.js', // collect files from
  entry: {
    homepage: './app/src/js/app.js',
    scrollable: './app/src/js/fixed_on_scrollV3.js'
  },
  output: {
    path: path.resolve( __dirname, './app/build/js' ),
    filename: '[name].js'

    // filename: '[name].[contenthash].js'
  }

  // resolve: {
  //   extensions: [ '.js' ]
  // },
  // plugins: [
  //   new HTMLWebpackPlugin( {
  //     template: './app/build/index.html'
  //   } ),
  //   new CleanWebpackPlugin()
  // ],

  // module: {
  //   rules: [
  //     {
  //       test: /\.css$/,
  //       use: [ 'style-loader', 'css-loader' ]
  //     },
  //     {
  //       test: /\.(png|jpg|svg|gif)$/,
  //       use: [ 'file-loader' ]
  //     },
  //     {
  //       test: /\.(ttf|woff|woff2|eot)$/,
  //       use: [ 'file-loader' ]
  //     }
  //   ]
  // }
};
