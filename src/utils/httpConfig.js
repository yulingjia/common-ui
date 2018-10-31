// import { Message } from 'element-ui'
import axios from 'axios'
import qs from 'qs'
import router from '../router'
import store from '../store/index'
import { getToken, removeToken } from '../utils/auth'
import { Message } from 'element-ui'

axios.defaults.timeout = 20000 // 10s
axios.defaults.withCredentials = true

const CancelToken = axios.CancelToken
let [cancel, promiseArr] = [null, {}]

// 添加请求拦截器
axios.interceptors.request.use(config => {
  // 发送请求前
  // 发起请求时，取消掉当前正在进行的相同请求
  if (promiseArr[config.url]) {
    promiseArr[config.url]('操作取消')
    promiseArr[config.url] = cancel
  } else {
    promiseArr[config.url] = cancel
  }

  // 接口携带 userToken
  let userToken = getToken()
  if (userToken) {
    config.headers.userToken = userToken
  }
  return config
}, error => {
  // 请求错误
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(response => {
  // 响应数据
  if (response.data.code === '99999999') { // token 无效
    removeToken()
    router.push({name: '登录', params: {noToken: true}})
  }
  return response
}, error => {
  // 响应错误
  return Promise.reject(error)
})

export function post (url, params) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: url,
      data: qs.stringify(params),
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      cancelToken: new CancelToken(c => {
        cancel = c
      }),
      validateStatus: status => {
        if (status >= 500) {
          store.dispatch('cancleUserInfo')
          router.push('/login')
          Message.error('服务器' + status + '错误，请联系管理员')
        }
        return status < 500
      }
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

export function get (url, params) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: url,
      data: params
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}
