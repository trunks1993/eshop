import React, { useState, useEffect } from "react";
import TabsComp from "@/components/lib/tabs";
import brand from "@/assets/images/brand.png";
import BScroll from "@better-scroll/core";

const data = [
  {
    key: 0,
    title: "全部",
  },
  {
    key: 1,
    title: "待付款",
  },
  {
    key: 2,
    title: "处理中",
  },
  {
    key: 3,
    title: "已完成",
  },
  {
    key: 4,
    title: "已取消",
  },
];

const list = [
  {
    orderNo: 987896590986,
    status: 0,
    icon: brand,
    goodsName: "星巴克中杯通兑券",
    type: 1,
    count: 2,
    price: 99000,
    createTime: "2020-06-18 10:18:00",
    validTime: "2020-06-18 10:18:00",
  },
  {
    orderNo: 987896590986,
    status: 0,
    icon: brand,
    goodsName: "星巴克中杯通兑券",
    type: 1,
    count: 2,
    price: 99000,
    createTime: "2020-06-18 10:18:00",
    validTime: "2020-06-18 10:18:00",
  },
  {
    orderNo: 987896590986,
    status: 0,
    icon: brand,
    goodsName: "星巴克中杯通兑券",
    type: 1,
    count: 2,
    price: 99000,
    createTime: "2020-06-18 10:18:00",
    validTime: "2020-06-18 10:18:00",
  },
  {
    orderNo: 987896590986,
    status: 0,
    icon: brand,
    goodsName: "星巴克中杯通兑券",
    type: 1,
    count: 2,
    price: 99000,
    createTime: "2020-06-18 10:18:00",
    validTime: "2020-06-18 10:18:00",
  },
];
export default (props) => {
  const { history } = props;

  const [activeTab, setActiveTab] = useState(1);

  useEffect(() => {
    new BScroll(".order__list", {
      // scrollX: true,
      bounce: false,
      click: true,
    });
  }, []);

  return (
    <div className="order">
      <TabsComp
        className="order__filter-tabs"
        activeTab={activeTab}
        onTabClick={(tab, index) => setActiveTab(index)}
        data={data}
        page={5}
      />
      <div className="order__filter-tabs--block"></div>
      <div className="order__list">
        <ul>
          {_.map(list, (item, index) => (
            <li className="order__item" key={index}>
              <div className="order__item-head">
                <span className="order__item-head-no">
                  订单号：{item.orderNo}
                </span>
                <span className="order__item-head-status">{item.status}</span>
              </div>
              <div className="order__item-goods">
                <img className="order__item-goods-img" src={item.icon} />
                <span className="order__item-goods-name">
                  {item.goodsName}
                  <b className="order__item-goods-name--type">{item.type}</b>
                </span>
                <span className="order__item-goods-other">
                  <span>x{item.count}</span>
                  <span className="price">￥{item.price}</span>
                </span>
              </div>
              <div className="order__item-extra">
                <span className="order__item-extra-item">
                  有效期至：{item.validTime}
                </span>
                <span className="order__item-extra-item">
                  购买时间：{item.createTime}
                </span>
              </div>
              <div className="order__item-bottom">
                <div className="order__item-bottom-btn">
                  <div className="order__item-bottom-btn--ghost">联系客服</div>
                  <div
                    className="order__item-bottom-btn--primary"
                    onClick={() => history.push("/card")}
                  >
                    查看卡券
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
