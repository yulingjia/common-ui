<template>
  <div class="common-container">
    <div class="submit-cont">
      <div class="list-container">
        <!--工具栏-->
        <div class="toolbar">
          <div class="tooltitle">
          <h3 class="mytitle"><b></b>用户管理
            <my-refreshIcon @handleRefresh="handleRefresh" :loading="loading"></my-refreshIcon>
          </h3>
          </div>
          <div class="toolcontent">
            <el-form :inline="true" :model="formInline" class="demo-form-inline" ref="formInline"
              @submit.native.prevent="onSubmit" size="mini">
              <el-form-item prop="realname" v-if="$hasPermission('sysUser:query')">
                <el-input v-model="formInline.realname" placeholder="请输入用户名"></el-input>
              </el-form-item>
              <el-form-item>
                <my-provinces></my-provinces>
              </el-form-item>
              <el-form-item v-if="$hasPermission('sysUser:query')">
                <el-button type="primary" @click="onSubmit" plain>查询</el-button>
                <el-button type="primary" @click="onReset" plain>重置</el-button>
              </el-form-item>
              <div class="addNewBut">
                <el-button type="primary" @click="handleAdd" v-if="$hasPermission('sysUser:create')" size="mini">新增</el-button>
                <el-button type="primary" @click="handleDelete" v-if="$hasPermission('sysUser:delete')" size="mini">批量删除</el-button>
                <el-dropdown @command="handleExport" v-if="$hasPermission('sysUser:exportExcel')" style="margin-left:10px;">
                  <el-button type="primary" size="mini">
                    导出<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item onclick="window.open('ibest/service/system/sysUser/exportExcel','_self')">全部导出</el-dropdown-item>
                    <el-dropdown-item command="a">自定义导出</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </el-form>
          </div>
        </div>
        <!-- 表格 -->
        <div class="tableBox" v-loading="loading" element-loading-text="拼命加载中...">
          <el-table ref="tableData" stripe :data="tableData" @selection-change="handleSelectionChange" highlight-current-row height="100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="username" label="登录帐号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="realname" label="用户名" show-overflow-tooltip></el-table-column>
            <el-table-column prop="sexName" label="性别" show-overflow-tooltip></el-table-column>
            <el-table-column prop="mobile" label="电话" show-overflow-tooltip></el-table-column>
            <el-table-column prop="cardNo" label="身份证" show-overflow-tooltip></el-table-column>
            <el-table-column prop="createDate" label="创建时间" show-overflow-tooltip></el-table-column>
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
                    <el-dropdown-item command="b" v-if="$hasPermission('sysUser:update')"><i class="el-icon-edit"></i><span>编辑</span>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="$hasPermission('sysUser:accredit')" command="c"><i class="el-icon-setting"></i><span>授权</span>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="$hasPermission('sysUser:delete')" command="d"><i class="el-icon-delete"></i><span>删除</span>
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
      <!--查看详情 窗口-->
      <div v-if="dialogVisible">
        <el-dialog title="详情" :visible.sync="dialogVisible">
          <el-form label-position="left" inline class="demo-table-expand">
            <table class="list-detail-con">
              <tr>
                <td><p>登录账号</p><span>{{ formData.username }}</span></td>
                <td rowspan="4" align="center">
                  <el-form-item prop="photo">
                    <img v-if="formData.photo!=null" :src="formData.photo" alt="" srcset="">
                    <img v-else src="../../assets/images/imgFile_default2.png" alt="" srcset="">
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td><p>用户名称</p><span>{{ formData.realname }}</span></td>
              </tr>
              <tr>
                <td><p>性别</p><span>{{ formData.sexName }}</span></td>
              </tr>
              <tr>
                <td><p>生日</p><span>{{ formData.birthday }}</span></td>
              </tr>
              <tr>
                <td><p>身份证</p><span>{{ formData.cardNo }}</span></td>
                <td><p>部门名称</p><span>{{ formData.departmentName }}</span></td>
              </tr>
              <tr>
                <td><p>手机</p><span>{{ formData.mobile }}</span></td>
                <td><p>电话</p><span>{{ formData.phone }}</span></td>
              </tr>
              <tr>
                <td><p>QQ</p><span>{{ formData.qq }}</span></td>
                <td><p>Email</p><span>{{ formData.email }}</span></td>
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
          <el-form class="editList" :model="formData" ref="formData" :rules="rules" :inline="true" size="mini" label-width="90px">
            <table class="list-detail-con">
              <tr>
                <td>
                  <el-form-item label="登录账号" prop="username">
                    <el-input placeholder="登录账号" v-model="formData.username" :disabled="dialogFlag?true:false" clearable></el-input>
                  </el-form-item>
                </td>
                <td class="imgLoader" rowspan="4" align="center">
                  <el-form-item prop="photo">
                    <div class="img_load" @click="toggleShow">
                      <img v-if="formData.photoData!=null" :src="formData.photoData" alt="" srcset="">
                      <img v-else-if="formData.photo!=null" :src="formData.photo" alt="" srcset="">
                      <img v-else src="../../assets/images/imgFile_default.png" alt="" srcset="">
                    </div>
                  </el-form-item>
                  <my-upload field="img"
                    @crop-success="cropSuccess"
                    @crop-upload-success="cropUploadSuccess"
                    @crop-upload-fail="cropUploadFail"
                    v-model="showImg"
                    :width="100"
                    :height="100"
                    :params="params"
                    :headers="headers"
                    img-format="png"></my-upload>
                </td>
              </tr>
              <tr v-if="!dialogFlag">
                <td>
                  <el-form-item label="登陆密码" prop="password">
                    <el-input placeholder="登陆密码" v-model="formData.password" clearable></el-input>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td>
                  <el-form-item label="用户名称" prop="realname">
                    <el-input placeholder="用户名称" v-model="formData.realname" clearable></el-input>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td>
                  <el-form-item label="性别" prop="sex">
                    <el-radio-group v-model="formData.sex" size="small">
                      <el-radio :label="0">保密</el-radio>
                      <el-radio :label="1">男</el-radio>
                      <el-radio :label="2">女</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td>
                  <el-form-item label="生日" prop="birthday">
                    <template>
                      <el-date-picker
                        v-model="formData.birthday"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions"
                        placeholder="选择日期">
                      </el-date-picker>
                    </template>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td>
                  <el-form-item label="身份证" prop="cardNo">
                    <el-input placeholder="身份证" v-model="formData.cardNo" clearable></el-input>
                  </el-form-item>
                </td>
                <td>
                  <el-form-item label="部门名称" prop="departmentParentKey">
                    <el-cascader v-model="formData.departmentParentKey"
                      placeholder="请选择部门"
                      :options="departmentOptions"
                      :props="{
                        value: 'id',
                        label: 'text',
                        children: 'children'
                      }"
                      change-on-select>
                    </el-cascader>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td>
                  <el-form-item label="手机" prop="mobile">
                    <el-input placeholder="手机" v-model="formData.mobile" clearable></el-input>
                  </el-form-item>
                </td>
                <td>
                  <el-form-item label="电话" prop="phone">
                    <el-input placeholder="电话" v-model="formData.phone" clearable></el-input>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td>
                  <el-form-item label="QQ" prop="qq">
                    <el-input placeholder="QQ" v-model="formData.qq" clearable></el-input>
                  </el-form-item>
                </td>
                <td>
                  <el-form-item label="Email" prop="email">
                    <el-input placeholder="Email" v-model="formData.email" clearable></el-input>
                  </el-form-item>
                </td>
              </tr>
              <!-- <tr>
                <td colspan="2">
                  <el-form-item label="省市区">
                    <el-cascader
                      :options="cascaderData"
                      @change="handleChange"
                      @active-item-change="handleItemChange"
                      :props="{
                        value: 'id',
                        label: 'name',
                        children: 'cities'
                      }"
                    ></el-cascader>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <el-form-item label="详细地址" prop="">
                    <el-input type="textarea" placeholder="详细地址" clearable></el-input>
                  </el-form-item>
                </td>
              </tr> -->
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

      <!--授权 窗口-->
      <div v-if="dialogAccreditVisible">
        <el-dialog title="授权" :visible.sync="dialogAccreditVisible" style="width:1100px;margin:auto">
          <template>
            <div style="text-align: center;margin-top:20px;">
              <el-transfer
                style="text-align: left; display: inline-block;"
                :titles="['角色', '已授权角色']"
                :format="{
                  noChecked: '${total}',
                  hasChecked: '${checked}/${total}'
                }"
                :props="{
                  key: 'id',
                  label: 'name'
                }"
                v-model="accreditValue.accreditIds"
                :data="accreditValue.all">
              </el-transfer>
            </div>
          </template>
          <div slot="footer" class="dialog-footer">
            <el-button :loading="saveLoading" type="primary" @click="handleAccredit('formData')" size="small">授权</el-button>
          </div>
        </el-dialog>
      </div>

      <!-- 自定义导出窗口 -->
      <div v-if="dialogExportVisible">
        <el-dialog title="自定义导出" :visible.sync="dialogExportVisible">
          <el-form label-position="top">
            <el-form-item label="选择要导出的列">
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
              <el-checkbox-group v-model="checkedList">
                <el-row>
                  <el-col :span="6" v-for="item in customExportData" :key="item.id">
                    <el-checkbox :label="item.value">{{item.label}}</el-checkbox>
                  </el-col>
                </el-row>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button :loading="saveLoading" type="primary" @click="handleCustomExport" size="small">导出</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import myUpload from 'vue-image-crop-upload'
