<template>
  <div class="common-container">
    <div class="submit-cont">
      <div class="list-container">
        <!--工具栏-->
        <div class="toolbar">
          <div class="tooltitle">
          <h3 class="mytitle"><b></b>角色管理
            <my-refreshIcon @handleRefresh="handleRefresh" :loading="loading"></my-refreshIcon>
          </h3>
          </div>
          <div class="toolcontent">
            <el-form :inline="true" :model="formInline" class="demo-form-inline" ref="formInline"
              @submit.native.prevent="onSubmit" size="mini">
              <el-form-item prop="name" v-if="$hasPermission('sysRole:query')">
                <el-input v-model="formInline.name" placeholder="请输入角色名称"></el-input>
              </el-form-item>
              <el-form-item v-if="$hasPermission('sysRole:query')">
                <el-button type="primary" @click="onSubmit" plain>查询</el-button>
                <el-button type="primary" @click="onReset" plain>重置</el-button>
              </el-form-item>
              <div class="addNewBut">
                <el-button type="primary" @click="handleAdd" v-if="$hasPermission('sysRole:create')" size="mini">新增</el-button>
                <el-button type="primary" @click="handleDelete" v-if="$hasPermission('sysRole:delete')" size="mini">批量删除</el-button>
              </div>
            </el-form>
          </div>
        </div>
        <!-- 表格 -->
        <div class="tableBox" v-loading="loading" element-loading-text="拼命加载中...">
          <el-table ref="tableData" stripe :data="tableData" @selection-change="handleSelectionChange" highlight-current-row  height="100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="角色名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="code" label="角色代码" show-overflow-tooltip></el-table-column>
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
                    <el-dropdown-item command="b" v-if="$hasPermission('sysRole:update')"><i class="el-icon-edit"></i><span>编辑</span>
                    </el-dropdown-item>
                    <el-dropdown-item command="c" v-if="$hasPermission('sysRole:accedit')"><i class="el-icon-setting"></i><span>授权</span>
                    </el-dropdown-item>
                    <el-dropdown-item command="d" v-if="$hasPermission('sysRole:delete')"><i class="el-icon-delete"></i><span>删除</span>
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
                <td colspan="2"><p>角色名称</p><span>{{ formData.name }}</span></td>
              </tr>
              <tr>
                <td colspan="2"><p>角色代码</p><span>{{ formData.code }}</span></td>
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
                  <el-form-item label="角色名称" prop="name">
                    <el-input placeholder="角色名称" v-model="formData.name" clearable></el-input>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <el-form-item label="角色代码" prop="code">
                    <el-input placeholder="角色代码" v-model="formData.code" clearable></el-input>
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

      <!--查看权限窗口-->
      <div v-if="dialogAccreditVisible">
        <el-dialog :visible.sync="dialogAccreditVisible" custom-class="dialogSee" title="当前角色可访问的资源" width='60%'>
          <!--工具栏-->
          <ul v-loading="perLoading" class="role-table col-xs-offset-2 col-md-offset-1 col-sm-offset-2">
            <li class="header_role">
              <div class="left">菜单列表</div>
              <div class="right">功能权限</div>
            </li>
            <div class="vertical-line"></div>
            <li v-for="item in dataList" :key="item.id">
              <div class="left h40" @click="fold(item)">
                <i :class="{'el-icon-caret-right':item.folded,'el-icon-caret-bottom':!item.folded}" v-cloak v-if="item.children.length>0" class="item-icon"></i>
                <!--如果没有子集-->
                <el-checkbox @change="handleOneCheckAll(item)" v-cloak v-else  v-model="item.checked"> {{item.text}}</el-checkbox>
                <span v-if="item.children.length>0" v-cloak>{{item.text}}</span>
              </div>
              <div class="right h40">
                <el-checkbox v-if="item.children.length>0" @change="checkSecondAll(item)" v-model="item.checked">模块显示</el-checkbox>
                <el-checkbox v-for="m in item.sysResourcesList" :label="m.id" :key="m.id" v-cloak @change="handleOneCheckedCitiesChange(item)" v-model="m.checked" v-else> {{m.name}}</el-checkbox>
              </div>
              <div class="line"></div>
              <ul v-show="item.children&&!item.folded">
                <li class="h40" v-for="second in item.children" :key="second.id">
                  <div class="left"  style="padding-left: 30px">
                    <el-checkbox v-model="second.checked" @change="handleCheckAllChange($event,item,second)" v-cloak>
                      {{second.text}}
                    </el-checkbox>
                  </div>
                  <div class="right">
                    <!--<el-checkbox-group v-model="second.checkedCities" @change="handleCheckedCitiesChange(item,second)">-->
                    <el-checkbox v-for="p in second.sysResourcesList" :label="p.id" :key="p.id" v-cloak v-model="p.checked" @change="handleCheckedCitiesChange(item,second)">
                      {{p.name}}
                    </el-checkbox>
                    <!--</el-checkbox-group>-->
                  </div>
                  <div class="line"></div>
                </li>
              </ul>
            </li>
          </ul>
          <div slot='footer'>
            <el-button type="primary" :loading="saveLoading" @click="handlePermision" size="mini">保存</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
