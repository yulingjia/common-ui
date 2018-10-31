<template>
  <div class="tabs-container">
    <el-tabs v-model="activeTabs" type="card" closable @tab-click="tabsClick" @tab-remove="tabsRemove" >
      <el-tab-pane v-for="item in tabs" :key="item.id" :label="item.name" :name="item.route">
        <span slot="label"><i v-if="item.name === '首页'" class="iconfont icon-home"></i> {{item.name}}</span>
      </el-tab-pane>
    </el-tabs>
    <div class="tabs-else">
      <el-dropdown @command="handleCommand">
        <el-button type="text" size="mini">
          <i class="el-icon-setting"></i><i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="a">关闭其他</el-dropdown-item>
          <el-dropdown-item command="b">关闭所有</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      tabs: state => state.tabs.tabs
    }),
    activeTabs: {
      get: function () {
        return this.$store.state.tabs.activeTabs
      },
      set: function (val) {
        this.$store.state.tabs.activeTabs = val
      }
    }
  },
  methods: {
    tabsClick (tab, event) {
      this.$router.push({path: tab.name})
    },
    tabsRemove (targetName) {
      this.$store.dispatch('deleteTabs', targetName)
      this.$router.push({path: this.activeTabs})
    },
    handleCommand (command) {
      if (command === 'a') {
        this.$store.dispatch('closeOther')
      } else if (command === 'b') {
        this.$store.dispatch('closeAll')
        this.$router.push('/main')
      }
    }
  },
  created () {
    this.$store.state.tabs.tabs = []
    this.$store.dispatch('setActiveTabs', '/main')
    this.$store.dispatch('addTabs', {route: '/main', name: '首页'})
    if (this.$route.path !== '/main') {
      this.$store.dispatch('addTabs', {route: this.$route.path, name: this.$route.name})
    }
  },
  watch: {
    '$route' (to) {
      let flag = true // 没有重复的标签
      for (let tab of this.tabs) {
        if (tab.name === to.name) {
          flag = false
          break
        }
      }
      if (flag) {
        this.$store.dispatch('addTabs', {route: to.path, name: to.name})
      } else {
        this.$store.dispatch('setActiveTabs', to.path)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tabs-container{
  display: flex;
  flex-direction: row;
  height: 39px;
  .el-tabs{
    flex: 1;
  }
  .tabs-else{
    width: 60px;
    height: 36px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .el-icon-arrow-down{
      display: none;
    }
  }
}
</style>
