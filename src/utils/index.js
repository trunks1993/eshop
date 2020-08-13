/*
 * @Date: 2020-06-19 20:47:15
 * @LastEditTime: 2020-08-12 17:56:36
 */
import moment from 'moment';

export function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function flatTree(tree, flatArr = []) {
  func(tree, flatArr);
  return flatArr;
}

function func(tree, arr) {
  if (!tree.length) return;
  Array.prototype.push.apply(arr, tree);
  tree.map(
    (item) => item.children && item.children.length && func(item.children, arr)
  );
}

export function getQueryVariable(variable) {
  const query = window.location.hash.split('?')[1];
  if (!query) return;
  const vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=');
    if (pair[0] === variable) {
      return pair[1];
    }
  }
  return false;
}

export function formateTime(timeStr, formatStr) {
  return timeStr
    ? moment(timeStr).format(formatStr ? formatStr : 'YYYY-MM-DD HH:mm:ss')
    : '';
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

// 判断设备为 ios
export function isIos() {
  var u = navigator.userAgent;
  if (u.indexOf("iPhone") > -1 || u.indexOf("iOS") > -1) {
      return true;
  }
  return false;
}