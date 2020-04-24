<template>
  <div>
    <div>
      <el-form
        ref="insertRootOrgForm"
        :model="insertRootOrgForm"
        style="margin:10px;width:auto;"
      >
        <el-form-item
          prop='ogId'
          label="组织机构ID:"
          label-width="25%"
          style="margin-bottom: 30px"
          :rules="[{ required: true, message: '组织机构ID不能为空' ,trigger: 'blur' }]">
          <el-input v-model="insertRootOrgForm.ogId" style="width: 93%" ></el-input>
        </el-form-item>

        <el-form-item
          prop='ogName'
          label="组织机构名称:"
          style="margin-bottom: 30px"
          :rules="[{ required: true, message: '组织机构名称不能为空' ,trigger: 'blur' }]">
          <el-input v-model="insertRootOrgForm.ogName" style="width: 70%" ></el-input>
        </el-form-item>

        <el-form-item label-width="67%">
          <el-button type="primary" size="small" @click='_insertRootOrg("insertRootOrgForm")'>保 存</el-button>
          <el-button size="small" @click="_closeInsertRootOrg()">关闭</el-button>
        </el-form-item>

      </el-form>

    </div>
  </div>
</template>

<script>
    export default {
        name: "preInsertRootOrg",
      data(){
          return{
            insertRootOrgForm: {
              ogId: '',
              ogName: ''
            }
          }
      },
      methods: {
        setInsertRootOrgForm(){
          this.insertRootOrgForm.ogId = '';
          this.insertRootOrgForm.ogName = '';
        },
        //点击保存按钮
        _insertRootOrg(insertRootOrgForm){
          this.$refs[insertRootOrgForm].validate((valid) => {
            if (valid) {//表单数据验证完成之后，提交数据;
              let formData = this[insertRootOrgForm];
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
                  parentId: -1,
                  ogId: ogId,
                  status: 1,
                  level: 1,
                }
              }).then(res => {
                if(res.data.status == '1'){
                  this.$message({message: '操作成功', type: 'success'});
                  this.$emit('insertRootOrgListeners')
                }else{
                  this.$message({message: '系统异常,请联系管理员', type: 'error'});
                }
              })

            }
          })
        },
        //点击关闭按钮
        _closeInsertRootOrg(){
          this.$emit('_closeInsertRootOrgDialog')
        }
      }
    }
</script>

<style scoped>

</style>
