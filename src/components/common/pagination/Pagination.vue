<template>
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
</template>

<script>
export default {
  name: 'my-pagination',
  props: {
    flag: Boolean,
    page: Number,
    pageSize: Number,
    totalCount: Number
  },
  methods: {
    handleSizeChange (val) {
      this.$emit('handleSizeChange', val)
    },
    handleCurrentChange (val) {
      this.$emit('handleCurrentChange', val)
    }
  }
}
</script>
