/*
 * @Date: 2020-09-08 11:04:34
 * @LastEditTime: 2020-09-22 10:08:32
 */
import Vue from 'vue';
import App from './app';
import FastClick from 'fastclick';
import Vant, { Toast } from 'vant';
import 'normalize.css';
import '@/styles/redirect/index.less';
import { getQueryVariable, setToken, setChannel } from '@/utils';

FastClick.attach(document.body);

const token = getQueryVariable('token');
if (token) setToken(token);

const channel = getQueryVariable('channel');
if (channel) setChannel(channel);

Vue.prototype.$toast = Toast;
Vue.use(Vant);
new Vue({
  //   router,
  //   store,
  render: (h) => h(App),
}).$mount('#app');
