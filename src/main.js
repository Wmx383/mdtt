// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router';
import Api from './api/index.js';
import  axios from "axios";
import qs from 'qs';
import * as utils from "./utils/utils";
Vue.prototype.$http = axios;
// Vue.prototype.$ajax = axios
Vue.prototype.$qs=qs;

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.prototype.$api = Api;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
axios.interceptors.request.use(
  config => {
    // 判断是否存在token，如果存在的话，则每个http header都加上token
    let token = utils.getStore("Token")
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  });
