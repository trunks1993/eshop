import React, { useEffect, useState } from "react";
import { InputItem, Toast } from "antd-mobile";
import { getQueryVariable } from "@/utils";
import tags from "@/assets/images/tags.png";
import Footer from "./Footer";
import { searchGoodsByBrandCode } from "@/services/app";
import BScroll from "@better-scroll/core";
import _ from "lodash";

export default (props) => {
  const { history } = props;
  const [list, setList] = useState([]);
  const [name, setName] = useState([]);
  const [norm, setNorm] = useState([]);
  const [addPhone, setaddPhone] = useState();
  const [normKey, setNormKey] = useState(0);
  const [nameKey, setNameKey] = useState(0);
  const [goodsSelect, setGoodsSelect] = useState(0);
  const [b, setB] = useState(null);

  useEffect(() => {
    initList(getQueryVariable("brandCode"));
  }, []);

  useEffect(() => {
    const b = new BScroll(".credit-item", {
      bounce: false,
      probeType: 3,
      click: true,
    });
    setB(b);
  }, []);

  useEffect(() => {
    if (b) b.refresh();
  }, [normKey, nameKey, list, name, norm]);

  const initList = async (brandCode) => {
    try {
      const [err, data, msg] = await searchGoodsByBrandCode({ brandCode });
      if (!err) {
        getShopDetail(data);
        setList(data);
      } else Toast.fail(msg, 1);
    } catch (error) {}
  };

  /** 获取选择商品和商品规格 */
  const getShopDetail = (data) => {
    let name = [];
    let norm = [];

    var map = data.reduce((all, m) => {
      let list = all.get(m.productName);
      if (!list) {
        list = [];
        all.set(m.productName, list);
      }
      list.push(m);
      return all;
    }, new Map());

    Array.from(map.entries()).forEach(([des, list]) => {
      name.push(des);
      norm.push(list);
    });

    setName(name);
    setNorm(norm);
  };

  return (
    <>
      <div className="credit-item">
        <div>
          <div className="credit-item__head">
            <img src={`/file${list[goodsSelect]?.iconUrl}`} />
            <span className="credit-item__head-name">
              {list[goodsSelect]?.brandName}
            </span>
          </div>

          <div className="credit-item__count">
            <div className="credit-item__count-title">充值账号</div>
            <InputItem
              type="phone"
              placeholder="请输入充值手机号"
              onChange={(e) => setaddPhone(e)}
            />

            <div className="credit-item__count-content">
              <div className="title">购买须知</div>
              <div
                dangerouslySetInnerHTML={{
                  __html: list[normKey]?.purchaseNotes,
                }}
              />
            </div>
          </div>

          <div className="credit-item__sku">
            <div className="credit-item__sku-title">选择商品</div>
            <ul className="credit-item__sku-context">
              {_.map(name, (item, index) => (
                <li
                  className={
                    nameKey === index
                      ? "credit-item__sku-goods-item--active"
                      : "credit-item__sku-goods-item"
                  }
                  key={index}
                  onClick={() => setNameKey(index)}
                >
                  <div></div>
                  {item}
                </li>
              ))}
            </ul>
            <div
              className="credit-item__sku-title"
              style={{ marginTop: "15SUPX" }}
            >
              商品规格
            </div>
            <ul className="credit-item__sku-context">
              {_.map(norm[nameKey], (item, index) => (
                <li
                  className={
                    normKey === index
                      ? "credit-item__sku-norms-item--active"
                      : "credit-item__sku-norms-item"
                  }
                  key={index}
                  onClick={() => setNormKey(index)}
                >
                  {!_.isEmpty(item.tags) && (
                    <div className="tags">{item.tags}</div>
                  )}
                  <div className="name">{item?.shortName}</div>
                  <div className="price">售价{item?.price / 10000}元</div>
                  <div className="facePrice">
                    官方价{item?.facePrice / 10000}元
                  </div>
                </li>
              ))}
            </ul>

            <div className="credit-item__sku-needknow">
              <img src={tags} className="credit-item__sku-needknow--img" />
              <div className="credit-item__sku-needknow--title">使用说明</div>
              <div
                dangerouslySetInnerHTML={{
                  __html: list[goodsSelect]?.usageIllustration,
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer
        goodsCode={!_.isEmpty(norm) ? norm[nameKey][normKey]?.code : ""}
        rechargeAccount={addPhone ? addPhone : ""}
        history={history}
        tags={list[goodsSelect]?.tags}
        type="zhichong"
        successCallBack={(orderId) =>
          history.push(`/creditItems?orderId=${orderId}`)
        }
      />
    </>
  );
};
