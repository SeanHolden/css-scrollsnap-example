const path = require('path');

module.exports = {
    entry: './index.js',
    mode: 'development',
    output: {
        filename: 'index.min.js',
        path: path.resolve(__dirname)
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.resolve(__dirname),
        useLocalIp: true,
        host: '0.0.0.0'
    }
};
