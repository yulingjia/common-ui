import router from '../router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '../utils/auth'

const install = (Vue) => {
  Vue.prototype.$hasPermission = function (p) {
    if (!p) {
      return true
    }
    let r = false
    this.$store.state.permissions.permissions.forEach((item, index) => {
      if (item === p) {
        r = true
        return r
      }
    })
    return r
  }
}

export default install

// NProgress 配置
NProgress.inc(0.2)
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/main' })
      NProgress.done()
    } else {
      next()
      NProgress.done()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next({ path: '/login' })
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
