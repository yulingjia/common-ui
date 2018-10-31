<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getTheme, toggleClass } from './utils/auth.js'
import './assets/styles/theme/409eff/style.scss'
import './assets/styles/theme/fc7167/style.scss'
export default {
  name: 'App',
  computed: mapState({
    themeColor: state => state.theme.themeColor
  }),
  mounted () {
    if (getTheme()) {
      toggleClass(document.body, 'custom-' + getTheme())
    } else {
      toggleClass(document.body, 'custom-' + this.themeColor)
    }
  },
  watch: {
    themeColor: {
      handler () {
        toggleClass(document.body, 'custom-' + this.themeColor)
      }
    }
  }
}
</script>

<style>
#app {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  position: absolute;
}
</style>
