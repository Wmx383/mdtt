<template>
  <div>
    <div>
      <el-form
        ref="insertUserForm"
        :model="insertUserForm"
        style="margin:10px;width:auto;"
      >
        <el-form-item
          prop='name'
          label="昵称:"
          label-width="15.5%"
          style="margin-bottom: 30px"
          :rules="[{ required: true, message: '昵称不能为空' ,trigger: 'blur' }]">
          <el-input v-model="insertUserForm.name" style="width: 95.5%" ></el-input>
        </el-form-item>

        <el-form-item
          prop='userName'
          label="用户名:"
          style="margin-bottom: 30px"
          :rules="[{ required: true, message: '用户名不能为空' ,trigger: 'blur' }]">
          <el-input v-model="insertUserForm.userName" style="width: 81%" ></el-input>
        </el-form-item>

        <el-form-item
          prop='password'
          label="密码:"
          label-width="15%"
          style="margin-bottom: 30px"
          :rules="[{ required: true, message: '密码不能为空' ,trigger: 'blur' }]">
          <el-input v-model="insertUserForm.password" clearable show-password  style="width: 95.5%" ></el-input>
        </el-form-item>

        <el-form-item
          prop='idCard'
          label="编号:"
          label-width="15%"
          style="margin-bottom: 30px"
          :rules="[{ required: true, message: '编号不能为空' ,trigger: 'blur' }]">
          <el-input v-model="insertUserForm.idCard" style="width: 95.5%" ></el-input>
        </el-form-item>

        <el-form-item
          prop='phone'
          label="电话:"
          style="margin-bottom: 30px"
          label-width="15%">
          <el-input v-model="insertUserForm.phone" style="width: 95.5%" ></el-input>
        </el-form-item>

        <el-form-item
          prop='email'
          label="邮箱:"
          style="margin-bottom: 30px"
          label-width="15%"
          :rules="[{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]">
          <el-input v-model="insertUserForm.email" style="width: 95.5%" ></el-input>
        </el-form-item>

        <el-form-item label-width="67%">
          <el-button type="primary" size="small" @click='_insertUser("insertUserForm")'>保 存</el-button>
          <el-button size="small" @click="_closeInsertUser()">关闭</el-button>
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
            email: '',
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
          this.insertUserForm.email = '';
        },
        //点击保存按钮
        _insertUser(insertUserForm){
          this.$refs[insertUserForm].validate((valid) => {
            if (valid) {//表单数据验证完成之后，提交数据;
              let formData = this[insertUserForm];
              let phone = '';
              let mail = '';
              if(formData.phone.length == 0 || formData.phone == null){
                phone = ''
              }else{
                phone = formData.phone;
              }
              if(formData.email.length == 0 || formData.phone == null){
                mail = '';
              }else{
                mail = formData.email;
              }

              this.$http({
                url: '/api/api/user/createUser',
                "content-type": "application/json",
                method: 'post',
                data: {
                  idCard: formData.idCard,
                  mail: mail,
                  name: formData.name,
                  orgId: this.insertUserForm.org_id,
                  password: formData.password,
                  phone: phone,
                  status: '1',
                  userName: formData.userName
                }
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
        _closeInsertUser(){
          this.$emit('_closeInsertUserDialog')
          this.$emit('closeUpdateModelGroupDialog');
        },
      }
    }
</script>

<style scoped>

</style>
