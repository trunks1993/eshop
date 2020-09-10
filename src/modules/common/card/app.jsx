import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import goods from '@/assets/images/goods.png';
import { InputNumber, Tabs as TabsComp } from '@/components/r';
import { getQueryVariable, getFloat } from '@/utils';
import {
  searchGoodsByBrandCode,
  getBrandListInSameCategory,
} from '@/services/app';
import { Toast } from 'antd-mobile';
import _ from 'lodash';
import { ProductTypes, TRANSTEMP, PRECISION } from '@/const';
import { Footer } from '@/components/r';
import Cookies from 'js-cookie';

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
  const brandCode = getQueryVariable('brandCode');

  const { history } = props;
  const [list, setList] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [active, setActive] = useState(brandCode);
  const [activeTab, setActiveTab] = useState(0);
  const [goodsSelect, setGoodsSelect] = useState(0);
  const [amount, setAmount] = useState(1);
  const [skuCaches, setSkuCaches] = useState({});

  const inputRef = React.createRef();

  useEffect(() => {
    setGoodsSelect(0);
    inputRef.current.setInputVal(1);
  }, [active]);

  useEffect(() => {
    getBrandList(brandCode);
    initList(brandCode);
  }, []);

  const getBrandList = async (brandCode) => {
    try {
      const [err, data, msg] = await getBrandListInSameCategory(brandCode);
      if (!err) setBrandList(data);
      else Toast.fail(msg);
    } catch (error) {}
  };

  const initList = async (brandCode) => {
    const cacheList = skuCaches[brandCode];

    if (!_.isEmpty(cacheList)) return setList(cacheList);

    try {
      Toast.loading();
      const [err, data, msg] = await searchGoodsByBrandCode({ brandCode });
      Toast.hide();
      if (!err) {
        setList(data || []);
        setSkuCaches({
          ...skuCaches,
          [brandCode]: data,
        });
        if (data[0].productTypeCode === 104) {
          window.location.href = `/credit.html#/?brandCode=${brandCode}`;
        }
      } else Toast.fail(msg, 1);
    } catch (error) {}
  };

  return (
    <>
      <div className="card-item">
        <div className="card-item__scroll-filter">
          {/* 隐藏ios滚动条 */}
          {/* <div
            style={{
              height: "86SUPX",
              // paddingTop: "4SUPX",
              overflowY: "hidden",
            }}
          > */}
          <ul>
            {_.map(brandList, (item, index) => (
              <li
                key={index}
                className={classnames({
                  active: active == brandList[index].code,
                })}
                onClick={() => {
                  const brandCode = brandList[index].code;
                  setActive(brandCode);
                  initList(brandCode);
                }}
              >
                {item.name}
              </li>
            ))}
          </ul>
          {/* </div> */}
          <div className="card-item__scroll-filter--line"></div>
        </div>
        <div className="card-item__goods">
          {/* 隐藏ios滚动条 */}
          <div
            style={{
              height: '408SUPX',
              paddingTop: '4SUPX',
              overflowY: 'hidden',
            }}
          >
            <ul>
              {_.map(list, (item, index) => (
                <li
                  key={index}
                  className={classnames({ active: goodsSelect === index })}
                  onClick={() => {
                    setGoodsSelect(index);
                    inputRef.current.setInputVal(1);
                  }}
                >
                  <div className="img-box">
                    <img src={item.iconUrl ? `/file${item.iconUrl}` : goods} />
                  </div>
                  <div className="info-wrap">
                    <span className="info-wrap-name">{item.shortName}</span>
                    <div className="info-wrap-price">
                      <span className="info-wrap-price__price">
                        <b style={{ fontSize: '24SUPX' }}>￥</b>
                        {getFloat(item.price / TRANSTEMP, PRECISION)}
                      </span>
                      <span className="info-wrap-price__face-price">
                        官方价{getFloat(item.facePrice / TRANSTEMP, PRECISION)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="card-item__count-box">
          <div className="card-item__count-box-num">
            <span>
              <span className="card-item__count-box-num-title">购买数量</span>
              <span className="card-item__count-box-num-subtitle">
                最多可购买 {list[goodsSelect]?.singleBuyLimit} 张
              </span>
            </span>
            <InputNumber
              min={1}
              max={list[goodsSelect]?.singleBuyLimit}
              defaultValue={1}
              onChange={(val) => setAmount(val)}
              ref={inputRef}
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
              {getFloat(
                (list[goodsSelect]?.price * amount) / TRANSTEMP,
                PRECISION
              )}
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
            onTabClick={({ key }) => {
              setActiveTab(key);
            }}
            data={data}
            page={4}
          />
          <div className="card-item__html-content">
            {activeTab === 0 ? (
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    list[goodsSelect]?.purchaseNotes ||
                    "<p style='text-align: center'>暂无数据</p>",
                }}
              />
            ) : (
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    list[goodsSelect]?.usageIllustration ||
                    "<p style='text-align: center'>暂无数据</p>",
                }}
              />
            )}
          </div>
        </div>
      </div>
      <Footer
        history={history}
        successCallback={() => (window.location.href = `/order.html`)}
        validCallback={() => {
          if (!list[goodsSelect]?.code) return Toast.fail('请选择商品', 1);
          return {
            goodsCode: list[goodsSelect]?.code,
            amount,
          };
        }}
        btnText="立即购买"
      >
        {list[goodsSelect]?.facePrice - list[goodsSelect]?.price > 0 && (
          <div className="item-footer__btn-tags">
            立省
            {getFloat(
              ((list[goodsSelect]?.facePrice - list[goodsSelect]?.price) *
                amount) /
                10000,
              2
            )}
            元
          </div>
        )}
      </Footer>
    </>
  );
};
