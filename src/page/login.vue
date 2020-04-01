<template>
  <div class="bigDiv">

    <div class="topPage">
      <h1 class="h1">
        北京淇朗工业大数据系统
      </h1>
      <p class="top_p">
        全球领先的工业大数据展示平台
      </p>
    </div>

    <div class="centerPage">

      <div class="form" style="background-color: white; width: 44%; height: 100%; float: right">

        <el-form
          ref="loginForm"
          :model="loginForm"
        >

          <el-tabs v-model="activeName" stretch="stretch" style="margin-top: 5%">

            <el-tab-pane label="账户密码登录" name="first">
              <el-form-item style="text-align: center; margin-top: 5%;">
                <span style="font-size: 25px; color: #696969">账户密码登录</span>
              </el-form-item>
              <el-form-item prop='userId' :rules="[{ required: true, message: '用户名不能为空' ,trigger: 'blur' }]"
                            style="width: 80%; margin-left: 10%; text-align: center; margin-top: 5%;">
                <el-input
                  placeholder="用户名："
                  v-model="loginForm.userId"
                  clearable
                  prefix-icon="el-icon-user">
                </el-input>
              </el-form-item>
              <el-form-item prop='userPassword' :rules="[{ required: true, message: '密码不能为空' ,trigger: 'blur' }]"
                            style="width: 80%; margin-left: 10%; text-align: center; margin-top: 7%;">
                <el-input
                  placeholder="密码："
                  v-model="loginForm.userPassword"
                  clearable
                  show-password
                  prefix-icon="el-icon-unlock">
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" class="loginBtn" @click="login"
                           style="width: 80%; margin-left: 10%; text-align: center; margin-top: 4%; background-color: #ff6600; border: white">
                  登录
                </el-button>
              </el-form-item>
              <el-form-item style="width: 80%; margin-left: 10%; text-align: center; margin-top: 5%;">
                <el-checkbox v-model="userChecked" class="checked" style="float: left; "><span style="color: #A9A9A9">自动登录</span>
                </el-checkbox>
                <el-link href="" type="info" class="forgetPw" style="float: right;">忘记密码</el-link>
              </el-form-item>
            </el-tab-pane>

            <el-tab-pane label="统一认证登录" name="second">
              <el-form-item style="text-align: center; margin-top: 5%;">
                <span style="font-size: 25px; color: #696969">统一认证账号密码登录</span>
              </el-form-item>
              <el-form-item prop='unifiedId' :rules="[{ required: true, message: '统一认证账号不能为空' ,trigger: 'blur' }]"
                            style="width: 80%; margin-left: 10%; text-align: center; margin-top: 5%;">
                <el-input
                  placeholder="统一认证账号："
                  v-model="loginForm.unifiedId"
                  clearable
                  prefix-icon="el-icon-user">
                </el-input>
              </el-form-item>
              <el-form-item prop='unifiedPassword' :rules="[{ required: true, message: '密码不能为空' ,trigger: 'blur' }]"
                            style="width: 80%; margin-left: 10%; text-align: center; margin-top: 7%;">
                <el-input
                  placeholder="密码："
                  v-model="loginForm.unifiedPassword"
                  clearable
                  show-password
                  prefix-icon="el-icon-unlock">
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" class="loginBtn"
                           style="width: 80%; margin-left: 10%; text-align: center; margin-top: 4%;  background-color: #ff6600; border: white">
                  登录
                </el-button>
              </el-form-item>
              <el-form-item style="width: 80%; margin-left: 10%; text-align: center; margin-top: 5%;">
                <el-checkbox v-model="userChecked" class="checked" style="float: left;"><span style="color: #A9A9A9">自动登录</span>
                </el-checkbox>
                <el-link href="" type="info" class="forgetPw" style="float: right;">忘记密码</el-link>
              </el-form-item>
            </el-tab-pane>

          </el-tabs>

        </el-form>

      </div>

    </div>
    <div class="bottomPage" style="position:absolute; bottom: 0%; right: 42%; color: #2f4f4f; font-size: 15px;">
      <p>
        Copyright©2019北京淇朗科技有限公司
      </p>
    </div>
  </div>

</template>

<script>
  export default {
    name: "login",

    data() {
      return {
        activeName: 'first',
        loginForm: {
          userId: '',
          userPassword: '',
          unifiedId: '',
          unifiedPassword: ''
        },
        userChecked: true,
        unifiedChecked: true
      }
    },
    methods: {
      login() {
        this.$http({
          url: "/api/users",
          "content-type": "application/json",
          method: 'post',
          data: this.loginForm
        }).then(res=>{
          console.log(res)
          if(res.data.code==1){
            this.$router.push({path:"/index"})
          }else{
            alert(res.data.msg)
          }
        })
      }
    }

  }
</script>

<style scoped>
  .centerPage {
    background: url("../images/background01.jpg") no-repeat center;
    background-size: cover;
    z-index: 3;
    width: 60%;
    position: absolute;
    height: 60%;
    left: 20%;
    top: 20%;
    border: solid 1px white;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.9)
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
    font-size: 40px;
    margin-left: 5%;
  }

  .top_p {
    color: #ccc;
    font-size: 15px;
    margin-left: 11%;
  }
</style>

<style>

</style>
