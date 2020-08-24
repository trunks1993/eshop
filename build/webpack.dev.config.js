/*
 * @Date: 2020-05-29 14:31:03
 * @LastEditTime: 2020-08-24 16:04:07
 */

const webpackMerge = require("webpack-merge");
const baseWebpackConfig = require("./webpack.base.config");
const utils = require("./utils");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

// 构建速度分析
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();

const externalConfig = JSON.parse(JSON.stringify(utils.externalConfig)); // 读取配置
utils.getExternalModules(externalConfig); // 获取到合适的路径（引用类型，自动改变）

// 打包分析
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const config = webpackMerge(baseWebpackConfig, {
  // 指定构建环境
  mode: "development",
  // 控制台信息简化
  stats: "errors-only",
  // 插件
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerPort: 1111, // 指定端口号
      openAnalyzer: false,
    }),
    new webpack.DefinePlugin({
      "process.env": {
        BASE_API: '"/api"',
        FILE_URL: '"/file"',
      },
    }),
    new HtmlWebpackPlugin({
      filename: utils.resolve("./../dist/index.html"), // html模板的生成路径
      template: "index.html", //html模板
      inject: true, // true：默认值，script标签位于html文件的 body 底部
      cdnConfig: externalConfig, // cdn配置
      // onlyCss: true,
    }),
  ],
  // 开发环境本地启动的服务配置
  devServer: {
    historyApiFallback: true, // 当找不到路径的时候，默认加载index.html文件
    hot: true,
    contentBase: '.', // 告诉服务器从哪里提供内容。只有在你想要提供静态文件时才需要
    compress: true, // 一切服务都启用gzip 压缩：
    port: "8081", // 指定段靠谱
    publicPath: "/", // 访问资源加前缀
    proxy: {
      // 接口请求代理
      "/api": {
        target: "http://192.168.28.61:9003/",
        changeOrigin: true,
        pathRewrite: { "^/api": "" },
      },
      "/file": {
        target: "http://101.132.39.136:9080/",
        changeOrigin: true,
        pathRewrite: {
          "^/file": "",
        },
      },
    },
  },
});

module.exports = smp.wrap(config);
