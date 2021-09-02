import Vue from 'vue'
import Router from 'vue-router'
import index from '@/iview/index'
import login from '@/iview/login'
import chpassword from '@/iview/chpassword'
// import first from '@/iview/path1/first'
Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

export default new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: login
    },
    {
      name: 'chpassword',
      path: '/chpassword',
      component: chpassword
    },
    {
      name: '用户管理',
      path: '/',
      component: index,
      children: [
        {
          name: 'user',
          path: '/',
          component: () => import('@/iview/user/index.vue') // 用户管理
        },
        {
          name: 'accountorder',
          path: 'accountorder',
          component: () => import('@/iview/orderman/accountorder.vue') // 账号费用订单
        },
        {
          name: 'modellingorder',
          path: 'modellingorder',
          component: () => import('@/iview/orderman/modellingorder.vue') // 建站申请订单
        },
        {
          name: 'opening',
          path: 'opening',
          component: () => import('@/iview/orderman/opening.vue') // 支付开通订单
        },
        {
          name: 'logistics',
          path: 'logistics',
          component: () => import('@/iview/orderman/logistics.vue') // 物流开通订单
        },
        {
          name: 'channel',
          path: 'channel',
          component: () => import('@/iview/orderman/channel.vue') // 广告渠道开通订单
        },
        {
          name: 'Internetorder',
          path: 'Internetorder',
          component: () => import('@/iview/orderman/Internetorder.vue') // 网红营销订单
        },
        {
          name: 'companyoder',
          path: 'companyoder',
          component: () => import('@/iview/orderman/companyoder.vue') // 公司注册订单
        },

        {
          name: 'accountaudit',
          path: 'accountaudit',
          component: () => import('@/iview/accountaudit/accountaudit.vue') // 账号开通审核
        },
        {
          name: 'accountman',
          path: 'accountman',
          component: () => import('@/iview/setting/accountman.vue') // 员工账号管理
        },
        {
          name: 'siteconfig',
          path: 'siteconfig',
          component: () => import('@/iview/setting/siteconfig.vue') // 建站参数配置
        },
        {
          name: 'payconfig',
          path: 'payconfig',
          component: () => import('@/iview/setting/payconfig.vue') // 支付参数配置
        },
        {
          name: 'logisconfig',
          path: 'logisconfig',
          component: () => import('@/iview/setting/logisconfig.vue') // 物流参数配置
        },
        {
          name: 'channelconfig',
          path: 'channelconfig',
          component: () => import('@/iview/setting/channelconfig.vue') // 广告渠道参数配置
        },
        {
          name: 'memberconfig',
          path: 'memberconfig',
          component: () => import('@/iview/setting/memberconfig.vue') // 会员信息配置
        },
        {
          name: 'client',
          path: 'client',
          component: () => import('@/iview/setting/client.vue') // 客户系统权限配置
        },
        {
          name: 'Internet',
          path: 'Internet',
          component: () => import('@/iview/setting/Internet.vue') // 网红营销权限配置
        },
        {
          name: 'company',
          path: 'company',
          component: () => import('@/iview/setting/company.vue') // 公司注册权限配置
        }

      ]
    }
  ]

})
