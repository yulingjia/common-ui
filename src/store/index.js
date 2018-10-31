import Vue from 'vue'
import Vuex from 'vuex'

import tabs from './modules/tabs'
import menuList from './modules/menuList'
import permissions from './modules/permissions'
import userInfo from './modules/userInfo'
import theme from './modules/theme'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    tabs,
    menuList,
    permissions,
    userInfo,
    theme
  }
})
