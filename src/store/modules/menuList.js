import axios from 'axios'

const state = {
  menuList: [],
  isCollapse: false // 菜单是否收起
}

const mutations = {
  // 菜单栏
  GETMENULIST (state, data) {
    state.menuList = data
  },
  // 菜单栏展开收缩
  SHOWMENULIST (state) {
    state.isCollapse = !state.isCollapse
  }
}

const actions = {
  // 菜单栏
  getMenuList ({commit}) {
    axios.post('ibest/service/system/sysModule/userModule').then(response => {
      if (response.data && response.data.code === '00000000') {
        commit('GETMENULIST', response.data.data)
        sessionStorage.moduleId = response.data.data[0].id
      } else {
        console.log(response.data.msg)
      }
    }).catch(error => {
      console.log(error)
    })
  },
  // 菜单栏展开收缩
  showMenuList ({commit}) {
    commit('SHOWMENULIST')
  }
}

export default {
  state,
  mutations,
  actions
}
