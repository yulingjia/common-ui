<template>
  <div class="common-container">
    <div class="submit-cont">
      <div class="list-container">
        <el-row :gutter="20">
          <el-col :span="5" style="border-right:15px solid #EAEDF1;padding-right:0">
            <div class="resources-tree">
              <div class="toolbar" style="margin-bottom:0;">
                <div class="tooltitle">
                  <h3 class="mytitle"><b></b>系统模块</h3>
                </div>
              </div>
              <el-tree
                :data="menuList"
                :props="{
                  children: 'children',
                  label: 'text'
                }"
                node-key="id"
                accordion
                highlight-current
                @node-click="handleNodeClick">
              </el-tree>
            </div>
          </el-col>
          <el-col :span="19">
            <div class="resources-list">
              <!--工具栏-->
              <div class="toolbar">
                <div class="tooltitle">
                  <h3 class="mytitle"><b></b>资源管理
                    <my-refreshIcon @handleRefresh="handleRefresh" :loading="loading"></my-refreshIcon>
                  </h3>
                </div>
                <div class="toolcontent">
                  <el-form size="mini">
                    <div class="addNewBut">
                      <el-button type="primary" v-if="$hasPermission('sysResources:create')" v-show="sysResourcesAdd" @click="handleAdd" size="mini">新增</el-button>
                      <el-button type="primary" v-if="$hasPermission('sysResources:delete')" @click="handleDelete" size="mini">批量删除</el-button>
                    </div>
                  </el-form>
                </div>
              </div>
              <!-- 表格 -->
              <div class="tableBox" v-loading="loading" element-loading-text="拼命加载中...">
                <el-table ref="tableData" stripe :data="tableData"  @selection-change="handleSelectionChange" highlight-current-row height="100%">
                  <el-table-column type="selection" width="55"></el-table-column>
                  <el-table-column prop="name" label="资源名称" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="code" label="资源代码" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="remarks" label="备注" show-overflow-tooltip></el-table-column>
                  <el-table-column label="操作" width="100px" align="center">
                    <template slot-scope="scope">
                      <el-dropdown trigger="click" @command="handleCommand">
                        <el-button size="mini" type="text" class="el-dropdown-link"
                            @click="handleEdit(scope.$index, scope.row)">
                          <i class="el-icon-share"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item command="a" v-if="$hasPermission('sysResources:update')"><i class="el-icon-edit"></i><span>编辑</span>
                          </el-dropdown-item>
                          <el-dropdown-item command="b" v-if="$hasPermission('sysResources:delete')"><i class="el-icon-delete"></i><span>删除</span>
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <!-- 分页 -->
              <my-pagination
                @handleSizeChange='handleSizeChange'
                @handleCurrentChange='handleCurrentChange'
                :flag='flag'
                :page='page'
                :pageSize='pageSize'
                :totalCount='totalCount'>
              </my-pagination>
            </div>
          </el-col>
        </el-row>
      </div>

      <!--新增、编辑 窗口-->
      <div v-if="dialogEditVisible">
        <el-dialog :title="dialogFlag?'编辑':'新增'" :visible.sync="dialogEditVisible">
          <el-form class="editList" :model="formData" ref="formData" :rules="rules" :inline="true" size="small" label-width="90px">
            <table class="list-detail-con">
              <tr>
                <td colspan="2">
                  <el-form-item label="资源名称" prop="name">
                    <el-input placeholder="资源名称" v-model="formData.name" clearable></el-input>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <el-form-item label="资源代码" prop="code">
                    <el-input placeholder="资源代码" v-model="formData.code" clearable></el-input>
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
import {mapState} from 'vuex'
export default {
  data () {
    return {
      sysResourcesAdd: false,
      loading: true,
      tableData: [],
      flag: false,
      page: 1,
      pageSize: 10,
      totalCount: 0,
      resId: '',
      dialogEditVisible: false,
      dialogFlag: '',
      formData: {},
      rules: {
        name: [
          { required: true, message: '请输入资源名称', trigger: 'blur' },
          { pattern: /^[^\u0020]/, message: '不能以空格开头', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入资源代码', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z]+:[a-zA-Z]*$/,
            message: '标准格式：" sysUser:query " ',
            trigger: 'blur'
          }
        ],
        remarks: [
          { min: 0, max: 150, message: '长度在 0 到 150 个字符', trigger: 'blur' }
        ]
      },
      checkId: '',
      saveLoading: false
    }
  },
  computed: mapState({
    menuList: state => state.menuList.menuList
  }),
  methods: {
    // 列表
    placeSearch (page, pageSize, id) {
      this.loading = true
      this.$post('ibest/service/system/sysModule/moduleResources', {
        'page': page,
        'pageSize': pageSize,
        'id': id
      }).then(response => {
        if (response.data && response.data.code === '00000000') {
          this.flag = true
          this.loading = false
          this.tableData = response.data.data.rows
          this.totalCount = response.data.data.total
        } else {
          console.log(response.data.msg)
        }
      }, error => {
        console.log(error)
      })
    },
    // 刷新
    handleRefresh () {
      this.placeSearch(this.page, this.pageSize, this.resId)
    },
    handleSizeChange (val) {
      this.placeSearch(this.page, val, this.resId)
    },
    handleCurrentChange (val) {
      this.placeSearch(val, this.pageSize, this.resId)
    },
    handleNodeClick (value) {
      this.resId = value.id
      if (value.parentId) {
        this.sysResourcesAdd = true
      } else {
        this.sysResourcesAdd = false
      }
      this.placeSearch(this.page, this.pageSize, this.resId)
    },
    handleEdit (index, row) {
      if (index !== undefined && row !== undefined) {
        this.row_info = [index, row]
      }
    },
    handleCommand (command) {
      let setInfo = this.row_info
      this.formData = JSON.stringify(setInfo[1])
      this.formData = JSON.parse(this.formData)
      if (command === 'a') { // 编辑
        this.dialogFlag = true
        this.dialogEditVisible = true
      } else if (command === 'b') { // 删除
        this.$msgbox({
          title: '提示',
          message: '是否删除',
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              instance.confirmButtonText = '删除中...'
              this.$post('ibest/service/system/sysResources/delete', {
                'ids': setInfo[1].id
              }).then(response => {
                if (response.data && response.data.code === '00000000') {
                  this.placeSearch(this.page, this.pageSize, this.resId)
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
      }
    },
    // 新增
    handleAdd () {
      this.dialogEditVisible = true
      this.dialogFlag = false
      this.formData = {}
    },
    // 多选获取参数
    handleSelectionChange (val) {
      this.checkId = ''
      val.forEach(el => {
        this.checkId += el.id + ','
      })
      this.checkId = this.checkId.substring(0, this.checkId.length - 1)
    },
    // 多选 删除
    handleDelete () {
      if (!this.checkId) {
        this.$message({
          type: 'warning',
          message: '没有要删除的哦~~~'
        })
        return false
      }
      this.$msgbox({
        title: '提示',
        message: '是否批量删除',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            this.$post('ibest/service/system/sysResources/delete', {
              'ids': this.checkId
            }).then(response => {
              if (response.data && response.data.code === '00000000') {
                this.placeSearch(this.page, this.pageSize, this.resId)
                done()
                instance.confirmButtonLoading = false
              } else {
                this.$message.error(response.data.msg)
              }
            }, error => {
              console.log(error)
            })
          } else {
            done()
          }
        }
      }).then(() => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      }).catch(() => {})
    },
    handleSave (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          let url
          if (this.dialogFlag) { // 编辑
            url = 'ibest/service/system/sysResources/update'
          } else { // 新增
            url = 'ibest/service/system/sysResources/create'
          }
          this.$post(url, {
            'moduleId': this.resId,
            'id': this.formData.id,
            'name': this.formData.name,
            'code': this.formData.code,
            'remarks': this.formData.remarks
          }).then(response => {
            if (response.data && response.data.code) {
              this.saveLoading = false
              this.dialogEditVisible = false
              this.placeSearch(this.page, this.pageSize, this.resId)
              this.$message({
                message: '保存成功',
                type: 'success'
              })
            } else {
              this.saveLoading = false
              this.$message.error(response.data.msg)
            }
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
    this.resId = sessionStorage.moduleId
    this.placeSearch(this.page, this.pageSize, this.resId)
  }
}
</script>

<style lang="scss" scoped>
.list-container {
  .el-row{
    flex:1;
    display: flex;
    .el-col{
      display: flex;
      flex-direction: column;
    }
  }
  .resources-tree{
    display: flex;
    flex: 1;
    flex-direction: column;
    .el-tree{
      flex: 1;
      overflow-y: auto;
    }
  }
  .resources-list{
    display: flex;
    flex: 1;
    flex-direction: column;
    .tableBox{
      flex: 1;
    }
  }
}
</style>
