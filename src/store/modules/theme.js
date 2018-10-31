import {setTheme, getTheme} from '../../utils/auth'
const state = {
  themeColor: '409eff',
  themeData: [{
    id: 0,
    value: '409eff',
    text: '默认'
  }, {
    id: 1,
    value: 'fc7167',
    text: '珊瑚红'
  }]
}

const getters = {
  themeColor (state) {
    if (getTheme()) {
      state.themeColor = getTheme()
    }
    return state.themeColor
  }
}

const mutations = {
  EDIT_THEME_COLOR (state, data) {
    state.themeColor = data
  }
}

const actions = {
  edit_theme_color ({commit}, data) {
    setTheme(data)
    commit('EDIT_THEME_COLOR', data)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
