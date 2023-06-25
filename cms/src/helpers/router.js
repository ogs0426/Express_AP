import Vue from 'vue'
import Router from 'vue-router'
import Store from '@/store'
import LoginPage from '@/pages/layout/Login'
import HomePage from '@/pages/layout/Home'
import DashPage from '@/pages/layout/Dashboard'
import BannerPage from '@/pages/banner/Banner'
import ChannelPage from '@/pages/channel/Channel'
import SchedulePage from '@/pages/schedule/Schedule'
import BoardPage from '@/pages/board/Board'
import ProgramPage from '@/pages/program/Program'
import LinkPage from '@/pages/link/Link'

Vue.use(Router)

export const router = new Router({
  mode: 'history',
  routes: [
    { path: '/login', name: 'login', component: LoginPage, props: true },
    {
      path: '/',
      component: HomePage,
      children: [
        { path: '/', component: DashPage },
        { path: '/banner', component: BannerPage },
        { path: '/program', component: ProgramPage },
        { path: '/channel', component: ChannelPage },
        { path: '/schedule', component: SchedulePage },
        { path: '/board', component: BoardPage },
        { path: '/link', component: LinkPage }
      ]
    },
    { path: '*', redirect: '/' }
  ]
})

router.beforeEach((to, from, next) => {
  // console.log('# router, state : ', Store.state.common)
  // console.log('# router, isLogin : ', Store.state.common.isLogin)
  let isLogin = Store.getters['common/IS_LOGIN']
  console.log("ISLOGIN", isLogin)
  if (to.path !== '/login' && isLogin === false) {
    return next({path: '/login'})
  }

  next()
})