import serverOption from './serverOption.vue'

const globalVue = {
  install: function(Vue) {
    Vue.component('serverOption', serverOption)
  }
}

export default globalVue
