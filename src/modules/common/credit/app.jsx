import React, { useEffect, useState } from 'react';
import { InputItem, Toast } from 'antd-mobile';
import { getQueryVariable, getFloat } from '@/utils';
import tags from '@/assets/images/tags.png';
import { Footer } from '@/components/r';
import { searchGoodsByBrandCode, getOrderId } from '@/services/app';
import _ from 'lodash';
import { TRANSTEMP, PRECISION } from '@/const';

export default (props) => {
  const brandCode = getQueryVariable('brandCode');
  const goodsCode = getQueryVariable('goodsCode');
  const [list, setList] = useState([]);
  const [parent, setParent] = useState('');

  const [rechargeAccount, setRechargeAccount] = useState();

  const [goodsSelect, setGoodsSelect] = useState({});

  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    initList();
  }, []);
  let i = 0;
  useEffect(() => {
    const skuList = list.filter((item) => item.productName === parent);
    const obj =
      i === 0
        ? _.find(list, (item) => item.code == goodsCode) || skuList[0]
        : skuList[0];
    setGoodsSelect(obj);
    i++;
  }, [parent]);

  const initList = async () => {
    try {
      const [err, data, msg] = await searchGoodsByBrandCode({ brandCode });
      if (!err) {
        setList(data);

        const parent = goodsCode
          ? _.find(data, (item) => item.code == goodsCode).productName
          : data[0].productName;
        setParent(parent);
      } else Toast.fail(msg, 1);
    } catch (error) {}
  };

  const validCallback = () => {
    if (!rechargeAccount) return Toast.fail('请输入需要充值的账号', 1);
    return {
      goodsCode: goodsSelect.code,
      rechargeAccount: rechargeAccount.replace(/\s+/g, ''),
    };
  };

  const shop = async () => {
    try {
      const params = validCallback();

      if (!params) return;

      let [err, data, msg] = await getOrderId(params);

      if (!err) setOrderId(data?.orderId);
      else Toast.fail(msg, 1);
    } catch (error) {}
  };

  return (
    <>
      <div className="credit-item">
        <div>
          <div className="credit-item__head">
            <img src={`/file${list[0]?.iconUrl}`} />
            <span className="credit-item__head-name">{list[0]?.brandName}</span>
          </div>

          <div className="credit-item__count">
            <div className="credit-item__count-title">充值账号</div>
            <InputItem
              type="phone"
              placeholder="请输入需要充值的账号"
              onChange={(e) => setRechargeAccount(e)}
              style={{ height: '120SUPX' }}
            />

            <div className="credit-item__count-content">
              <div className="title">购买须知</div>
              <div
                dangerouslySetInnerHTML={{
                  __html: goodsSelect?.purchaseNotes,
                }}
              />
            </div>
          </div>

          <div className="credit-item__sku">
            <div className="credit-item__sku-title">选择商品</div>
            <ul className="credit-item__sku-context">
              {_.map(
                list.filter((item, index, arr) => {
                  return (
                    arr.findIndex(
                      (el) => el.productName == item.productName
                    ) === index
                  );
                }),
                (item, index) => (
                  <li
                    className={
                      parent === item.productName
                        ? 'credit-item__sku-goods-item--active'
                        : 'credit-item__sku-goods-item'
                    }
                    key={index}
                    onClick={() => setParent(item.productName)}
                  >
                    <div></div>
                    {item.productName}
                  </li>
                )
              )}
            </ul>
            <div
              className="credit-item__sku-title"
              style={{ marginTop: '15SUPX' }}
            >
              商品规格
            </div>
            <ul className="credit-item__sku-context">
              {_.map(
                list.filter((item) => item.productName === parent),
                (item, index) => (
                  <li
                    className={
                      goodsSelect?.code === item.code
                        ? 'credit-item__sku-norms-item--active'
                        : 'credit-item__sku-norms-item'
                    }
                    key={index}
                    onClick={() => setGoodsSelect(item)}
                  >
                    {!_.isEmpty(item.tags) && (
                      <div className="tags">{item.tags}</div>
                    )}
                    <div className="name">{item?.shortName}</div>
                    <div className="price">
                      售价{getFloat(item?.price / TRANSTEMP, PRECISION)}元
                    </div>
                    <div className="facePrice">
                      官方价{getFloat(item?.facePrice / TRANSTEMP, PRECISION)}元
                    </div>
                  </li>
                )
              )}
            </ul>

            <div className="credit-item__sku-needknow">
              <img src={tags} className="credit-item__sku-needknow--img" />
              <div className="credit-item__sku-needknow--title">使用说明</div>
              <div
                dangerouslySetInnerHTML={{
                  __html: goodsSelect?.usageIllustration,
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer
        btnText="立即充值"
        shop={shop}
        redirectOrder={() => (window.location.href = '/order.html')}
        showKFModal={_.debounce(() => {
          Modal.alert(
            <div className="modalTop">
              咨询商品问题,请添加客服QQ(2045879978)
            </div>,
            '',
            [
              {
                text: '我知道了',
                onPress: () => {},
              },
            ]
          );
        }, 100)}
        orderId={orderId}
        successUrl={() => {
          window.location.href = `/creditResult.html#/?orderId=${orderId}`;
        }}
      >
        {goodsSelect?.facePrice - goodsSelect?.price > 0 && (
          <div className="item-footer__btn-tags">
            立省
            {(goodsSelect?.facePrice - goodsSelect?.price) / 10000}元
          </div>
        )}
      </Footer>
    </>
  );
};
