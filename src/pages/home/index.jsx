/*
 * @Date: 2020-07-01 15:01:13
 * @LastEditTime: 2020-08-29 16:15:44
 */

import React, { useEffect, useState } from 'react';
import BScroll from '@better-scroll/core';
import { Tabs as TabsComp } from '@/components/lib';
import { getList } from '@/services/app';
import { getQueryVariable } from '@/utils';
import { setToken } from '@/utils/auth';
import Cookies from 'js-cookie';
import { Toast } from 'antd-mobile';

let myScroll;
export default (props) => {
  const { history } = props;

  const [fix, setFix] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const [data, setDataList] = useState([]);

  useEffect(() => {
    _getToken();
    _getList();
  }, []);

  const _getList = async () => {
    try {
      const [err, data, msg] = await getList();
      if (!err) {
        setDataList(
          data.map((item) => {
            item.key = item.code;
            item.title = item.name;
            return item;
          })
        );
      } else Toast.fail(msg, 1);
    } catch (error) {
      console.log('_getList -> error', error);
    }
  };

  const _getToken = () => {
    const token = getQueryVariable('token');
    if (token) setToken(token);
  };

  useEffect(() => {
    myScroll = new BScroll('#home', {
      // mouseWheel: true, // 开启鼠标滚轮支持
      //   scrollbars: "custom", // 开启滚动条支持
      bounce: false,
      probeType: 3,
      click: true,
    });
    myScroll.on('scroll', eventScroll);
    return () => {
      myScroll.off('scroll', eventScroll);
    };
  }, [data]);

  function eventScroll() {
    setFix(this.y < -170);
  }

  const scrollToAnchor = (tab, anchorName) => {
    let anchorElement = document.getElementById(anchorName + '');
    myScroll.scrollToElement(anchorElement, 500);
    setActiveTab(anchorName);
  };

  const toItem = (index, brandCode, key) => {
    Cookies.set('shopname', JSON.stringify(data[key]));
    history.push(
      index === 2
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
              {_.map(data, (item, indes) => (
                <div className="home__card" key={indes}>
                  <div id={indes + ''} className="home__card-anchor"></div>
                  <div className="home__card-title">
                    <img
                      className="home__card-title-icon"
                      src={'/file' + item.iconUrl}
                    />
                    <span className="home__card-title-text">{item.title}</span>
                  </div>
                  <ul className="home__card-brand">
                    {_.map(item.brandList, (item, index) => (
                      <li
                        className="home__card-brand-item"
                        key={index}
                        onClick={() => toItem(item.bizType, item.code, indes)}
                      >
                        <img
                          className="home__card-brand-item-img"
                          src={'/file' + item.iconUrl}
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
