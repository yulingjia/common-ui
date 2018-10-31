<template>
  <div class="login-contain">
    <div class="login-header">
      <img src="../assets/images/logo_dev.png" alt="" srcset="">
      <p>后台管理系统</p>
      <div class="righ_theme">
        <span>切换主题</span>
        <div class="righ_theme_con">
          <ul class="list_con">
            <li @click="handleTheme(item.value)" v-for="item in themeData" :key="item.id"><p>{{item.text}}</p></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="login-masker">
      <div id="login">
        <p class="loginTitle">用户登录</p>
        <el-form ref="loginForm" :model="loginForm" :rules="rules" @submit.native.prevent="onSubmit('loginForm')" size="small">
          <el-form-item prop="userName">
            <el-input v-model="loginForm.userName" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item prop="passWord">
            <el-input v-model="loginForm.passWord" placeholder="密码" :type="pwdActive?'password':'text'">
              <i class="pwdIcon iconfont" :class="pwdActive?'icon-open-eyes':'icon-clouse'" slot="suffix" @click="pwdOff"></i>
            </el-input>
          </el-form-item>
          <el-form-item v-if="checkCodeShow" prop="checkCode">
            <el-row>
              <el-col :span="14">
                <el-input v-model="loginForm.checkCode" placeholder="验证码"></el-input>
              </el-col>
              <el-col :span="10">
                <img @click="exchangeCode" :src="'ibest/common/getKaptchaImage?code=' + code" alt="" srcset="" style="height:33px;float:right">
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-button class="loginBtn" type="primary" @click="onSubmit('loginForm')" :loading="btnLoading" autofocus>登陆</el-button>
            <!-- <el-checkbox class="rem-pass">记住密码</el-checkbox> -->
            <a class="for-pass">忘记密码?</a>
          </el-form-item>
        </el-form>
      </div>
      <div class="left-con">
        <img src="../assets/images/logo.png" alt="" srcset="">
      </div>
    </div>
    <div class="login-footer">
      <p>版权所有 © 2013- 2018 安徽百得思维信息科技有限公司 皖ICP备16015303号-1</p>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {setToken} from '../utils/auth'
export default {
  data () {
    return {
      btnLoading: false,
      loginForm: {
        userName: '',
        passWord: '',
        checkCode: ''
      },
      checkCodeShow: false,
      rules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        passWord: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        checkCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      },
      pwdActive: true,
      code: ''
    }
  },
  computed: {
    ...mapState({
      themeData: state => state.theme.themeData
    })
  },
  methods: {
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          this.$post('ibest/auth/login', {
            'username': this.loginForm.userName,
            'password': this.loginForm.passWord,
            'checkCode': this.loginForm.checkCode
          }).then(response => {
            let res = response.data
            if (res && res.code === '00000000') {
              setToken(res.data.userToken)
              setTimeout(_ => {
                this.btnLoading = false
              }, 500)
              this.$router.push('/main')
            } else if (res && res.code === '00000001') {
              sessionStorage.loginNum++
              if (sessionStorage.loginNum === '3') {
                this.checkCodeShow = true
              }
              this.exchangeCode()
              this.$message.error(res.msg)
              this.btnLoading = false
            } else {
              this.$message.error('操作异常')
              this.btnLoading = false
            }
          }, error => {
            console.log(error)
            this.$message.error(error)
            this.btnLoading = false
          })
        }
      })
    },
    exchangeCode () {
      this.code = new Date().getTime()
    },
    // 密码显隐
    pwdOff () {
      if (this.pwdActive) {
        this.pwdActive = false
      } else {
        this.pwdActive = true
      }
    },
    handleTheme (val) {
      this.$store.dispatch('edit_theme_color', val)
    }
  },
  mounted () {
    if (this.$route.params.noToken) {
      setTimeout(_ => {
        this.$message.error('登陆超时，请重新登陆')
      }, 500)
    }
    sessionStorage.loginNum = 0
  }
}
</script>

