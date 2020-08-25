/*
 * @Date: 2020-07-01 17:41:31
 * @LastEditTime: 2020-08-24 17:08:21
 */
import request from '@/utils/request';

/**
 * @name: 获取首页商品目录及品牌列表
 * @param {}
 */
export async function getList() {
  return request('/home/searchHomeCategoryList', {
    method: 'POST',
  });
}

/**
 * @name: 立即购买
 * @param {}
 */
export async function buyImmediately(data) {
  return request('/order/buyImmediately', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 取消订单
 * @param {}
 */
export async function cancelOrder(data) {
  return request('/order/cancelOrder', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 查询订单信息, 不带详情列表
 * @param {}
 */
export async function getOrderByOrderId(data) {
  return request('/order/getOrderByOrderId', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 查询订单信息，带详情列表
 * @param {}
 */
export async function getOrderWithDetailByOrderId(data) {
  return request('/order/getOrderWithDetailByOrderId', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 分页查询采购订单
 * @param {}
 */
export async function searchUserSubscribeOrderList(data) {
  return request('/order/searchUserSubscribeOrderList', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 发起订单支付
 * @param {}
 */
export async function pay(data) {
  return request('/wx/pay', {
    method: 'POST',
    data,
  });
}
/**
 * @name: 通过品牌编码获取商品列表
 * @param {}
 */
export async function searchGoodsByBrandCode(data) {
  return request('/detail/searchGoodsByBrandCode', {
    method: 'POST',
    data,
  });
}
