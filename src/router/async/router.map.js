

// 视图组件
const view = {
  tabs: () => import('@/layouts/tabs'),
  tabsadmin: ()=>import('@/layouts/tabsadmin'),
  blank: () => import('@/layouts/BlankView'),
  page: () => import('@/layouts/PageView')
}

// 路由组件注册
const routerMap = {
  login: {
    authority: '*',
    path: '/login',
    component: () => import('@/pages/login')
  },
  Register: {
    authority: '*',
    path: '/Register',
    component: () => import('@/pages/Register')
  },
  demo: {
    name: '演示页',
    renderMenu: false,
    component: () => import('@/pages/demo')
  },
  main: {
    name: '主页面',
    renderMenu: false,
    component: () => import('@/pages/main')
  },
  mall: {
    name: '政策解读',
    renderMenu: false,
    component: () => import('@/pages/mall')
  },
  collect: {
    name: '我的收藏',
    renderMenu: false,
    component: () => import('@/pages/collect')
  },
  information: {
    name: '用户中心',
    renderMenu: false,
    component: () => import('@/pages/information')
  },
  shopcart: {
    name: '讨论区',
    renderMenu: false,
    component: () => import('@/pages/shopcart')
  },
  backlogin: {
    name: '退出登录',
    renderMenu: false,
    component: () => import('@/pages/login')
  },
  exp403: {
    authority: '*',
    name: 'exp403',
    path: '403',
    component: () => import('@/pages/exception/403')
  },
  exp404: {
    name: 'exp404',
    path: '404',
    component: () => import('@/pages/exception/404')
  },
  exp500: {
    name: 'exp500',
    path: '500',
    component: () => import('@/pages/exception/500')
  },
  root: {
    path: '/',
    name: '首页',
    redirect: '/login',
    component: view.tabs
  },
  admin: {
    path: '/admin',
    name: '管理员首页',
    renderMenu: false,
    component: () => import('@/pages/adminpage')
  },
  parent1: {
    name: '父级路由1',
    icon: 'dashboard',
    component: view.blank
  },
  parent2: {
    name: '父级路由2',
    icon: 'form',
    component: view.page
  },
  exception: {
    name: '异常页',
    icon: 'warning',
    component: view.blank
  }
}
export default routerMap