<style lang="scss" scoped>
.login-contain{
  position: fixed;
  top:0;
  left:0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  .login-header{
    width: 100%;
    height: 80px;
    background: #fff;
    &>img{
      float: left;
      height: 50px;
      margin-top: 15px;
      margin-left: 100px;
    }
    &>p{
      float: left;
      margin-top:40px;
      margin-left: 40px;
      font-size: 18px;
      color: #999;
    }
    &>.righ_theme{
      float: right;
      margin-right: 100px;
      position: relative;
      &:hover{
        .righ_theme_con{
          display: block!important;
        }
      }
      span{
        line-height: 80px;
        cursor: pointer;
      }
      .righ_theme_con{
        position: absolute;
        top:60px;
        right: 0;
        background-color: #fff;
        width:130px;
        z-index:200;
        box-shadow: 1px 1px 2px #ddd;
        display: none;
        .list_con>li:hover{
          color: #409eff;
        }
        ul li {
          line-height: 30px!important;
          padding:0 15px;
          cursor: pointer;
        }
      }
    }
  }
  .login-masker{
    flex: 1;
    width: 100%;
    background-color: rgba(0,0,0,.4);
    background-image: url(../assets/images/login-bg.png);
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
  }
  .login-footer{
    width: 100%;
    height: 80px;
    background: #fff;
    p{
      line-height: 80px;
      text-align: center;
      color:#999;
    }
  }
}

@keyframes slideLeft
{
  from {right: -330px;}
  to {right: 100px;}
}

@-moz-keyframes slideLeft /* Firefox */
{
  from {right: -330px;}
  to {right: 100px;}
}

@-webkit-keyframes slideLeft /* Safari 和 Chrome */
{
  from {right: -330px;}
  to {right: 100px;}
}

@-o-keyframes slideLeft /* Opera */
{
  from {right: -330px;}
  to {right: 100px;}
}

#login{
  width:250px;
  height: 300px;
  padding:40px 40px;
  background: #fff;
  position: absolute;
  top:0;
  bottom:0;
  right: -330px;
  margin: auto;
  border-radius: 0;
  z-index:100;
  box-shadow: 1px 1px 2px #eee;

  animation: slideLeft .5s ease-out forwards ;
  -moz-animation: slideLeft .5s ease-out forwards ;	/* Firefox */
  -webkit-animation: slideLeft .5s ease-out forwards ;	/* Safari 和 Chrome */
  -o-animation: slideLeft .5s ease-out forwards ;	/* Opera */

  .loginTitle{
    font-size: 16px;
    line-height: 40px;
    border-bottom:1px solid rgba(228,228,228,1);
    margin-bottom: 30px;
    text-align: left;
  }
  .loginBtn{
    width: 100%;
    margin-top:20px;
  }
  .rem-pass{
    float: left;
  }
  .for-pass{
    float: right;
    cursor: pointer;
  }
  .pwdIcon{
    color:#409EFF;
    cursor: pointer;
  }
}

.left-con{
  position: absolute;
  width: 150px;
  height: 200px;
  top:0;
  bottom: 0;
  left: -160px;
  margin: auto;

  animation: slideRight .5s ease-out forwards ;
  -moz-animation: slideRight .5s ease-out forwards ;	/* Firefox */
  -webkit-animation: slideRight .5s ease-out forwards ;	/* Safari 和 Chrome */
  -o-animation: slideRight .5s ease-out forwards ;	/* Opera */
  img{
    width:100%;
  }
}

@keyframes slideRight
{
  from {left: -160px;}
  to {left: 200px;}
}

@-moz-keyframes slideRight /* Firefox */
{
  from {left: -160px;}
  to {left: 200px;}
}

@-webkit-keyframes slideRight /* Safari 和 Chrome */
{
  from {left: -160px;}
  to {left: 200px;}
}

@-o-keyframes slideRight /* Opera */
{
  from {left: -160px;}
  to {left: 200px;}
}

</style>
