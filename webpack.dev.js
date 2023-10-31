const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
    mode: "development",
    devtool: "eval", // 개발버전
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        host: '0.0.0.0',         // host: "localhost",
        port: 3000,
        hot: true,
        historyApiFallback: true,
        open: false,
    },
    watchOptions: {
        ignored: /node_modules/,
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: 'public/img', to: 'img' }
            ]
        }),
        new ReactRefreshWebpackPlugin(),
    ],
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js',
        publicPath: '/', // 라우터 링크 못읽는 현상 수정
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: require.resolve('babel-loader'),
                        options: {
                            plugins: [
                                require.resolve('react-refresh/babel'),
                            ],
                        },
                    },
                ],
            },
        ],
    },
});