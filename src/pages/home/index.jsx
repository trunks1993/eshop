/*
 * @Date: 2020-07-01 15:01:13
 * @LastEditTime: 2020-08-13 10:30:25
 */

import React, { useEffect, useState } from "react";
import BScroll from "@better-scroll/core";
import icon from "@/assets/images/icon.png";
import brand from "@/assets/images/brand.png";
import { Tabs as TabsComp } from "@/components/lib";

let myScroll;
const data = Array(5)
  .fill("")
  .map((item, index) => ({
    key: index,
    title: "生活服务" + index,
    icon: icon,
    list: [
      {
        brandName: "美团外卖",
        icon: brand,
      },
      {
        brandName: "美团外卖",
        icon: brand,
      },
      {
        brandName: "美团外卖",
        icon: brand,
      },
      {
        brandName: "美团外卖",
        icon: brand,
      },
      {
        brandName: "美团外卖",
        icon: brand,
      },
      {
        brandName: "美团外卖",
        icon: brand,
      },
      {
        brandName: "美团外卖",
        icon: brand,
      },
      {
        brandName: "美团外卖",
        icon: brand,
      },
      {
        brandName: "美团外卖",
        icon: brand,
      },
      {
        brandName: "美团外卖",
        icon: brand,
      },
      {
        brandName: "美团外卖",
        icon: brand,
      },
      {
        brandName: "美团外卖",
        icon: brand,
      },
    ],
  }));

export default (props) => {
  const { history } = props;

  const [fix, setFix] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    myScroll = new BScroll("#home", {
      // mouseWheel: true, // 开启鼠标滚轮支持
      //   scrollbars: "custom", // 开启滚动条支持
      probeType: 3,
      click: true,
    });
    myScroll.on("scroll", eventScroll);
    return () => {
      myScroll.off("scroll", eventScroll);
    };
  }, []);

  function eventScroll() {
    setFix(this.y < -170);
  }

  const scrollToAnchor = (tab, anchorName) => {
    let anchorElement = document.getElementById(anchorName + "");
    myScroll.scrollToElement(anchorElement, 500);
    setActiveTab(anchorName);
  };

  const toItem = (index) => {
    history.push(index === 0 ? "/rechargeItem" : "/item");
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
                    <img className="home__card-title-icon" src={item.icon} />
                    <span className="home__card-title-text">{item.title}</span>
                  </div>
                  <ul className="home__card-brand">
                    {_.map(item.list, (item, index) => (
                      <li
                        className="home__card-brand-item"
                        key={index}
                        onClick={() => toItem(index)}
                      >
                        <img
                          className="home__card-brand-item-img"
                          src={item.icon}
                        />
                        <span className="home__card-brand-item-name">
                          {item.brandName}
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
