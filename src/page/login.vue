<template>
  <div class="bigDiv">

    <div class="topPage">
      <h1 class="h1">
        D.Perspcire
      </h1>
      <h2 class="top_p">
        全球领先的工业大数据展示平台
      </h2>
    </div>

    <div class="centerPage">

      <div class="form">

        <el-form
          ref="loginForm"
          :model="loginForm"
        >

          <el-tabs v-model="activeName" stretch="stretch" style="margin-top: 5%">

            <el-tab-pane label= "账户密码登录" name="first">
              <el-form-item class="form-top">
                <span class="form-top-span">账户密码登录</span>
              </el-form-item>
              <el-form-item prop='userId' :rules="[{ required: true, message: '用户名不能为空' ,trigger: 'blur' }]"
                            class="form-id">
                <el-input
                  placeholder="用户名："
                  v-model="loginForm.userName"
                  clearable
                  prefix-icon="el-icon-user">
                </el-input>
              </el-form-item>
              <el-form-item prop='userPassword' :rules="[{ required: true, message: '密码不能为空' ,trigger: 'blur' }]"
                            class="form-psd">
                <el-input
                  placeholder="密码："
                  v-model="loginForm.password"
                  clearable
                  show-password
                  prefix-icon="el-icon-unlock">
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" class="loginBtn" @click="login">
                  登录
                </el-button>
              </el-form-item>
              <el-form-item class="form-checked">
                <el-checkbox v-model="userChecked" class="checked" style="float: left; "><span style="color: #A9A9A9">自动登录</span>
                </el-checkbox>
                <el-link href="" type="info" class="forgetPw" style="float: right;">忘记密码</el-link>
              </el-form-item>
            </el-tab-pane>

            <el-tab-pane label="统一认证登录" name="second">
              <el-form-item class="form-top">
                <span class="form-top-span">统一认证账号密码登录</span>
              </el-form-item>
              <el-form-item prop='unifiedId' :rules="[{ required: true, message: '统一认证账号不能为空' ,trigger: 'blur' }]"
                            class="form-id">
                <el-input
                  placeholder="统一认证账号："
                  v-model="loginForm.unifiedId"
                  clearable
                  prefix-icon="el-icon-user">
                </el-input>
              </el-form-item>
              <el-form-item prop='unifiedPassword' :rules="[{ required: true, message: '密码不能为空' ,trigger: 'blur' }]"
                            class="form-psd">
                <el-input
                  placeholder="密码："
                  v-model="loginForm.unifiedPassword"
                  clearable
                  show-password
                  prefix-icon="el-icon-unlock">
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" class="loginBtn">
                  登录
                </el-button>
              </el-form-item>
              <el-form-item class="form-checked">
                <el-checkbox v-model="userChecked" class="checked" style="float: left;"><span style="color: #A9A9A9">自动登录</span>
                </el-checkbox>
                <el-link href="" type="info" class="forgetPw" style="float: right;">忘记密码</el-link>
              </el-form-item>
            </el-tab-pane>

          </el-tabs>

        </el-form>

      </div>

    </div>
    <div class="bottomPage">
      <p>
        Copyright©2019北京淇朗科技有限公司
      </p>
    </div>
  </div>

</template>

<script>
  export default {
    inject: ['reload'],
    name: "login",
    provide() {
      return {
        reload: this.reload
      }
    },
    data() {
      return {
        activeName: 'first',
        loginForm: {
          userName: '',
          password: '',
          loginType: '1',
          unifiedId: '',
          unifiedPassword: ''
        },
        userChecked: true,
        unifiedChecked: true,
        isRouterAlive: true
      }
    },
    methods: {
      login() {
        this.$http({
          url: "/api/api/login",
          "content-type": "application/json",
          method: 'post',
          data: this.loginForm
        }).then(res => {
          console.log(res)
          if (res.data.status == 1) {
            this.$router.push({path: "/index"})
          } else {
            alert(res.data.msg);
            this.reload()
          }
        })
      },
      reload() {
        this.isRouterAlive = false
        this.$nextTick(function () {
          this.isRouterAlive = true
        })
      }
    }

  }
</script>

<style scoped>
  .centerPage {
    background: url("../images/background02.png") no-repeat center;
    background-size: cover;
    z-index: 3;
    width: 60%;
    position: absolute;
    height: 60%;
    left: 20%;
    top: 20%;
    border: solid 1px white;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.9);
  }

  .bigDiv {
    width: 99%;
    position: absolute;
    background: url('https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg') no-repeat center;
    background-size: cover;
    height: 99%;
    z-index: 3;
  }

  .h1 {
    color: #FF6600;
    font-size: 42px;
    margin-left: 2%;
  }

  .top_p {
    color: #a679b9;
    font-size: 12px;
    margin-left: 17%;
    position: relative;
    bottom: 10%;
  }
  .topPage {
    width: 20%;
    height: 20%;
    margin-left: 10%;
  }
  .form{
    background-color: white;
    width: 44%;
    height: 100%;
    float: right;
  }
  .form-top-span{
    font-size: 25px;
    color: #696969;
  }
  .form-top{
    text-align: center;
    margin-top: 5%;
  }
  .form-id{
    width: 80%;
    margin-left: 10%;
    text-align: center;
    margin-top: 5%;
  }
  .form-psd{
    width: 80%;
    margin-left: 10%;
    text-align: center;
    margin-top: 7%;
  }
  .loginBtn{
    width: 80%;
    margin-left: 10%;
    text-align: center;
    margin-top: 4%;
    background-color: #ff6600;
    border: white
  }
  .form-checked{
    width: 80%;
    margin-left: 10%;
    text-align: center;
    margin-top: 5%;
  }
  .bottomPage{
    position:absolute;
    bottom: 0%;
    right: 42%;
    color: #2f4f4f;
    font-size: 15px;
  }
</style>

<style scoped>
  /deep/ .el-tabs__item.is-active{
    color: #FF6600;
  }
  /deep/ .el-tabs__item:hover{
    color: #FF6600;
  }
  /deep/ .el-checkbox__inner{
    background-color: #ff6600;
    border-color: #ff6600;
  }
  /deep/ .el-tabs__active-bar{
    background-color: #ff6600;
  }
  /deep/ .el-checkbox__input.is-focus .el-checkbox__inner{
    border-color: #ff6600;
    background-color: white;
  }
  /deep/ .el-checkbox__input.is-checked .el-checkbox__inner{
    border-color: #ff6600;
    background-color: #ff6600;
  }
</style>
