/*
 * @Date: 2020-06-30 09:20:46
 * @LastEditTime: 2020-09-02 09:13:41
 */

import { extend } from "umi-request";
// import { METHOD_POST, whiteUrls } from '@/const';
import { getToken, removeToken, setToken } from "./auth";
import _ from "lodash";
import { getTargetUrlTimeout } from "@/services/app";
import { Toast } from "antd-mobile";
import { createHashHistory } from "history";
const history = createHashHistory();

const codeMessage = {
  200: "服务器成功返回请求的数据。",
  201: "新建或修改数据成功。",
  202: "一个请求已经进入后台排队（异步任务）。",
  204: "删除数据成功。",
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
  401: "用户没有权限（令牌、用户名、密码错误）。",
  403: "用户得到授权，但是访问是被禁止的。",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
  406: "请求的格式不可得。",
  410: "请求的资源被永久删除，且不会再得到的。",
  422: "当创建一个对象时，发生一个验证错误。",
  500: "服务器发生错误，请检查服务器。",
  502: "网关错误。",
  503: "服务不可用，服务器暂时过载或维护。",
  504: "网关超时。",
};

/**
 * 异常处理程序
 */
const errorHandler = (error) => {
  const { response } = error;
  // debugger;
  // if (!response) {
  // }
  history.push("/404");
  return response;
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  prefix: process.env.BASE_API,
  errorHandler, // 默认错误处理
  credentials: "include", // 默认请求是否带上cookie
  timeout: 10000,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
});

request.use(async (ctx, next) => {
  const { req } = ctx;
  const { url, options } = req;
  const { data, method } = options;

  options.headers.token = getToken();

  // 如果是post请求并且 需要接口需要token
  // const needToken =
  //   method?.toLowerCase === METHOD_POST.toLowerCase && !whiteUrls.includes(url);

  // if (needToken) options.data.token = getToken();

  await next();
  const { res } = ctx;
  const { success, result, resultMsg, code } = res;
  if (!success) ctx.res = [!res.success, null, resultMsg];
  else ctx.res = [!res.success, result, null];
  if (code === '-2') {
    // getToken();
    // removeToken();
    unLogin();
  }
});

const unLogin = async () => {
  try {
    const [err, data, msg] = await getTargetUrlTimeout();
    if (!err) {
      window.location.href = data;
      // const redirect = location.href.split("#")[1];
      // window.location.href = `http://192.168.28.124:8081/${encodeURIComponent(
      //   redirect
      // )}`;
      // location.reload();
    } else Toast.fail(msg, 1);
  } catch (error) {}
};

export default request;
