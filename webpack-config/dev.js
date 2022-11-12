const webpack = require('webpack');
const { merge } = require('webpack-merge')
const common = require('./common')
const dotenv = require('dotenv');
dotenv.config();

module.exports = merge(common, {

    mode: 'development',
    devtool: 'inline-source-map',

    module: {
        rules: [
            {
                test: /\.(sass|scss|css)$/i,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            importLoaders: 1,
                            modules: false
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                ],
            },
        ],
    },

    watchOptions: {
        poll: true,
        ignored: /node_modules/,
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"dev"',
            'process.env.APP_URL': '"http://localhost:' + process.env.PORT_DEV + '"',
        })
    ]
})