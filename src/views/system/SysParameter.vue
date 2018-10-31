<template>
  <div class="common-container">
    <div class="submit-cont">
      <div class="list-container">
        <!--工具栏-->
        <div class="toolbar">
          <div class="tooltitle">
          <h3 class="mytitle"><b></b>参数管理
            <my-refreshIcon @handleRefresh="handleRefresh" :loading="loading"></my-refreshIcon>
          </h3>
          </div>
          <div class="toolcontent">
            <el-form :inline="true" :model="formInline" class="demo-form-inline" ref="formInline"
              @submit.native.prevent="onSubmit" size="mini">
              <el-form-item prop="name" v-if="$hasPermission('sysParameter:query')">
                <el-input v-model="formInline.paramName" placeholder="请输入参数名称"></el-input>
              </el-form-item>
              <el-form-item v-if="$hasPermission('sysParameter:query')">
                <el-button type="primary" @click="onSubmit" plain>查询</el-button>
                <el-button type="primary" @click="onReset" plain>重置</el-button>
              </el-form-item>
              <div class="addNewBut">
                <el-button type="primary" v-if="$hasPermission('sysParameter:create')" @click="handleAdd" size="mini">新增</el-button>
                <el-button type="primary" v-if="$hasPermission('sysParameter:delete')" @click="handleDelete" size="mini">批量删除</el-button>
              </div>
            </el-form>
          </div>
        </div>
        <!-- 表格 -->
        <div class="tableBox" v-loading="loading" element-loading-text="拼命加载中...">
          <el-table ref="tableData" stripe :data="tableData" @selection-change="handleSelectionChange" highlight-current-row  height="100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="paramName" label="参数名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="paramCode" label="参数代码" show-overflow-tooltip></el-table-column>
            <el-table-column prop="paramValue" label="参数值" show-overflow-tooltip></el-table-column>
            <el-table-column prop="isOpen" label="状态" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tag size="mini" v-if="scope.row.isOpen === 0" type="info" disable-transitions>关闭</el-tag>
                <el-tag size="mini" v-else disable-transitions>开启</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="remarks" label="备注" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="100px" align="center">
              <template slot-scope="scope">
                <el-dropdown trigger="click" @command="handleCommand">
                  <el-button size="mini" type="text" class="el-dropdown-link"
                      @click="handleEdit(scope.$index, scope.row)">
                    <i class="el-icon-share"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="a"><i class="el-icon-view"></i><span>详情</span>
                    </el-dropdown-item>
                    <el-dropdown-item command="b" v-if="$hasPermission('sysParameter:update')"><i class="el-icon-edit"></i><span>编辑</span>
                    </el-dropdown-item>
                    <el-dropdown-item command="c" v-if="$hasPermission('sysParameter:delete')"><i class="el-icon-delete"></i><span>删除</span>
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
      <!--查看详情窗口-->
      <div v-if="dialogVisible">
        <el-dialog title="详情" :visible.sync="dialogVisible">
          <el-form label-position="left" inline class="demo-table-expand">
            <table class="list-detail-con">
              <tr>
                <td colspan="2"><p>参数名称</p><span>{{ formData.paramName }}</span></td>
              </tr>
              <tr>
                <td colspan="2"><p>参数代码</p><span>{{ formData.paramCode }}</span></td>
              </tr>
              <tr>
                <td colspan="2"><p>参数值</p><span>{{ formData.paramValue }}</span></td>
              </tr>
              <tr>
                <td colspan="2">
                  <p>状态</p>
                  <span>
                    <el-tag size="mini" v-if="formData.isOpen === 0" type="info" disable-transitions>关闭</el-tag>
                    <el-tag size="mini" v-else disable-transitions>开启</el-tag>
                  </span>
                </td>
              </tr>
              <tr>
                <td colspan="2"><div class="flex-layout"><p>备注</p><span>{{ formData.remarks }}</span></div></td>
              </tr>
            </table>
          </el-form>
        </el-dialog>
      </div>
      <!--新增、编辑 窗口-->
      <div v-if="dialogEditVisible">
        <el-dialog :title="dialogFlag?'编辑':'新增'" :visible.sync="dialogEditVisible">
          <el-form class="editList" :model="formData" ref="formData" :rules="rules" :inline="true" size="small" label-width="90px">
            <table class="list-detail-con">
              <tr>
                <td colspan="2">
                  <el-form-item label="参数名称" prop="paramName">
                    <el-input placeholder="参数名称" v-model="formData.paramName" clearable></el-input>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <el-form-item label="参数代码" prop="paramCode">
                    <el-input placeholder="参数代码" v-model="formData.paramCode" clearable></el-input>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <el-form-item label="参数值" prop="paramValue">
                    <el-input placeholder="参数值" v-model="formData.paramValue" clearable></el-input>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <el-form-item label="状态" prop="isOpen">
                    <el-switch
                      v-model="switchValue"
                      active-text="开启"
                      inactive-text="关闭">
                    </el-switch>
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
export default {
  data () {
    return {
      loading: true,
      formInline: {
        paramName: ''
      },
      flag: false,
      // 列表分页数据
      tableData: [],
      page: 1,
      pageSize: 10,
      totalCount: 0,
      dialogTitle: '',
      dialogVisible: false,
      dialogEditVisible: false,
      dialogFlag: '',
      formData: {},
      rules: {
        paramName: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          { pattern: /^[^\u0020]/, message: '不能以空格开头', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        paramCode: [
          { required: true, message: '请输入参数代码', trigger: 'blur' },
          { pattern: /^[^\u0020]/, message: '不能以空格开头', trigger: 'blur' },
          { pattern: /^[^\u4e00-\u9fa5]{1,50}$/, message: '只能输入1到50个字母、数字、特殊字符', trigger: 'blur' }
        ],
        paramValue: [
          { required: true, message: '请输入参数值', trigger: 'blur' },
          { pattern: /^[^\u0020]/, message: '不能以空格开头', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
        ],
        remarks: [
          { min: 0, max: 150, message: '长度在 0 到 150 个字符', trigger: 'blur' }
        ]
      },
      row_info: [],
      saveLoading: false,
      switchValue: false // 默认状态关闭
    }
  },
  methods: {
    // 查询按钮
    onSubmit () {
      this.placeSearch(this.page, this.pageSize, this.formInline.paramName)
    },
    // 重置
    onReset () {
      this.formInline.paramName = ''
      this.placeSearch(this.page, this.pageSize, this.formInline.paramName)
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
            this.$post('ibest/service/system/sysParameter/delete', {
              'ids': this.checkId
            }).then(response => {
              if (response.data && response.data.code === '00000000') {
                this.placeSearch(this.page, this.pageSize)
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
    // 列表
    placeSearch (page, pageSize, paramName) {
      this.loading = true
      this.$post('ibest/service/system/sysParameter/query', {
        'page': page,
        'pageSize': pageSize,
        'paramName': this.formInline.paramName
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
      this.placeSearch(this.page, this.pageSize, this.formInline.paramName)
    },
    handleSizeChange (val) {
      this.placeSearch(this.page, val)
    },
    handleCurrentChange (val) {
      this.placeSearch(val, this.pageSize)
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
      this.formData.isOpen === 1 ? this.switchValue = true : this.switchValue = false
      if (command === 'a') {
        this.dialogVisible = true
      } else if (command === 'b') { // 编辑
        this.dialogFlag = true
        this.dialogEditVisible = true
      } else if (command === 'c') { // 删除
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
              this.$post('ibest/service/system/sysParameter/delete', {
                'ids': setInfo[1].id
              }).then(response => {
                if (response.data && response.data.code === '00000000') {
                  this.placeSearch(this.page, this.pageSize)
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
              instance.confirmButtonLoading = false
            }
          }
        }).then(() => {}).catch(() => {})
      }
    },
    // 新增编辑 保存
    handleSave (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = ''
          if (this.dialogFlag) {
            url = 'ibest/service/system/sysParameter/update' // 编辑
          } else {
            url = 'ibest/service/system/sysParameter/create' // 新增
            this.formData.id = ''
          }
          this.switchValue ? this.formData.isOpen = 1 : this.formData.isOpen = 0
          this.saveLoading = true
          this.$post(url, {
            'id': this.formData.id,
            'paramName': this.formData.paramName,
            'paramValue': this.formData.paramValue,
            'paramCode': this.formData.paramCode,
            'isOpen': this.formData.isOpen,
            'remarks': this.formData.remarks
          }).then(response => {
            if (response.data && response.data.code === '00000000') {
              this.saveLoading = false
              this.dialogEditVisible = false
              this.placeSearch(this.page, this.pageSize)
              this.$message({
                message: '保存成功',
                type: 'success'
              })
            } else {
              console.log(response.data.msg)
            }
          }, error => {
            console.log(error)
            this.saveLoading = false
          })
        } else {
          return false
        }
      })
    }
  },
  created () {
    this.placeSearch(this.page, this.pageSize)
  }
}
</script>
