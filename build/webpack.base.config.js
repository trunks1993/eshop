/*
 * @Date: 2020-05-29 14:30:28
 * @LastEditTime: 2020-09-08 16:35:48
 */

const utils = require("./utils");
const path = require("path");
const os = require("os");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

// 擦除无用css
const PurgecssPlugin = require("purgecss-webpack-plugin");

// 多线程处理打包
const HappyPack = require("happypack");
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

// 替代tree-shaking
// const WebpackDeepScopeAnalysisPlugin = require("webpack-deep-scope-plugin")
//   .default;

// antd主题
const modifyVars = {
  "brand-primary": "#2272FC",
};

const glob = require("glob");
const PATHS = {
  src: path.join(__dirname, "./src"),
};

module.exports = {
  // 入口
  entry: utils.entries(),
  // 出口
  output: {
    path: utils.resolve("../dist"),
    filename: "js/[name].[hash].js",
    publicPath: "/", // 打包后的资源的访问路径前缀
  },
  devtool: "inline-source-map",
  resolve: {
    extensions: [".js", ".jsx", '.vue', ".json"], // 解析扩展。（当我们通过路导入文件，找不到改文件时，会尝试加入这些后缀继续寻找文件）
    alias: {
      "@": path.join(__dirname, "..", "src"), // 在项目中使用@符号代替src路径，导入文件路径更方便
    },
  },
  // 模块
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: "vue-loader",
      },
      {
        test: /\.(js|jsx)$/, //一个匹配loaders所处理的文件的拓展名的正则表达式，这里用来匹配js和jsx文件（必须）
        exclude: /node_modules/, // 屏蔽不需要处理的文件（文件夹）（可选）
        loader: "happypack/loader?id=happyBabel",
      },
      {
        test: /\.css$/,
        use: [
          "style-loader", // 创建 <style></style>
          "css-loader", // 转换css
          "postcss-loader",
        ],
      },
      {
        test: /\.less$/,
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader",
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                modifyVars,
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000, // url-loader 包含file-loader，这里不用file-loader, 小于10000B的图片base64的方式引入，大于10000B的图片以路径的方式导入
          name: "static/img/[name].[hash:7].[ext]",
        },
      },
      {
        test: /\.svg$/,
        loader: "svg-sprite-loader",
        options: {
          symbolId: "icon-[name]",
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000, // 小于10000B的图片base64的方式引入，大于10000B的图片以路径的方式导入
          name: "static/fonts/[name].[hash:7].[ext]",
        },
      },
      {
        test: /\.(js|jsx)$/,
        loader: "eslint-loader",
        enforce: "pre",
        include: [path.resolve(__dirname, "src")], // 指定检查的目录
        options: {
          // 这里的配置项参数将会被传递到 eslint 的 CLIEngine
          formatter: require("eslint-friendly-formatter"), // 指定错误报告的格式规范
        },
      },
    ],
  },
  plugins: [
    new PurgecssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
    }),
    new HappyPack({
      //用id来标识 happypack处理那里类文件
      id: "happyBabel",
      //如何处理  用法和loader 的配置一样
      loaders: [
        {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
          },
          query: {
            // presets: ["env", "react"],
            plugins: [
              ["import", { libraryName: "antd-mobile", style: true }], // antd按需加载
            ],
          },
        },
        {
          loader: utils.resolve("../loaders/jsxPx2VwLoader"),
          options: {},
        },
      ],
      //共享进程池
      threadPool: happyThreadPool,
      //允许 HappyPack 输出日志
      verbose: true,
    }),
    new VueLoaderPlugin(),
  ],
  optimization: {
    splitChunks: {
      chunks: "all", // "initial" | "all"(推荐) | "async" (默认就是async) | 函数
    },
  },
};
