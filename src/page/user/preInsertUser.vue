<template>
  <div>
    <div>
      <el-form
        ref="insertUserForm"
        :model="insertUserForm"
        style="margin:10px;width:auto;height:330px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item prop='name' label="昵称:" label-width="15.5%"
                          :rules="[{ required: true, message: '昵称不能为空' ,trigger: 'blur' }]">
              <el-input v-model="insertUserForm.name" style="width: 95.5%" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item prop='userName' label="用户名:"
                          :rules="[{ required: true, message: '用户名不能为空' ,trigger: 'blur' }]">
              <el-input v-model="insertUserForm.userName" style="width: 81%" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item prop='password' label="密码:" label-width="15%"
                          :rules="[{ required: true, message: '密码不能为空' ,trigger: 'blur' }]">
              <el-input v-model="insertUserForm.password" clearable show-password  style="width: 95.5%" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item prop='idCard' label="编号:" label-width="15%"
                          :rules="[{ required: true, message: '编号不能为空' ,trigger: 'blur' }]">
              <el-input v-model="insertUserForm.idCard" style="width: 95.5%" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item prop='phone' label="电话:" label-width="15%">
              <el-input v-model="insertUserForm.phone" style="width: 95.5%" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item prop='mail' label="邮箱:" label-width="15%">
              <el-input v-model="insertUserForm.mail" style="width: 95.5%" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label-width="67%">
          <el-button type="primary" size="small" @click='_insertUser("insertUserForm")'>保 存</el-button>
          <el-button size="small" @click="_close()">关闭</el-button>
        </el-form-item>

      </el-form>

    </div>
  </div>
</template>

<script>
    export default {
      name: "preInsertUser",
      data(){
        return{
          insertUserForm:{
            name: '',
            userName: '',
            password: '',
            idCard: '',
            phone: '',
            mail: '',
            org_id:''
          },
        }
      },
      methods: {
        setInsertUserForm(){
          this.insertUserForm.name = '';
          this.insertUserForm.userName = '';
          this.insertUserForm.password = '';
          this.insertUserForm.idCard = '';
          this.insertUserForm.phone = '';
          this.insertUserForm.mail = '';
        },
        //点击保存按钮
        _insertUser(insertUserForm){
          this.$refs[insertUserForm].validate((valid) => {
            if (valid) {//表单数据验证完成之后，提交数据;
              let formData = this[insertUserForm];

              this.$http({
                url: '/api/api/user/createUser',
                "content-type": "application/json",
                method: 'post',
                data: {
                  idCard: formData.idCard,
                  mail: formData.mail,
                  name: formData.name,
                  orgId: this.insertUserForm.org_id,
                  password: formData.password,
                  phone: formData.phone,
                  status: '1',
                  userName: formData.userName
                }
                /*headers: {Authorization: token},*/
              }).then(res => {
                if(res.data.status == '1'){
                  this.$message({message: '操作成功', type: 'success'});
                  this.setInsertUserForm();
                  let returnValue = res.data.result;
                  this.$emit('insertUserListeners', returnValue)
                }else{
                  this.$message({message: '系统异常,请联系管理员', type: 'error'});
                }
              })

            }
          })
        },
        //点击取消
        _close(){

        },
      }
    }
</script>

<style scoped>

</style>
