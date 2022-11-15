const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {

    entry:[
        path.resolve(__dirname, '../src/index.js')
    ],

    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '../dist'),
        clean: true,
        assetModuleFilename: (pathData) => {
            const filepath = path
                .dirname(pathData.filename)
                .split("/")
                .slice(1)
                .join("/");
            return `${filepath}/[name].[hash][ext][query]`;
        },
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: 'alexgalax.com',
            template: './src/index.html',
            // @todo: favicon: paths.src + '/images/favicon.png',
            meta: {
                viewport: 'width=device-width, initial-scale=1'
            }
        }),
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(process.env),
            'app.config.logo': '`' + (fs.readFileSync(path.resolve(__dirname, '../src/assets/logo.txt'), 'utf-8')).replace(/\\/g, '\\\\') + '`',
        })
    ],

    module: {
        rules: [
            {
                test: /\.js$/i,
                use: ['babel-loader']
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource'
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource'
            },
        ]
    },

}