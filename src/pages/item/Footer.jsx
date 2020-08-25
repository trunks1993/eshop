import React, { useEffect, useState } from 'react';
import order from '@/assets/images/order.png';
import service from '@/assets/images/service.png';
import { Toast } from 'antd-mobile';
import { buyImmediately, pay } from '@/services/app';

export default (props) => {
  const shop = async () => {
    try {
      const { goodsCode, rechargeAccount, amount } = props;
      if (!rechargeAccount && !amount) return Toast.fail('请输入完整信息', 1);
      if (!goodsCode) return Toast.fail('请选择商品', 1);
      const [err, data, msg] = await buyImmediately({
        goodsCode,
        rechargeAccount,
        amount,
      });
      if (!err) shopPay(data.orderId);
      else Toast.fail(msg, 1);
    } catch (error) {}
  };

  const shopPay = async (orderId) => {
    try {
      const [err, data, msg] = await pay({ orderId });
      if (!err) console.log(data);
      else Toast.fail(msg, 1);
    } catch (error) {}
  };

  return (
    <>
      <div className="card-item__footer--block"></div>
      <div className="card-item__footer">
        <div className="card-item__footer-subtn">
          <img src={service} />
          <span className="card-item__footer-subtn-title">客服</span>
        </div>
        <div
          className="card-item__footer-subtn line"
          onClick={() => history.push('/order')}
        >
          <img src={order} />
          <span className="card-item__footer-subtn-title">订单</span>
        </div>
        <div className="card-item__footer-btn" onClick={shop}>
          立即购买
        </div>
      </div>
    </>
  );
};
