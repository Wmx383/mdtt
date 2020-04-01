import Vue from 'vue'
import Router from 'vue-router'
import login from '../page/login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '登录',
      hidden   : true,
      component: ()=>import("../page/login.vue")
    },
    {
      path: '/index',
      name: '首页',
      hidden   : true,
      component: ()=>import("../page/index.vue")
    }
  ]
})
