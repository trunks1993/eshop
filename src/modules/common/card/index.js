/*
 * @Date: 2020-05-29 11:05:46
 * @LastEditTime: 2020-09-09 14:39:44
 */
import React from "react";
import ReactDom from "react-dom";
import { BrowserRouter, Router, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
const b = createBrowserHistory();

import "normalize.css";

import FastClick from "fastclick";

import { getQueryVariable, setToken } from "@/utils";
import App from "./app";

import "@/modules/es/styles/base.less";

FastClick.attach(document.body);

const token = getQueryVariable("token");
if (token) setToken(token);

const channel = getQueryVariable("channel");
if (channel) setChannel(channel);

ReactDom.render(
  <Router history={b}>
    <Switch>
      <App />
    </Switch>
  </Router>,
  document.getElementById("app")
);
