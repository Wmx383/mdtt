<template>
  <div class="bigDiv" id="particles-js">

    <div class="topPage">
      <h1 class="h1">
        D.Perspclre
      </h1>
      <h2 class="top_p">
        <!--全球领先的工业大数据展示平台-->
      </h2>
    </div>

    <div class="centerPage">

      <div class="form">

        <el-tabs v-model="activeName" stretch="stretch" style="margin-top: 5%">

          <el-tab-pane label="账户密码登录" name="first">

            <el-form
              ref="loginUserForm"
              :model="loginUserForm"
              class="login_form"
            >

              <el-form-item class="form-top">
                <span class="form-top-span">账户密码登录</span>
              </el-form-item>
              <el-form-item prop='userName' :rules="[{ required: true, message: '用户名不能为空' ,trigger: 'blur' }]"
                            class="form-id">
                <el-input
                  placeholder="用户名："
                  v-model="loginUserForm.userName"
                  clearable
                  prefix-icon="el-icon-user">
                </el-input>
              </el-form-item>
              <el-form-item prop='password' :rules="[{ required: true, message: '密码不能为空' ,trigger: 'blur' }]"
                            class="form-psd">
                <el-input
                  placeholder="密码："
                  v-model="loginUserForm.password"
                  clearable
                  show-password
                  prefix-icon="el-icon-unlock">
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" class="loginBtn" @click="login('loginUserForm')">
                  登录
                </el-button>
              </el-form-item>
              <el-form-item class="form-checked">
                <el-checkbox v-model="userChecked" class="checked" style="float: left; "><span style="color: #A9A9A9">自动登录</span>
                </el-checkbox>
                <el-link href="" type="info" class="forgetPw" style="float: right;">忘记密码</el-link>
              </el-form-item>

            </el-form>

          </el-tab-pane>

          <el-tab-pane label="统一认证登录" name="second">

            <el-form
              ref="loginUnifiedForm"
              :model="loginUnifiedForm"
              class="login_form"
            >

              <el-form-item class="form-top">
                <span class="form-top-span">统一认证账号密码登录</span>
              </el-form-item>
              <el-form-item prop='unifiedId' :rules="[{ required: true, message: '统一认证账号不能为空' ,trigger: 'blur' }]"
                            class="form-id">
                <el-input
                  placeholder="统一认证账号："
                  v-model="loginUnifiedForm.unifiedId"
                  clearable
                  prefix-icon="el-icon-user">
                </el-input>
              </el-form-item>
              <el-form-item prop='unifiedPassword' :rules="[{ required: true, message: '密码不能为空' ,trigger: 'blur' }]"
                            class="form-psd">
                <el-input
                  placeholder="密码："
                  v-model="loginUnifiedForm.unifiedPassword"
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
                <el-checkbox v-model="unifiedChecked" class="checked" style="float: left;"><span style="color: #A9A9A9">自动登录</span>
                </el-checkbox>
                <el-link href="" type="info" class="forgetPw" style="float: right;">忘记密码</el-link>
              </el-form-item>

            </el-form>

          </el-tab-pane>

        </el-tabs>

      </div>

    </div>
    <div>
      <p class="bottomPage">
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
        loginUserForm: {
          userName: '',
          password: '',
          loginType : '1'
        },
        loginUnifiedForm:{
          unifiedId: '',
          unifiedPassword: '',
          loginType : '2'
        },
        userChecked: true,
        unifiedChecked: true,
        isRouterAlive: true
      }
    },
    mounted(){
      this.keyupEnter();
    },
    methods: {
      keyupEnter(){
        document.onkeydown = e =>{
          let body = document.getElementsByTagName('body')[0]
          if (e.keyCode === 13) {
            this.login();
          }
        }
      },
      login(loginUserForm) {
        this.$refs[loginUserForm].validate((valid) => {
          if(valid){
            this.$http({
              url: "/api/api/login",
              "content-type": "application/json",
              method: 'post',
              data: this.loginUserForm
            }).then(res => {
              if (res.data.status == 1) {
                console.log(res.data.result.token);

                let content = JSON.stringify(res.data.result.token);
                window.localStorage.setItem('Token', content);

                this.$router.push({path: "/exception/manageException"});
              } else {
                alert(res.data.msg);
                this.reload()
              }
            })

          }
        });
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
    background: url("../images/loginForm.png") no-repeat center;
    background-size: cover;
    width: 60%;
    height: 60%;
    border: solid 0px white;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.9);
    min-width: 800px;
    min-height: 400px;
    margin: 0 auto;
  }

  .bigDiv {
    width: 99%;
    position: absolute;
    background: url("../images/loginBackground.png") no-repeat center;
    background-size: cover;
    height: 99%;
    z-index: 3;
  }

  .h1 {
    color: #FF6600;
    font-size: 52px;
    font-family: 华文隶书;
  ;
    font-weight: bolder;
  }

  .top_p {
    color: #a679b9;
    font-size: 12px;
    margin-top: -1%;
    margin-left: 2%;
  }

  .topPage {
    margin-left: 2%;
    margin-bottom: 3%;
  }

  .form {
    background-color: white;
    width: 44%;
    height: 100%;
    float: right;
  }

  .login_form {
    width: 100%;
    height: 100%;
  }

  .form-top-span {
    font-size: 25px;
    color: #696969;
  }

  .form-top {
    text-align: center;
    margin-top: 5%;
  }

  .form-id {
    width: 80%;
    margin-left: 10%;
    text-align: center;
    margin-top: 5%;
  }

  .form-psd {
    width: 80%;
    margin-left: 10%;
    text-align: center;
    margin-top: 7%;
  }

  .loginBtn {
    width: 80%;
    margin-left: 10%;
    text-align: center;
    margin-top: 4%;
    background-color: #ff6600;
    border: white
  }

  .form-checked {
    width: 80%;
    margin-left: 10%;
    text-align: center;
    margin-top: 5%;
  }

  .bottomPage {
    color: #2f4f4f;
    font-size: 15px;
    text-align: center;
    margin-top: 9.5%;
  }
</style>

<style scoped>
  /deep/ .el-tabs__item.is-active {
    color: #FF6600;
  }

  /deep/ .el-tabs__item:hover {
    color: #FF6600;
  }

  /deep/ .el-checkbox__inner {
    background-color: #ff6600;
    border-color: #ff6600;
  }

  /deep/ .el-tabs__active-bar {
    background-color: #ff6600;
  }

  /deep/ .el-checkbox__input.is-focus .el-checkbox__inner {
    border-color: #ff6600;
    background-color: white;
  }

  /deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
    border-color: #ff6600;
    background-color: #ff6600;
  }
</style>
