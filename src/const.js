/*
 * @Date: 2020-08-05 09:53:34
 * @LastEditTime: 2020-08-25 09:16:20
 */
export const ORDER_STATUS_1 = 1; // 待付款
export const ORDER_STATUS_2 = 2; // 处理中
export const ORDER_STATUS_3 = 3; // 已完成
export const ORDER_STATUS_4 = 4; // 已取消

export const PRODUCT_TYPE_1 = 101; //卡密
export const PRODUCT_TYPE_2 = 102; // 兑换码
export const PRODUCT_TYPE_3 = 103; // 短链接
export const PRODUCT_TYPE_4 = 104; // 直充

export const ProductTypes = {
  [PRODUCT_TYPE_1]: '卡密',
  [PRODUCT_TYPE_2]: '兑换码',
  [PRODUCT_TYPE_3]: '短链接',
  [PRODUCT_TYPE_4]: '直充',
};
