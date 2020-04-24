<template>
  <div>
    <div>
      <el-form
        ref="updateOrgForm"
        :model="updateOrgForm"
        style="margin:10px;width:auto;"
      >
        <el-form-item
          prop='ogId'
          label="组织机构ID:"
          label-width="25%"
          style="margin-bottom: 30px"
          :rules="[{ required: true, message: '组织机构ID不能为空' ,trigger: 'blur' }]">
          <el-input v-model="updateOrgForm.ogId" style="width: 93%" ></el-input>
        </el-form-item>

        <el-form-item
          prop='ogName'
          label="组织机构名称:"
          style="margin-bottom: 30px"
          :rules="[{ required: true, message: '组织机构名称不能为空' ,trigger: 'blur' }]">
          <el-input v-model="updateOrgForm.ogName" style="width: 70%" ></el-input>
        </el-form-item>

        <el-form-item label-width="67%">
          <el-button type="primary" size="small" @click='_updateOrg("updateOrgForm")'>保 存</el-button>
          <el-button size="small" @click="_closeUpdateOrg()">关闭</el-button>
        </el-form-item>

      </el-form>

    </div>
  </div>
</template>

<script>
    export default {
        name: "preUpdateOrg",
      data(){
        return{
          updateOrgForm:{
            ogId: '',
            id: '',
            ogName: '',
            parentId: '',
            level: '',
          },
        }
      },
      methods: {
        //点击保存按钮
        _updateOrg(updateOrgForm){
          this.$refs[updateOrgForm].validate((valid) => {
            if (valid) {//表单数据验证完成之后，提交数据;
              let formData = this[updateOrgForm];
              let ogId = '';
              let ogName = '';
              if(formData.ogId == null){
                ogId = ''
              }else{
                ogId = formData.ogId;
              }
              if(formData.ogName == null){
                ogName = '';
              }else{
                ogName = formData.ogName;
              }

              this.$http({
                url: '/api/api/organization/updateOrganization',
                "content-type": "application/json",
                method: 'put',
                data: {
                  id: this.updateOrgForm.id,
                  ogName: ogName,
                  parentId: this.updateOrgForm.parentId,
                  ogId: ogId,
                  status: 1,
                  level: this.updateOrgForm.level
                }
              }).then(res => {
                if(res.data.status == '1'){
                  this.$message({message: '操作成功', type: 'success'});
                  let returnValue = this.updateOrgForm.parentId;
                  this.$emit('updateOrgListeners', returnValue)
                }else{
                  this.$message({message: '系统异常,请联系管理员', type: 'error'});
                }
              })

            }
          })
        },
        //点击关闭按钮
        _closeUpdateOrg(){
          this.$emit('_closeUpdateOrgDialog')
        }
      }
    }
</script>

<style scoped>

</style>
