<template>
  <div>
    <el-form
      ref="updateSamplePointForm"
      :model="updateSamplePointForm"
      style="margin:10px;width:auto; "
    >
      <el-form-item prop='sampleName' label="样品名称:" label-width="100px"
      >
        <el-input v-model="updateSamplePointForm.sampleName" style="width: 100%"></el-input>
      </el-form-item>

      <el-form-item prop='sourceName' label="检测源:" label-width="100px"
      >
        <el-input v-model="updateSamplePointForm.sourceName" style="width: 100%"></el-input>
      </el-form-item>

      <el-form-item class="text_right">
        <el-button type="primary" @click='_closeSamplePoint()'>取 消</el-button>
        <el-button type="primary" @click='_updateSamplePoint()'>保 存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
  export default {
    name: "preUpdateInputNorm",
    data() {
      return {
        idFlag: false,
        updateSamplePointForm: {
          id : '',
          sampleName: '',
          sourceName: '',
          status: ''
        },
      }
    },
    methods:{
      _updateSamplePoint(){
        this.$http({
          url: '/api/api/samplePoint/updateSamplePoint',
          "content-type": "application/json",
          method: 'put',
          data : {
            id : this.updateSamplePointForm.id,
            sampleName : this.updateSamplePointForm.sampleName,
            sourceName : this.updateSamplePointForm.sourceName,
            status : this.updateSamplePointForm.status
          }
        }).then(res => {
          if (res.data.status == 1) {
            this.$message({message: '操作成功', type: 'success'});
            this.$emit('updateSamplePointListeners');
            this._closeSamplePoint();

          } else {
            this.$message({message: '系统异常,请联系管理员', type: 'error'});
          }
        })
      },
      _closeSamplePoint(){
        this.$emit('closeUpdateSamplePointDialog');
      }
    }
  }
</script>

<style scoped>
  .text_right{
    text-align: right;
  }

</style>
