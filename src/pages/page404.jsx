import React from "react";
import empty from "@/assets/images/empty.png";

export default () => (
  <div className="page-404">
    <img src={empty} />
    <div className="page-404__text">页面载入失败！</div>
    <div className="page-404__btn" onClick={() => history.go(-1)}>
      <span>点击重试</span>
    </div>
  </div>
);
