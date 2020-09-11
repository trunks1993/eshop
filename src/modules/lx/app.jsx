import React from "react";
import { routerRedux, Route, Switch } from "dva/router";

const { ConnectedRouter } = routerRedux;

import Home from "@/modules/lx/pages";
import Page404 from "@/modules/lx/pages/page404";

export default ({ history }) => {
  return (
    <ConnectedRouter history={history}>
      <Switch>
        <Route exact path="/404" component={Page404} />
        <Route path="/" component={Home} />
      </Switch>
    </ConnectedRouter>
  );
};
