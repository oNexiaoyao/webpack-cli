const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const webpack = require('webpack');

module.exports = (env) => {
    console.log('这个貌似是从配置的启动命令获取到的NODE_ENV:', env);
    return {
        // entry: {
        //     main: './src/index.js',
        //     pageTwo: './src/pageTwo.js'
        // },
        entry: './src/index.js',
        output: {
            // filename: '[name].bundle.js',
            filename: '[name].[contenthash].js',
            path: path.resolve(__dirname, 'dist')
        },
        module: {
            rules: [
                {
                    // 样式
                    test: /\.css$/,
                    include: path.resolve(__dirname, 'src'),
                    use: [
                        'style-loader',
                        'css-loader'
                    ]
                },
                {
                    // 图片
                    test: /\.(png|svg|jpg|gif)$/,
                    include: path.resolve(__dirname, 'src'),
                    use: [
                        'file-loader'
                    ]
                },
                {
                    // 字体文件
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    include: path.resolve(__dirname, 'src'),
                    use: [
                        'file-loader'
                    ]
                },
                {
                    test: /\.(csv|tsv)$/,
                    include: path.resolve(__dirname, 'src'),
                    use: [
                        'csv-loader'
                    ]
                },
                {
                    test: /\.xml$/,
                    include: path.resolve(__dirname, 'src'),
                    use: [
                        'xml-loader'
                    ]
                }
            ]
        },
        // 从编译压缩处理后的代码映射到它最初的样子
        devtool: 'inline-source-map',
        // 启用一个服务器，不需要每次手动输入命令执行
        devServer: {
            contentBase: './dist',
            hot: true
        },
        plugins: [
            // 生成资源对应表-manifest.json
            // new ManifestPlugin(),
            // 清除编译生成的资源文件
            new CleanWebpackPlugin(),
            // new webpack.NamedModulesPlugin(),
            // new webpack.HotModuleReplacementPlugin(),
            new HtmlWebPackPlugin({
                title: 'homePage'
            }),
            // new HtmlWebPackPlugin({
            //     filename: '01.html',
            //     title: '页面一',
            //     template: './src/index01.html',
            //     chunks: ['main'],
            //     excludeChunks: []
            // }),
            // new HtmlWebPackPlugin({
            //     filename: '02.html',
            //     title: '页面二',
            //     template: './src/index02.html',
            //     // chunks: ['pageTwo']
            // })
        ],
        mode: 'development',
        optimization: {
            usedExports: true,
            // true by default --对编译产生的代码进行压缩
            minimize: false,
            // 配置后抽离出来的公共模块的hash不会改变了
            moduleIds: 'hashed',
            // 针对每一个入口的runtime 新增一个额外的 chunk 
            runtimeChunk: {
                name: entrypoint => `runtime~${entrypoint.name}`
            },
            // runtimeChunk: 'single',
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all'
                    }
                }
            }
        }
    }
}