import React, { useState, useEffect } from "react";
import TabsComp from "@/components/lib/tabs";
import BScroll from "@better-scroll/core";
import PullUp from "@better-scroll/pull-up";
import { Toast, Modal } from "antd-mobile";
import { setToken } from "@/utils/auth";
import {
  getOrderByOrderId,
  pay,
  searchUserSubscribeOrderList,
} from "@/services/app";
import empty from "@/assets/images/empty.png";
import { getQueryVariable, getFloat } from "@/utils";
import {
  ProductTypes,
  TraceStatus,
  TRACE_STATUS_0,
  TRACE_STATUS_1,
  TRACE_STATUS_2,
  TRACE_STATUS_3,
  TRACE_STATUS_4,
  TRACE_STATUS_5,
  TRACE_STATUS_6,
  PRODUCT_TYPE_1,
  PRODUCT_TYPE_2,
  PRODUCT_TYPE_3,
  PRODUCT_TYPE_4,
  TRANSTEMP,
  PRECISION,
} from "@/const";
import _ from "lodash";
BScroll.use(PullUp);

let cuur = 1;
const tabData = [
  {
    key: 0,
    title: "全部",
    value: "",
  },
  {
    key: 1,
    title: "待付款",
    value: "1",
  },
  {
    key: 2,
    title: "处理中",
    value: "2,3",
  },
  {
    key: 3,
    title: "已完成",
    value: "4,5",
  },
  {
    key: 4,
    title: "已取消",
    value: "6",
  },
];

