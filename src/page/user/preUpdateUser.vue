<template>
  <div>
    <div>
      <el-form
        ref="updateUserForm"
        :model="updateUserForm"
        style="margin:10px;width:auto;"
      >
        <el-form-item
          prop='name'
          label="昵称:"
          label-width="15.5%"
          style="margin-bottom: 30px"
          :rules="[{ required: true, message: '昵称不能为空' ,trigger: 'blur' }]">
          <el-input v-model="updateUserForm.name" style="width: 95.5%" ></el-input>
        </el-form-item>

        <el-form-item
          prop='userName'
          label="用户名:"
          style="margin-bottom: 30px"
          :rules="[{ required: true, message: '用户名不能为空' ,trigger: 'blur' }]">
          <el-input v-model="updateUserForm.userName" style="width: 81%" ></el-input>
        </el-form-item>

        <el-form-item
          prop='password'
          label="密码:"
          label-width="15%"
          style="margin-bottom: 30px"
          :rules="[{ required: true, message: '密码不能为空' ,trigger: 'blur' }]">
          <el-input v-model="updateUserForm.password" clearable show-password  style="width: 95.5%" ></el-input>
        </el-form-item>

        <el-form-item
          prop='idCard'
          label="编号:"
          label-width="15%"
          style="margin-bottom: 30px"
          :rules="[{ required: true, message: '编号不能为空' ,trigger: 'blur' }]">
          <el-input v-model="updateUserForm.idCard" style="width: 95.5%" ></el-input>
        </el-form-item>

        <el-form-item
          prop='phone'
          label="电话:"
          style="margin-bottom: 30px"
          label-width="15%">
          <el-input v-model="updateUserForm.phone" style="width: 95.5%" ></el-input>
        </el-form-item>

        <el-form-item
          prop='email'
          label="邮箱:"
          style="margin-bottom: 30px"
          label-width="15%"
          :rules="[{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]">
          <el-input v-model="updateUserForm.email" style="width: 95.5%" ></el-input>
        </el-form-item>

        <el-form-item label-width="67%">
          <el-button type="primary" size="small" @click='_updateUser("updateUserForm")'>保 存</el-button>
          <el-button size="small" @click="_closeUpdateUser()">关闭</el-button>
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
              email: '',
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
              let phone = '';
              let mail = '';
              if(formData.phone == null){
                phone = ''
              }else{
                phone = formData.phone;
              }
              if(formData.email == null){
                mail = '';
              }else{
                mail = formData.email;
              }

              this.$http({
                url: '/api/api/user/updateUser',
                "content-type": "application/json",
                method: 'put',
                data: {
                  id: this.updateUserForm.id,
                  idCard: formData.idCard,
                  mail: mail,
                  name: formData.name,
                  orgId: '',
                  password: formData.password,
                  phone: phone,
                  status: '1',
                  userName: formData.userName
                }
              }).then(res => {
                if(res.data.status == '1'){
                  this.$message({message: '操作成功', type: 'success'});
                  this.$emit('updateUserListeners')
                }else{
                  this.$message({message: '系统异常,请联系管理员', type: 'error'});
                }
              })

            }
          })
        },
        //点击关闭按钮
        _closeUpdateUser(){
          this.$emit('_closeUpdateUserDialog')
        }
      }
    }
</script>

<style scoped>

</style>
