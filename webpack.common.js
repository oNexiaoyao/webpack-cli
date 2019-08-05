const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MinCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// 获取入口文件
const getEntries = pattern => {
    const fileList = glob.sync(pattern)
    return fileList.reduce((previous, current) => {
        const filePath = path.parse(path.relative(path.resolve(__dirname, './src'), current));
        // 包含路径的名称 key
        // const withoutSuffix = path.join(filePath.dir, filePath.name).replace(/\\/g, '/');
        // 用文件名称作为 key，（文件名称不能重复）
        const withoutSuffix = filePath.name;
        previous[withoutSuffix] = path.resolve(__dirname, current);
        return previous
    }, {})
}
// 所有入口 index.js 匹配正则
const jsRegex = `./src/pages/**/*.js`;
// 所有子页面模板文件匹配
const htmlRegex = `./src/pages/**/*.html`;

const jsEntries = getEntries(jsRegex);
const htmlEntries = getEntries(htmlRegex);


// 根据 src 目录结构生成对应的文件结构
const generateHtmlWebpackPlugin = () => {
    const htmlPlugins = [];

    for (htmlEntry in htmlEntries) {
        const _config = {
            filename: htmlEntry + '.html',
            template: htmlEntries[htmlEntry],
            chunks: []
        }

        // 判断注入每个页面的 js 文件
        for (jsEntry in jsEntries) {
            if (htmlEntry === jsEntry) {
                // js 和 html 文件所在的路径
                _config.chunks.push(htmlEntry.replace(/\\/g, '/'));
            }
        }
        htmlPlugins.push(new HtmlWebpackPlugin(_config));
    }
    return htmlPlugins;
}

module.exports = {
    entry: jsEntries,
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, './dist')
    },
    module: {
        rules: [
            {
                // 样式
                test: /\.css$/,
                include: path.resolve(__dirname, 'src'),
                use: [
                    {
                        loader: MinCssExtractPlugin.loader
                    },
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
            },
            {
                test: /\.tsx?$/,
                include: path.resolve(__dirname, 'src'),
                use: 'ts-loader'
            }
        ]
    },
    plugins: [
        // 生成资源对应表-manifest.json
        new ManifestPlugin(),
        new CleanWebpackPlugin(),
        new FriendlyErrorsWebpackPlugin(),
        ...generateHtmlWebpackPlugin(),
        new MinCssExtractPlugin({
            filename: 'css/[name].css',
            chunkFilename: '[id].css',
            ignoreOrder: false
        }),
        new AddAssetHtmlPlugin([
            {
                // Files that the assets will be added to
                // 不设置或者为 []，则表示为所有的页面都注入
                files: [],
                // The absolute path of the file you want to add to the compilation, and resulting HTML file. Also support globby string.
                // filepath: path.resolve(__dirname, './public/vendor/*.dll.js'),
                filepath: path.resolve(__dirname, './public/asset/js/jquery.min.js'),
                // the output directory of the file.
                outputPath: 'vendor',
                // the public path of the script or link tag.
                publicPath: './vendor'
            },
            {
                files: ['pageOne.html'],
                filepath: path.resolve(__dirname, './public/vendor/lodash.dll.js'),
                outputPath: 'vendor',
                publicPath: './vendor'
            },
            {
                files: ['pageTwo.html'],
                filepath: path.resolve(__dirname, './public/vendor/queryString.dll.js'),
                outputPath: 'vendor',
                publicPath: './vendor'
            }
        ]),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, 'public/asset'),
                to: path.resolve(__dirname, './dist/asset')
            }
        ])
        // 不必通过 import/ require 使用模块
        // new webpack.ProvidePlugin({
        //     _: 'lodash',
        //     $: 'jquery',
        //     jQuery: 'jquery',
        //     'window.jQuery': 'jquery'
        // })
    ],
    resolve: {
        // 自动解析确定的扩展（可以在引入的时候不需要带上扩展后缀）
        extensions: ['.tsx', '.ts', '.js']
    },
    optimization: {
        // true by default --对编译产生的代码进行压缩
        minimize: false,
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: 'commons',
                    chunks: 'initial'
                }
            }
        }
    },
    externals: {
        // 属性名称是 jquery, 表示应该排除 import $ from 'jquery' 中的 jquery 模块
        // $ 的值将被用来检索一个全局的 $ 变量。换句话说，当设置为一个字符串时，它将被视为全局的
        jquery: '$'
    }
}

