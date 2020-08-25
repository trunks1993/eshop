import React, { useEffect, useState } from 'react';
import BScroll from '@better-scroll/core';
import classnames from 'classnames';
import { toFixed, isIos } from '@/utils';
import goods from '@/assets/images/goods.png';
import { InputNumber, Tabs as TabsComp } from '@/components/lib';
import { getQueryVariable } from '@/utils';
import { searchGoodsByBrandCode } from '@/services/app';
import { Toast } from 'antd-mobile';
import _ from 'lodash';
import { ProductTypes } from '@/const';
import Footer from './Footer';

const realIos = isIos();

const data = [
  {
    title: '购买须知',
    key: 0,
  },
  {
    title: '使用说明',
    key: 1,
  },
];

export default (props) => {
  const { history } = props;
  const [list, setList] = useState({});
  const [active, setActive] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [goodsSelect, setGoodsSelect] = useState(0);
  const [shopAmount, setShopAmount] = useState(1);

  useEffect(() => {
    if (_.isEmpty(list)) return;
    let sum = _.map(list, (item) => item.name.length * 30 + 60).reduce(
      (t, p) => t + p
    );

    document.querySelector('#brand').style.width =
      toFixed((sum / 750) * 100, 6) + 'vw';

    new BScroll('.card-item__scroll-filter', {
      scrollX: true,
      bounce: false,
      click: true,
    });

    sum = list.length * 300 + (list.length + 1) * 30;

    document.querySelector('#goods').style.width =
      toFixed((sum / 750) * 100, 6) + 'vw';

    new BScroll('.card-item__goods', {
      scrollX: true,
      bounce: false,
      click: true,
    });
  }, [list]);

  useEffect(() => {
    initList(getQueryVariable('brandCode'));
  }, []);

  const initList = async (brandCode) => {
    try {
      const [err, data, msg] = await searchGoodsByBrandCode({ brandCode });
      if (!err) setList(data);
      else Toast.fail(msg, 1);
    } catch (error) {}
  };

  return (
    <div className="card-item">
      <div className="card-item__scroll-filter">
        <ul id="brand">
          {_.map(list, (item, index) => (
            <li
              key={index}
              className={classnames({ active: active === index })}
              onClick={() => setActive(index)}
              style={{ letterSpacing: realIos ? '-1.4px' : undefined }}
            >
              {item.name}
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
                <img src={item.iconUrl ? `/file${item.iconUrl}` : goods} />
              </div>
              <div className="info-wrap">
                <span className="info-wrap-name">{item.title}</span>
                <div className="info-wrap-price">
                  <span className="info-wrap-price__price">
                    <b style={{ fontSize: '24SUPX' }}>￥</b>
                    {item.price / 10000}
                  </span>
                  <span className="info-wrap-price__face-price">
                    官方价{item.facePrice / 10000}
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
              最多可购买 {list[goodsSelect]?.stock} 张
            </span>
          </span>
          <InputNumber
            min={1}
            max={10}
            defaultValue={1}
            onChange={(val) => setShopAmount(val)}
          />
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
          <span className="card-item__view-item-sub">
            {list[goodsSelect]?.name}
          </span>
        </li>
        <li className="card-item__view-item line">
          <span className="card-item__view-item-title">应付金额</span>
          <span className="card-item__view-item-price">
            <b>￥</b>
            {list[goodsSelect]?.price / 10000}
          </span>
        </li>
        <li className="card-item__view-item">
          <span className="card-item__view-item-title">商品标签</span>
          <div className="card-item__view-item-block">
            <span>{ProductTypes[list[goodsSelect]?.productTypeCode]}</span>
          </div>
        </li>
      </ul>

      <div className="card-item__html">
        <TabsComp
          className="home__content-wrap-tabs"
          activeTab={activeTab}
          onTabClick={({ key }) => setActiveTab(key)}
          data={data}
          page={4}
        />
        <div className="card-item__html-content">
          {activeTab === 0
            ? list[goodsSelect]?.purchaseNotes
            : list[goodsSelect]?.usageIllustration}
        </div>
      </div>

      <div className="card-item__footer--block"></div>
      <Footer goodsCode={list[goodsSelect]?.code} amount={shopAmount} />
    </div>
  );
};
