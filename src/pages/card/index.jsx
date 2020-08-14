import React, { useEffect, useState } from "react";
import brand from "@/assets/images/brand.png";
import { SvgIcon } from "@/components/lib";
import BScroll from "@better-scroll/core";

const list = [
  {
    icon: brand,
    title: "星巴克中杯通兑券",
    time: "2020-06-20 10:21:30",
    code: "fa88t1rz1j",
    status: 0,
  },
  {
    icon: brand,
    title: "星巴克中杯通兑券",
    time: "2020-06-20 10:21:30",
    code: "fa88t1rz1j",
    status: 1,
  },
  {
    icon: brand,
    title: "星巴克中杯通兑券",
    time: "2020-06-20 10:21:30",
    code: "fa88t1rz1j",
    status: 1,
  },
];
export default (props) => {
  const { history } = props;

  useEffect(() => {
    new BScroll(".card__list", {
      // mouseWheel: true, // 开启鼠标滚轮支持
      //   scrollbars: "custom", // 开启滚动条支持
      probeType: 3,
      click: true,
    });
    // myScroll.on("scroll", eventScroll);
    // return () => {
    //   myScroll.off("scroll", eventScroll);
    // };
  }, []);

  return (
    <div className="card">
      <div className="card__head">星巴克中杯通兑券</div>
      <div className="card__list">
        <ul>
          {_.map(list, (item, index) => (
            <li key={index} className="card__list-item">
              <div className="card__list-item-info">
                <img src={item.icon} />
                <div className="right">
                  <span className="title">{item.title}</span>
                  <span className="time">有效期至 {item.time}</span>
                </div>
              </div>
              <div className="card__list-item-code">
                <span className="text">
                  兑换码：<b>{item.code}</b>
                </span>
              </div>

              <SvgIcon iconClass="qrCode" />
            </li>
          ))}
        </ul>
      </div>

      <div className="card__btn">
        <div className="card__btn-1" onClick={() => history.push("/order")}>
          查看订单
        </div>
        <div className="card__btn-2" onClick={() => history.push("/home")}>
          继续购买
        </div>
      </div>

      <div className="card__block"></div>

      <div className="card__html">
        <div className="card__html-title">
          <span className="card__html-title-line after"></span>
          <span className="card__html-title-text">使用须知</span>
          <span className="card__html-title-line before"></span>
        </div>
        <div className="card__html-content">
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
    </div>
  );
};
