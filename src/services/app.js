/*
 * @Date: 2020-07-01 17:41:31
 * @LastEditTime: 2020-08-21 14:09:07
 */
import request from '@/utils/request';

/**
 * @name:
 * @param {}
 */
export async function getList() {
  return request('/home/searchHomeCategoryList', {
    method: 'POST',
  });
}
