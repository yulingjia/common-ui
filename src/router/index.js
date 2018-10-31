import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const constantRouterMap = [
  {
    path: '',
    component: resolve => require(['@/views/Main'], resolve),
    redirect: '/main'
  },
  {
    path: '/login',
    name: '登录',
    component: resolve => require(['@/views/Login'], resolve),
    hidden: true
  },
  {
    path: '/main',
    component: resolve => require(['@/views/Main'], resolve),
    children: [
      {
        path: '/',
        name: '首页',
        component: resolve => require(['@/views/Home'], resolve)
      },
      {
        path: '/sysModule',
        name: '菜单管理',
        component: resolve => require(['@/views/system/SysModule'], resolve)
      },
      {
        path: '/sysUser',
        name: '用户管理',
        component: resolve => require(['@/views/system/SysUser'], resolve)
      },
      {
        path: '/sysRole',
        name: '角色管理',
        component: resolve => require(['@/views/system/SysRole'], resolve)
      },
      {
        path: '/sysDepartment',
        name: '组织结构管理',
        component: resolve => require(['@/views/system/SysDepartment'], resolve)
      },
      {
        path: '/sysResources',
        name: '权限管理',
        component: resolve => require(['@/views/system/SysResources'], resolve)
      },
      {
        path: '/sysDictionary',
        name: '字典管理',
        component: resolve => require(['@/views/system/SysDictionary'], resolve)
      },
      {
        path: '/sysParameter',
        name: '参数管理',
        component: resolve => require(['@/views/system/SysParameter'], resolve)
      },
      {
        path: '/message',
        name: '消息中心',
        component: resolve => require(['@/views/message/Message'], resolve)
      }
    ]
  },
  {
    path: '*',
    name: '404',
    component: resolve => require(['@/components/error/404'], resolve)
  }
]

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
