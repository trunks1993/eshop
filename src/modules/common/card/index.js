/*
 * @Date: 2020-05-29 11:05:46
 * @LastEditTime: 2020-09-10 15:15:40
 */
import React from "react";
import ReactDom from "react-dom";
import FastClick from "fastclick";

import App from "./app";
import { getQueryVariable, setToken } from "@/utils";
import "normalize.css";
import "@/styles/card/index.less";
import "@/assets/images/svg";

FastClick.attach(document.body);

const token = getQueryVariable("token");
if (token) setToken(token);

const channel = getQueryVariable("channel");
if (channel) setChannel(channel);

ReactDom.render(<App />, document.getElementById("app"));
