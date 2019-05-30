// store/permission.js
import {
  // asyncRouterMap,
  constantRouterMap
} from '@/router'

import {
// asyncRouterMap,
// updateJsonValue
} from '@/utils/Common'
// import Pinyin from '@/utils/chinesePY'

// data.menutree格式化为正确的router
function menuTreeToRouterTree(menuTree, parentText) {
  var routerTree = []
  menuTree.forEach((item, index, arr) => {
    var tempNode = {}
    if (item.btn !== true) {
      // 只有当btn为false，即该项不为btn按钮时，说明该项为树的节点。
      // path应该为它的父节点的text+它自己的text。
      tempNode.text = item.text
      if (parentText) {
        tempNode.text = parentText + '/' + item.text
      }
      // tempNode.attributes = JSON.parse(JSON.stringify(item.attributes))
      // tempNode.path = Pinyin.getWordsCode(item.hasParent === true ? ('/' + tempNode.text) : ('/' + item.text))
      tempNode.path = item.menuId
      tempNode.name = tempNode.path
      tempNode.id = item.id
      tempNode.parentId = item.parentId
      // 当hasParent为false时,说明是根节点，component的值是'Layout'。
      // 当hasParent为true时,说明不根节点，上面有至少1个 父节点。，component的值是当前的text+它父节点的text的值。
      // tempNode.component = item.hasParent === true ? Pinyin.getWordsCode(tempNode.text) : 'Layout'
      tempNode.component = item.hasParent === true ? item.menuId : 'Layout'

      // tempNode.alwaysShow = true
      // 当hasChildren为true时，说明非末级节点。且btn为false，icon图片使用tree，末级节点则使用example
      tempNode.meta = Object.assign({}, {
        title: item.text
      }, {
        icon: (item.hasChildren === true && item.children[0].btn === false) ? 'tree' : 'example'
      },
        // 有butns就加，没有就不加。
      {
        butns: item.attributes.butns
      },
        // 报表url
      {
        url: item.attributes.url
      }
      )
      // 当children的长度为零，说明已经到达了末级节点。children取空数组，否则说明还有子节点，继续递归调用格式转化函数。
      tempNode.children = item.hasChildren === true ? menuTreeToRouterTree(item.children, tempNode.text) : []
      routerTree.push(tempNode)
    } else {
      // 说明此时的该项为btn，即为一个按钮功能。不做处理。
    }
  })
  return routerTree
}

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  // 如果路由的meta和meta.role都存在，
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(routes, roles) {
  const res = []
  routes.forEach(route => {
    const tmp = {
      ...route
    }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}
// /**废弃。只能处理单层。
//  * 根据服务器返回的component的字符串，通过函数拼接字符串，获得真正的
//  *  component: require.ensure([], (require) => {
//  *    resolve(require('@/page/home.vue'))
//  *  })
//  * @param component 服务器端返回的component的值，是字符串
//  */
// function getViews(component) {
//   return resolve => {
//     require.ensure([], (require) => {
//       resolve(require('@/' + component + '.vue'))
//     })
//   }
// }

/** 格式化路由。传入的路由不需要404
 * 根据服务器返回的component的字符串，通过require来获得真正的component
 *  component: require.ensure([], (require) => {
 *    resolve(require('@/page/home.vue'))
 *  })
 * @param permissionRoutes 服务器端返回的路由数组，其中的component是字符串。
 */
function formatRouter(permissionRoutes) {
  var formatRoutes = []
  permissionRoutes.forEach((routerItem) => {
    var {
      path,
      component,
      name,
      meta,
      children
    } = routerItem
    var formatItem = {
      path,
      name,
      meta,
      component(resolve) {
        let componentPath = ''
        if (component === 'Layout') {
          require(['@/views/layout/Layout'], resolve)
          return
        } else {
          componentPath = component
          require([`@/views${componentPath}/index`], resolve)
        }
      },
      // 递归调用，若children数组为空就停止。遍历所有层次。
      children: children.length > 0 ? formatRouter(children) : []
    }
    formatRoutes.push(formatItem)
  })
  return formatRoutes
}

// 最后增加404页面，因为放在上面格式化里增加，由于递归的原因，会导致每个子路由结尾都带一个404
function addNotFound(router) {
  router.push({
    path: '*',
    redirect: '/404',
    hidden: true
  })
}

const permission = {
  state: {
    routers: [],
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
      console.dir(routers)
    }
  },
  actions: {
    // 根据权限，过滤路由。当路由对象中含有需要的权限，则通过，否则过滤掉。
    GenerateRoutes({
      commit
    }, data) {
      return new Promise(resolve => {
        const {
          roles,
          menutree
        } = data
        // updateJsonValue(menutree, 'text', '票据购领证1', 'id', '402880d5421165e2014211cfb8d4000a')
        // updateJsonValue(menutree, 'text', '票据购领证11', 'id', '402880b3348289190134835484bc00e4')
        var routerTree = menuTreeToRouterTree(menutree)
        console.log('格式化之后的路由为：', routerTree)
        // document.write(JSON.stringify(routerTree))
        // 再把routerTree中的component字符串，转化为符合要求的component
        var permissionRouter = formatRouter(routerTree)
        console.log('最终格式化之后的路由为：', permissionRouter)

        addNotFound(permissionRouter)
        // 如果是服务器传递异步路由表，那么应该将格式化之后的异步路由表对象，作为参数替换asyncRouterMap
        let accessedRouters
        if (roles.includes('admin')) {
          accessedRouters = permissionRouter
          // accessedRouters = asyncRouterMap
        } else {
          accessedRouters = filterAsyncRouter(permissionRouter, roles)
          // accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        }
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
