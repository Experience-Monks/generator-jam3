const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const config = require('./config.json');

const ENV = process.env.NODE_ENV || 'development';

const webpackConfig = {
  entry: {
    bundle: './src/index.js'{{#if unsupported}}{{#is backend "none"}},
    unsupported: './src/unsupported.js'{{/is}}{{/if}}
  },
  output: {
    filename: '[name].js',
    path: path.resolve(config[ ENV ].output)
  },
  module: {
    rules: [
      /*
       * process main style file using SASS,
       * autoprefix, minify and include in bundle
       */
      {
        test: /\.(scss)$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'postcss-loader', options: { plugins: [ autoprefixer, cssnano ] } },{{/is}}{{#is css 'scss'}}
          { loader: 'sass-loader' },
          { loader: 'import-glob-loader' },{{/is}}
        ]
      },
      /*
       * process .js files with babel
       */
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader' }
        ]
      },
      /*
       * inline svg requires in .js files
       */
      {
        test: /\.(svg)$/,
        use: [
          { loader: 'svg-inline-loader' },
          // optionally optimize inlined svgs
          // { loader: 'svgo-loader' }
        ]
      }
    ]
  },
  plugins: [
    // generate index.html file
    new htmlWebpackPlugin({
      template: './static/index.ejs',
      minify: config[ ENV ].minifyHtml,
      inject: false
      /*
       * specific template variables can be injected like:
       * facebookAppID: config[ ENV ].facebookAppID
       */
    }),
    // generate unsupported.html file
    {{#if unsupported}}{{#is backend "none"}}new htmlWebpackPlugin({
      template: './static/unsupported.ejs',
      minify: config[ ENV ].minifyHtml,
      filename: 'unsupported.html',
      inject: false
    }),{{/is}}{{/if}}
    // set bundle constant
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(ENV)
    }),
    // copy assets
    new CopyWebpackPlugin([
      { from: './raw-assets', to: './assets' }
    ]),
    // copy other pages and files
    new CopyWebpackPlugin([
      { from: './static/**/*.txt', to: './', flatten: true }
    ]),
  ]
};

if (ENV === 'development') {
  // add source maps in dev
  webpackConfig.devtool = 'source-map';

  // dev server config
  webpackConfig.devServer = {
    compress: false,
    historyApiFallback: true,
    port: 9966
  }
}

if (ENV === 'production') {
  // inline modules when possible
  webpackConfig.plugins.push(
    new webpack.optimize.ModuleConcatenationPlugin()
  );

  // uglify code in production
  webpackConfig.plugins.push(
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          dead_code: true
        },
        warnings: false
      }
    })
  );

  // generate gzip files
  webpackConfig.plugins.push(
    new CompressionPlugin({
      asset: '[path].gz[query]',
      test: /\.(js)$/
    })
  );
}

module.exports = webpackConfig ;
