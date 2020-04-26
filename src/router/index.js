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
          path: '/role/manageRole',
          name: '角色管理',
          hidden : true,
          component :() => import('@/page/role/manageRole')
        },
        {
          path: '/org/manageOrg',
          name: '组织机构管理',
          hidden : true,
          component :() => import('@/page/org/manageOrg')
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
          path: '/norm/manageNorm',
          name: '指标管理',
          hidden : true,
          component :() => import('@/page/norm/manageNorm')
        },
        {
          path: '/featuresBrand/manageFeaturesBrand',
          name: '特征牌号管理',
          hidden : true,
          component :() => import('@/page/featuresBrand/manageFeaturesBrand')
        },
        {
          path: '/systemManage/manageOptimization',
          name: '优化管理',
          hidden : true,
          component :() => import('@/page/systemManage/manageOptimization')
        },
        {
          path: '/rate/manageExpression',
          name: '收率公式管理',
          hidden : true,
          component :() => import('@/page/rate/manageExpression')
        },
        {
          path: '/rate/viewExpression',
          name: '收率展示',
          hidden : true,
          component :() => import('@/page/rate/viewExpression')
        },
        {
          path: '/rate/viewQualityRate',
          name: '质量合格率',
          hidden : true,
          component :() => import('@/page/rate/viewQualityRate')
        },
        {
          path: '/rate/viewOperationRate',
          name: '操作合格率',
          hidden : true,
          component :() => import('@/page/rate/viewOperationRate')
        },
        {
          path: '/rate/viewOperationStableRate',
          name: '操作平稳率',
          hidden : true,
          component :() => import('@/page/rate/viewOperationStableRate')
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
