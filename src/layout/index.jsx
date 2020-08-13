import React, { useEffect } from "react";

import { connect } from "dva";

import TabBar from "./TabBar";

const Comp = (props) => {
  const { history } = props;

  return <TabBar history={history} />;
};

export default Comp;
