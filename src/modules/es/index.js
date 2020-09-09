/*
 * @Date: 2020-05-29 11:05:46
 * @LastEditTime: 2020-09-09 14:53:07
 */

import router from "@/modules/es/router";
import dva from "dva";
import createLoading from "dva-loading";
import models from "@/modules/es/models";
import FastClick from "fastclick";
import createHistory from "history/createBrowserHistory";

import { getQueryVariable, setToken } from "@/utils";

import "@/modules/es/styles/base.less";
import "@/modules/es/assets/images/svg";
import "normalize.css";

FastClick.attach(document.body);

const token = getQueryVariable("token");
if (token) setToken(token);

const channel = getQueryVariable("channel");
if (channel) setChannel(channel);

// const app = dva();
const app = dva({
  history: createHistory(),
});

app.use(createLoading());
_.map(_.values(models), (item) => app.model(item));
app.router(router);
app.start("#app");
