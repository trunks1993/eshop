import React, { useEffect, useState } from 'react';
import { InputItem, Toast, Modal } from 'antd-mobile';
import { getChannel, getFloat } from '@/utils';
import tags from '@/assets/images/tags.png';
import { Footer } from '@/components/r';
import IconUrl from '@/assets/images/lxHead.png';
import {
  getHomeShopList,
  getOrderId,
  pay,
  getOrderByOrderId,
  getPhoneAddress,
} from '@/services/app';
import _ from 'lodash';
import { TRANSTEMP, PRECISION } from '@/const';

export default (props) => {
  let timer = null;

  const [list, setList] = useState([]);
  const [parent, setParent] = useState('');

  const [rechargeAccount, setRechargeAccount] = useState();
  const [phoneAddressList, setPhoneAddressList] = useState({});

  const [goodsSelect, setGoodsSelect] = useState({});

  useEffect(() => {
    initList();
  }, []);

  useEffect(() => {
    const skuList = list.filter((item) => item.productName === parent);
    setGoodsSelect(skuList[0]);
  }, [parent]);

  const initList = async () => {
    try {
      const [err, data, msg] = await getHomeShopList({
        currPage: 1,
        pageSize: 1000,
      });
      if (!err) {
        if (!data?.list) Toast.fail('暂无商品', 1);
        setList(data.list);
        setParent(data?.list[0]?.productName);
      } else Toast.fail(msg, 1);
    } catch (error) {}
  };

  const validCallback = () => {
    if (!rechargeAccount) return Toast.fail('请输入正确的充值账号', 1);
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

      const { orderId } = data;

      if (!err) {
        [err, data, msg] = await pay({ orderId });
        if (!err) {
          getList(orderId);
          if (getChannel() == 'PLAT3') {
            shilu(orderId);
          } else if (
            getChannel() == 'WECHAT' ||
            getChannel() == 'PLAT3_WECHAT'
          ) {
            wxpay(data);
          }
        } else Toast.fail(msg, 1);
      } else Toast.fail(msg, 1);
    } catch (error) {}
  };

  const wxpay = ({
    appId,
    timestamp,
    nonceStr,
    signType,
    paySign,
    orderdetail,
  }) => {
    WeixinJSBridge.invoke(
      'getBrandWCPayRequest',
      {
        appId, //公众号名称，由商户传入
        timeStamp: timestamp, //时间戳，自1970年以来的秒数
        nonceStr, //随机串
        package: orderdetail,
        signType, //微信签名方式：
        paySign, //微信签名
      },
      (res) => {
        if (res.err_msg == 'get_brand_wcpay_request:cancel') {
          clearTimeout(timer);
        }
      }
    );
  };

  //wx-h5--支付
  const shilu = async ({ orderId }) => {
    try {
      const [err, data, msg] = await shiluPay({ orderId });
      if (err) Toast.fail(msg, 1);
    } catch (error) {}
  };

  const getList = async (orderId) => {
    try {
      const [err, data, msg] = await getOrderByOrderId({ orderId });
      if (!err) {
        if (data.payStatus === 1) {
          clearTimeout(timer);
          Toast.success('支付成功');
          window.location.href = `/cdkey.html#/?orderId=${orderId}`;
        } else timer = setTimeout(() => getList(orderId), 1000);
      } else Toast.fail(msg, 1);
    } catch (error) {}
  };

  const setPhoneNumber = async (e) => {
    if (e.split(' ').join('').length != 11) return setPhoneAddressList({});
    try {
      const [err, data, msg] = await getPhoneAddress({
        telephone: e.split(' ').join(''),
      });
      if (!err) {
        setRechargeAccount(e);
        setPhoneAddressList(data);
      } else Toast.fail(msg, 1);
    } catch (error) {}
  };

  return (
    <>
      <div className="lx">
        <div>
          <div className="lx__head">
            <img src={IconUrl} />
            <span className="lx__head-name">话费充值</span>
          </div>

          <div className="lx__count">
            <div className="lx__count-title">
              充值号码
              <span className="lx__count-title--detail">(支持三网/虚商)</span>
            </div>
            <InputItem
              type="phone"
              placeholder="请输入充值号码"
              onChange={(e) => setPhoneNumber(e)}
              extra={
                <div>
                  {phoneAddressList?.province} {phoneAddressList?.city}{' '}
                  {phoneAddressList?.operatorNo}
                </div>
              }
            />
          </div>

          <div className="lx__sku">
            <div className="lx__sku-title" style={{ marginTop: '15SUPX' }}>
              充值金额
            </div>
            <ul className="lx__sku-context">
              {_.map(list, (item, index) => (
                <li
                  className={
                    goodsSelect?.code === item.code
                      ? 'lx__sku-norms-item--active'
                      : 'lx__sku-norms-item'
                  }
                  key={index}
                  onClick={() => setGoodsSelect(item)}
                >
                  <div className="name">
                    <b>{getFloat(item?.facePrice / TRANSTEMP, PRECISION)}</b>元
                  </div>
                  <div className="price">
                    售价<b>{getFloat(item?.price / TRANSTEMP, PRECISION)}</b>元
                  </div>
                </li>
              ))}
            </ul>

            <div className="lx__sku-needknow">
              <img src={tags} className="lx__sku-needknow--img" />
              <div className="lx__sku-needknow--title">使用须知</div>
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
      />
    </>
  );
};
