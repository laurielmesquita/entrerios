const glob = require('glob-all');
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin');
const Clean = require('clean-webpack-plugin');

module.exports = {
   entry: {
      main: './assets/javascripts/main.js',
      other: './assets/javascripts/other.js',
   },
   output: {
      path: path.join(__dirname, '/.tmp/dist'),
      filename: 'javascripts/[name].bundle.js',
   },
   resolve: {
      modules: [
         path.join(__dirname, '/assets/javascripts'),
         path.join(__dirname, '/assets/stylesheets'),
         path.join(__dirname, '/node_modules'),
      ],
      extensions: ['.js', '.css', '.scss']
   },
   module: {
      rules: [
         {
            test: /\.js$/,
            loader: 'babel-loader',
            options: {
               presets: [
                  ['env', {
                     modules: false,
                  }],
               ],
            },
            exclude: /node_modules/,
         },
         {
            test: /\.(css|scss)$/,
            loader: ExtractTextPlugin.extract({
               fallback: 'style-loader',
               use: [
                  { loader: 'css-loader' },
                  {
                     loader: 'postcss-loader',
                     options: {
                        sourceMap: true,
                        plugins: function () {
                           return [
                              require('rucksack-css'),
                              require('autoprefixer'),
                              // require('cssnano')
                           ];
                        }
                     }
                  },
                  { loader: 'sass-loader', options: { sourceMap: true } }
               ]
            }),
         },
         {
            test: /\.(jpe?g|png|gif|svg)$/i,
            use: [
               {
                  loader: 'url-loader',
                  query: {
                     limit: 5000,
                     name: '[name].[ext]',
                  },
               },
               {
                  loader: 'img-loader',
                  options: {
                     enabled: process.env.NODE_ENV === 'production',
                     gifsicle: {
                        interlaced: false
                     },
                     mozjpeg: {
                        progressive: true,
                        arithmetic: false
                     },
                     optipng: false,
                     pngquant: {
                        floyd: 0.5,
                        speed: 2
                     },
                     svgo: {
                        plugins: [
                           { removeTitle: true },
                           { convertPathData: false }
                        ]
                     }
                  }
               }
            ]
         }
      ]
   },
   plugins: [
      new webpack.DefinePlugin({
         'process.env': {
            NODE_ENV: JSON.stringify(process.env.NODE_ENV),
         },
      }),
      new Clean(['.tmp']),
      new ExtractTextPlugin('stylesheets/[name].bundle.css'),
      // new PurifyCSSPlugin({
      //   paths: glob.sync(path.join(__dirname, 'source/*.html.erb')),
      //   purifyOptions: {
      //     whitelist: ['show'],
      //     minify: true
      //   }
      // }),
      new UglifyJsWebpackPlugin(),
   ],
};
