/*
 * @Date: 2020-05-29 14:30:17
 * @LastEditTime: 2020-09-10 13:49:29
 */

const path = require("path");
const PAGE_PATH = path.resolve(__dirname, "../src/modules");
const glob = require("glob");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpackMerge = require("webpack-merge");

const externalConfig = [
  {
    name: "react",
    scope: "React",
    module: "umd",
    js:
      process.env.NODE_ENV === "development"
        ? "react.development.js"
        : "react.production.min.js",
  },
  {
    name: "react-dom",
    scope: "ReactDOM",
    module: "umd",
    js:
      process.env.NODE_ENV === "development"
        ? "react-dom.development.min.js"
        : "react-dom.production.min.js",
  },
  {
    name: "redux",
    scope: "Redux",
    js: "redux.min.js",
  },
  {
    name: "lodash.js",
    scope: "_",
    js: "lodash.min.js",
  },
  {
    name: "moment.js",
    scope: "moment",
    js: "moment.min.js",
  },
  {
    name: "immer",
    scope: "immer",
    js:
      process.env.NODE_ENV === "development"
        ? "immer.umd.development.min.js"
        : "immer.umd.production.min.js",
  },
  {
    name: "antd-mobile",
    scope: "antd-mobile",
    js: "antd-mobile.min.js",
  },
];

exports.cdnBaseHttp = "https://cdn.bootcdn.net/ajax/libs";
exports.externalConfig = externalConfig;

exports.getModulesVersion = () => {
  let mvs = {};
  let regexp = /^npm_package_.{0,3}dependencies_/gi;
  for (let m in process.env) {
    // 从node内置参数中读取，也可直接import 项目文件进来
    if (regexp.test(m)) {
      // 匹配模块
      // 获取到模块版本号
      mvs[m.replace(regexp, "").replace(/_/g, "-")] = process.env[m].replace(
        /(~|\^)/g,
        ""
      );
    }
  }
  return mvs;
};

exports.getExternalModules = (config) => {
  let externals = {}; // 结果
  let dependencieModules = this.getModulesVersion(); // 获取全部的模块和版本号

  config = config || this.externalConfig; // 默认使用utils下的配置
  config.forEach((item) => {
    const hasPoint = item.name.indexOf(".") > 0;
    const spliteName = item.name.split(".")[0];
    // 遍历配置
    if (item.name in dependencieModules || spliteName in dependencieModules) {
      let version =
        dependencieModules[item.name] || dependencieModules[spliteName];
      // 拼接css 和 js 完整链接
      // item.css = item.css && [this.cdnBaseHttp, version, item.css].join("/");
      item.js =
        item.js &&
        `${item.baseHttp || this.cdnBaseHttp}/${item.name}/${version}/${
          item.module ? item.module + "/" + item.js : item.js
        }`;
      externals[hasPoint ? spliteName : item.name] = item.scope; // 为打包时准备
    } else {
      throw new Error("相关依赖未安装，请先执行npm install " + item.name);
    }
  });

  console.log("exports.getExternalModules -> externals", externals);
  return externals;
};

exports.resolve = function(dir) {
  return path.resolve(__dirname, dir);
};

//多入口配置
// 通过glob模块读取pages文件夹下的所有对应文件夹下的js后缀文件，如果该文件存在
// 那么就作为入口处理
exports.entries = function() {
  const entryFiles = glob.sync(PAGE_PATH + "/*/index.js");
  const entryFilesNext = glob.sync(PAGE_PATH + "/*/*/index.js");

  entryFiles.push(...entryFilesNext);
  
  var map = {};
  entryFiles.forEach((filePath) => {
    var i = filePath.lastIndexOf("/");
    var newfilePath = filePath.substring(0, i);

    var filename = newfilePath.substring(newfilePath.lastIndexOf("/") + 1);
    map[filename] = filePath;
  });
  return map;
};

//多页面输出配置
// 与上面的多页面入口配置相同，读取pages文件夹下的对应的html后缀文件，然后放入数组中
exports.htmlPlugin = function(externalConfig) {
  const entryHtml = glob.sync(PAGE_PATH + "/*/index.html");
  const entryHtmlNext = glob.sync(PAGE_PATH + "/*/*/index.html");

  entryHtml.push(...entryHtmlNext);

  let arr = [];
  entryHtml.forEach((filePath) => {
    var i = filePath.lastIndexOf("/");
    var newfilePath = filePath.substring(0, i);
    var filename = newfilePath.substring(newfilePath.lastIndexOf("/") + 1);

    let conf = {
      // 模板来源
      template: filePath,
      // 文件名称
      filename: filename + ".html",
      // 页面模板需要加对应的js脚本，如果不加这行则每个页面都会引入所有的js脚本
      chunks: ["manifest", "vendor", filename],
      cdnConfig: externalConfig,
      inject: true,
    };
    if (process.env.NODE_ENV === "production") {
      conf = webpackMerge(conf, {
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          // removeAttributeQuotes: true,
        },
        // chunksSortMode: "dependency",
      });
    }
    arr.push(new HtmlWebpackPlugin(conf));
  });
  return arr;
};
