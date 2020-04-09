import Vue from 'vue'
import Router from 'vue-router'

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
      hidden : true,
      component :() => import('@/page/index'),
      children : [
        {
          path: '/exception/manageException',
          name: '异常管理',
          hidden : true,
          component :() => import('@/page/exception/manageException')
        },
        {
          path: '/realTimeMonitoring/forecastParameter',
          name: '预测参数',
          hidden : true,
          component :() => import('@/page/realTimeMonitoring/forecastParameter')
        },
        {
          path: '/realTimeMonitoring/forecastFeatures',
          name: '预测特征',
          hidden : true,
          component :() => import('@/page/realTimeMonitoring/forecastFeatures')
        },
        {
          path: '/realTimeMonitoring/workShopModel',
          name: '车间模型',
          hidden : true,
          component :() => import('@/page/realTimeMonitoring/workShopModel')
        },
        {
          path: '/user/manageUser',
          name: '用户管理',
          hidden : true,
          component :() => import('@/page/user/manageUser')
        },
        {
          path: '/systemManage/manageData',
          name: '数据配置',
          hidden : true,
          component :() => import('@/page/systemManage/manageData')
        },
        {
          path: '/systemManage/manageRole',
          name: '角色管理',
          hidden : true,
          component :() => import('@/page/systemManage/manageRole')
        },
        {
          path: '/systemManage/manageOrg',
          name: '组织机构管理',
          hidden : true,
          component :() => import('@/page/systemManage/manageOrg')
        },
        {
          path: '/modelGroup/manageModelGroup',
          name: '模型组管理',
          hidden : true,
          component :() => import('@/page/modelGroup/manageModelGroup')
        },
        {
          path: '/samplePoint/manageSamplePoint',
          name: '采样点管理',
          hidden : true,
          component :() => import('@/page/samplePoint/manageSamplePoint')
        },
        {
          path: '/systemManage/manageNorm',
          name: '指标管理',
          hidden : true,
          component :() => import('@/page/systemManage/manageNorm')
        },
        {
          path: '/systemManage/manageCharacteristicGrade',
          name: '特征牌号管理',
          hidden : true,
          component :() => import('@/page/systemManage/manageCharacteristicGrade')
        },
        {
          path: '/systemManage/manageOptimization',
          name: '优化管理',
          hidden : true,
          component :() => import('@/page/systemManage/manageOptimization')
        },
        {
          path: '/rate/manageYieldFormula',
          name: '收率公式管理',
          hidden : true,
          component :() => import('@/page/rate/manageYieldFormula')
        },
        {
          path: '/rate/viewYield',
          name: '收率展示',
          hidden : true,
          component :() => import('@/page/rate/viewYield')
        },
        {
          path: '/rate/viewPassRate',
          name: '合格率',
          hidden : true,
          component :() => import('@/page/rate/viewPassRate')
        },
        {
          path: '/org/viewOrg',
          name: '树菜单',
          hidden : true,
          component :() => import('@/page/org/viewOrg')
        }
      ]
    }
  ]
})
