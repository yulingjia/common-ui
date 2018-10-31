<template>
  <div class="main-header">
    <div class="myheader">
      <div class="left">
        <span @click="handleButton" :model="isCollapse" class="iconfont icon-open" :class="!isCollapse?'show_in':'show_out'"></span>
        <a class="left_link" href="javascript:void(0)">管理控制台</a>
      </div>
      <div class="right">
        <div class="right_link">
          <span>主题色</span>
          <div class="right_link_con theme_container">
            <ul class="list_con">
              <li @click="handleTheme(item.value)" v-for="item in themeData" :key="item.id">
                <p>{{item.text}}</p>
              </li>
            </ul>
          </div>
        </div>
        <div class="right_link">
          <span>工单</span>
          <div class="right_link_con workOrder_container">
            <ul class="list_con">
              <li>
                <p>我的工单</p>
              </li>
              <li>
                <p>提交工单</p>
              </li>
            </ul>
          </div>
        </div>
        <div class="right_link">
          <span>消息</span>
          <div class="right_link_con message_container">
            <div class="list_title">
              <span>未读消息</span>
              <a href="javascript:void(0)">进入消息中心</a>
            </div>
            <ul class="list_con">
              <li>
                <p class="mes_cons">系统将于9月10日上线升级！</p>
                <p class="mes_time">2018-05-25 14:19</p>
              </li>
              <li>
                <p class="mes_cons">系统将于9月10日上线升级！</p>
                <p class="mes_time">2018-05-25 14:19</p>
              </li>
              <li>
                <p class="mes_cons">系统将于9月10日上线升级！</p>
                <p class="mes_time">2018-05-25 14:19</p>
              </li>
              <li>
                <p class="mes_cons">系统将于9月10日上线升级！</p>
                <p class="mes_time">2018-05-25 14:19</p>
              </li>
              <li>
                <p class="mes_cons">系统将于9月10日上线升级！</p>
                <p class="mes_time">2018-05-25 14:19</p>
              </li>
            </ul>
          </div>
        </div>
        <div class="right_link">
          <span>
            <b class="my-pic" :style="{'background-image' : 'url('+userInfo.photo+')'}"></b>
          </span>
          <div class="right_link_con person_container">
            <div class="list_title">
              <span style="line-height:50px;">
                <b class="my-pic" :style="{'background-image' : 'url('+userInfo.photo+')'}"></b>
                {{userInfo.realname}}
              </span>
            </div>
            <div class="person_button">
              <div class="person_button_item" @click="handleMes">修改信息</div>
              <div class="person_button_item" @click="handlePas">修改密码</div>
            </div>
            <ul class="list_con">
              <li>
                <p>哈哈哈哈哈哈</p>
              </li>
            </ul>
            <div class="person_exit" @click="handleExit">退出管理平台</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 修改密码 -->
    <div v-if="dialogFormVisible">
      <el-dialog title="修改密码" :visible.sync="dialogFormVisible">
        <el-form :model="formPass" ref="formPass" :rules="rules" :inline="true" size="small" label-width="90px">
          <table class="list-detail-con">
            <tr>
              <td colspan="2">
                <el-form-item label="原密码" prop="oldPassword">
                  <el-input type="password" v-model="formPass.oldPassword" placeholder="请输入原密码" auto-complete="off"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <el-form-item label="新密码" prop="newPassword">
                  <el-input type="password" v-model="formPass.newPassword" placeholder="请输入新密码" auto-complete="off"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <el-form-item label="确认密码" prop="comparePassword">
                  <el-input type="password" v-model="formPass.comparePassword" placeholder="请确认密码" auto-complete="off"></el-input>
                </el-form-item>
              </td>
            </tr>
          </table>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button :loading="saveLoading" type="primary" @click="handleSave('formPass')" size="small">保存</el-button>
        </div>
      </el-dialog>
    </div>
    <!--修改个人信息 窗口-->
    <div v-if="dialogEditVisible">
      <el-dialog title="修改信息" :visible.sync="dialogEditVisible">
        <el-form class="editList" :model="formData" ref="formData" :rules="rulesEdit" :inline="true" size="mini" label-width="90px">
          <table class="list-detail-con">
            <tr>
              <td>
                <el-form-item label="登录账号" prop="username">
                  <el-input placeholder="登录账号" v-model="formData.username" :disabled="true" clearable></el-input>
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
                <my-upload field="img" @crop-success="cropSuccess" @crop-upload-success="cropUploadSuccess" @crop-upload-fail="cropUploadFail" v-model="showImg" :width="100" :height="100" :params="params" :headers="headers" img-format="png"></my-upload>
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
                    <el-date-picker v-model="formData.birthday" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期">
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
                  <el-cascader v-model="formData.departmentParentKey" :disabled="true" placeholder="请选择部门" :options="departmentOptions"
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
          <el-button :loading="saveLoading" type="primary" @click="handleEditSave('formData')" size="small">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import myUpload from 'vue-image-crop-upload'
