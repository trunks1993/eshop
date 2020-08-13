import React, { useState } from "react";
import TabsComp from "@/components/lib/tabs";
import brand from "@/assets/images/brand.png";

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
export default (props) => {
  const [activeTab, setActiveTab] = useState(1);

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
        <div className="order__item">
          <div className="order__item-head">
            <span className="order__item-head-no">订单号：987896590986</span>
            <span className="order__item-head-status">待发货</span>
          </div>
          <div className="order__item-goods">
            <img className="order__item-goods-img" src={brand} />
            <span className="order__item-goods-name">
              星巴克中杯通兑券{" "}
              <b className="order__item-goods-name--type">卡密</b>
            </span>
            <span className="order__item-goods-other">
              <span>x2</span>
              <span className="price">￥9.9</span>
            </span>
          </div>
          <div className="order__item-extra">
            <span className="order__item-extra-item">
              有效期至：2020-06-18 10:18:00
            </span>
            <span className="order__item-extra-item">
              购买时间：2020-06-17 10:18:00
            </span>
          </div>
          <div className="order__item-bottom"></div>
        </div>

        <div className="order__item">
          <div className="order__item-head">
            <span className="order__item-head-no">订单号：987896590986</span>
            <span className="order__item-head-status">待发货</span>
          </div>
          <div className="order__item-goods">
            <img className="order__item-goods-img" src={brand} />
            <span className="order__item-goods-name">
              星巴克中杯通兑券{" "}
              <b className="order__item-goods-name--type">卡密</b>
            </span>
            <span className="order__item-goods-other">
              <span>x2</span>
              <span className="price">￥9.9</span>
            </span>
          </div>
          <div className="order__item-extra">
            <span className="order__item-extra-item">
              有效期至：2020-06-18 10:18:00
            </span>
            <span className="order__item-extra-item">
              购买时间：2020-06-17 10:18:00
            </span>
          </div>
          <div className="order__item-bottom"></div>
        </div>

        <div className="order__item">
          <div className="order__item-head">
            <span className="order__item-head-no">订单号：987896590986</span>
            <span className="order__item-head-status">待发货</span>
          </div>
          <div className="order__item-goods">
            <img className="order__item-goods-img" src={brand} />
            <span className="order__item-goods-name">
              星巴克中杯通兑券{" "}
              <b className="order__item-goods-name--type">卡密</b>
            </span>
            <span className="order__item-goods-other">
              <span>x2</span>
              <span className="price">￥9.9</span>
            </span>
          </div>
          <div className="order__item-extra">
            <span className="order__item-extra-item">
              有效期至：2020-06-18 10:18:00
            </span>
            <span className="order__item-extra-item">
              购买时间：2020-06-17 10:18:00
            </span>
          </div>
          <div className="order__item-bottom"></div>
        </div>
      </div>
    </div>
  );
};
