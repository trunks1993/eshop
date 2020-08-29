/*
 * @Date: 2020-06-20 17:03:03
 * @LastEditTime: 2020-08-28 17:54:46
 */
import React from "react";
import { routerRedux, Route, Switch, Redirect } from "dva/router";
import _ from "lodash";

const { ConnectedRouter } = routerRedux;

import Layout from "@/layout";
import Order from "@/pages/order";
import CardItem from "@/pages/item/card";
import CreditItem from "@/pages/item/credit";
import CreditItems from "@/pages/item/credits";

import Card from "@/pages/card";

export default ({ history }) => {
  return (
    <ConnectedRouter history={history}>
      <Switch>
        <Route exact path="/order" component={Order} />
        
        <Route exact path="/cardItem" component={CardItem} />
        <Route exact path="/creditItem" component={CreditItem} />
        <Route exact path="/creditItems" component={CreditItems} />

        <Route exact path="/card" component={Card} />
        <Route path="/" component={Layout} />
      </Switch>
    </ConnectedRouter>
  );
};
