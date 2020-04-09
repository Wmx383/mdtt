<template>
  <div>
    <el-form
      ref="updateAssayForm"
      :model="updateAssayForm"
      style="margin:10px;width:auto; "
    >
      <el-form-item prop='itemName' label="名 称:" label-width="100px"
      >
        <el-input v-model="updateAssayForm.itemName" style="width: 100%"></el-input>
      </el-form-item>

      <el-form-item prop='num' label="序 号:" label-width="100px"
      >
        <el-input v-model="updateAssayForm.num" style="width: 100%"></el-input>
      </el-form-item>

      <el-form-item class="text_right">
        <el-button type="primary" @click='_closeAssay()'>取 消</el-button>
        <el-button type="primary" @click='_updateAssay()'>保 存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
  export default {
    name: "preUpdateAssay",
    data() {
      return {
        idFlag: false,
        updateAssayForm: {
          id : '',
          samplePointId : '',
          itemName: '',
          num: '',
          status: ''
        },
      }
    },
    methods:{
      _updateAssay(){
        this.$http({
          url: '/api/api/assay/updateAssay',
          "content-type": "application/json",
          method: 'put',
          data : {
            id : this.updateAssayForm.id,
            samplePointId : this.updateAssayForm.samplePointId,
            itemName : this.updateAssayForm.itemName,
            num : this.updateAssayForm.num,
            status : this.updateAssayForm.status
          }
        }).then(res => {
          if (res.data.status == 1) {
            this.$message({message: '操作成功', type: 'success'});
            this.$emit('updateAssayListeners');
            this._closeAssay();

          } else {
            this.$message({message: '系统异常,请联系管理员', type: 'error'});
          }
        })
      },
      _closeAssay(){
        this.$emit('closeUpdateAssayDialog');
      }
    }
  }
</script>

<style scoped>
  .text_right{
    text-align: right;
  }

</style>
