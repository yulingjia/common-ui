// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import './assets/styles/element-variables.scss'
import Vuex from 'vuex'
import store from './store/index'
// import './utils/errorLog'
import VueQuillEditor from 'vue-quill-editor'
import 'babel-polyfill' // ES6

import {post, get} from './utils/httpConfig'
import Permission from './utils/permission'
import Global from './utils/global'

import '../static/iconfont/iconfont.css' // 小图标
import './assets/styles/reset.css' // 初始化样式
import './assets/styles/common.scss'

Vue.prototype.$post = post // 定义全局post方法
Vue.prototype.$get = get // 定义全局get方法
Vue.use(Permission) // 权限
Vue.use(Global) // 注册全局组件

Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(ElementUI)
Vue.use(VueQuillEditor) // 富文本编辑器

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
