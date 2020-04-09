<template>
  <div>
    <el-form
      ref="insertAssayForm"
      :model="insertAssayForm"
      style="margin:10px;width:auto; "
    >
      <el-form-item prop='itemName' label="名 称:" label-width="100px"
      >
        <el-input v-model="insertAssayForm.itemName" style="width: 100%"></el-input>
      </el-form-item>

      <el-form-item prop='num' label="序 号:" label-width="100px"
      >
        <el-input v-model="insertAssayForm.num" style="width: 100%"></el-input>
      </el-form-item>

      <el-form-item class="text_right">
        <el-button type="primary" @click='_closeAssay()'>取 消</el-button>
        <el-button type="primary" @click='_insertAssay()'>保 存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
  export default {
    name: "preInsertAssay",
    data() {
      return {
        idFlag: false,
        insertAssayForm: {
          samplePointId : '',
          itemName: '',
          num: '',
          status: '1'
        },
      }
    },
    methods:{
      _insertAssay(){
        this.$http({
          url: '/api/api/assay/createAssay',
          "content-type": "application/json",
          method: 'post',
          data : {
            samplePointId : this.insertAssayForm.samplePointId,
            itemName : this.insertAssayForm.itemName,
            num : this.insertAssayForm.num,
            status : this.insertAssayForm.status
          }
        }).then(res => {
          if (res.data.status == 1) {
            this.$message({message: '操作成功', type: 'success'});
            this.$emit('insertAssayListeners');
            this._closeAssay();

          } else {
            this.$message({message: res.data.msg, type: 'error'});
          }
        })
      },
      _closeAssay(){
        this.$emit('closeInsertAssayDialog');
      }
    }
  }
</script>

<style scoped>
  .text_right{
    text-align: right;
  }

</style>
