/*
 * @Date: 2020-09-08 11:04:34
 * @LastEditTime: 2020-09-08 12:24:17
 */
import Vue from "vue";
import App from "./app";
import FastClick from "fastclick";
import "normalize.css";

FastClick.attach(document.body);

new Vue({
  //   router,
  //   store,
  render: (h) => h(App),
}).$mount("#app");
