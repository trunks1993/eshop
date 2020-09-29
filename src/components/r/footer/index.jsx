import React from 'react';
import order from '@/assets/images/order.png';
import service from '@/assets/images/service.png';
import PayType from './payType';

export default (props) => {
  const {
    children,
    shop,
    redirectOrder,
    showKFModal,
    btnText,
    orderId,
    successUrl,
  } = props;

  return (
    <>
      <div className="item-footer">
        <div className="item-footer-subtn" onClick={showKFModal}>
          <img src={service} />
          <span className="item-footer-subtn-title">客服</span>
        </div>
        <div className="item-footer-subtn line" onClick={redirectOrder}>
          <img src={order} />
          <span className="item-footer-subtn-title">订单</span>
        </div>
        <div className="item-footer__btn" onClick={shop}>
          {children}
          {btnText}
        </div>
      </div>
      <PayType orderId={orderId} successUrl={successUrl} />
    </>
  );
};
