import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import '@/utils/directive' // global directive

import VueDND from 'awe-dnd'

import globalVue from '@/components/globalVue'

Vue.use(globalVue)

Vue.use(VueDND)

Vue.use(ElementUI, {
  locale
})

Vue.config.productionTip = false

Vue.prototype.$getCodeLabel = function(codeValue) {
  var dictionaryObject = store.state.app.allCodeLabelDictionary
  if (dictionaryObject[codeValue]) {
    return dictionaryObject[codeValue]
  } else {
    return codeValue
  }
}

Vue.prototype.$tableCodeToLabel = function(row, col) {
  return Vue.prototype.$getCodeLabel(row[col.property])
  // var dictionaryObject = store.state.app.allCodeLabelDictionary
  // if (dictionaryObject[row[col.property]]) {
  //   return dictionaryObject[row[col.property]]
  // } else {
  //   return row[col.property]
  // }
}

router.beforeEach((to, from, next) => {
  if (to.fullPath.includes('jczl')) {
    store.dispatch('SetListInfo', [])
    store.dispatch('SetSubMenuGuid', '')
    store.dispatch('InitDetailInfo')
  }
  store.dispatch('SetSelectedTabsId', 0)
  next()
})

Vue.filter('markFilter', (val) => {
  if (val === '0') {
    return '×'
  } else if (val === '1') {
    return '√'
  } else { // 新加的。
    return val
  }
})
Vue.filter('equiredFilter', (val) => {
  if (val === 'false') {
    return '×'
  } else if (val === 'true') {
    return '√'
  }
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
