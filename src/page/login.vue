<template>
  <div class="bigDiv">
    <div class="page">
      <h1 class="h1">
        北京淇朗工业大数据系统
      </h1>
      <p class="top_p">
        全球领先的工业大数据展示平台
      </p>
      <div class="form">
        <el-form
          ref="loginForm"
          :model="loginForm"
        >

          <el-tabs v-model="activeName" stretch="stretch">

              <el-tab-pane label="账户密码登录" name="first">
                  <el-form-item prop='userId' :rules="[{ required: true, message: '用户名不能为空' ,trigger: 'blur' }]">
                      <el-input
                          placeholder="用户名："
                          v-model="loginForm.userId"
                          clearable
                          prefix-icon="el-icon-user">
                      </el-input>
                  </el-form-item>
                  <el-form-item prop='userPassword' :rules="[{ required: true, message: '密码不能为空' ,trigger: 'blur' }]">
                      <el-input
                          placeholder="密码："
                          v-model="loginForm.userPassword"
                          clearable
                          show-password
                          prefix-icon="el-icon-user">
                      </el-input>
                  </el-form-item>
                  <el-form-item>
                      <el-checkbox v-model="userChecked" class="checked">自动登录</el-checkbox>
                      <el-link href="" type="primary" class="forgetPw">忘记密码</el-link>
                  </el-form-item>
                  <el-form-item>
                      <el-button type="primary" class="loginBtn">登录</el-button>
                  </el-form-item>
              </el-tab-pane>

              <el-tab-pane label="统一认证登录" name="second">
                  <el-form-item prop='unifiedId' :rules="[{ required: true, message: '统一认证账号不能为空' ,trigger: 'blur' }]">
                      <el-input
                          placeholder="统一认证账号："
                          v-model="loginForm.unifiedId"
                          clearable
                          prefix-icon="el-icon-user">
                      </el-input>
                  </el-form-item>
                  <el-form-item prop='unifiedPassword' :rules="[{ required: true, message: '密码不能为空' ,trigger: 'blur' }]">
                      <el-input
                          placeholder="密码："
                          v-model="loginForm.unifiedPassword"
                          clearable
                          show-password
                          prefix-icon="el-icon-user">
                      </el-input>
                  </el-form-item>
                  <el-form-item>
                      <el-checkbox v-model="unifiedChecked" class="checked">自动登录</el-checkbox>
                      <el-link href="" type="primary" class="forgetPw">忘记密码</el-link>
                  </el-form-item>
                  <el-form-item>
                      <el-button type="primary" class="loginBtn">登录</el-button>
                  </el-form-item>
              </el-tab-pane>

          </el-tabs>

        </el-form>
      </div>
      <p class="bottom_p">
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
        loginForm:{
          userId: '',
          userPassword: '',
          unifiedId: '',
          unifiedPassword: ''
        },
        userChecked: true,
        unifiedChecked: true
      }
    }

  }
</script>

<style scoped>
  .bigDiv{
    width: 99%;
    position: absolute;
    background: url('https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg') no-repeat center;
    background-size:cover;
    height: 99%;
    z-index: 3;
  }
  .page{
    margin-top: 5%;
  }
  .h1{
    text-align: center;
  }
  .top_p{
    text-align: center;
    color: #ccc;
    font-size: 15px;
  }
  .form{
    width: 20%;
    position: absolute;
    left: 40%;
    margin-top: 2%;
  }
  .checked{
    float: left;
  }
  .forgetPw{
    float: right;
  }
  .loginBtn{
    width: 100%;
  }
  .bottom_p{
    position: absolute;
    bottom: 0%;
    right: 42%;
    color: #ccc;
    font-size: 15px;
  }
</style>
