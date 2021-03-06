const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        index: './test/test.js'
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './test',
        port: '2323',
        host: '172.16.1.95'
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'test')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: [
                    'babel-loader',
                    'eslint-loader'
                ]
            }
        ]
    }
};
