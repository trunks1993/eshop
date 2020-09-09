import React, { useEffect, useState } from "react";
import order from "@/modules/es/assets/images/order.png";
import service from "@/modules/es/assets/images/service.png";
import { Toast, Modal } from "antd-mobile";
import { getOrderId, pay, getOrderByOrderId } from "@/modules/es/services/app";
import _ from "lodash";

export default (props) => {
  let timer = null;

  const { children, successCallback, validCallback, history, btnText } = props;

  const shop = async () => {
    try {
      const params = validCallback();

      if (!params) return;

      let [err, data, msg] = await getOrderId(params);

      const { orderId } = data;

      if (!err) {
        [err, data, msg] = await pay({ orderId });
        if (!err) {
          getList(orderId);
          wxpay(data);
        } else Toast.fail(msg, 1);
      } else Toast.fail(msg, 1);
    } catch (error) {}
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
      "getBrandWCPayRequest",
      {
        appId, //公众号名称，由商户传入
        timeStamp: timestamp, //时间戳，自1970年以来的秒数
        nonceStr, //随机串
        package: orderdetail,
        signType, //微信签名方式：
        paySign, //微信签名
      },
      (res) => {
        if (res.err_msg == "get_brand_wcpay_request:cancel") {
          clearTimeout(timer);
        }
      }
    );
  };

  const getList = async (orderId) => {
    try {
      const [err, data, msg] = await getOrderByOrderId({ orderId });
      if (!err) {
        if (data.payStatus === 1) {
          clearTimeout(timer);
          Toast.success("支付成功");
          successCallback(orderId);
        } else timer = setTimeout(() => getList(orderId), 1000);
      } else Toast.fail(msg, 1);
    } catch (error) {}
  };

  const kefuModal = _.debounce(() => {
    Modal.alert(
      <div className="modalTop">咨询商品问题,请添加客服QQ(2045879978)</div>,
      "",
      [
        {
          text: "我知道了",
          onPress: () => {},
        },
      ]
    );
  }, 100);

  return (
    <>
      <div className="item-footer">
        <div className="item-footer-subtn" onClick={kefuModal}>
          <img src={service} />
          <span className="item-footer-subtn-title">客服</span>
        </div>
        <div
          className="item-footer-subtn line"
          onClick={() => history.push("/order")}
        >
          <img src={order} />
          <span className="item-footer-subtn-title">订单</span>
        </div>
        <div className="item-footer__btn" onClick={shop}>
          {children}
          {btnText}
        </div>
      </div>
    </>
  );
};
