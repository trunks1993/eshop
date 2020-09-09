/*
 * @Date: 2020-06-30 09:20:46
 * @LastEditTime: 2020-09-08 16:02:58
 */

import { extend } from "umi-request";
import { getToken } from "@/utils";

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  prefix: process.env.BASE_API,
  // errorHandler, // 默认错误处理
  credentials: "include", // 默认请求是否带上cookie
  timeout: 10000,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
});

request.use(async (ctx, next) => {
  const { req } = ctx;
  const { options } = req;

  options.headers.token = getToken();

  await next();
  const { res } = ctx;
  const { success, result, resultMsg } = res;
  if (!success) ctx.res = [!res.success, null, resultMsg];
  else ctx.res = [!res.success, result, null];
});

export default request;
