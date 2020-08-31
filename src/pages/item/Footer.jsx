import React, { useEffect, useState } from "react";
import order from "@/assets/images/order.png";
import service from "@/assets/images/service.png";
import { Toast, Modal } from "antd-mobile";
import { buyImmediately, pay, getOrderByOrderId } from "@/services/app";
import _ from "lodash";

export default (props) => {
  let timer = null;

  const {
    goodsCode,
    rechargeAccount,
    amount,
    type,
    successCallBack,
    history,
  } = props;

  const shop = async () => {
    try {
      if (!rechargeAccount && !amount) return Toast.fail("请输入完整信息", 1);
      if (type == "zhichong" && !rechargeAccount) {
        return Toast.fail("请输入充值手机号", 1);
      } else if (type == "kami" && !amount) {
        return Toast.fail("请输入数量", 1);
      } else if (
        rechargeAccount &&
        !/^1[3456789]\d{9}$/.test(rechargeAccount.split(" ").join(""))
      ) {
        return Toast.fail("手机号格式不正确", 1);
      }

      if (!goodsCode) return Toast.fail("请选择商品", 1);
      const [err, data, msg] = await buyImmediately({
        goodsCode,
        rechargeAccount,
        amount,
      });
      if (!err) {
        shopPay(data.orderId);
      } else Toast.fail(msg, 1);
    } catch (error) {}
  };

  const shopPay = async (orderId) => {
    try {
      const [err, data, msg] = await pay({ orderId });
      if (!err) {
        getList(orderId);
        wxpay(data);
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
          successCallBack(orderId);
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
          {!_.isEmpty(props?.tags) && (
            <div className="item-footer__btn-tags">{props?.tags}</div>
          )}
          {props?.amount ? "立即购买" : "立即充值"}
        </div>
      </div>
    </>
  );
};