export default (props) => {
  const { history } = props;

  const tabIndex = parseInt(getQueryVariable("index")) || 0;
  const token = getQueryVariable("token");

  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeTab, setActiveTab] = useState(tabIndex);

  const [list, setList] = useState([]);
  const [noMore, setNoMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const [b, setB] = useState(null);

  let timer = null;

  useEffect(() => {
    if (token) setToken(token);

    const b = new BScroll(".order__list", {
      scrollY: true,
      click: true,
      pullUpLoad: true,
    });
    b.on("pullingUp", pullingUpHandler); //上拉加载更多
    setB(b);
  }, []);

  useEffect(() => {
    if (!b) return;
    b.finishPullUp();
    b.refresh();
  }, [list]);

  useEffect(() => {
    initList();
  }, [currPage]);

  useEffect(() => {
    cuur = 1;
    dispatchInit();
  }, [activeTab]);

  const pullingUpHandler = () => {
    setCurrPage(++cuur);
  };

  const dispatchInit = () => {
    currPage === 1 ? initList() : setCurrPage(1);
  };

  const initList = async () => {
    try {
      setLoading(true);
      Toast.loading();
      const statusArray = _.find(tabData, (item) => item.key === activeTab)
        .value;
      const [err, data, msg] = await searchUserSubscribeOrderList({
        statusArray,
        currPage,
        pageSize,
      });
      if (!err) {
        const newList = data?.list;
        if (!newList || newList.length < pageSize) {
          setNoMore(true);
        }
        setList([...list, ...(newList || [])]);
        setLoading(false);
        Toast.hide();
      } else Toast.fail(msg, 1);
    } catch (error) {}
  };

  const payTypeMap = {
    [TRACE_STATUS_0]: () => {},
    [TRACE_STATUS_1]: (item) => (
      <div className="order__item-bottom-text">
        <span className="order__item-bottom-text--text">待付合计:</span>
        <span className="order__item-bottom-text--money">
          &nbsp;￥{getFloat((item.amount * item.price) / TRANSTEMP, PRECISION)}
        </span>
      </div>
    ),
    [TRACE_STATUS_2]: (item) => (
      <div className="order__item-bottom-text">
        <span className="order__item-bottom-text--text">合计:</span>
        <span className="order__item-bottom-text--money">
          &nbsp;￥{getFloat((item.amount * item.price) / TRANSTEMP, PRECISION)}
        </span>
      </div>
    ),
    [TRACE_STATUS_3]: () => {},
    [TRACE_STATUS_4]: (item) => (
      <div className="order__item-bottom-text">
        <span className="order__item-bottom-text--text">合计:</span>
        <span className="order__item-bottom-text--money">
          &nbsp;￥{getFloat((item.amount * item.price) / TRANSTEMP, PRECISION)}
        </span>
      </div>
    ),
    [TRACE_STATUS_5]: (item) => (
      <div className="order__item-bottom-text">
        <span className="order__item-bottom-text--text">合计:</span>
        <span className="order__item-bottom-text--money">
          &nbsp;￥{getFloat((item.amount * item.price) / TRANSTEMP, PRECISION)}
        </span>
      </div>
    ),
    [TRACE_STATUS_6]: (item) => (
      <div className="order__item-bottom-text">
        <span className="order__item-bottom-text--text">合计:</span>
        <span className="order__item-bottom-text--unmoney">
          &nbsp;￥{getFloat((item.amount * item.price) / TRANSTEMP, PRECISION)}
        </span>
      </div>
    ),
  };

  const payButMap = {
    [TRACE_STATUS_0]: () => {},
    [TRACE_STATUS_1]: (item) => {
      return (
        <>
          <div className="order__item-bottom-btn--ghost" onClick={kefuModal}>
            联系客服
          </div>
          <div
            className="order__item-bottom-btn--primary"
            onClick={() => _pay(item.orderId)}
          >
            继续支付
          </div>
        </>
      );
    },

    [TRACE_STATUS_2]: (item) => (
      <div className="order__item-bottom-btn--ghost" onClick={kefuModal}>
        联系客服
      </div>
    ),
    [TRACE_STATUS_3]: () => {},
    [TRACE_STATUS_4]: (item) => {
      if (
        item.productTypeCode === PRODUCT_TYPE_1 ||
        item.productTypeCode === PRODUCT_TYPE_2 ||
        item.productTypeCode === PRODUCT_TYPE_3
      ) {
        return (
          <>
            {/* <div
              className="order__item-bottom-btn--ghost"
              onClick={() => {
                if (item.bizType === TRANSACTION_TYPE_1) {
                  history.push(`/cardItem?brandCode=${item.brandCode}`);
                } else if (item.bizType === TRANSACTION_TYPE_2) {
                  history.push(`/creditItem?brandCode=${item.brandCode}`);
                }
              }}
            >
              再来一单
            </div> */}
            <div
              className="order__item-bottom-btn--primary"
              onClick={() => history.push(`/card?orderId=${item.orderId}`)}
            >
              查看卡券
            </div>
          </>
        );
      } else return "";
    },
    [TRACE_STATUS_5]: () => {},
    [TRACE_STATUS_6]: () => {},
  };

  const _pay = async (orderId) => {
    try {
      if (orderId) {
        const [err, data, msg] = await pay({ orderId });
        if (!err) {
          getList(orderId);
          wxpay(data);
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
      "getBrandWCPayRequest",
      {
        appId, //公众号名称，由商户传入
        timeStamp: timestamp, //时间戳，自1970年以来的秒数
        nonceStr, //随机串
        package: orderdetail,
        signType, //微信签名方式：
        paySign, //微信签名
      },
      (res) => {
        if (res.err_msg == "get_brand_wcpay_request:cancel") {
          clearTimeout(timer);
        }
      }
    );
  };

  const getList = async (orderId) => {
    try {
      const [err, data, msg] = await getOrderByOrderId({ orderId });
      if (!err) {
        if (data.payStatus === 1) {
          clearTimeout(timer);
          dispatchInit();
          Toast.success("支付成功");
        } else timer = setTimeout(() => getList(orderId), 1000);
      } else Toast.fail(msg, 1);
    } catch (error) {}
  };

  const kefuModal = _.debounce(() => {
    Modal.alert(
      <div className="modalTop">咨询商品问题,请添加客服QQ(2045879978)</div>,
      "",
      [
        {
          text: "我知道了",
          onPress: () => {},
        },
      ]
    );
  }, 100);

  return (
    <div className="order">
      <TabsComp
        className="order__filter-tabs"
        activeTab={activeTab}
        onTabClick={(tab, index) => {
          if (tab.key === activeTab) return;
          setList([]);
          setActiveTab(index);
        }}
        data={tabData}
        page={5}
      />
      <div className="order__filter-tabs--block"></div>
      <div className="order__list">
        <div>
          {!list.length && !loading ? (
            <div className="order__list-unList">
              <img src={empty} />
              <div className="order__list-unList-text">您还没有订单</div>
              <div
                className="order__item-bottom-btn--ghost"
                onClick={() => {
                  history.push("/home");
                }}
              >
                去购买
              </div>
            </div>
          ) : (
            <ul>
              {_.map(list, (item, index) => (
                <li className="order__item" key={index}>
                  <div className="order__item-head">
                    <span className="order__item-head-no">
                      订单号：{item.orderId}
                    </span>
                    <span className="order__item-head-status">
                      {typeof TraceStatus[item.status] === "function"
                        ? TraceStatus[item.status](item.productTypeCode)
                        : TraceStatus[item.status]}
                    </span>
                  </div>
                  <div className="order__item-goods">
                    <img
                      className={
                        item.status === TRACE_STATUS_6
                          ? "order__item-goods-unimg"
                          : "order__item-goods-img"
                      }
                      src={`/file${item.iconUrl}`}
                    />
                    <span className="order__item-goods-name">
                      {item.goodsName}
                      <b
                        className={
                          item.status === TRACE_STATUS_6
                            ? "order__item-goods-name--untype"
                            : "order__item-goods-name--type"
                        }
                      >
                        {ProductTypes[item.productTypeCode]}
                      </b>
                    </span>
                    <span className="order__item-goods-other">
                      <span>x{item.amount}</span>
                      <span className="price">
                        ￥{getFloat(item.price / TRANSTEMP, PRECISION)}
                      </span>
                    </span>
                  </div>
                  <div className="order__item-extra">
                    <span className="order__item-extra-item">
                      购买时间：{item.createTime}
                    </span>
                    {item.productTypeCode === PRODUCT_TYPE_4 && (
                      <span className="order__item-extra-item">
                        充值账号：{item.rechargeAccount}
                      </span>
                    )}
                  </div>
                  <div className="order__item-bottom">
                    {payTypeMap[item.status](item)}
                    <div className="order__item-bottom-btn">
                      <span className="order__item-bottom--text">
                        {item.status === TRACE_STATUS_1 ? (
                          <div className="order__item-bottom--pay">
                            等待买家付款
                          </div>
                        ) : (
                          ""
                        )}
                      </span>
                      {payButMap[item.status](item)}
                    </div>
                  </div>
                </li>
              ))}
              {/* {noMore && <li className="order__item--no-more">没有更多</li>} */}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
