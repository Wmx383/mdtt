<template>
  <div>
    <el-form
      ref="updateFeaturesBrandForm"
      :model="updateFeaturesBrandForm"
      style="margin:10px;width:auto; "
    >
      <el-form-item
        prop='brandName'
        label="牌号:"
        label-width="100px"
        style="margin-bottom: 30px"
        :rules="[{ required: true, message: '牌号不能为空' ,trigger: 'blur' }]"
      >
        <el-input v-model="updateFeaturesBrandForm.brandName" style="width: 100%"></el-input>
      </el-form-item>

      <el-form-item
        prop='brandRange'
        label="牌号范围:"
        label-width="100px"
        style="margin-bottom: 30px"
        :rules="[{ required: true, message: '牌号范围不能为空' ,trigger: 'blur' }]"
      >
        <el-input v-model="updateFeaturesBrandForm.brandRange" style="width: 100%"></el-input>
      </el-form-item>

      <el-form-item class="text_right">
        <el-button type="primary" @click='_closeFeaturesBrand()'>取 消</el-button>
        <el-button type="primary" @click='_updateFeaturesBrand()'>保 存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
export default {
  name: "preUpdateFeaturesBrand",
  data () {
    return {
      idFlag: false,
      updateFeaturesBrandForm: {
        id : '',
        brandName: '',
        brandRange: '',
      },
    }
  },
  methods: {
    _updateFeaturesBrand () {
      this.$refs['updateFeaturesBrandForm'].validate((valid) => {
        if (valid) {//表单数据验证完成之后，提交数据;
          this.$http({
            url: '/api/api/modelFeatures/updateOutputFeaturesBrandName',
            "content-type": "application/json",
            method: 'put',
            data: {
              id : this.updateFeaturesBrandForm.id,
              brandName: this.updateFeaturesBrandForm.brandName,
              brandRange: this.updateFeaturesBrandForm.brandRange
            }
          }).then(res => {
            if (res.data.status == 1) {
              this.$message({message: '操作成功', type: 'success'});
              this.$emit('updateFeaturesBrandListeners');
              this._closeFeaturesBrand();

            } else {
              this.$message({message: res.data.msg, type: 'error'});
            }
          })
        }
      })

    },
    _closeFeaturesBrand () {
      this.$emit('closeUpdateFeaturesBrandDialog');
    }
  }
}
</script>

<style scoped>
  .text_right {
    text-align: right;
  }

</style>
