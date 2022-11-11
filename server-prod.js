const dotenv = require('dotenv');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

dotenv.config();
const app = express();
const config = require('./webpack-config/prod');
const compiler = webpack(config);

app.use(
    webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath,
    })
);

app.listen(process.env.PORT, function () {
    console.log('prod server running on port ' + process.env.PORT);
});