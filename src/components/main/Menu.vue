<template>
  <el-aside :class="!isCollapse?'open_menu':'close_menu'">
    <div class="mymenu">
      <div class="myLogo">
        <img v-if="isCollapse" src="../../assets/images/logo01.png" alt="" srcset="">
        <img v-else src="../../assets/images/logo02.png" alt="" srcset="">
      </div>
      <el-col :span="24" style="padding-top:55px;">
        <el-menu class="el-menu-vertical-demo" :collapse="isCollapse" :collapse-transition=false :default-active="this.$route.path" router background-color="#252a2f" text-color="#fff" :active-text-color="'#'+themeColor">
          <template v-for="(el,index) in menuList">
            <el-submenu :index="'/' + el.path" :key="index" v-if='el.children && el.children.length>0'>
              <template slot="title">
                <i class="iconfont" :class="el.iconCls"></i>
                <span slot="title">{{el.text}}</span>
              </template>
              <el-menu-item v-for="it in el.children" :index="'/' + it.path" :key="it.id">{{it.text}}</el-menu-item>
            </el-submenu>
            <el-menu-item :index="'/' + el.path" :key="el.id" v-else>
              <i class="iconfont" :class="el.iconCls"></i>
              <span slot="title">{{el.text}}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </el-col>
    </div>
  </el-aside>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState({
      isCollapse: state => state.menuList.isCollapse,
      menuList: state => state.menuList.menuList,
      permissions: state => state.permissions.permissions
    }),
    ...mapGetters(['themeColor'])
  },
  methods: {
    ...mapActions(['getMenuList', 'getPermissions'])
  },
  created () {
    this.getMenuList()
    this.getPermissions()
  }
}
</script>

<style lang="scss" scoped>
.mymenu {
  overflow-y: auto;
  height: 100%;
  .myLogo {
    height: 50px;
    background-color: #252a2f;
  }
}

.open_menu {
  transition: all 0.6s;
  width: 190px !important;
  .mymenu {
    transition: all 0.03s;
    width: 210px;
  }
  .myLogo {
    transition: all 0.6s;
    width: 190px;
  }
  .el-submenu {
    transition: all 0.6s;
    width: 190px;
  }
}

.close_menu {
  transition: all 0.3s;
  width: 64px !important;
  .mymenu {
    transition: all 0.3s;
    width: 64px;
  }
  .myLogo {
    transition: all 0.3s;
    width: 64px;
  }
  .el-submenu {
    transition: all 0.3s;
    width: 64px;
  }
}

.el-menu {
  border: none;
  text-align: left;
  .el-submenu {
    .el-submenu__title {
      i {
        color: #d4d4d4;
        margin-right: 5px;
        font-size: 14px;
      }
    }
    .el-menu {
      .el-menu-item {
        height: 40px !important;
        line-height: 40px !important;
        padding-left: 45px !important;
        color: #fff;
        font-size: 13px;
      }
    }
  }
  .el-menu-item {
    i {
      color: #d4d4d4;
      margin-right: 5px;
    }
    &.is-active {
      background-color: #1e2226 !important;
      i {
        color: #6cc1f6;
      }
    }
  }
}

.myLogo {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 6;
}

.el-menu--vertical {
  .el-menu-item {
    height: 40px !important;
    line-height: 40px !important;
    color: #fff;
    font-size: 13px;
  }
}
</style>
