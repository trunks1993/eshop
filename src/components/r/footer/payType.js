/*
 * @Author: Dad
 * @Date: 2020-09-22 16:03:47
 * @LastEditors: Dad
 * @LastEditTime: 2020-09-25 10:09:03
 */
import { useEffect, useState, useRef } from 'react';
import { getChannel } from '@/utils';
import { pay, shiluPay, getPayStatus } from '@/services/app';
import { Toast } from 'antd-mobile';

export default ({ orderId, successUrl }) => {
  const [payUrl, setPayUrl] = useState('');
  const [orderInfo, setOrderInfo] = useState('');

  const formRef = useRef();
  let timer = null;
  useEffect(() => {
    if (orderId) _pay();
  }, [orderId]);

  const _pay = async () => {
    try {
      if (getChannel() == 'PLAT3') {
        //H5支付
        shilu();
      } else if (getChannel() == 'WECHAT' || getChannel() == 'PLAT3_WECHAT') {
        //wx公众号支付
        const [err, data, msg] = await pay({ orderId });
        if (!err) {
          wxpay(data);
          _getPayStatus();
        } else Toast.fail(msg);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const wxpay = ({
    appId,
    timestamp,
    nonceStr,
    signType,
    paySign,
    orderdetail,
  }) => {
    WeixinJSBridge.invoke(
      'getBrandWCPayRequest',
      {
        appId, //公众号名称，由商户传入
        timeStamp: timestamp, //时间戳，自1970年以来的秒数
        nonceStr, //随机串
        package: orderdetail,
        signType, //微信签名方式：
        paySign, //微信签名
      },
      (res) => {
        if (res.err_msg == 'get_brand_wcpay_request:cancel') {
          timer = null;
        }
      }
    );
  };

  //wx-h5--支付
  const shilu = async () => {
    try {
      const [err, data, msg] = await shiluPay({ orderId });
      if (!err) {
        //这里唤起了H5支付 通过form的action
        setPayUrl(data.payUrl);
        setOrderInfo(data.orderInfo);
        Toast.loading();
        formRef.current.submit();
      } else Toast.fail(msg, 1);
    } catch (error) {}
  };

  const _getPayStatus = async () => {
    try {
      const [err, data, msg] = await getPayStatus({ orderId });
      if (!err) {
        if (data.payStatus === 1) {
          Toast.success('支付成功');
          successUrl && successUrl();
        } else timer = setTimeout(() => _getPayStatus(), 1000);
      } else Toast.fail(msg, 1);
    } catch (error) {}
  };

  return (
    <form id="pay_form" action={payUrl} method="post" ref={formRef}>
      <input
        id="order_info"
        type="text"
        name="orderInfo"
        value={orderInfo}
        style={{ display: 'none' }}
      />
    </form>
  );
};
