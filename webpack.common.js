const path = require('path');
// const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); //추가
const HtmlWebpackPlugin = require('html-webpack-plugin') //추가
// const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = {

    entry: { // 합쳐질 파일 요소들 입력
        app: ['./src/index.js'],
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'build.js',
        publicPath: '/', // 라우터 링크 못읽는 현상 수정
    },
    resolve: {
        modules: [path.join(__dirname, "src"), "node_modules"],
        alias: {
            react: path.join(__dirname, "node_modules", "react"),
        },
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,  // js 및 jsx 파일을 대상으로 합니다.
                exclude: /node_modules/,  // node_modules 폴더를 제외합니다.
                use: {
                    loader: 'babel-loader',  // babel-loader를 사용합니다.
                    options: {
                        presets: ['@babel/preset-react']  // React 및 JSX를 변환하는 데 사용할 Babel 프리셋을 지정합니다.
                    }
                },
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader",
                    },
                    {
                        loader: "css-loader",
                    },
                ],
            },
            // {
            //     test: /\.(sa|sc|c)ss$/,
            //     use: ["css-loader", "sass-loader"],
            // },
            {
                test: /\.(png|jp(e*)g|svg|gif|ico|webp)$/,
                use: ['file-loader'],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(), // 웹팩 실행시마다 dist 폴더 정리
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src', 'index.html'),  // index.html 파일의 경로를 지정합니다.
            inject: true,
            filename: path.resolve(__dirname, './dist/index.html')
        }),
        // new webpack.ProvidePlugin({ 'window.Quill' : 'quill'}),
    ],

}

module.exports = config