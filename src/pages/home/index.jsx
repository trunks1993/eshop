/*
 * @Date: 2020-07-01 15:01:13
 * @LastEditTime: 2020-08-31 19:48:12
 */

import React, { useEffect, useState } from "react";
import BScroll from "@better-scroll/core";
import { Tabs as TabsComp } from "@/components/lib";
import { getList } from "@/services/app";
import { getQueryVariable } from "@/utils";
import { setToken } from "@/utils/auth";
import Cookies from "js-cookie";
import { Toast } from "antd-mobile";

export default (props) => {
  const { history } = props;

  const [fix, setFix] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const [data, setDataList] = useState([]);
  const [b, setB] = useState(null);

  useEffect(() => {
    _getToken();
    _getList();
  }, []);

  const _getList = async () => {
    try {
      Toast.loading();
      const [err, data, msg] = await getList();
      Toast.hide();
      if (!err) {
        setDataList(
          data.map((item) => {
            item.key = item.code;
            item.title = item.name;
            return item;
          })
        );
      } else Toast.fail(msg, 1);
    } catch (error) {}
  };

  const _getToken = () => {
    const token = getQueryVariable("token");
    if (token) setToken(token);
  };

  useEffect(() => {
    const b = new BScroll("#home", {
      // mouseWheel: true, // 开启鼠标滚轮支持
      //   scrollbars: "custom", // 开启滚动条支持
      bounce: false,
      probeType: 3,
      click: true,
    });
    b.on("scroll", eventScroll);
    setB(b);
    return () => {
      b.off("scroll", eventScroll);
    };
  }, []);

  useEffect(() => {
    if (b) b.refresh();
  }, [data]);

  function eventScroll() {
    setFix(this.y < -170);
  }

  const scrollToAnchor = (tab, anchorName) => {
    let anchorElement = document.getElementById(anchorName + "");
    b.scrollToElement(anchorElement, 500);
    setActiveTab(anchorName);
  };

  const toItem = (bizType, brandCode, index) => {
    Cookies.set("brandList", JSON.stringify(data[index]?.brandList));
    history.push(
      bizType === 2
        ? `/creditItem?brandCode=${brandCode}`
        : `/cardItem?brandCode=${brandCode}`
    );
  };

  return (
    <>
      {fix ? (
        <TabsComp
          className="home__content-wrap-tabs home__content-wrap-tabs--fix"
          activeTab={activeTab}
          onTabClick={scrollToAnchor}
          data={data}
          page={4}
        />
      ) : null}
      <div id="home" className="home">
        <div>
          <div className="home__img-wrap">
            <div className="home__img-wrap-img"></div>
          </div>
          <div className="home__content-wrap">
            {fix ? (
              <div className="home__content-wrap-tabs--block"></div>
            ) : (
              <TabsComp
                className="home__content-wrap-tabs"
                activeTab={activeTab}
                onTabClick={scrollToAnchor}
                data={data}
                page={4}
              />
            )}
            <div className="home__content-wrap-list">
              {_.map(data, (item, index) => (
                <div className="home__card" key={index}>
                  <div id={index + ""} className="home__card-anchor"></div>
                  <div className="home__card-title">
                    <img
                      className="home__card-title-icon"
                      src={"/file" + item.iconUrl}
                    />
                    <span className="home__card-title-text">{item.title}</span>
                  </div>
                  <ul className="home__card-brand">
                    {_.map(item.brandList, (item) => (
                      <li
                        className="home__card-brand-item"
                        key={item.code}
                        onClick={() => toItem(item.bizType, item.code, index)}
                      >
                        <img
                          className="home__card-brand-item-img"
                          src={"/file" + item.iconUrl}
                        />
                        <span className="home__card-brand-item-name">
                          {item.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
