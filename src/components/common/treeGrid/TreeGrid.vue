<template>
  <el-table
    :data="data"
    style="width: 100%"
    stripe
    highlight-current-row
    height="100%"
    :row-style="showTr">
    <el-table-column v-for="(column, index) in columns" :key="column.dataIndex" :label="column.text"  show-overflow-tooltip>
      <template slot-scope="scope">
        <span v-if="spaceIconShow(index)" v-for="(space, levelIndex) in scope.row._level" :key="levelIndex" class="ms-tree-space"></span>
        <el-button type="text" v-if="toggleIconShow(index,scope.row)" @click="toggle(scope.$index)" style="padding:0">
          <i v-if="!scope.row._expanded" class="el-icon-caret-right" aria-hidden="true"></i>
          <i v-if="scope.row._expanded" class="el-icon-caret-bottom" aria-hidden="true"></i>
        </el-button>
        <span v-else-if="index===0" class="ms-tree-space"></span>
        {{scope.row[column.dataIndex]}}
      </template>
    </el-table-column>
    <el-table-column label="操作" v-if="treeType === 'normal'" width="100px" align='center'>
      <template slot-scope="scope">
        <el-dropdown trigger="click" @command="handleCommand" v-if="$hasPermission(treeModule+':create')||$hasPermission(treeModule+':update')||$hasPermission(treeModule+':delete')">
          <el-button size="mini" type="text" class="el-dropdown-link"
                @click="handleOpen(scope.row)">
              <i class="el-icon-share"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="$hasPermission(treeModule+':create')" command="a"><i class="el-icon-circle-plus-outline"></i><span>新增</span>
            </el-dropdown-item>
            <el-dropdown-item v-if="$hasPermission(treeModule+':update')" command="b"><i class="el-icon-edit"></i><span>修改</span>
            </el-dropdown-item>
            <el-dropdown-item v-if="$hasPermission(treeModule+':delete')" command="c"><i class="el-icon-delete"></i><span>删除</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import Utils from './utils/index.js'
export default {
  name: 'tree-grid',
  props: {
    treeModule: {
      type: String,
      default: function () {
        return ''
      }
    },
    // 该属性是确认父组件传过来的数据是否已经是树形结构了，如果是，则不需要进行树形格式化
    treeStructure: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    // 这是相应的字段展示
    columns: {
      type: Array,
      default: function () {
        return []
      }
    },
    // 这是数据源
    dataSource: {
      type: Array,
      default: function () {
        return []
      }
    },
    // 这个作用是根据自己需求来的，比如在操作中涉及相关按钮编辑，删除等，需要向服务端发送请求，则可以把url传过来
    requestUrl: {
      type: String,
      default: function () {
        return ''
      }
    },
    // 这个是是否展示操作列
    treeType: {
      type: String,
      default: function () {
        return 'normal'
      }
    },
    // 是否默认展开所有树
    defaultExpandAll: {
      type: Boolean,
      default: function () {
        return false
      }
    }
  },
  data () {
    return {
      items: ''
    }
  },
  computed: {
    // 格式化数据源
    data: function () {
      let me = this
      if (me.treeStructure) {
        let sortNum = (a, b) => {
          return a.orderNo - b.orderNo
        }
        me.dataSource = me.dataSource.sort(sortNum)
        let data = Utils.MSDataTransfer.treeToArray(me.dataSource, null, null, me.defaultExpandAll)
        return data
      }
      return me.dataSource
    }
  },
  methods: {
    // 显示行
    showTr: function (row, index) {
      row = row.row
      let show = (row._parent ? (row._parent._expanded && row._parent._show) : true)
      row._show = show
      return show ? '' : 'display:none;'
    },
    // 展开下级
    toggle: function (trIndex) {
      let me = this
      let record = me.data[trIndex]
      record._expanded = !record._expanded
    },
    // 显示层级关系的空格和图标
    spaceIconShow (index) {
      let me = this
      if (me.treeStructure && index === 0) {
        return true
      }
      return false
    },
    // 点击展开和关闭的时候，图标的切换
    toggleIconShow (index, record) {
      let me = this
      if (me.treeStructure && index === 0 && record.children && record.children.length > 0) {
        return true
      }
      return false
    },
    handleAdd (item) {
      this.$parent.handleAdd(item)
    },
    handleEdit (item) {
      this.$parent.handleEdit(item)
    },
    handleDelete (item) {
      this.$parent.handleDelete(item)
    },
    handleOpen (item) {
      this.items = item
    },
    handleCommand (command) {
      if (command === 'a') {
        this.handleAdd(this.items)
      } else if (command === 'b') {
        this.handleEdit(this.items)
      } else if (command === 'c') {
        this.handleDelete(this.items)
      }
    }
  }
}
</script>
<style scoped>
  .ms-tree-space{position: relative;
    top: 1px;
    display: inline-block;
    font-family: 'Glyphicons Halflings';
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: 18px;
    height: 14px;}
  .ms-tree-space::before{content: ""}
  table td{
    line-height: 26px;
  }
</style>
