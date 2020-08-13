/*
 * @Date: 2020-06-28 19:58:04
 * @LastEditTime: 2020-07-20 20:38:24
 */
export const patternPhone = /^((13[0-9])|(14[0-9])|(15[0-9])|(17[0-9])|(18[0-9]))\d{8}$/;

/** 匹配网址URL的正则表达式：[a-zA-z]+://[^s]* */
export const patternUrl = /[a-zA-z]+:\/\/[^s]*/;

/** 身份证号码 */
export const patternIdCard = /^(\d{15}$)|(^\d{17}([0-9]|X|x)$)/;

/** 姓名 */
export const patternName = /^[\u4e00-\u9fa5A-Za-z]{1,16}$/;
