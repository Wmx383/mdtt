<template>
  <div>
    <div>
      <el-form
        ref="updateRoleForm"
        :model="updateRoleForm"
        style="margin:10px;width:auto;"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item prop='roleName' label="角色名称:"
                          :rules="[{ required: true, message: '角色名称不能为空' ,trigger: 'blur' }]">
              <el-input v-model="updateRoleForm.roleName" style="width: 81%" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="el_row_releCode">
          <el-col :span="24">
            <el-form-item prop='roleCode' label="角色昵称:"
                          :rules="[{ required: true, message: '角色昵称不能为空' ,trigger: 'blur' }]">
              <el-input v-model="updateRoleForm.roleCode" style="width: 81%" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label-width="67%">
          <el-button type="primary" size="small" @click='_updateRole("updateRoleForm")'>保 存</el-button>
          <el-button size="small" @click="_close()">取消</el-button>
        </el-form-item>

      </el-form>

    </div>
  </div>
</template>

<script>
    export default {
        name: "preUpdateRole",
      data(){
          return{
            updateRoleForm:{
              id: '',
              roleCode: '',
              roleName: '',
              orgId: '',
              status: '',
              org_id:''
            },
          }
      },
      methods:{
        //点击保存按钮
        _updateRole(updateRoleForm){
          this.$refs[updateRoleForm].validate((valid) => {
            if (valid) {//表单数据验证完成之后，提交数据;
              let formData = this[updateRoleForm];

              this.$http({
                url: '/api/api/role/updateRole',
                "content-type": "application/json",
                method: 'put',
                data: {
                  id: this.updateRoleForm.id,
                  orgId: this.updateRoleForm.orgId,
                  roleCode: formData.roleCode,
                  roleName: formData.roleName,
                  status: '1',
                }
                /*headers: {Authorization: token},*/
              }).then(res => {
                if(res.data.status == '1'){
                  this.$message({message: '操作成功', type: 'success'});
                  let returnValue = res.data.result;
                  this.$emit('updateRoleListeners', returnValue);
                  this._close();
                }else{
                  this.$message({message: '系统异常,请联系管理员', type: 'error'});
                }
              })
            }
          })
        },
        // 点击关闭按钮
        _close(){
          this.$emit('updateRoleListeners');
        }
      }
    }
</script>

<style scoped>
 .el_row_releCode{
   margin-top: 20px;
 }
</style>
