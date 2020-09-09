import React, { useState, useEffect } from 'react';
import { Steps, Toast } from 'antd-mobile';
import BScroll from '@better-scroll/core';
import { getQueryVariable } from '@/utils';
import { getOrderByOrderId } from '@/modules/es/services/app';
import { TRACE_STATUS_4, TRACE_STATUS_5, TRACE_STATUS_6 } from '@/const';
import _ from 'lodash';

export default (props) => {
  const { history } = props;
  const [current, setCurrent] = useState(2);
  const [list, setList] = useState([]);
  let timer = null;
  const orderId = getQueryVariable('orderId');

  useEffect(() => {
    getList();
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    new BScroll('.credits-item', {
      bounce: false,
      probeType: 3,
      click: true,
    });
  }, []);

  const getList = async () => {
    try {
      const [err, data, msg] = await getOrderByOrderId({ orderId });
      if (!err) {
        setList(data);
        if (
          data.status === TRACE_STATUS_4 ||
          data.status === TRACE_STATUS_5 ||
          data.status == TRACE_STATUS_6
        ) {
          clearTimeout(timer);
          setCurrent(3);
        } else timer = setTimeout(getList, 3000);
      } else Toast.fail(msg, 1);
    } catch (error) {}
  };
  const TypeMap = {
    [TRACE_STATUS_4]: <div style={{ color: '#FFD598' }}>商品已到账</div>,
    [TRACE_STATUS_5]: <div style={{ color: '#FFD598' }}>商品已失败</div>,
    [TRACE_STATUS_6]: <div style={{ color: '#FFD598' }}>商品已取消</div>,
  };

  return (
    <div className="credits-item">
      <div>
        <div className="credits-item-head">
          <div className="credits-item-head-title">充值流程</div>
          <Steps
            size="small"
            current={current}
            className="credits-item-head-step"
          >
            <Steps.Step
              title={<div style={{ color: '#FFD598' }}>支付成功</div>}
            />
            <Steps.Step
              title={
                <div style={{ color: '#FFD598' }}>
                  充值已经提交,等待{list?.brandName}处理
                </div>
              }
            />
            <Steps.Step
              title={
                (current === 3 && TypeMap[list.status]) || '预计10秒内到账'
              }
              description="具体到账情况以运营商为准,如有疑问请致电 0731-85790298 联系我们"
            />
          </Steps>
        </div>
        <div className="credits-item-content">
          <div className="credits-item-content-title">
            商品名称:<span>{list.goodsName}</span>
          </div>
          <div className="credits-item-content-title">
            充值账号:<span>{list.rechargeAccount}</span>
          </div>
          <div
            className="credits-item-content-btn--add"
            onClick={() =>
              history.push(`/creditItem?brandCode=${list.brandCode}`)
            }
          >
            继续充值
          </div>
          <div
            className="credits-item-content-btn--detail"
            onClick={() => history.push('/order')}
          >
            查看详情
          </div>
        </div>
      </div>
    </div>
  );
};
