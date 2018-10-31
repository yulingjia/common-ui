import { post } from '../../utils/httpConfig'
import { setToken, removeToken } from '../../utils/auth'

const state = {
  loginInfo: {},
  userInfo: {}
}

const mutations = {
  // 登录
  LOGIN (state, data) {
    state.loginInfo = data
    if (data.userToken) {
      setToken(data.userToken)
    }
  },
  // 获取用户信息
  GETUSERINFO (state, data) {
    state.userInfo = data
  },
  // 注销
  CANCLEUSERINFO (state) {
    state.loginInfo = {}
    state.userInfo = {}
    removeToken()
  }
}

const actions = {
  // 登录
  login ({commit}, data) {
    return new Promise((resolve, reject) => {
      post('ibest/auth/login', data).then(response => {
        commit('LOGIN', response.data.data)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取用户信息
  getUserInfo ({commit}) {
    return new Promise((resolve, reject) => {
      post('ibest/service/system/sysUser/getPersonalInformation').then(response => {
        commit('GETUSERINFO', response.data.data)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 注销
  cancleUserInfo ({commit}) {
    removeToken()
    commit('CANCLEUSERINFO')
  }
}

export default {
  state,
  mutations,
  actions
}
