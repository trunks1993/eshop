import React from "react";

import Home from "@/modules/es/pages/home";
import User from "@/modules/es/pages/user";

import { TabBar } from "antd-mobile";
import tabBarHome from "@/assets/images/@2x/tab-bar-home.png";
import tabBarHomeActive from "@/assets/images/@2x/tab-bar-home-active.png";
import tabBarUser from "@/assets/images/@2x/tab-bar-user.png";
import tabBarUserActive from "@/assets/images/@2x/tab-bar-user-active.png";

import { Route } from "dva/router";

const Footer = (props) => {
  const { history } = props;
  return (
    <TabBar
      unselectedTintColor="#949494"
      tintColor="#33A3F4"
      barTintColor="white"
      tabBarPosition="bottom"
    >
      <TabBar.Item
        icon={<img className="layout__tar-bar-icon--40" src={tabBarHome} />}
        selectedIcon={
          <img className="layout__tar-bar-icon--40" src={tabBarHomeActive} />
        }
        selected={history.location.pathname === "/home"}
        title="首页"
        key="/home"
        onPress={() => history.push("/home")}
      >
        <Route exact path="/home" component={Home} />
      </TabBar.Item>
      <TabBar.Item
        icon={<img className="layout__tar-bar-icon--48" src={tabBarUser} />}
        selectedIcon={
          <img className="layout__tar-bar-icon--48" src={tabBarUserActive} />
        }
        selected={history.location.pathname === "/user"}
        title="我的"
        key="/user"
        onPress={() => history.push("/user")}
      >
        <Route exact path="/user" component={User} />
      </TabBar.Item>
    </TabBar>
  );
};

export default Footer;
