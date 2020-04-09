<template>
  <div>
    <el-form
      ref="insertSamplePointForm"
      :model="insertSamplePointForm"
      style="margin:10px;width:auto; "
    >
      <el-form-item prop='sampleName' label="样品名称:" label-width="100px"
      >
        <el-input v-model="insertSamplePointForm.sampleName" style="width: 100%"></el-input>
      </el-form-item>

      <el-form-item prop='sourceName' label="检测源:" label-width="100px"
      >
        <el-input v-model="insertSamplePointForm.sourceName" style="width: 100%"></el-input>
      </el-form-item>

      <el-form-item class="text_right">
        <el-button type="primary" @click='_closeSamplePoint()'>取 消</el-button>
        <el-button type="primary" @click='_insertSamplePoint()'>保 存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
  export default {
    name: "preInsertSamplePoint",
    data() {
      return {
        idFlag: false,
        insertSamplePointForm: {
          sampleName: '',
          sourceName: '',
          status: '1'
        },
      }
    },
    methods:{
      _insertSamplePoint(){
        this.$http({
          url: '/api/api/samplePoint/createSamplePoint',
          "content-type": "application/json",
          method: 'post',
          data : {
            sampleName : this.insertSamplePointForm.sampleName,
            sourceName : this.insertSamplePointForm.sourceName,
            status : this.insertSamplePointForm.status
          }
        }).then(res => {
          if (res.data.status == 1) {
            this.$message({message: '操作成功', type: 'success'});
            this.$emit('insertSamplePointListeners');
            this._closeSamplePoint();

          } else {
            this.$message({message: res.data.msg, type: 'error'});
          }
        })
      },
      _closeSamplePoint(){
        this.$emit('closeInsertSamplePointDialog');
      }
    }
  }
</script>

<style scoped>
  .text_right{
    text-align: right;
  }

</style>
