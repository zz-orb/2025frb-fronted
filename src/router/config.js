import TabsView from '@/layouts/tabs/TabsView'
import BlankView from '@/layouts/BlankView'

// 路由配置
const options = {
  routes: [
    {
      path: '/login',
      name: '登录页',
      component: () => import('@/pages/login')
    },
    {
      path: '/Register',
      name: '注册页',
      component: () => import('@/pages/Register')
    },
    {
      path: '*',
      name: '404',
      component: () => import('@/pages/exception/404'),
    },
    {
      path: '/403',
      name: '403',
      component: () => import('@/pages/exception/403'),
    },
    {
      path: '/',
      name: '首页',
      component: TabsView,
      //redirect: '/login',
      meta:{
        page:{
                title: 'Default Page Title',
                path:'main',
                component: () => import('@/pages/main')
        }
      },
      children: [
        {
          path: 'main',
          name: '主页面',
          meta: {
            icon: 'file-ppt'
          },
          component: () => import('@/pages/main')
        },
        {
          path: '/login',
          name: '退出登录',
          meta: {
            icon: 'file-ppt'
          },
          component: () => import('@/pages/login')
        },
        {
          path: '/mall',
          name: '政策解读',
          meta: {
            icon: 'file-ppt'
          },
          component: () => import('@/pages/mall')
        },
        {
          path: '/shopcart',
          name: '讨论区',
          meta: {
            icon: 'file-ppt'
          },
          component: () => import('@/pages/shopcart')
        },
        {
          path: '/collect',
          name: '我的收藏',
          meta: {
            icon: 'file-ppt'
          },
          component: () => import('@/pages/collect')
        },
        {
          path: 'parent1',
          name: '用户中心',
          meta: {
            icon: 'dashboard',
          },
          component: BlankView,
          children: [
            {
              path: 'information',
              name: '重置用户信息',
              component: () => import('@/pages/information'),
            }
          ]
        },
       
        {
          name: '验权页面',
          path: 'auth/demo',
          meta: {
            icon: 'file-ppt',
            authority: {
              permission: 'form',
              role: 'manager'
            },
            component: () => import('@/pages/demo')
          }
        }
      ]
    },
    {
      path: '/admin',
      name: '管理员首页',
      component: () => import('@/pages/adminpage')
    },
     
  ]
}

export default options
