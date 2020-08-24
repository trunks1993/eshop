import React, { useEffect, useState } from "react";
import BScroll from "@better-scroll/core";
import classnames from "classnames";
import { toFixed, isIos } from "@/utils";
import goods from "@/assets/images/goods.png";
import { InputNumber, Tabs as TabsComp } from "@/components/lib";
import order from "@/assets/images/order.png";
import service from "@/assets/images/service.png";

const realIos = isIos();
const tabsData = [
  { title: "星巴克" },
  { title: "叫了只炸鸡" },
  { title: "五粮液" },
  { title: "饿了么" },
  { title: "美团" },
  { title: "察颜悦色" },
];

const list = [
  { title: "星巴克代金卷", price: 9.9, facePrice: 11.99 },
  { title: "星巴克中杯通兑卷", price: 9.9, facePrice: 11.99 },
  { title: "星巴克大杯通兑卷", price: 9.9, facePrice: 11.99 },
  { title: "星巴克大杯通兑卷", price: 9.9, facePrice: 11.99 },
  { title: "星巴克大杯通兑卷", price: 9.9, facePrice: 11.99 },
  { title: "星巴克大杯通兑卷", price: 9.9, facePrice: 11.99 },
];

const data = [
  {
    title: "购买须知",
    key: 0,
  },
  {
    title: "使用说明",
    key: 1,
  },
];

export default (props) => {
  const { history } = props;
  const [active, setActive] = useState(0);
  const [goodsSelect, setGoodsSelect] = useState(0);

  useEffect(() => {
    let sum = _.map(tabsData, (item) => item.title.length * 30 + 60).reduce(
      (t, p) => t + p
    );

    document.querySelector("#brand").style.width =
      toFixed((sum / 750) * 100, 6) + "vw";

    new BScroll(".card-item__scroll-filter", {
      scrollX: true,
      bounce: false,
      click: true,
    });

    sum = list.length * 300 + (list.length + 1) * 30;

    document.querySelector("#goods").style.width =
      toFixed((sum / 750) * 100, 6) + "vw";

    new BScroll(".card-item__goods", {
      scrollX: true,
      bounce: false,
      click: true,
    });
  }, []);

  return (
    <div className="card-item">
      <div className="card-item__scroll-filter">
        <ul id="brand">
          {_.map(tabsData, (item, index) => (
            <li
              key={index}
              className={classnames({ active: active === index })}
              onClick={() => setActive(index)}
              style={{ letterSpacing: realIos ? "-1.4px" : undefined }}
            >
              {item.title}
            </li>
          ))}
        </ul>
      </div>

      <div className="card-item__goods">
        <ul id="goods">
          {_.map(list, (item, index) => (
            <li
              key={index}
              className={classnames({ active: goodsSelect === index })}
              onClick={() => setGoodsSelect(index)}
            >
              <div className="img-box">
                <img src={goods} />
              </div>
              <div className="info-wrap">
                <span className="info-wrap-name">{item.title}</span>
                <div className="info-wrap-price">
                  <span className="info-wrap-price__price">
                    <b style={{ fontSize: "24SUPX" }}>￥</b>
                    {item.price}
                  </span>
                  <span className="info-wrap-price__face-price">
                    官方价{item.facePrice}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="card-item__count-box">
        <div className="card-item__count-box-num">
          <span>
            <span className="card-item__count-box-num-title">购买数量</span>
            <span className="card-item__count-box-num-subtitle">
              最多可购买 10 张
            </span>
          </span>
          <InputNumber min={1} max={10} defaultValue={1} />
        </div>

        <div className="card-item__count-box-suggestion">
          <span>
            使用有效期：<b>购买起24小时内</b>
          </span>
        </div>
      </div>

      <ul className="card-item__view">
        <li className="card-item__view-item line">
          <span className="card-item__view-item-title">商品名称</span>
          <span className="card-item__view-item-sub">星巴克代金卷</span>
        </li>
        <li className="card-item__view-item line">
          <span className="card-item__view-item-title">应付金额</span>
          <span className="card-item__view-item-price">
            <b>￥</b>11.8
          </span>
        </li>
        <li className="card-item__view-item">
          <span className="card-item__view-item-title">商品标签</span>
          <div className="card-item__view-item-block">
            <span>兑换码</span>
          </div>
        </li>
      </ul>

      <div className="card-item__html">
        <TabsComp
          // className="home__content-wrap-tabs"
          // activeTab={activeTab}
          onTabClick={() => {}}
          data={data}
          page={4}
        />
        <div className="card-item__html-content">
          <p>
            1.
            收到的短链接就是星礼卡的电子兑换券，点击短链接即可生成二维码，到店初始
          </p>
          <p>
            2.
            收到的短链接就是星礼卡的电子兑换券，点击短链接即可生成二维码，到店初始
          </p>
          <p>
            3.
            收到的短链接就是星礼卡的电子兑换券，点击短链接即可生成二维码，到店初始
          </p>
        </div>
      </div>

      <div className="card-item__footer--block"></div>
      <div className="card-item__footer">
        <div className="card-item__footer-subtn">
          <img src={service} />
          <span className="card-item__footer-subtn-title">客服</span>
        </div>
        <div
          className="card-item__footer-subtn line"
          onClick={() => history.push("/order")}
        >
          <img src={order} />
          <span className="card-item__footer-subtn-title">订单</span>
        </div>
        <div className="card-item__footer-btn">立即购买</div>
      </div>
    </div>
  );
};
