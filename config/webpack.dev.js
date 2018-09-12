const webpack = require('webpack')
const path = require("path");
const uglify = require('uglifyjs-webpack-plugin'); // 引入js打包
const htmlPlugin = require('html-webpack-plugin'); // html打包插件
const PurifyCSSPlugin = require("purifycss-webpack");
const extractTextPlugin = require('extract-text-webpack-plugin') // css 分离
const glob = require('glob');
var website ={
    publicPath:"http://localhost:8888/"
    // publicPath:"http://192.168.1.103:8888/"
}
module.exports={
    mode: 'development',
    // 入口文件配置项
    entry: {
        // 里面的main是可以随便写的
        main: './src/main.js',
        main1: './src/main1.js',
    },
    // 出口文件的配置项
    output: {
        // 打包的路径
        path: path.resolve(__dirname,'../dist'),
        // 打包的文件名
        filename: '[name].js',   // 这里[name] 是告诉我们入口进去的文件是什么名字，打包出来也同样是什么名字
        publicPath: website.publicPath // 主要作用是处理静态文件路径的
    },
    // 模块：例如解读css，图片如何转换，压缩
    module: {
        rules: [
            // css loader
            {
                test: /\.css$/,
                use: extractTextPlugin.extract({
                    fallback: "style-loader",
                    use:[
                        {loader:"css-loader"},
                        {
                            loader:"postcss-loader",
                        },
                    ]
                }),
                // css 分离后重新配置，之前配置注释
                // use: [
                //     {loader: "style-loader"},
                //     {loader: "css-loader"}
                // ]
            },
            // 图片 loader
            {
                test:/\.(png|jpg|gif|jpeg)/, //匹配图片文件后缀名称
                use: [
                    {
                        loader: 'url-loader', // 是指定使用的loader和loader的配置参数
                        options: {
                            limit: 500, // 把小于500B的文件打成base64的格式，写入js
                            name: '[name].[ext]',
                            outputPath: 'images'
                        }
                    }
                ]
            },
        //     {
        // 　　　　　　test: /\.(png|jpg)$/,
        // 　　　　　　loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]'
        // 　　　},
            {
                test: /\.(htm|html)$/i,
                 use:[ 'html-withimg-loader'] 
            },
            //less loader
            {
                test: /\.less$/,
                use: extractTextPlugin.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "less-loader"
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            //     [{
            //            loader: "style-loader" // creates style nodes from JS strings
            //         }, 
            //         {
            //             loader: "css-loader" // translates CSS into CommonJS
            //         },
            //         {
            //             loader: "less-loader" // compiles Less to CSS
            //    }]
            },
            // scss loader
            {
                test: /\.scss$/,
                use: extractTextPlugin.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "sass-loader"
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            },
            //babel 配置
            {
                test:/\.(jsx|js)$/,
                use:{
                    loader:'babel-loader',
                    options:{
                        presets:[
                            "es2015","react"
                        ]
                    }
                },
                exclude:/node_modules/
            }
        ]
    },
    // 插件，用于生产模板和各项功能
    plugins:[
        new webpack.HotModuleReplacementPlugin(), // 模块热替换，更新各种模块，无需进行完全刷新
        new uglify(), // js压缩插件
        new htmlPlugin({ 
            minify: { // 对html文件压缩
                removeAttributeQuotes: true  // 去掉属性的双引号
            },
            hash: true, // 为了开发中js有缓冲效果，所以加入了hash，这样可以有效避免缓冲js
            template: './src/index.html' // 要打包的html模板路径和文件名称
        }), 
        new PurifyCSSPlugin({ 
            //这里配置了一个paths，主要是需找html模板，purifycss根据这个配置会遍历你的文件，查找哪些css被使用了。
            paths: glob.sync(path.join(__dirname, 'src/*.html')),
        }),
        new extractTextPlugin("css/index.css"), // 这里的/css/index.css 是分离后的路径
    ],
    // 配置webpack开发服务功能
    devServer: {
        // 设置基本目录结构
        contentBase: path.resolve(__dirname,'../dist'),
        // 服务器的IP地址，可以使用IP也可以使用localhost
        host: 'localhost',
        // 服务端压缩是否开启
        compress: true,
        // 配置端口号
        port: 8888
    }
}