<template>
  <div class="page-container">
    <el-container>
      <v-menu></v-menu>
      <el-container>
        <el-header style="height: 50px;">
          <v-header></v-header>
        </el-header>
        <el-main>
          <div class="main-tabs">
            <v-tabs></v-tabs>
          </div>
          <div class="main-container">
            <transition name="slide-fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Header from '../components/main/Header'
import Menu from '../components/main/Menu'
import Tabs from '../components/main/Tabs'
export default {
  name: 'Main',
  components: {
    'v-header': Header,
    'v-menu': Menu,
    'v-tabs': Tabs
  }
}
</script>

<style lang="scss" scoped>
.page-container{
  width: 100%;
  height: 100%;
  display: flex;
  min-width: 1200px;
}

.el-header {
  background-color: #fff;
  color: #333;
  padding: 0;
  color: #fff;
}
.el-aside {
  background:#252a2f;
  color: #333;
  text-align: center;
  overflow: hidden;
}
.el-main {
  flex: 1;
  padding:0;
  overflow: hidden;
  background: #EAEDF1;
  position: relative;
  .main-tabs{
    height: 39px;
    background-color: #fff;
    .el-tabs__content{
      display: none;
    }
  }
  .main-container{
    display: flex;
    background: #EAEDF1;
    position: absolute;
    top: 41px;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    overflow: hidden
  }
}

/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .5s cubic-bezier(0.5, 0.3, 0.6, 0.5);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(100px);
  opacity: 0;
}
</style>
