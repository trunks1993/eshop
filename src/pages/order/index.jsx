import React, { useState, useEffect } from 'react';
import TabsComp from '@/components/lib/tabs';
import BScroll from '@better-scroll/core';
import PullUp from '@better-scroll/pull-up';
import { searchUserSubscribeOrderList } from '@/services/app';
import { Toast, Modal } from 'antd-mobile';
import { getQueryVariable } from '@/utils';
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
} from '@/const';
import _, { set } from 'lodash';
BScroll.use(PullUp);
let scroll;
let cuur = 1;
const data = [
  {
    key: 0,
    title: '全部',
    value: '',
  },
  {
    key: 1,
    title: '待付款',
    value: '1',
  },
  {
    key: 2,
    title: '处理中',
    value: '2,3',
  },
  {
    key: 3,
    title: '已完成',
    value: '4,5',
  },
  {
    key: 4,
    title: '已取消',
    value: '6',
  },
];

export default (props) => {
  const { history } = props;

  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [status, setStatus] = useState();
  const [activeTab, setActiveTab] = useState(0);
  const [list, setList] = useState([]);

  useEffect(() => {
    if (_.isEmpty(getQueryVariable('status'))) return;
    setStatus(getQueryVariable('status'));
    for (let i = 0; i <= data?.length; i++) {
      if (data[i]?.value === getQueryVariable('status')) {
        return setActiveTab(data[i]?.key);
      }
    }
  }, []);

  useEffect(() => {
    if (_.isEmpty(list) || list.length > pageSize) return;
    scroll = new BScroll('.order__list', {
      scrollY: true,
      click: true,
      pullUpLoad: {
        threshold: 50, //触发pullingDown事件的位置
      },
    });
    scroll.on('pullingUp', pullingUpHandler); //上拉加载更多
  }, [list]);

  useEffect(() => {
    if (_.isEmpty(scroll) || _.isEmpty(list)) return;
    scroll.finishPullUp();
    scroll.refresh();
  }, [list]);

  useEffect(() => {
    if (!_.isEmpty(getQueryVariable('status'))) return;
    initList();
  }, [currPage]);

  useEffect(() => {
    if (_.isEmpty(status)) return;
    dispatchInit();
    setList([]);
  }, [status]);

  const pullingUpHandler = () => {
    setCurrPage(++cuur);
  };

  const dispatchInit = () => {
    currPage === 1 ? initList() : setCurrPage(1);
  };

  const initList = async () => {
    try {
      const [err, data, msg] = await searchUserSubscribeOrderList({
        statusArray: status,
        currPage,
        pageSize,
      });
      if (!err) {
        setList([...list, ...data.list]);
      } else Toast.fail(msg, 1);
    } catch (error) {}
  };

  const payTypeMap = {
    [TRACE_STATUS_0]: () => {},
    [TRACE_STATUS_1]: (item) => (
      <div className="order__item-bottom-text">
        <span className="order__item-bottom-text--text">待付合计:</span>
        <span className="order__item-bottom-text--money">
          &nbsp;￥{(item.amount * item.price) / 10000}
        </span>
      </div>
    ),
    [TRACE_STATUS_2]: (item) => (
      <div className="order__item-bottom-text">
        <span className="order__item-bottom-text--text">合计:</span>
        <span className="order__item-bottom-text--money">
          &nbsp;￥{(item.amount * item.price) / 10000}
        </span>
      </div>
    ),
    [TRACE_STATUS_3]: () => {},
    [TRACE_STATUS_4]: () => {},
    [TRACE_STATUS_5]: () => {},
    [TRACE_STATUS_6]: (item) => (
      <div className="order__item-bottom-text">
        <span className="order__item-bottom-text--text">合计:</span>
        <span className="order__item-bottom-text--unmoney">
          &nbsp;￥{(item.amount * item.price) / 10000}
        </span>
      </div>
    ),
  };

  const payButMap = {
    [TRACE_STATUS_0]: () => {},
    [TRACE_STATUS_1]: (item) => (
      <>
        <div className="order__item-bottom-btn--ghost" onClick={kefuModal}>
          联系客服
        </div>
        <div
          className="order__item-bottom-btn--primary"
          // onClick={() => history.push('/card')}
        >
          继续支付
        </div>
      </>
    ),
    [TRACE_STATUS_2]: (item) => (
      <div className="order__item-bottom-btn--ghost" onClick={kefuModal}>
        联系客服
      </div>
    ),
    [TRACE_STATUS_3]: () => {},
    [TRACE_STATUS_4]: (item) => {
      if (item.productTypeCode === PRODUCT_TYPE_1) {
        return (
          <>
            <div className="order__item-bottom-btn--ghost" onClick={kefuModal}>
              联系客服
            </div>
            <div
              className="order__item-bottom-btn--primary"
              onClick={() => history.push('/card')}
            >
              查看卡券
            </div>
          </>
        );
      } else return '';
    },
    [TRACE_STATUS_5]: () => {},
    [TRACE_STATUS_6]: () => {},
  };

  const kefuModal = _.debounce(() => {
    Modal.alert('咨询商品问题,请添加客服QQ(791441309)', '', [
      {
        text: '我知道了',
        onPress: () => {},
      },
    ]);
  }, 100);

  return (
    <div className="order">
      <TabsComp
        className="order__filter-tabs"
        activeTab={activeTab}
        onTabClick={(tab, index) => {
          setActiveTab(index);
          setStatus(tab.value);
        }}
        data={data}
        page={5}
      />
      <div className="order__filter-tabs--block"></div>
      <div className="order__list">
        <ul>
          {_.map(list, (item, index) => (
            <li className="order__item" key={index}>
              <div className="order__item-head">
                <span className="order__item-head-no">订单号：{index + 1}</span>
                <span className="order__item-head-status">
                  {TraceStatus[item.status]}
                </span>
              </div>
              <div className="order__item-goods">
                <img
                  className={
                    item.status === TRACE_STATUS_6
                      ? 'order__item-goods-unimg'
                      : 'order__item-goods-img'
                  }
                  src={`/file${item.iconUrl}`}
                />
                <span className="order__item-goods-name">
                  {item.goodsName}
                  <b
                    className={
                      item.status === TRACE_STATUS_6
                        ? 'order__item-goods-name--untype'
                        : 'order__item-goods-name--type'
                    }
                  >
                    {ProductTypes[item.productTypeCode]}
                  </b>
                </span>
                <span className="order__item-goods-other">
                  <span>x{item.amount}</span>
                  <span className="price">￥{item.price / 10000}</span>
                </span>
              </div>
              <div className="order__item-extra">
                <span className="order__item-extra-item">
                  有效期至：{item.modifyTime}
                </span>
                <span className="order__item-extra-item">
                  购买时间：{item.modifyTime}
                </span>
              </div>
              <div className="order__item-bottom">
                {payTypeMap[item.status](item)}
                <div className="order__item-bottom-btn">
                  <span className="order__item-bottom--text">
                    {item.status === TRACE_STATUS_1 ? (
                      <div className="order__item-bottom--pay">
                        等待付款
                        <div className="order__item-bottom--close">
                          15分钟00秒自动关闭
                        </div>
                      </div>
                    ) : (
                      ''
                    )}
                  </span>
                  {payButMap[item.status](item)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
