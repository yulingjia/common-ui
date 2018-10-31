import Cookies from 'js-cookie'

// 缓存 token
const TokenKey = 'userToken'
export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}

// 主题色 缓存
const themeColor = 'themeColor'
export function getTheme () {
  return Cookies.get(themeColor)
}

export function setTheme (val) {
  return Cookies.set(themeColor, val)
}

// 换肤加 className 函数
export function toggleClass (element, className) {
  if (!element || !className) {
    return
  }
  element.className = className
}
