/*
 * @Date: 2020-05-29 11:05:46
 * @LastEditTime: 2020-09-10 15:19:31
 */

import App from "./app";
import dva from "dva";
import FastClick from "fastclick";

import { getQueryVariable, setToken } from "@/utils";

import "@/styles/es/index.less";
import "normalize.css";

FastClick.attach(document.body);

const token = getQueryVariable("token");
if (token) setToken(token);

const channel = getQueryVariable("channel");
if (channel) setChannel(channel);

const app = dva();

app.router(App);
app.start("#app");
