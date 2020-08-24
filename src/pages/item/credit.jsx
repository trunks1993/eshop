import React, { useEffect, useState } from "react";
import BScroll from "@better-scroll/core";
import aqy from "@/assets/images/aqy.png";
import { List, InputItem, WhiteSpace } from "antd-mobile";

const goodsSkus = [
  {
    name: "黄金会员",
  },
  {
    name: "钻石会员",
  },
  {
    name: "黄金会员黄金会员",
  },
  {
    name: "黄金会员",
  },
  {
    name: "黄金会员",
  },
  {
    name: "黄金会员",
  },
];

const norms = [
  {
    name: "月卡",
    price: 9900,
    facePrice: 11000,
  },
  {
    name: "季卡",
    price: 9900,
    facePrice: 11000,
  },
  {
    name: "月卡",
    price: 9900,
    facePrice: 11000,
  },
  {
    name: "半年卡",
    price: 9900,
    facePrice: 11000,
  },
  {
    name: "月卡",
    price: 9900,
    facePrice: 11000,
  },
  {
    name: "半年卡",
    price: 9900,
    facePrice: 11000,
  },
];

export default (props) => {
  const { history } = props;
  return (
    <div className="credit-item">
      <div className="credit-item__head">
        <img src={aqy} />
        <span className="credit-item__head-name">爱奇艺</span>
      </div>

      <div className="credit-item__count">
        <div className="credit-item__count-title">充值账号</div>
        <InputItem type="phone" placeholder="请输入充值手机号" />

        <div className="credit-item__count-content">
          <div className="title">购买须知</div>
          <p>
            1.
            收到的短链接就是星礼卡的电子兑换券，点击短链接即可生成二维码，到店出示二维码给店员扫码即可兑换
          </p>
          <p>2. 需要一次性消费完，并且商品一经售出不可以退换 </p>
          <p>
            3.
            不支持的门店：浦东机场国内登机口门店、浦东机场国际登机口门店、浦东机场交通中心点等
          </p>
          <p>4. 代金券的有效期为3年</p>
        </div>
      </div>

      <div className="credit-item__sku">
        <div className="credit-item__sku-title">选择商品</div>
        <ul className="credit-item__sku-context">
          {_.map(goodsSkus, (item) => (
            <li className="credit-item__sku-goods-item">{item.name}</li>
          ))}
        </ul>
        <div className="credit-item__sku-title" style={{ marginTop: "15SUPX" }}>
          商品规格
        </div>
        <ul className="credit-item__sku-context">
          {_.map(norms, (item) => (
            <li className="credit-item__sku-norms-item">
              <div className="name">{item.name}</div>
              <div className="price">￥{item.price}</div>
              <div className="facePrice">￥{item.facePrice}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