export default {
  data () {
    return {
      loading: true,
      formInline: {
        realName: ''
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
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { pattern: /^[^\u0020]/, message: '不能以空格开头', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入角色代码', trigger: 'blur' },
          { pattern: /^[^\u0020]/, message: '不能以空格开头', trigger: 'blur' },
          { pattern: /^[^\u4e00-\u9fa5]{1,50}$/, message: '只能输入1到50个字母、数字、特殊字符', trigger: 'blur' }
        ],
        remarks: [
          { min: 0, max: 150, message: '长度在 0 到 150 个字符', trigger: 'blur' }
        ]
      },
      dialogAccreditVisible: false,
      dataList: [],
      row_info: [],
      perLoading: true,
      saveLoading: false
    }
  },
  methods: {
    ...mapActions(['getPermissions', 'getMenuList']),
    // 查询按钮
    onSubmit () {
      this.placeSearch(this.page, this.pageSize, this.formInline.name)
    },
    // 重置
    onReset () {
      this.formInline.name = ''
      this.placeSearch(this.page, this.pageSize, this.formInline.name)
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
            this.$post('ibest/service/system/sysRole/delete', {
              'ids': this.checkId
            }).then(response => {
              if (response.data && response.data.code === '00000000') {
                this.placeSearch(this.page, this.pageSize)
                this.$message({
                  message: '删除成功',
                  type: 'success'
                })
              } else if (response.data.code === '00000001') {
                this.$message.error(response.data.msg)
              } else {
                this.$message.error('操作异常')
              }
              done()
              instance.confirmButtonLoading = false
            }, error => {
              console.log(error)
            })
          } else {
            done()
            instance.confirmButtonLoading = false
          }
        }
      }).then(() => {}).catch(() => {})
    },
    // 列表
    placeSearch (page, pageSize, name) {
      this.loading = true
      this.$post('ibest/service/system/sysRole/query', {
        'page': page,
        'pageSize': pageSize,
        'name': name
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
      this.placeSearch(this.page, this.pageSize, this.formInline.name)
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
      if (command === 'a') {
        this.dialogVisible = true
      } else if (command === 'b') { // 编辑
        this.dialogFlag = true
        this.dialogEditVisible = true
      } else if (command === 'c') { // 授权
        this.dialogAccreditVisible = true
        this.perLoading = true
        this.dataList = []
        this.$post('ibest/service/system/sysRole/getAccreditByRoleId', {
          'roleId': setInfo[1].id
        }).then(response => {
          if (response.data && response.data.code === '00000000') {
            this.dataList = response.data.data
            this.perLoading = false
          } else {
            this.$message.error(response.data.msg)
          }
        }, error => {
          console.log(error)
        })
      } else if (command === 'd') { // 删除
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
              this.$post('ibest/service/system/sysRole/delete', {
                'ids': setInfo[1].id
              }).then(response => {
                if (response.data && response.data.code === '00000000') {
                  this.placeSearch(this.page, this.pageSize)
                  this.$message({
                    message: '删除成功',
                    type: 'success'
                  })
                } else if (response.data.code === '00000001') {
                  this.$message.error(response.data.msg)
                } else {
                  this.$message.error('操作异常')
                }
                done()
                instance.confirmButtonLoading = false
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
          let params = {}
          let paramsCode = {}
          let paramsName = {}
          if (this.dialogFlag) {
            url = 'ibest/service/system/sysRole/update' // 编辑
            params = {
              'id': this.formData.id,
              'name': this.formData.name,
              'code': this.formData.code,
              'remarks': this.formData.remarks
            }
            paramsName = {
              'id': this.formData.id,
              'name': this.formData.name
            }
            paramsCode = {
              'id': this.formData.id,
              'code': this.formData.code
            }
          } else {
            url = 'ibest/service/system/sysRole/create' // 新增
            params = {
              'name': this.formData.name,
              'code': this.formData.code,
              'remarks': this.formData.remarks
            }
            paramsName = {
              'name': this.formData.name
            }
            paramsCode = {
              'code': this.formData.code
            }
            this.formData.id = ''
          }
          this.saveLoading = true

          // 判断是否重复 角色名称
          this.$post('ibest/service/system/sysRole/validateRoleName', paramsName).then(response => {
            if (response.data && response.data.code === '00000000') {
              if (response.data.data) { // 重复
                this.$message.error('角色名称不可重复！')
                this.saveLoading = false
              } else {
                // 判断是否重复 角色代码
                this.$post('ibest/service/system/sysRole/validateRoleCode', paramsCode).then(response => {
                  if (response.data && response.data.code === '00000000') {
                    if (response.data.data) { // 重复
                      this.$message.error('角色代码不可重复！')
                      this.saveLoading = false
                    } else {
                      this.$post(url, params).then(response => {
                        if (response.data && response.data.code === '00000000') {
                          this.saveLoading = false
                          this.dialogEditVisible = false
                          this.placeSearch(this.page, this.pageSize)
                          this.$message({
                            message: '保存成功',
                            type: 'success'
                          })
                        } else {
                          this.$message.error(response.data.msg)
                          this.saveLoading = false
                        }
                      }, error => {
                        console.log(error)
                        this.saveLoading = false
                      })
                    }
                  } else {
                    this.$message.error('操作异常')
                    this.saveLoading = false
                  }
                })
              }
            } else {
              this.$message.error('操作异常')
              this.saveLoading = false
            }
          })
        } else {
          return false
        }
      })
    },
    // 授权页面 事件
    fold (item) {
      if (typeof item.folded === 'undefined') {
        this.$set(item, 'folded', true)
      } else {
        item.folded = !item.folded
      }
    },
    handleCheckAllChange (event, item, second) {
      for (let a = 0; a < second.sysResourcesList.length; a++) {
        second.sysResourcesList[a].checked = second.checked
      }
      if (second.checked) {
        item.checked = second.checked
      } else {
        for (let a = 0; a < item.children.length; a++) {
          if (item.children[a].checked) {
            item.checked = true
            break
          } else {
            item.checked = false
          }
        }
      }
    },
    handleCheckedCitiesChange (item, second) {
      for (let a = 0; a < second.sysResourcesList.length; a++) {
        if (second.sysResourcesList[a].checked) {
          second.checked = true
          break
        } else {
          second.checked = false
        }
      }
      if (second.checked) {
        item.checked = second.checked
      } else {
        for (let a = 0; a < item.children.length; a++) {
          if (item.children[a].checked) {
            item.checked = true
            break
          } else {
            item.checked = false
          }
        }
      }
    },
    checkSecondAll (item) {
      for (let a = 0; a < item.children.length; a++) {
        let second = item.children[a]
        second.checked = item.checked
        for (let b = 0; b < second.sysResourcesList.length; b++) {
          second.sysResourcesList[b].checked = item.checked
        }
      }
    },
    handleOneCheckedCitiesChange (item) {
      for (let a = 0; a < item.sysResourcesList.length; a++) {
        if (item.sysResourcesList[a].checked) {
          item.checked = true
          break
        } else {
          item.checked = false
        }
      }
    },
    handleOneCheckAll (item) {
      for (let a = 0; a < item.sysResourcesList.length; a++) {
        item.sysResourcesList[a].checked = item.checked
      }
    },
    // 授权保存
    handlePermision () {
      this.saveLoading = true
      let moduleIds = ''
      let resourcesIds = ''
      this.dataList.forEach(el => {
        if (el.checked) {
          moduleIds += el.id + ','
          if (el.children.length !== 0) {
            el.children.forEach(it => {
              if (it.checked) {
                moduleIds += it.id + ','
                // 按钮权限
                it.sysResourcesList.forEach(m => {
                  if (m.checked) {
                    resourcesIds += m.id + ','
                  }
                })
              }
            })
          } else {
            el.sysResourcesList.forEach(p => {
              if (p.checked) {
                resourcesIds += p.id + ','
              }
            })
          }
        }
      })
      moduleIds = moduleIds.substring(0, moduleIds.length - 1)
      resourcesIds = resourcesIds.substring(0, resourcesIds.length - 1)
      this.$post('ibest/service/system/sysRole/accreditForRole', {
        'roleId': this.row_info[1].id,
        'moduleIds': moduleIds,
        'resourcesIds': resourcesIds
      }).then(response => {
        if (response.data && response.data.code === '00000000') {
          this.dialogAccreditVisible = false
          this.getMenuList()
          this.getPermissions()
          this.$message({
            type: 'success',
            message: '授权成功'
          })
          this.saveLoading = false
        } else if (response.data && response.data.code === '00000001') {
          this.$message.error(response.data.msg)
          this.saveLoading = false
        } else {
          this.$message.error('操作异常')
          this.saveLoading = false
        }
      }, error => {
        console.log(error)
        this.saveLoading = false
      })
    }
  },
  created () {
    this.placeSearch(this.page, this.pageSize)
  }
}
</script>

<style lang="scss" scoped>
.role-table {
  border: 1px solid #e0e0e0;
  border-bottom: none;
  padding: 0;
  position: relative;
}

.header_role {
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #e7e7e7;
  background: #F8F8F9;
  text-align: center;
}

.vertical-line {
  width: 1px;
  height: 100%;
  background: #ddd;
  position: absolute;
  left: 30%;
  top: 0
}

.left {
  width: 30%;
  float: left;
  padding-left: 10px;
  user-select: none;
  cursor: pointer;
  box-sizing: border-box;
}

.one {
  padding-left: 20px;
}

.right {
  width: 70%;
  float: left;
  padding-left: 10px;
  box-sizing: border-box;
}

.item-icon {
  margin-left: -5px;
  padding: 5px;
}

.line {
  clear: both;
  width: 100%;
  height: 1px;
  background: #e0e0e0;
}

.h40 {
  height: 39px;
  line-height: 39px;
}

[v-cloak] {
  display: none;
}

.roleManagement {
  .dialogSee {
    .el-dialog__header {
      display: none;
    }
  }
  .el-radio__label {
    display: none;
  }
}
</style>
