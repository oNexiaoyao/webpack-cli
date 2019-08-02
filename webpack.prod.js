const path = require('path');
const webpack = require('webpack');
const glob = require('glob');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const generateDllReferences = () => {
    const manifests = glob.sync(`${path.resolve(__dirname, 'public/vendor/*.json')}`);
    return manifests.map(file => {
        return new webpack.DllReferencePlugin({
            manifest: require(file)
        })
    })
}

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    plugins: [
        // new webpack.DefinePlugin({
        //     'process.env.NODE_ENV': JSON.stringify('production')
        // }),
        // 告诉 webpack 使用了哪些动态链接库
        ...generateDllReferences()
    ]
})
