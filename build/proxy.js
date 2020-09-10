/*
 * @Date: 2020-05-11 09:27:53
 * @LastEditTime: 2020-09-08 10:55:57
 */
/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 */
module.exports = {
  development: {
    // 接口请求代理
    "/api": {
      target: "http://eshop.yunjinshuke.com/wap/",
      changeOrigin: true,
      pathRewrite: { "^/api": "" },
    },
    "/file": {
      target: "http://eshop.yunjinshuke.com/file/",
      changeOrigin: true,
      pathRewrite: {
        "^/file": "",
      },
    },
  },
  test: {
    // 接口请求代理
    "/api": {
      target: "http://test.eshop.yunjinshuke.com/wap/",
      changeOrigin: true,
      pathRewrite: { "^/api": "" },
    },
    "/file": {
      target: "http://test.eshop.yunjinshuke.com/file/",
      changeOrigin: true,
      pathRewrite: {
        "^/file": "",
      },
    },
  },
};