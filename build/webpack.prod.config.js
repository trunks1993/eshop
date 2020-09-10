/*
 * @Date: 2020-05-29 14:31:35
 * @LastEditTime: 2020-09-10 13:40:29
 */

const webpackMerge = require("webpack-merge");
const baseWebpackConfig = require("./webpack.base.config");
const utils = require("./utils");
const webpack = require("webpack");
// 构建速度分析
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();

const { CleanWebpackPlugin } = require("clean-webpack-plugin");

// css压缩
// const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

// 压缩插件 对es6友好
const TerserPlugin = require("terser-webpack-plugin");

// const externalConfig = JSON.parse(JSON.stringify(utils.externalConfig)); // 读取配置
// const externalModules = utils.getExternalModules(externalConfig); // 获取到合适的路径（引用类型，自动改变）

// 打包分析
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const config = webpackMerge(baseWebpackConfig, {
  // 指定构建环境
  mode: "production",
  // externals: externalModules,
  // 插件
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerPort: 1110, // 指定端口号
      openAnalyzer: false,
    }),
    new webpack.DefinePlugin({
      "process.env": {
        BASE_API: '"/wap"',
        FILE_URL: '"/file"',
      },
    }),
    new CleanWebpackPlugin(),
    // new HtmlWebpackPlugin({
    //   filename: utils.resolve("./../dist/index.html"), // html模板的生成路径
    //   template: "index.html", //html模板
    //   // inject: true, // true：默认值，script标签位于html文件的 body 底部
    //   hash: true, // 在打包的资源插入html会加上hash
    //   cdnConfig: externalConfig,
    //   // onlyCss: false, //加载css
    //   //  html 文件进行压缩
    //   minify: {
    //     removeComments: true, //去注释
    //     collapseWhitespace: true, //压缩空格
    //     // removeAttributeQuotes: true, //去除属性引用
    //   },
    // }),
  ],
  optimization: {
    // minimizer: [
    //   new OptimizeCSSAssetsPlugin({
    //     assetNameRegExp: /\.scss$/g,
    //     cssProcessor: require("cssnano"),
    //     cssProcessorPluginOptions: {
    //       preset: ["default", { discardComments: { removeAll: true } }],
    //     },
    //     canPrint: true,
    //   }),
    // ],
    minimize: true,
    usedExports: true,
    minimizer: [
      new TerserPlugin({
        parallel: 4, // 开启几个进程来处理压缩，默认是 os.cpus().length - 1
      }),
    ],
  },
});

module.exports = smp.wrap(config);
