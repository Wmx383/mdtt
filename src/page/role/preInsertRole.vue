<template>
  <div>
    <div>
      <el-form
        ref="insertRoleForm"
        :model="insertRoleForm"
        style="margin:10px;width:auto;"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item prop='roleName' label="角色名称:"
                          :rules="[{ required: true, message: '昵称不能为空' ,trigger: 'blur' }]">
              <el-input v-model="insertRoleForm.roleName" style="width: 81%" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="el_row_roleCode">
          <el-col :span="24">
            <el-form-item prop='roleCode' label="角色昵称:"
                          :rules="[{ required: true, message: '用户名不能为空' ,trigger: 'blur' }]">
              <el-input v-model="insertRoleForm.roleCode" style="width: 81%" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label-width="67%">
          <el-button type="primary" size="small" @click='_insertRole("insertRoleForm")'>保 存</el-button>
          <el-button size="small" @click="_close()">取消</el-button>
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
          insertRoleForm:{
            roleName: '',
            roleCode: '',
            status: '',
            org_id:''
          },
        }
      },
      methods: {
        setInsertRoleForm(){
          this.insertRoleForm.roleName = '';
          this.insertRoleForm.roleCode = '';
          this.insertRoleForm.status = '';
        },
        //点击保存按钮
        _insertRole(insertRoleForm){
          this.$refs[insertRoleForm].validate((valid) => {
            if (valid) {//表单数据验证完成之后，提交数据;
              let formData = this[insertRoleForm];

              this.$http({
                url: '/api/api/role/createRole',
                "content-type": "application/json",
                method: 'post',
                data: {
                  roleCode: formData.roleCode,
                  roleName: formData.roleName,
                  orgId: this.insertRoleForm.org_id,
                  status: '1',
                }
                /*headers: {Authorization: token},*/
              }).then(res => {
                if(res.data.status == '1'){
                  this.$message({message: '操作成功', type: 'success'});
                  this.setInsertRoleForm();
                  let returnValue = res.data.result;
                  this.$emit('insertRoleListeners', returnValue);
                  this._close();
                }else{
                  this.$message({message: '系统异常,请联系管理员', type: 'error'});
                }
              })

            }
          })
        },
        //点击取消
        _close(){
          this.$emit('insertRoleListeners');
          this.$emit('closeUpdateModelGroupDialog');
        },
      }
    }
</script>

<style scoped>
  .el_row_roleCode{
    margin-top: 20px;
  }
</style>
