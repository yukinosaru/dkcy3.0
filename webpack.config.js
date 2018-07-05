var path = require('path');
var webpack = require('webpack');
var SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        main: path.resolve(__dirname,'src/main.js')
    },
    output: {
        path: path.resolve(__dirname,'dist/'),
        filename: '[name].bundle.js',
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ["env","react"]
                }
            },
            {
                test: /\.css/,
                loader: [ 'style-loader', 'css-loader' ]
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader", // creates style nodes from JS strings
                    "css-loader", // translates CSS into CommonJS
                    "sass-loader" // compiles Sass to CSS
                ]
            }
        ]
    },
    plugins: [
        new SWPrecacheWebpackPlugin(
          {
            cacheId: 'dkcy',
            filename: 'service-worker.js',
            minify: true,
            staticFileGlobs: [
                'dist/',
                'dist/**.html',
                'dist/images/**.*',
                'dist/scripts/**.js',
                'dist/scripts/sw/**.js',
                'dist/styles/**.css',
                'dist/favicon.ico',
                'dist/**.js'
            ],
            stripPrefix: 'dist/',
            staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
          }
        )
     ]
};