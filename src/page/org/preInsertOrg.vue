<template>
  <div>
    <div>
      <el-form
        ref="insertOrgForm"
        :model="insertOrgForm"
        style="margin:10px;width:auto;"
      >
        <el-form-item
          prop='ogId'
          label="组织机构ID:"
          label-width="25%"
          style="margin-bottom: 30px"
          :rules="[{ required: true, message: '组织机构ID不能为空' ,trigger: 'blur' }]">
          <el-input v-model="insertOrgForm.ogId" style="width: 93%" ></el-input>
        </el-form-item>

        <el-form-item
          prop='ogName'
          label="组织机构名称:"
          style="margin-bottom: 30px"
          :rules="[{ required: true, message: '组织机构名称不能为空' ,trigger: 'blur' }]">
          <el-input v-model="insertOrgForm.ogName" style="width: 70%" ></el-input>
        </el-form-item>

        <el-form-item label-width="67%">
          <el-button type="primary" size="small" @click='_insertOrg("insertOrgForm")'>保 存</el-button>
          <el-button size="small" @click="_closeInsertOrg()">关闭</el-button>
        </el-form-item>

      </el-form>

    </div>
  </div>
</template>

<script>
    export default {
        name: "preInsertOrg",
      data(){
          return{
            insertOrgForm: {
              ogId: '',
              ogName: '',
              parentId: '',
              level: ''
            }
          }
      },
      methods: {
        setInsertOrgForm(){
          this.insertOrgForm.ogId = '';
          this.insertOrgForm.ogName = '';
        },
        //点击保存按钮
        _insertOrg(insertOrgForm){
          this.$refs[insertOrgForm].validate((valid) => {
            if (valid) {//表单数据验证完成之后，提交数据;
              let formData = this[insertOrgForm];
              let ogId = '';
              let ogName = '';
              if(formData.ogId.length == 0 || formData.ogId == null){
                ogId = ''
              }else{
                ogId = formData.ogId;
              }
              if(formData.ogName.length == 0 || formData.ogName == null){
                ogName = '';
              }else{
                ogName = formData.ogName;
              }

              this.$http({
                url: '/api/api/organization/createOrganization',
                "content-type": "application/json",
                method: 'post',
                data: {
                  ogName: ogName,
                  parentId: this.insertOrgForm.parentId,
                  ogId: ogId,
                  status: 1,
                  level: this.insertOrgForm.level + 1,
                }
              }).then(res => {
                if(res.data.status == '1'){
                  this.$message({message: '操作成功', type: 'success'});
                  let returnValue = this.insertOrgForm.parentId;
                  this.$emit('insertOrgListeners', returnValue)
                }else{
                  this.$message({message: '系统异常,请联系管理员', type: 'error'});
                }
              })

            }
          })
        },
        //点击关闭按钮
        _closeInsertOrg(){
          this.$emit('_closeInsertOrgDialog')
        }
      }
    }
</script>

<style scoped>

</style>
