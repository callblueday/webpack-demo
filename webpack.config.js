var path = require("path");
var webpack = require("webpack");

// Plugins
var HtmlWebpackPlugin = require("html-webpack-plugin");

const build_path = "dist";

/**
 * ----------------------------------------
 *  config
 * ----------------------------------------
 */

// scratch 原始提供的配置
var originalWebpackConfig = {
    devServer: {
        contentBase: path.resolve(__dirname, "build"),
        host: "localhost",
        port: process.env.PORT || 9602,
        disableHostCheck: true
    },
    devtool: "cheap-module-source-map",
    resolve: {
        alias:{
            src:path.resolve(__dirname, 'src')
        },
        extensions:['.js','.json','.svg','css']
    },
    entry: {
        mstage: ["./src/"]
    },
    output: {
        path: path.resolve(__dirname, build_path),
        filename: "[name].js"
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            plugins: [
                                "transform-object-rest-spread", "transform-runtime"
                            ],
                            presets: [
                                [
                                    "es2015", {
                                        modules: false
                                    }
                                ],
                                "stage-3"
                            ]
                        }
                    }
                ],
                include: path.resolve(__dirname, "src/"),

            }, {
                test: /\.css$/,
                use: [
                    { loader: "style-loader" },
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            importLoaders: 1,
                            localIdentName: "[name]_[local]",
                            camelCase: true
                        }
                    }
                ]
            },
            {
                test: /\.(svg|png|wav)$/,
                loader: 'file-loader',
                options: {
                    outputPath: 'static/resource/'
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": '"' + process.env.NODE_ENV + '"',
            "process.env.DEBUG": Boolean(process.env.DEBUG)
        })
    ].concat(process.env.NODE_ENV === "production" ? [
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            parallel: true,
            minimize: true
        })
    ] : [])
};

// build 配置 发布目录 '/dist'
var buildConfig = Object.assign({}, originalWebpackConfig, {
    plugins: originalWebpackConfig.plugins.concat([
        new HtmlWebpackPlugin({
            title: "mstage demo",
            template: 'src/index.ejs',
            filename: 'index.html'
        })
    ])
});

// start sdk 的配置
var startConfig = Object.assign({}, buildConfig, {
    devServer: {
        contentBase: path.resolve(__dirname, build_path),
        host: "localhost",
        port: process.env.PORT || 9602,
        disableHostCheck: true
    },
    devtool: "cheap-module-source-map"
});

let config = {};
if( !process.env.PORT ){
    config = originalWebpackConfig;
}else if(process.env.PORT == 9602 || process.env.PORT == 9603) {
    config = startConfig;
}else if(process.env.PORT) {
    config = buildConfig;
}

module.exports = config;
