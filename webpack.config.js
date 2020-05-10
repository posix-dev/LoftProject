const HtmlPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-3-webpack-plugin');
const rules = require('./webpack.config.rules');
const path = require('path');

rules.push({
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader'
    })
});

module.exports = {
    entry: {
        main: './src/main.js',
        towns: './src/js/towns.js'
    },
    devServer: {
        index: 'towns.html'
    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve('dist')
    },
    devtool: 'source-map',
    module: { rules },
    plugins: [
        new UglifyJsPlugin({
            uglifyOptions: {
                warnings: false,
                ie8: false,
                output: {
                    comments: false
                }
            }
        }),
        new ExtractTextPlugin('styles.css'),
        new HtmlPlugin({
            title: 'Main Homework',
            template: 'main.hbs',
            filename: 'main.html',
            chunks: ['main']
        }),
        new HtmlPlugin({
            title: 'Towns',
            template: 'towns.hbs',
            filename: 'towns.html',
            chunks: ['towns']
        }),
        new CleanWebpackPlugin()
    ]
};
