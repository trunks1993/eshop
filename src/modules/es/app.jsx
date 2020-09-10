import React from "react";
import { routerRedux, Route, Switch } from "dva/router";

const { ConnectedRouter } = routerRedux;

import Layout from "@/modules/es/layout";
import Page404 from "@/modules/es/pages/page404";

export default ({ history }) => {
  return (
    <ConnectedRouter history={history}>
      <Switch>
        <Route exact path="/404" component={Page404} />
        <Route path="/" component={Layout} />
      </Switch>
    </ConnectedRouter>
  );
};
