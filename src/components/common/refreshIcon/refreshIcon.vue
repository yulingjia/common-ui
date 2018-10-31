<template>
  <el-button @click="handleRefresh" :icon="loading?'el-icon-loading':'el-icon-refresh'" class="common-refresh" type="text"></el-button>
</template>

<script>
export default {
  name: 'my-refreshIcon',
  props: {
    loading: {
      type: Boolean
    }
  },
  methods: {
    handleRefresh () {
      this.$emit('handleRefresh')
    }
  }
}
</script>
