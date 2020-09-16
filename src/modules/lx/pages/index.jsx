import React, { useEffect, useRef, useState } from 'react';
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
  shiluPay,
  getPayStatus,
} from '@/services/app';
import _ from 'lodash';
import { TRANSTEMP, PRECISION } from '@/const';
import { getQueryVariable } from '../../../utils';

export default (props) => {
  let timer = null;
  let timed = null;

  const [list, setList] = useState([]);
  const [parent, setParent] = useState('');

  const [rechargeAccount, setRechargeAccount] = useState();
  const [phoneAddressList, setPhoneAddressList] = useState({});

  const [goodsSelect, setGoodsSelect] = useState({});

  const [payUrl, setPayUrl] = useState('');
  const [orderInfo, setOrderInfo] = useState('');

  const formRef = useRef();

  useEffect(() => {
    initList();
  }, []);

  useEffect(() => {
    const skuList = list.filter((item) => item.productName === parent);
    setGoodsSelect(skuList[0]);
  }, [parent]);

  useEffect(() => {
    // 用于处理 H5 的回调函数  如果穿了orderId 就直接调转到详情页
    const orderId = getQueryVariable('orderId');
    console.log(orderId);
    if (orderId) payStatus(orderId);
  }, []);

  const payStatus = async (orderId) => {
    try {
      const [err, data, msg] = await getPayStatus({ orderId });
      if (!err) {
        if (data?.payStatus == 'success') {
          clearTimeout(timed);
          window.location.href = `creditResult.html#/?orderId=${orderId}`;
        } else if (data?.payStatus == 'failed') {
          clearTimeout(timed);
        } else {
          timed = setTimeout(() => payStatus(orderId), 2000);
        }
      } else Toast.fail(msg, 1);
    } catch (error) {}
  };

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

      if (!err) {
        const { orderId } = data;
        // getList(orderId);
        if (getChannel() == 'PLAT3') {
          //H5支付
          shilu(orderId);
        } else if (getChannel() == 'WECHAT' || getChannel() == 'PLAT3_WECHAT') {
          //wx公众号支付
          [err, data, msg] = await pay({ orderId });
          if (!err) {
            wxpay(data);
            getList(orderId);
          } else Toast.fail(msg, 1);
        }
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
  const shilu = async (orderId) => {
    try {
      let [err, data, msg] = await shiluPay({ orderId });
      if (!err) {
        //这里唤起了H5支付 通过form的action
        setPayUrl(data.payUrl);
        setOrderInfo(data.orderInfo);
        Toast.loading();
        formRef.current.submit();
      } else Toast.fail(msg, 1);
    } catch (error) {}
  };

  const getList = async (orderId) => {
    try {
      const [err, data, msg] = await getOrderByOrderId({ orderId });
      if (!err) {
        if (data.payStatus === 1) {
          clearTimeout(timed);
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

      <form id="pay_form" action={payUrl} method="post" ref={formRef}>
        <input
          id="order_info"
          type="text"
          name="orderInfo"
          value={orderInfo}
          style={{ display: 'none' }}
        />
        <input
          id="pay_submit_btn"
          type="submit"
          value="提交"
          style={{ display: 'none' }}
        />
      </form>

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
