import {post} from '../../utils/httpConfig'

const state = {
  permissions: []
}

const mutations = {
  // 当前用户权限
  GETPERMISSIONS (state) {
    post('ibest/service/system/sysResources/getCurrentUserResources').then(response => {
      if (response.data && response.data.code === '00000000') {
        state.permissions = response.data.data
      } else {
        console.log(response.data.msg)
      }
    }).catch(error => {
      console.log(error)
    })
  }
}

const actions = {
  getPermissions ({commit}) {
    commit('GETPERMISSIONS')
  }
}

export default {
  state,
  mutations,
  actions
}
