<template>
  <div class="common-container">
    <div class="submit-cont">
      <div class="list-container">
        <!--工具栏-->
        <div class="toolbar">
          <div class="tooltitle">
          <h3 class="mytitle"><b></b>字典管理
            <my-refreshIcon @handleRefresh="handleRefresh" :loading="loading"></my-refreshIcon>
          </h3>
          </div>
          <div class="toolcontent">
            <el-form size="mini">
              <div class="addNewBut">
                <el-button type="primary" v-if="$hasPermission('sysDictionary:create')" @click="handleAdd" size="mini">新增一级字典</el-button>
              </div>
            </el-form>
          </div>
        </div>
        <!-- 表格 -->
        <div class="tableBox" v-loading="loading" element-loading-text="拼命加载中...">
          <tree-grid :columns="columns" :tree-structure="true" :data-source="dictionaryTree" tree-module="sysDictionary"></tree-grid>
        </div>
      </div>
      <!-- 编辑  -->
      <div v-if="dialogEditVisible">
        <el-dialog :title="dialogFlag?'编辑':'新增'" :visible.sync="dialogEditVisible">
          <el-form class="editList" :model="formData" ref="formData" :rules="rules" :inline="true" size="small" label-width="110px">
            <table class="list-detail-con">
              <tr v-if="!dialogFlag && activeItem">
                <td colspan="2">
                  <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item>{{activeItem}}</el-breadcrumb-item>
                    <el-breadcrumb-item>{{formData.text}}</el-breadcrumb-item>
                  </el-breadcrumb>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <el-form-item label="字典名称" prop="text">
                    <el-input placeholder="字典名称" v-model="formData.text" clearable></el-input>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <el-form-item label="字典代码" prop="code">
                    <el-input placeholder="字典代码" v-model="formData.code" clearable></el-input>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <el-form-item label="字典分类" prop="type">
                    <el-input placeholder="字典分类" v-model="formData.type" clearable :disabled="activeType"></el-input>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <el-form-item label="排序号" prop="orderNo">
                    <el-input-number v-model="formData.orderNo" :min="1" :max="50" label="排序号"></el-input-number>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <el-form-item label="备注" prop="remarks">
                    <el-input type="textarea" placeholder="备注" v-model="formData.remarks" clearable></el-input>
                  </el-form-item>
                </td>
              </tr>
            </table>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button :loading="saveLoading" type="primary" @click="handleSave('formData')" size="small">保存</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import TreeGrid from '../../components/common/treeGrid/TreeGrid'
