/*
 * @Date: 2020-09-08 14:42:00
 * @LastEditTime: 2020-09-08 14:51:03
 */
export const TRANSTEMP = 10000; // 金额转换倍数
export const PRECISION = 2; // 金额转换倍数
export const TokenKey = 'token';
export const ChannelKey = 'channel';

export const ORDER_STATUS_1 = 1; // 待付款
export const ORDER_STATUS_2 = 2; // 处理中
export const ORDER_STATUS_3 = 3; // 已完成
export const ORDER_STATUS_4 = 4; // 已取消

export const PRODUCT_TYPE_1 = 101; //卡密
export const PRODUCT_TYPE_2 = 102; // 兑换码
export const PRODUCT_TYPE_3 = 103; // 短链接
export const PRODUCT_TYPE_4 = 104; // 直充

export const ProductTypes = {
  [PRODUCT_TYPE_1]: "卡密",
  [PRODUCT_TYPE_2]: "兑换码",
  [PRODUCT_TYPE_3]: "短链接",
  [PRODUCT_TYPE_4]: "直充",
};

export const TRACE_STATUS_0 = 0; // 初始
export const TRACE_STATUS_1 = 1; // 待付款
export const TRACE_STATUS_2 = 2; // 待发货
export const TRACE_STATUS_3 = 3; // 充值中
export const TRACE_STATUS_4 = 4; // 成功
export const TRACE_STATUS_5 = 5; // 失败
export const TRACE_STATUS_6 = 6; // 取消

export const TraceStatus = {
  [TRACE_STATUS_0]: "初始",
  [TRACE_STATUS_1]: "待付款",
  [TRACE_STATUS_2]: "待发货",
  [TRACE_STATUS_3]: "充值中",
  [TRACE_STATUS_4]: (type) => (type === PRODUCT_TYPE_4 ? "充值成功" : "已完成"),
  [TRACE_STATUS_5]: "失败",
  [TRACE_STATUS_6]: "取消",
};

export const TRANSACTION_TYPE_1 = 1;
export const TRANSACTION_TYPE_2 = 2;

export const TransactionTypes = {
  [TRANSACTION_TYPE_1]: "批采",
  [TRANSACTION_TYPE_2]: "直充",
};

export const KAMI_TYPE_1 = 1;
export const KAMI_TYPE_2 = 2;
export const KAMI_TYPE_3 = 3;

export const KamiTypes = {
  [KAMI_TYPE_1]: "有效",
  [KAMI_TYPE_2]: "无效",
  [KAMI_TYPE_3]: "已售出",
};