export default {
  name: 'Myheader',
  data () {
    return {
      dialogFormVisible: false,
      formPass: {
        oldPassword: '',
        newPassword: '',
        comparePassword: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' },
          { pattern: /^[^\u4e00-\u9fa5]{6,20}$/, message: '只能输入6到20个字母、数字、特殊字符', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { pattern: /^[^\u4e00-\u9fa5]{6,20}$/, message: '只能输入6到20个字母、数字、特殊字符', trigger: 'blur' }
        ],
        comparePassword: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { pattern: /^[^\u4e00-\u9fa5]{6,20}$/, message: '只能输入6到20个字母、数字、特殊字符', trigger: 'blur' }
        ]
      },
      saveLoading: false,
      dialogEditVisible: false,
      formData: [],
      userId: '',
      rulesEdit: {
        realname: [
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'blur' }
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
        }]
      },
      departmentOptions: [],
      // 图片上传
      showImg: false,
      params: {
        token: '123456798',
        name: 'avatar'
      },
      headers: {
        smail: '*_~'
      },
      imgDataUrl: '' // the datebase64 url of created image
      // 图片上传
    }
  },
  computed: {
    ...mapState({
      isCollapse: state => state.menuList.isCollapse,
      userInfo: state => state.userInfo.userInfo,
      themeData: state => state.theme.themeData
    })
  },
  components: {
    myUpload
  },
  methods: {
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
    handleButton () {
      this.$store.dispatch('showMenuList')
    },
    handleMes () {
      if (this.formData) {
        this.dialogEditVisible = true
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
      } else {
        this.$message({
          type: 'error',
          message: '未获取到用户信息~'
        })
      }
    },
    handlePas () {
      this.dialogFormVisible = true
      this.formPass = {
        oldPassword: '',
        newPassword: '',
        comparePassword: ''
      }
    },
    handleExit () {
      this.$confirm('确认退出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$get('ibest/auth/logout').then(response => {
          this.$store.dispatch('cancleUserInfo')
          this.$router.push({ path: '/login' })
        }, error => {
          console.log(error)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    },
    handleSave (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          this.$post('ibest/service/system/sysUser/modifyPassword', {
            'userId': this.userId,
            'oldPassword': this.formPass.oldPassword,
            'newPassword': this.formPass.newPassword,
            'comparePassword': this.formPass.comparePassword
          }).then(response => {
            if (response.data && response.data.code === '00000000') {
              this.$message({
                type: 'success',
                message: '密码保存成功,请重新登录~'
              })
              this.$store.dispatch('cancleUserInfo')
              setTimeout(() => {
                this.$router.push({ path: '/login' })
              }, 1000)
              this.saveLoading = false
              this.dialogFormVisible = false
            } else if (response.data.code === '00000001') {
              this.saveLoading = false
              this.$message.error(response.data.msg)
            } else {
              this.saveLoading = false
              this.$message.error('操作异常')
            }
          }, error => {
            console.log(error)
            this.saveLoading = false
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleEditSave (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.formData.departmentId = this.formData.departmentParentKey[this.formData.departmentParentKey.length - 1]
          this.saveLoading = true
          this.$post('ibest/service/system/sysUser/modifyPersonalInformation', {
            'id': this.formData.id,
            'realname': this.formData.realname,
            'sex': this.formData.sex,
            'birthday': this.formData.birthday,
            'cardNo': this.formData.cardNo,
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
              this.$message({
                message: '信息修改成功',
                type: 'success'
              })
            } else {
              console.log(response.data.msg)
              this.saveLoading = false
            }
          }, error => {
            console.log(error)
            this.saveLoading = false
          })
        }
      })
    },
    handleTheme (val) {
      this.$store.dispatch('edit_theme_color', val)
    }
  },
  created () {
    this.$store.dispatch('getUserInfo').then(response => {
      if (response.data && response.data.code === '00000000') {
        this.formData = response.data.data
        this.userId = response.data.data.id
        if (this.formData.departmentId) {
          this.formData.departmentParentKey += this.formData.departmentId
          this.formData.departmentParentKey = this.formData.departmentParentKey.substring(1)
          this.formData.departmentParentKey = this.formData.departmentParentKey.split(',')
        }
      } else {
        console.log('用户信息获取失败')
      }
    }, error => {
      console.log(error)
    })
  }
}
</script>

