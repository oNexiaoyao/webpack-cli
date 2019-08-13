/**
 * 本配置的目的是一次编译生成动态链接库，后续打包直接调用，不需要在编译
 */
const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FriendlyErrorsWebpackPlugin  = require('friendly-errors-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        // 可以分类打包成多个文件，也可以合在一起打包成一个文件
        // 将lodash 模块作为入口编译成动态链接库
        // 'lodash': ['lodash'],
        'queryString': ['query-string']
    },
    output: {
        // 指定生成文件所在目录
        // 由于每次打包生产环境时会清空 dist 文件夹，因此我们将其存放到 public 文件夹下
        path: path.resolve(__dirname, 'public/vendor'),
        // 指定文件名
        filename: '[name].dll.js',
        // 存放动态链接库的全局变量名称
        // 这个名称需要与 DllPlugin 插件中的 name 属性值对应起来
        library: '[name]_dll_lib'
    },
    plugins: [
        // 每次编译都会先清空输出文件夹下的文件
        new CleanWebpackPlugin(),
        new FriendlyErrorsWebpackPlugin(),
        new webpack.DllPlugin({
            path: path.join(__dirname, 'public', 'vendor', '[name].manifest.json'),
            // 动态链接库的全局变量名称，需要和 output.library 中保持一致
            // 该字段的值也就是输出的 manifest.json文件中 name 字段的值
            name: '[name]_dll_lib'
        })
    ]
}