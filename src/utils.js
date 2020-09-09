/*
 * @Date: 2020-09-08 14:41:47
 * @LastEditTime: 2020-09-08 14:52:56
 */
import moment from "moment";
import Cookies from "js-cookie";
import { TokenKey, ChannelKey } from "./const";

export function getQueryVariable(variable) {
  const query = window.location.hash.split("?")[1];
  if (!query) return;
  const vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split("=");
    if (pair[0] === variable) {
      return pair[1];
    }
  }
  return false;
}

export function formateTime(timeStr, formatStr) {
  return timeStr
    ? moment(timeStr).format(formatStr ? formatStr : "YYYY-MM-DD HH:mm:ss")
    : "";
}

export const getFloat = (number, n) => {
  let num = parseFloat(number);
  n = n ? n : 0;
  if (n <= 0) {
    return Math.round(number);
  }
  num = Math.round(num * Math.pow(10, n)) / Math.pow(10, n); // 四舍五入
  num = parseFloat(num).toFixed(n); // 补足位数
  return num;
};

export function toFixed(number, precision) {
  var multiplier = Math.pow(10, precision + 1),
    wholeNumber = Math.floor(number * multiplier);
  return (Math.round(wholeNumber / 10) * 10) / multiplier;
}

export const getToken = () => Cookies.get(TokenKey);

export const setToken = (token) => Cookies.set(TokenKey, token);

export const getChannel = () => Cookies.get(ChannelKey);

export const setChannel = (channel) => Cookies.set(ChannelKey, channel);