export default {
  data () {
    return {
      loading: false,
      columns: [
        {
          text: '字典名称',
          dataIndex: 'text'
        },
        {
          text: '字典代码',
          dataIndex: 'code'
        },
        {
          text: '字典分类',
          dataIndex: 'type'
        },
        {
          text: '排序号',
          dataIndex: 'orderNo'
        },
        {
          text: '备注',
          dataIndex: 'remarks'
        }
      ],
      dictionaryTree: [],
      dialogVisible: false,
      dialogEditVisible: false,
      dialogFlag: '',
      formData: {},
      formData2: {}, // 新增下一级时保存上一级数据
      rules: {
        text: [
          { required: true, message: '请输入字典名称', trigger: 'blur' },
          { pattern: /^[^\u0020]/, message: '不能以空格开头', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入字典代码', trigger: 'blur' },
          { pattern: /^[^\u0020]/, message: '不能以空格开头', trigger: 'blur' },
          { pattern: /^[^\u4e00-\u9fa5]{1,50}$/, message: '只能输入1到50个字母、数字、特殊字符', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请输入字典分类', trigger: 'blur' },
          { pattern: /^[^\u0020]/, message: '不能以空格开头', trigger: 'blur' },
          { pattern: /^[^\u4e00-\u9fa5]{1,50}$/, message: '只能输入1到50个字母、数字、特殊字符', trigger: 'blur' }
        ],
        orderNo: [{ required: true, message: '请输入排序号', trigger: 'blur' }],
        remarks: [
          { min: 0, max: 150, message: '长度在 0 到 150 个字符', trigger: 'blur' }
        ]
      },
      saveLoading: false,
      activeItem: '',
      activeType: false
    }
  },
  components: {
    TreeGrid
  },
  methods: {
    // Tree
    placeSearch () {
      this.loading = true
      this.$post('ibest/service/system/sysDictionary/dictionaryTree').then(response => {
        if (response.data && response.data.code === '00000000') {
          this.dictionaryTree = response.data.data
          this.loading = false
        } else {
          console.log(response.data.msg)
          this.loading = false
        }
      }, error => {
        console.log(error)
        this.loading = false
      })
    },
    // 刷新
    handleRefresh () {
      this.placeSearch()
    },
    dropMenu (item) {
      if (typeof item.folded === 'undefined') {
        this.$set(item, 'folded', true)
      } else {
        item.folded = !item.folded
      }
    },
    handleAdd (item) {
      this.dialogFlag = false
      this.formData = {}
      this.formData.orderNo = 1
      if (item.id) { // 新增
        this.formData.type = item.type
        this.formData2 = item
        this.activeType = true
      } else { // 新增一级
        this.formData2 = null
        this.activeType = false
      }
      this.dialogEditVisible = true
      this.activeItem = item.text
    },
    handleEdit (item) {
      this.activeType = true
      this.dialogFlag = true
      let CircularJSON = require('circular-json')
      this.formData = CircularJSON.stringify(item)
      this.formData = CircularJSON.parse(this.formData)
      this.dialogEditVisible = true
      this.activeItem = item.text
    },
    handleDelete (item) {
      this.$msgbox({
        title: '提示',
        message: '此操作将删除此级及下级内容, 是否继续?',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            this.$post('ibest/service/system/sysDictionary/delete', {
              'id': item.id
            }).then(response => {
              if (response.data && response.data.code === '00000000') {
                this.placeSearch()
                this.$message({
                  message: '删除成功',
                  type: 'success'
                })
                done()
                instance.confirmButtonLoading = false
              } else {
                done()
                instance.confirmButtonLoading = false
                this.$message.error('操作异常')
              }
            }, error => {
              console.log(error)
            })
          } else {
            done()
          }
        }
      }).then(() => {}).catch(() => {})
    },
    handleSave (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          let url, params
          if (this.dialogFlag) { // 编辑
            url = 'ibest/service/system/sysDictionary/update'
            params = {
              'id': this.formData.id,
              'name': this.formData.text,
              'code': this.formData.code,
              'type': this.formData.type,
              'orderNo': this.formData.orderNo,
              'remarks': this.formData.remarks
            }
          } else { // 新增
            let parentKey = ''
            if (this.formData2 === null) {
              this.formData2 = {}
              this.formData2.id = null
              parentKey = null
            } else if (this.formData2.parentKey === '') {
              parentKey = ',' + this.formData2.id + ','
            } else if (this.formData2.id && this.formData2.parentKey) {
              parentKey = this.formData2.parentKey + this.formData2.id + ','
            }
            url = 'ibest/service/system/sysDictionary/create'
            params = {
              'parent': this.formData2.id,
              'parentKey': parentKey,
              'name': this.formData.text,
              'code': this.formData.code,
              'type': this.formData.type,
              'orderNo': this.formData.orderNo,
              'remarks': this.formData.remarks
            }
          }
          this.$post(url, params).then(response => {
            if (response.data && response.data.code === '00000000') {
              this.dialogEditVisible = false
              this.placeSearch()
              this.$message({
                message: '保存成功',
                type: 'success'
              })
            } else {
              this.$message.error('操作异常')
            }
            this.saveLoading = false
          }, error => {
            console.log(error)
          })
        } else {
          return false
        }
      })
    }
  },
  created () {
    this.placeSearch()
  }
}
</script>
