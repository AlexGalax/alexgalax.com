const path = require('path');
const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');

const port = 8080;
const config = require('./webpack-config/dev');

// add hot reload plugin & entry points
config.entry.push(
    'webpack/hot/dev-server.js',
    'webpack-dev-server/client/index.js?hot=false&live-reload=true'
);
config.plugins.push(new webpack.HotModuleReplacementPlugin());

const compiler = webpack(config);

const server = new webpackDevServer(
    {
        static: path.join(__dirname, 'dist'),
        hot: false,
        client: false,
        port: port
    },
    compiler
);

(async () => {
    await server.start();
    console.log('dev server is running on port ' + port);
})();