import myProvinces from '../../components/common/provinces/Provinces'
export default {
  data () {
    return {
      // 图片上传
      showImg: false,
      params: {
        token: '123456798',
        name: 'avatar'
      },
      headers: {
        smail: '*_~'
      },
      imgDataUrl: '', // the datebase64 url of created image
      // 图片上传
      imageUrl: '',
      accreditValue: {
        all: [],
        accreditIds: []
      },
      loading: true,
      saveLoading: false,
      formInline: {
        realname: ''
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
      dialogAccreditVisible: false,
      dialogFlag: '',
      formData: {},
      row_info: [],
      rules: {
        username: [
          { required: true, message: '请输入登陆账号', trigger: 'blur' },
          { pattern: /^[^\u0020]/, message: '不能以空格开头', trigger: 'blur' },
          { pattern: /^[^\u4e00-\u9fa5]{2,16}$/, message: '只能输入2到16个字母、数字、特殊字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登陆密码', trigger: 'blur' },
          { pattern: /^[^\u0020]/, message: '不能以空格开头', trigger: 'blur' },
          { pattern: /^[^\u4e00-\u9fa5]{6,20}$/, message: '只能输入6到20个字母、数字、特殊字符', trigger: 'blur' }
        ],
        realname: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { pattern: /^[^\u0020]/, message: '不能以空格开头', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'blur' }
        ],
        departmentParentKey: [
          { required: true, message: '请选择部门', trigger: 'blur' }
        ],
        cardNo: [{
          pattern: /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|31)|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}([0-9]|x|X)$/,
          message: '身份证号码格式错误',
          trigger: 'blur'
        }],
        mobile: [{
          pattern: /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(166)|(17[3]|[5-8])|(18[0-9])|(19[8-9]))\d{8}$/,
          message: '手机号格式错误',
          trigger: 'blur'
        }],
        phone: [{
          pattern: /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/,
          message: '固定电话号码格式错误，例如：027-8888888',
          trigger: 'blur'
        }],
        email: [{
          pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
          message: '邮箱地址格式错误',
          trigger: 'blur'
        }],
        qq: [
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ],
        remarks: [
          { min: 0, max: 150, message: '长度在 0 到 150 个字符', trigger: 'blur' }
        ]
      },
      checkId: '',
      departmentOptions: [],
      dialogExportVisible: false,
      checkedList: [],
      customExportData: '',
      checkAll: false,
      isIndeterminate: false,
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  components: {
    'my-upload': myUpload,
    'my-provinces': myProvinces,
    cascaderData: {
      get: function () {
        this.cascaderData = []
      },
      set: val => {
        this.cascaderData = val
      }
    }
  },
  methods: {
    // 自定义导出
    handleCustomExport () {
      if (this.checkedList.length > 0) {
        let valList = ''
        this.checkedList.forEach((currentValue, index, arr) => {
          valList += currentValue + ','
        })
        valList = valList.slice(0, valList.length - 1)
        window.open('ibest/service/system/sysUser/exportCustomColumnExcel?selectColumnName=' + valList, '_self')
        this.dialogExportVisible = false
      } else {
        this.$message({
          type: 'warning',
          message: '当前没有选择要导出的列~'
        })
      }
    },
    // 图片上传
    toggleShow () {
      this.showImg = !this.showImg
    },
    cropSuccess (imgDataUrl, field) {
      console.log('-------- crop success --------')
      this.formData.photoData = imgDataUrl
    },
    cropUploadSuccess (jsonData, field) {
      console.log('-------- upload success --------')
      console.log(jsonData)
      console.log('field: ' + field)
    },
    cropUploadFail (status, field) {
      console.log('-------- upload fail --------')
      console.log(status)
      console.log('field: ' + field)
    },
    // 图片上传
    // 查询按钮
    onSubmit () {
      this.placeSearch(this.page, this.pageSize, this.formInline.realname)
    },
    // 重置
    onReset () {
      this.formInline.realname = ''
      this.placeSearch(this.page, this.pageSize, this.formInline.realname)
    },
    // 新增
    handleAdd () {
      this.dialogEditVisible = true
      this.dialogFlag = false
      this.formData = {}

      // 加载 组织部门
      this.$post('ibest/service/system/sysDepartment/departmentTree').then(response => {
        if (response.data && response.data.code === '00000000') {
          this.departmentOptions = response.data.data
        } else {
          console.log(response.data.msg)
        }
      }, error => {
        console.log(error)
      })
    },
    // 多选获取参数
    handleSelectionChange (val) {
      this.checkId = ''
      val.forEach(el => {
        this.checkId += el.id + ','
      })
      this.checkId = this.checkId.substring(0, this.checkId.length - 1)
    },
    // 批量删除
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
            this.$post('ibest/service/system/sysUser/delete', {
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
          }
        }
      }).then(() => {}).catch(() => {})
    },
    // 自定义导出
    handleExport (command) {
      if (command === 'a') {
        this.checkedList = []
        this.isIndeterminate = false
        this.checkAll = false
        this.dialogExportVisible = true
        this.getCustomExport()
      }
    },
    // 列表
    placeSearch (page, pageSize, realname) {
      this.loading = true
      this.$post('ibest/service/system/sysUser/query', {
        'page': page,
        'pageSize': pageSize,
        'realname': realname
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
      this.placeSearch(this.page, this.pageSize, this.formInline.realname)
    },
    handleSizeChange (val) {
      this.placeSearch(this.page, val)
    },
    handleCurrentChange (val) {
      this.placeSearch(val, this.pageSize)
    },
    // 组织部门加载 组织内容加载
    editDialogLoad (userId) {
      this.accreditValue.all = []
      this.accreditValue.accreditIds = []
      // 加载授权选项
      this.$post('ibest/service/system/sysUser/getAccreditRoleByUserId', {
        'userId': userId
      }).then(response => {
        if (response.data && response.data.code === '00000000') {
          let res = response.data.data
          this.accreditValue.all = res.unChooseRoleList.concat(res.chooseRoleList)
          res.chooseRoleList.forEach(el => {
            this.accreditValue.accreditIds.push(el.id)
          })
          console.log(this.accreditValue)
        } else {
          this.$message.error(response.data.msg)
        }
      }, error => {
        console.log(error)
      })
      // 加载 组织部门
      this.$post('ibest/service/system/sysDepartment/departmentTree').then(response => {
        if (response.data && response.data.code === '00000000') {
          this.departmentOptions = response.data.data
        } else {
          this.$message.error(response.data.msg)
        }
      }, error => {
        console.log(error)
      })
    },
    handleEdit (index, row) {
      if (index !== undefined && row !== undefined) {
        this.row_info = [index, row]
      }
      this.editDialogLoad(this.row_info[1].id)
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
        if (this.formData.departmentId) {
          this.formData.departmentParentKey += this.formData.departmentId
          this.formData.departmentParentKey = this.formData.departmentParentKey.substring(1)
          this.formData.departmentParentKey = this.formData.departmentParentKey.split(',')
        }
      } else if (command === 'c') { // 授权
        this.dialogAccreditVisible = true
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
              this.$post('ibest/service/system/sysUser/delete', {
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
                } else if (response.data.code === '00000001') {
                  done()
                  instance.confirmButtonLoading = false
                  this.$message.error(response.data.msg)
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
    // 新增编辑 保存
    handleSave (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.formData.departmentId = this.formData.departmentParentKey[this.formData.departmentParentKey.length - 1]
          this.saveLoading = true
          if (this.dialogFlag) { // 编辑
            this.$post('ibest/service/system/sysUser/update', {
              'id': this.formData.id,
              'username': this.formData.username,
              'realname': this.formData.realname,
              'sex': this.formData.sex,
              'birthday': this.formData.birthday,
              'cardNo': this.formData.cardNo,
              'departmentId': this.formData.departmentId,
              'mobile': this.formData.mobile,
              'phone': this.formData.phone,
              'qq': this.formData.qq,
              'email': this.formData.email,
              'remarks': this.formData.remarks,
              'photoData': this.formData.photoData
            }).then(response => {
              if (response.data && response.data.code === '00000000') {
                this.saveLoading = false
                this.dialogEditVisible = false
                this.$store.dispatch('getUserInfo')
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
          } else { // 校验 新增 用户名 登录账号是否重复
            this.$post('ibest/service/system/sysUser/validateUsername', {
              'username': this.formData.username
            }).then(response => {
              if (response.data && response.data.code === '00000000') {
                if (!response.data.data) {
                  this.saveLoading = true
                  this.$post('ibest/service/system/sysUser/create', { // 新增
                    'username': this.formData.username,
                    'password': this.formData.password,
                    'realname': this.formData.realname,
                    'sex': this.formData.sex,
                    'birthday': this.formData.birthday,
                    'cardNo': this.formData.cardNo,
                    'departmentId': this.formData.departmentId,
                    'mobile': this.formData.mobile,
                    'phone': this.formData.phone,
                    'qq': this.formData.qq,
                    'email': this.formData.email,
                    'remarks': this.formData.remarks,
                    'photoData': this.formData.photoData
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
                      this.$message.error('数据异常，保存失败')
                      this.saveLoading = false
                    }
                  }, error => {
                    console.log(error)
                    this.saveLoading = false
                  })
                } else {
                  this.$message.error('登录账号不可重复！')
                  this.saveLoading = false
                }
              } else {
                this.$message.error(response.data.msg)
              }
            }, error => {
              console.log(error)
            })
          }
        } else {
          console.log('error submit!!')
        }
      })
    },
    // 用户授权角色 保存
    handleAccredit () {
      this.saveLoading = true
      let roleIds = ''
      this.accreditValue.accreditIds.forEach(el => {
        roleIds += el + ','
      })
      roleIds = roleIds.substring(0, roleIds.length - 1)
      this.$post('ibest/service/system/sysUser/accreditForUser', {
        'userId': this.row_info[1].id,
        'roleIds': roleIds
      }).then(response => {
        if (response.data && response.data.code === '00000000') {
          this.saveLoading = false
          this.dialogAccreditVisible = false
          this.$message({
            message: '授权成功',
            type: 'success'
          })
        } else {
          this.saveLoading = false
          this.$message.error('操作异常')
        }
      }, error => {
        this.saveLoading = false
        console.log(error)
      })
    },
    // 自定义导出 列表
    getCustomExport () {
      this.$post('ibest/common/enumData/sysUserColumnField', {}).then(response => {
        this.customExportData = response.data
      }, error => {
        console.log(error)
      })
    },
    handleCheckAllChange (val) {
      let valListAll = []
      this.customExportData.forEach((currentValue, index, arr) => {
        valListAll.push(currentValue.value)
      })
      this.checkedList = val ? valListAll : []
      this.isIndeterminate = false
    }
  },
  created () {
    this.placeSearch(this.page, this.pageSize)
  }
}
</script>

<style lang="scss" scoped>
.imgLoader img{
  cursor: pointer;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.img_load{
  width: 100px!important;
  height: 100px;
  background: #f5f5f5;
  cursor: pointer;
}
</style>
