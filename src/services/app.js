/*
 * @Date: 2020-07-01 17:41:31
 * @LastEditTime: 2020-07-01 17:42:33
 */
import request from '@/utils/request';

/**
 * @name: 获取购物车数量
 * @param {}
 */
export async function getCountOfCar() {
  return request('/cart/countCartItem', {
    method: 'POST',
  });
}