<style lang="scss" scoped>
.myheader {
  background-color: #252a2f;
  display: flex;
  justify-content: space-between;
  .left {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    & > span.iconfont {
      cursor: pointer;
      margin-left: 10px;
    }
    img {
      float: left;
      margin: 11px;
    }
    h1 {
      line-height: 50px;
      color: #fff;
      font-size: 16px;
      float: left;
      margin: 0 10px;
      font-family: "微软雅黑";
    }
    p {
      float: left;
      color: #999;
      margin-left: 20px;
      margin-top: 20px;
    }
    .show_in {
      transition: all 0.6s;
      transform: rotate(0deg);
    }
    .show_out {
      transition: all 0.6s;
      transform: rotate(90deg);
    }
    .left_link {
      color: #ddd;
      margin-left: 15px;
      height: 50px;
      line-height: 50px;
      padding: 0 10px;
      font-size: 12px;
      &:hover {
        background: #1e2226 !important;
      }
    }
  }
  .right {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    & > div {
      float: right;
      cursor: pointer;
      font-size: 12px;
      color: #ccc;
      & > i {
        float: left;
        margin-right: 5px;
      }
    }

    .right-menu {
      color: #fff;
      span {
        display: block;
        line-height: 50px;
      }
    }

    .right-message {
      & > i {
        font-size: 20px;
      }
    }

    .my-pic {
      float: left;
      width: 30px;
      height: 30px;
      background: #ccc;
      background-repeat: no-repeat;
      background-position: center center;
      background-size: cover;
      margin: 10px;
      border-radius: 30px;
    }

    .right_link {
      color: #ddd;
      height: 50px;
      padding: 0 20px;
      font-size: 12px;
      position: relative;
      & > span {
        line-height: 50px;
      }
      &:hover {
        background: #1e2226 !important;
        & > .right_link_con {
          height: auto;
        }
      }
      .right_link_con {
        position: absolute;
        top: 50px;
        right: 0;
        background: #1e2226;
        z-index: 10;
        height: 0;
        transition: height 1s;
        overflow: hidden;
        .list_title {
          width: 100%;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          padding: 0 10px;
          box-sizing: border-box;
          line-height: 46px;
        }
        ul.list_con {
          display: block;
          li {
            padding: 10px;
            p {
              color: #fff;
            }
          }
        }
      }
      .person_container {
        width: 240px;
        .person_button {
          border-bottom: 1px solid #333;
          display: flex;
          flex-direction: row;
          padding-bottom: 10px;
          .person_button_item {
            flex: 1;
            height: 18px;
            line-height: 18px;
            border-right: 1px solid #333;
            text-align: center;
            color: #fff;
            opacity: 0.85;
          }
        }
        .person_exit {
          height: 40px;
          line-height: 40px;
          text-align: center;
          border-top: 1px solid #333;
        }
      }
      .message_container {
        width: 280px;
        li {
          border-bottom: 1px solid #333;
          .mes_cons {
            line-height: 26px;
            color: hsla(0, 0%, 100%, 0.85);
          }
          .mes_time {
            font-size: 12px;
            color: hsla(0, 0%, 100%, 0.85);
            opacity: 0.65;
          }
        }
      }
      .workOrder_container {
        width: 120px;
      }
      .theme_container {
        width: 130px;
      }
    }
  }
}

.img_load {
  width: 100px !important;
  height: 100px;
  background: #f5f5f5;
  cursor: pointer;
}
</style>
