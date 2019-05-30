import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

// 权限判断函数
// roles：vuex中的权限角色；permissionRoles：meta中的权限角色。
function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('admin') >= 0) return true // 是管理员权限，就直接跳过，获得全部权限。
  if (!permissionRoles) return true // meta中没有roles时，说明该路由没有权限限制，为undefined，取非，为true。
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  if (!(store.getters.savestate === 0)) {
    Message({
      showClose: true,
      message: '正在编辑状态中,请先保存',
      type: 'error'
    })
    next(false)
    return
  }
  NProgress.start()
  // 如果已经获取了token
  if (getToken()) {
    // 如果将要跳转到的页面是/login
    if (to.path === '/login') {
      // 那么就直接调转到/
      next({ path: '/' })
      // 进度条结束
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      // 如果角色长度为零，即没有获取到角色
      // 判断当前用户是否已拉取完user_info信息
      if (store.getters.roles.length === 0) {
        // 调用action派遣事件发送请求获取用户信息（包括角色权限）。
        store.dispatch('GetInfo').then(res => { // 拉取用户信息
          // const roles = res.data.roles
          console.log('菜单树信息为：', res.data)
          var { admdivcode, year, name, businessNb, officename } = res.data
          // 以后接口字段待调整。
          businessNb = '001财政局非税'
          var userInfo = { admdivcode, year, name, businessNb, officename }
          store.dispatch('SetUserInfo', userInfo)
          store.dispatch('GenerateRoutes', res.data).then(() => { // 生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({ ...to, replace: true })// hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          })
        }).catch((err) => {
          // getInfo的api报错时，打印错误并返回根目录。
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
      } else {
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        if (hasPermission(store.getters.roles, to.meta.roles)) {
          next()
        } else {
          next({ path: '/401', replace: true, query: { noGoBack: true }})
        }
        // 可删 ↑
      }
    }
  } else {
    // 如果没有获取到token，但是要跳转的页面在白名单中。
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      // 如果没有获取到token，且要跳转的页面不在白名单中。
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
