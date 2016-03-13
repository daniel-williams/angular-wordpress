var path = require('path');
var webpack = require("webpack");
var webpackConfig = require('./webpack.config.dev.js');

var DIST_PATH = path.resolve('client/content/bundles');

webpackConfig.output.path =  DIST_PATH;
webpackConfig.plugins.concat([
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
]);

module.exports = webpackConfig;