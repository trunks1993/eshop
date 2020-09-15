/*
 * @Date: 2020-09-08 11:04:34
 * @LastEditTime: 2020-09-15 11:02:05
 */
import Vue from 'vue';
import App from './app';
import FastClick from 'fastclick';
import Vant, { Dialog, Toast } from 'vant';
import 'normalize.css';
import '@/styles/order/index.less';
import { getQueryVariable, setToken, setChannel } from '@/utils';

FastClick.attach(document.body);

const token = getQueryVariable('token');
if (token) setToken(token);

const channel = getQueryVariable('channel');
if (channel) setChannel(channel);

Vue.prototype.$dialog = Dialog;
Vue.prototype.$toast = Toast;
Vue.use(Vant);
new Vue({
  //   router,
  //   store,
  render: (h) => h(App),
}).$mount('#app');
