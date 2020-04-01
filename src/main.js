// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router';
import Api from './api/index.js';
import  axios from "axios";
Vue.prototype.$http = axios;

import qs from 'qs';
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
})
