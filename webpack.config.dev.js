const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const prod = process.env.NODE_ENV === 'production';

const config = {
    mode: prod ? 'production' : 'development',
    devtool: prod ? false : 'eval',
    entry: {
        index: path.join(__dirname, 'demo', 'src', 'demo.js')
    },
    output: {
        path: path.resolve(__dirname, 'demo', 'dist'),
        filename: '[name].[hash:8].js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(css|less)$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            }
        ]
    },
    plugins: [],
};

if (prod) {
    config.plugins.push(
        new CleanWebpackPlugin({
            dry: false,
            verbose: true,
            cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, 'dist')]
        }),
    );
    config.plugins.push(
        new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('production')})
    );
    config.output.publicPath = '/demo/dist'
} else {
    config.plugins.push(
        new htmlWebpackPlugin({
            template: path.resolve(__dirname, 'demo', 'public', 'index.html'),
        })
    );
}

module.exports = config;