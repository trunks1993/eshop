import React from "react";
import { routerRedux, Route, Switch } from "dva/router";

const { ConnectedRouter } = routerRedux;

import Home from "@/modules/lx/pages";

export default ({ history }) => {
  return (
    <ConnectedRouter history={history}>
      <Switch>
        <Route path="/" component={Home} />
      </Switch>
    </ConnectedRouter>
  );
};
