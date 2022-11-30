const { merge } = require('webpack-merge')
const common = require('./common')

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
    }
})