# 目录结构说明

`public/asset`: 用于存储第三方插件（没有 npm 包）。会被复制到 `dist` 目录文件下

`public/vendor`: 用于存储第三方插件（有 npm 包，经过提前配置的包文件 

# 观察模式--缓存相关

* 分开发和生产版本

    开发版本打包处理所有的文件

    生产版本可以只编译自己需要的文件

    减少任何一个模式下的打包编译时间

* 模块热替换

* css分离

* 减少手动配置项

* `tree shaking` 删除未引用的代码（dead-code）

* `/src` 源代码是用于书写和编辑的代码。`/dist` 分发代码是构建过程产生的代码最小化和优化后的 ”输出“ 目录，最终将在浏览器中加载：

* 代码压缩控制

* 多页面和单页面 修改某一页面只需要编译对应的页面文件

***

* [webpack-dev-server和webpack-dev-middleware的区别](https://www.cnblogs.com/wangpenghui522/p/6826182.html)

* 使用 `optimization.splitChunks`进行代码的分隔然后实现缓存加载

* 为提高解析效率，尽量明确要针对的目标。比如使用`loader`的时候，最后指定到某一个文件夹

* `thread-loader` 和 `cache-loader`

* `expose-loader`/`externals`/`ProvidePlugin` jquery及其第三方插件的使用、**不需要打包编译的插件库换成去全局`<script>`标签引入**

    有些插件库的代码量有很多，打包起来可能会很耗时

* `exports-loader`---对应官方文档 `shimming`这一章节介绍

***

* 插件

    `CopyWebpackPlugin`: 将单个文件或整个目录复制到构建目录

    `DllPlugin`：为了极大减少构建时间，进行分离打包。**合在一起打包利用缓存**

        [参考资料一](https://juejin.im/post/5c665c6151882562986ce988)
        [参考资料二](https://github.com/chenchunyong/webpack-dllPlugin)

    `DllReferencePlugin`: 该插件的作用是把本项目中 `webpack_dll.config.js` 打包生成的 dll 文件引用到需要的预编译的依赖上来。什么意思呢？比如，通过 `webpack_dll.config.js` 打包会生成 `lodash.dll.js` 和 `lodash.manifest.json`文件，`lodash.dll.js` 文件包含所有的第三方库文件，`lodash.manifest.json` 文件会包含该第三方库的所有代码的一个索引，当在使用配置文件打包`DllReferencePlugin` 插件的时候，会使用该 `DllReferencePlugin` 插件读取 `lodash.manifest.json` 文件，看看是否有该第三方库，然后并读取第三方依赖库。`lodash.manifest.json` 文件是对之前打包好的第三方库的一个映射。

    `add-asset-html-webpack-plugin`: 将 Js 或者 Css 添加到 webpack 编译打包生成的 html文件中

*** webpack 性能优化

当所要使用的依赖库没有提供生产环境的文件（没有提供类似 `\*\*.js/\*\*.min.js`）时可以通过`DllPlugin`和`DllReferencePlugin`插件提前打包好相关模块（动态链接库的思想），如果存在生产环境的可以同时选择使用动态链接库或者 webpack 提供的外部扩展 （`externals`）属性（需要在页面注册相关js）

* [阅读参考资料一](https://juejin.im/entry/57996222128fe1005411c649)

[参考资料二](https://www.izhongxia.com/posts/44724.html#2-%E5%A4%9A%E9%A1%B5%E9%9D%A2%E5%BC%80%E5%8F%91)

[参考资料三](https://www.cnblogs.com/lvdabao/p/5944420.html)