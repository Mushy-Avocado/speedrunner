
// Fetch node modules
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');

module.exports = {
    mode: 'production', // Minifies the code, can use "development" for full code
    // Source maps add a lot to the file size, unnecessary for production
    devtool: "eval-source-map", // false for production, "eval-source-map" for development
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '',
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            // Possible TODO: Add attribute quotes in the generated HTML file
            // I havent found a setting for that, unfortunately Khan Academy isnt a fan of the missing quotes
            removeAttributeQuotes: false,
            minimizerOptions: {
                removeAttributeQuotes: false
            },
            template: './src/index.html',
            inject: 'body',
        }),
        new HtmlInlineScriptPlugin(),
    ],
};