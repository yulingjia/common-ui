/*
** 公共组件
*/

import Pagination from '../components/common/pagination/Pagination.vue'
import RefreshIcon from '../components/common/refreshIcon/RefreshIcon.vue'

const global = (Vue) => {
  if (global.installed) return
  Vue.component('my-pagination', Pagination) // 注册全局分页组件
  Vue.component('my-refreshIcon', RefreshIcon) // 注册全局列表刷新组件
}

export default global
