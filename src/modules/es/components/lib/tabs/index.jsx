import React, { useEffect } from "react";
import { Tabs } from "antd-mobile";

const TabsComp = (props) => {
  const { className, activeTab, onTabClick, page, data } = props;

  useEffect(() => {
    initLine();
  }, []);

  // 修改tabs选中下划线
  const initLine = () => {
    const dom = document.querySelector(".am-tabs-default-bar-underline");
    if (!dom.firstChild) {
      const el = document.createElement("div");
      el.className = "line";
      dom.appendChild(el);
    }
  };
  return (
    <div className={className}>
      <Tabs
        tabs={data}
        renderTabBar={(props) => {
          return (
            <Tabs.DefaultTabBar {...props} activeTab={activeTab} page={page} />
          );
        }}
        onTabClick={onTabClick}
      />
    </div>
  );
};

export default TabsComp;
