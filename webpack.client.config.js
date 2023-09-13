const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const OUT_DIR = path.resolve(__dirname, 'build');

const config = (env, argv) => ({
    entry: './src/index.ts',
    mode: argv.mode === 'production'
        ? 'production'
        : 'development',
    output: {
        path: OUT_DIR,
    },
    devServer: {
        open: true,
        host: 'localhost',
    },
    module: {
        rules: [
            {
                test: /\.(js|ts)$/i,
                loader: 'babel-loader',
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },
            {
                test: /\.(less)$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                            importLoaders: 1,
                        }
                    },
                    'less-loader',
                ]
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.json', '.ts'],
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['build'],
            cleanStaleWebpackAssets: false,
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: `assets/cocos.js`,
                    to: 'cocos.js',
                },
            ],
        }),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            filename: 'index.html',
            cache: false,
            minify: true,
        }),
    ],
});

module.exports = config;
