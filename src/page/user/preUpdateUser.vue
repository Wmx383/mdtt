<template>
  <div>
    <div>
      <el-form
        ref="updateUserForm"
        :model="updateUserForm"
        style="margin:10px;width:auto;height:330px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item prop='name' label="昵称:" label-width="15.5%"
                          :rules="[{ required: true, message: '昵称不能为空' ,trigger: 'blur' }]">
              <el-input v-model="updateUserForm.name" style="width: 95.5%" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item prop='userName' label="用户名:"
                          :rules="[{ required: true, message: '用户名不能为空' ,trigger: 'blur' }]">
              <el-input v-model="updateUserForm.userName" style="width: 81%" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item prop='password' label="密码:" label-width="15%"
                          :rules="[{ required: true, message: '密码不能为空' ,trigger: 'blur' }]">
              <el-input v-model="updateUserForm.password" clearable show-password  style="width: 95.5%" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item prop='idCard' label="编号:" label-width="15%"
                          :rules="[{ required: true, message: '编号不能为空' ,trigger: 'blur' }]">
              <el-input v-model="updateUserForm.idCard" style="width: 95.5%" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item prop='phone' label="电话:" label-width="15%">
              <el-input v-model="updateUserForm.phone" style="width: 95.5%" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item prop='mail' label="邮箱:" label-width="15%">
              <el-input v-model="updateUserForm.mail" style="width: 95.5%" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label-width="67%">
          <el-button type="primary" size="small" @click='_updateUser("updateUserForm")'>保 存</el-button>
          <el-button size="small" @click="_close()">关闭</el-button>
        </el-form-item>

      </el-form>

    </div>
  </div>
</template>

<script>
    export default {
        name: "preUpdateUser",
      data(){
          return{
            updateUserForm:{
              id: '',
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
      methods:{
        //点击保存按钮
        _updateUser(updateUserForm){
          this.$refs[updateUserForm].validate((valid) => {
            if (valid) {//表单数据验证完成之后，提交数据;
              let formData = this[updateUserForm];

              this.$http({
                url: '/api/api/user/updateUser',
                "content-type": "application/json",
                method: 'put',
                data: {
                  id: this.updateUserForm.id,
                  idCard: formData.idCard,
                  mail: formData.mail,
                  name: formData.name,
                  orgId: '',
                  password: formData.password,
                  phone: formData.phone,
                  status: '1',
                  userName: formData.userName
                }
                /*headers: {Authorization: token},*/
              }).then(res => {
                if(res.data.status == '1'){
                  this.$message({message: '操作成功', type: 'success'});
                  let returnValue = res.data.result;
                  this.$emit('updateUserListeners', returnValue)
                }else{
                  this.$message({message: '系统异常,请联系管理员', type: 'error'});
                }
              })

            }
          })
        },
      }
    }
</script>

<style scoped>

</style>
