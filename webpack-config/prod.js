const path = require("path");
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const common = require('./common');

module.exports = merge(common, {

    mode: 'production',
    devtool: false,

    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/',
        clean: true
    },

    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                            sourceMap: false,
                            modules: false,
                        },
                    },
                    "postcss-loader",
                    "sass-loader",
                ],
            }
        ]
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: 'styles/[name].[contenthash].css',
            chunkFilename: '[id].css',
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"prod"',
        })
    ],

    optimization: {
        minimize: true,
        minimizer: [
            // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`)
            '...',
            new CssMinimizerPlugin(),
        ],
        runtimeChunk: {
            name: 'runtime',
        },
    },

    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
    },
});