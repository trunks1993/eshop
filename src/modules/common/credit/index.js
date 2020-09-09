/*
 * @Date: 2020-05-29 11:05:46
 * @LastEditTime: 2020-09-09 12:21:01
 */
import React from "react";
import ReactDom from "react-dom";
// import { Router, Route } from "react-router-dom";
// import { browserHistory } from "react-router";

import "normalize.css";

import FastClick from "fastclick";

import { getQueryVariable, setToken, setChannel } from "@/utils";
import App from "./app";

import "@/modules/es/styles/base.less";

FastClick.attach(document.body);

const token = getQueryVariable("token");
if (token) setToken(token);

const channel = getQueryVariable("channel");
if (channel) setChannel(channel);

ReactDom.render(<App />, document.getElementById("app"));
