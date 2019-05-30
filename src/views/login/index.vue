<template>
  <div class="login-container">
    <div class="headline">湖北非税收入征收信息管理系统</div>

    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <h3 class="title">财政管理端</h3>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input v-model="loginForm.username" name="username" type="text" auto-complete="on" placeholder="username" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input :type="pwdType" v-model="loginForm.password" name="password" auto-complete="on" placeholder="password" @keyup.enter.native="handleLogin" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handleLogin">
          Sign in
        </el-button>
      </el-form-item>
      <div class="other-select">
        <el-select v-model="loginForm.year" class="year" placeholder="请选择年度">
          <el-option v-for="(item,i) in yearList" :key="i" :label="item" :value="item" />
        </el-select>
        <el-select v-model="loginForm.admdivcode" class="admdivcode" placeholder="请选择区划">
          <el-option v-for="(item,i) in admdivsList" :key="i" :label="item.text" :value="item.value" />
        </el-select>
      </div>
      <button @click="openTest">打开测试页面。</button>

      <!-- <button @click="getList">发送</button> -->
    </el-form>
  </div>
</template>

<script>
// import { isvalidUsername } from '@/utils/validate'
import { getYearAndAdmdiv } from '@/api/login'
export default {
  name: 'Login',
  components: {
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      // if (!isvalidUsername(value)) {
      // callback(new Error('请输入正确的用户名'))
      // } else {
      callback()
      // }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    return {
      yearList: [],
      admdivsList: [],
      loginForm: {
        username: '999',
        password: '111111',
        year: '',
        admdivcode: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      loading: false,
      pwdType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    openTest() {
      this.$refs.test.dialogTableVisible = true
    },
    getList() {
      var timer = null
      getYearAndAdmdiv().then(res => {
        this.yearList = res.data.years
        this.admdivsList = res.data.admdivs
        clearTimeout(timer)
      }).catch(err => {
        timer = setTimeout(() => {
          this.getList()
          console.log('重试')
        }, 3000)
        console.log('服务器返回错误信息：！', err)
      })
    },
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      // 这里需要调用login的接口
      if (this.loginForm.year === '' || this.loginForm.admdivcode === '') {
        this.$message.error('请选择年度和区划！')
      } else {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('Login', this.loginForm).then(() => {
              this.loading = false
              this.$router.push({ path: this.redirect || '/' })
            }).catch(() => {
              this.loading = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: $bg;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
.other-select {
  .el-input {
    width: 100%
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
// $bg:#2d3a4b;
$bg: #fff;
$dark_gray: #889aa4;
$light_gray: #dddddd;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background: $bg url('../../assets/login/bg_01.jpg') no-repeat 0 0 / cover;
  .headline {
    font-size: 58px;
    margin-top: 120px;
    text-align: center;
    letter-spacing: 5px;
    text-shadow: 0px 1px 0px #999, 0px 2px 0px #888, 0px 3px 0px #777,
      0px 4px 0px #666, 0px 5px 0px #555, 0px 6px 0px #444, 0px 7px 0px #333,
      0px 8px 7px #001135;
    color: #fff;
  }
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    margin: 50px auto;
    background: rgba(255, 255, 255, 0.9);
  }
  .other-select {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    .year{
      width:47.5%
    }
    .admdivcode{
      width:47.5%
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title {
    font-size: 38px;
    font-weight: 400;
    color: #a0dddd;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
    letter-spacing: 20px;
    text-shadow: 0px 1px 0px #999, 0px 2px 0px #888, 0px 3px 0px #777,
      0px 4px 0px #666, 0px 5px 0px #555, 0px 6px 0px #444, 0px 7px 0px #333,
      0px 8px 7px #001135;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
