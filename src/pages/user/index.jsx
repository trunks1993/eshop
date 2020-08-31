import React, { useEffect, useState } from 'react';
import { List, Modal, Button, Toast } from 'antd-mobile';
import { getQueryVariable } from '@/utils';
import { setToken } from '@/utils/auth';

const Item = List.Item;
import icon1 from '@/assets/images/@2x/user-icon1.png';
import icon2 from '@/assets/images/@2x/user-icon2.png';
import icon3 from '@/assets/images/@2x/user-icon3.png';
import icon4 from '@/assets/images/@2x/user-icon4.png';

import icon5 from '@/assets/images/@2x/user-icon5.png';
import icon6 from '@/assets/images/@2x/user-icon6.png';
import { getUseInfo } from '@/services/app';

export default (props) => {
  const { history } = props;
  const [list, setList] = useState([]);

  const toOrder = (index) => {
    history.push(`/order?index=${index}`);
  };

  useEffect(() => {
    getToken();
    initList();
  }, []);

  const initList = async () => {
    try {
      const [err, data, msg] = await getUseInfo();
      if (!err) setList(data);
      else Toast.fail(msg, 1);
    } catch (error) {}
  };

  const getToken = () => {
    const token = getQueryVariable('token');
    if (token) setToken(token);
  };

  return (
    <div className="user">
      <div className="user__info-panel">
        <div className="user__info-panel-wrap">
          <div className="user__info-panel-avater">
            <div className="user__info-panel-avater-box">
              <img src={list.headIcon} />
            </div>
            <span className="user__info-panel-avater-name">
              {list.aliasName}
            </span>
          </div>
          <Item arrow="horizontal" onClick={() => toOrder(0)}>
            <span className="user__item-text">全部订单</span>
          </Item>
        </div>
        <div className="user__icon-btn">
          <ul>
            <li className="user__icon-btn-item" onClick={() => toOrder(1)}>
              <img className="user__icon-btn-item-img" src={icon1} />
              <span className="user__icon-btn-item-text">待付款</span>
            </li>
            <li className="user__icon-btn-item" onClick={() => toOrder(2)}>
              <img className="user__icon-btn-item-img" src={icon2} />
              <span className="user__icon-btn-item-text">处理中</span>
            </li>
            <li className="user__icon-btn-item" onClick={() => toOrder(3)}>
              <img className="user__icon-btn-item-img" src={icon3} />
              <span className="user__icon-btn-item-text">已完成</span>
            </li>
            <li className="user__icon-btn-item" onClick={() => toOrder(4)}>
              <img className="user__icon-btn-item-img" src={icon4} />
              <span className="user__icon-btn-item-text">已取消</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="user__other-btn">
        <ul>
          <li
            className="user__other-btn-item"
            onClick={() => {
              Modal.alert(<div className="modalTop">咨询商品问题,请添加客服QQ(2045879978)</div>, '', [
                {
                  text: '我知道了',
                  onPress: () => {},
                },
              ]);
            }}
          >
            <img className="user__other-btn-item-img" src={icon5} />
            <span className="user__other-btn-item-text">客服咨询</span>
          </li>
          <li
            className="user__other-btn-item"
            onClick={() => (window.location.href = 'tel:18627374839')}
          >
            <img className="user__other-btn-item-img" src={icon6} />
            <span className="user__other-btn-item-text">商务合作</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
