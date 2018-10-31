<template>
  <div class="submit-cont">
    <div class="list-container">
      <!--工具栏-->
      <div class="toolbar">
        <div class="tooltitle">
         <h3 class="mytitle"><b></b>消息中心</h3>
        </div>
        <div class="toolcontent">
          <div class="select-btn">
            <el-button class="active" type="text">全部类型</el-button>
            <el-button type="text">系统消息</el-button>
            <el-button type="text">公告</el-button>
          </div>
        </div>
      </div>
      <!-- 表格 -->
      <div class="tableBox" v-loading="loading" element-loading-text="拼命加载中...">
        <el-table ref="tableData" stripe :data="tableData" @selection-change="handleSelectionChange" highlight-current-row height="100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="username" label="消息标题" show-overflow-tooltip></el-table-column>
          <el-table-column prop="realname" label="接收时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="sexName" label="消息类别" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div class="table-pagination" v-if="flag">
        <template>
          <div class="block">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="page"
              :page-sizes="[10, 20, 30]"
              :page-size="pageSize"
              :total="totalCount"
              layout="total, sizes, prev, pager, next">
            </el-pagination>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: true,
      saveLoading: false,
      flag: false,
      // 列表分页数据
      tableData: [],
      page: 1,
      pageSize: 10,
      totalCount: 0,
      formData: {},
      row_info: [],
      rules: {},
      checkId: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.select-btn{
  .active{
    background: #409EFF;
    color: #fff;
    padding: 8px 10px;
    font-size: 12px;
  }
}
</style>
