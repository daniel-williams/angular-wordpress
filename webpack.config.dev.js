var path = require('path');
var webpack = require('webpack');

var PROJECT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(PROJECT_PATH, 'src');
var WEB_PATH = path.resolve(PROJECT_PATH, 'client');
var DIST_PATH = path.resolve(WEB_PATH, 'content/bundles');


module.exports = {
    entry: {
        'app': [
          'webpack-hot-middleware/client',
          path.join(APP_PATH, 'main.ts')
        ],
        'vendors': path.join(APP_PATH, 'vendors.ts')
    },
    output: {
        path: DIST_PATH,
        filename: '[name].bundle.js',
        publicPath: '/content/bundles/'
    },
    module: {
        loaders: [{
            test: /\.ts$/,
            loader: 'ts',
            exclude: [
                /node_modules/
            ]
        }, {
            test: /\.json$/,
            loader: "json"
        }, {
            test: /\.html$/,
            loader: 'raw'
        }, {
            test: /\.scss$/,
            loader: "raw!autoprefixer?browsers=last 2 versions!sass"
        }],
        noParse: [/angular2\/bundles\/.+/],
    },
    resolve: {
        extensions: ['', '.ts', '.js', '.html', '.scss']
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
    ]
};
