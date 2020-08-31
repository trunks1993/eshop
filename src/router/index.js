/*
 * @Date: 2020-06-20 17:03:03
 * @LastEditTime: 2020-08-31 19:38:32
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
import Page404 from "@/pages/page404";

export default ({ history }) => {
  return (
    <ConnectedRouter history={history}>
      <Switch>
        <Route exact path="/order" component={Order} />
        
        <Route exact path="/cardItem" component={CardItem} />
        <Route exact path="/creditItem" component={CreditItem} />
        <Route exact path="/creditItems" component={CreditItems} />

        <Route exact path="/card" component={Card} />
        <Route exact path="/404" component={Page404} />
        <Route path="/" component={Layout} />
      </Switch>
    </ConnectedRouter>
  );
};
