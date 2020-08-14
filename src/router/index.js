/*
 * @Date: 2020-06-20 17:03:03
 * @LastEditTime: 2020-08-14 10:50:09
 */
import React from "react";
import { routerRedux, Route, Switch, Redirect } from "dva/router";
import _ from "lodash";

const { ConnectedRouter } = routerRedux;

import Layout from "@/layout";
import Order from "@/pages/order";
import Item from "@/pages/item";
import Card from "@/pages/card";

export default ({ history }) => {
  return (
    <ConnectedRouter history={history}>
      <Switch>
        <Route exact path="/order" component={Order} />
        <Route exact path="/item" component={Item} />
        <Route exact path="/card" component={Card} />
        <Route path="/" component={Layout} />
      </Switch>
    </ConnectedRouter>
  );
};
