/*
 * @Date: 2020-07-01 17:41:31
 * @LastEditTime: 2020-09-11 14:00:03
 */
import request from '@/request';
import { createHashHistory } from 'history';
const history = createHashHistory();

/**
 * 异常处理程序
 */
// const errorHandler = (error) => {
//   const { response } = error;
//   history.push('/404');
//   return response;
// };

// request.extendOptions({ errorHandler });

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
export async function getOrderId(data) {
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
  return request('/wx/jsapi/pay', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 发起订单支付
 * @param {}
 */
export async function shiluPay(data) {
  return request('/pay3/shilu/pay', {
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
/**
 * @name: 获取登录超时后的跳转URL
 * @param {}
 */
export async function getTargetUrlTimeout() {
  return request('/wx/user/getTargetUrlTimeout', {
    method: 'POST',
  });
}

/**
 * @name: 获取登录超时后的跳转URL
 * @param {}
 */
export async function wxCallback(data) {
  return request('/wx/pay/callback', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 获取用户基本信息
 * @param {}
 */
export async function getUseInfo() {
  return request('/wx/user/getUseInfo', {
    method: 'POST',
  });
}

/**
 * @name: 获取相同分类下的品牌列表
 * @param {}
 */
export async function getBrandListInSameCategory(brandCode) {
  return request('/brand/getBrandListInSameCategory', {
    method: 'POST',
    data: { brandCode },
  });
}

/**
 * @name: 获取首页商户商品列表
 * @param {}
 */
export async function getHomeShopList({ currPage, pageSize }) {
  return request('/home/searchHomeMerchantGoodsList', {
    method: 'POST',
    data: { currPage, pageSize },
  });
}

/**
 * @name: 获取手机地址
 * @param {}
 */
export async function getPhoneAddress({ telephone }) {
  return request('/brand/getAttribution', {
    method: 'POST',
    data: { telephone },
  });
}
