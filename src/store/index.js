import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import pjyw from './modules/pjyw'
import sjqx from './modules/sjqx'
import user from './modules/user'
import permission from './modules/permission'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    permission,
    pjyw,
    sjqx
  },
  getters
})

export default store
