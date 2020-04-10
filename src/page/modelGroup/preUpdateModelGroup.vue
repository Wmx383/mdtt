<template>
  <div>
    <el-form
      ref="updateModelGroupForm"
      :model="updateModelGroupForm"
      style="margin:10px;width:auto; "
    >
      <el-form-item
        prop='name'
        label="模型组名称:"
        label-width="100px"
        style="margin-bottom: 30px"
        :rules="[{ required: true, message: '模型组不能为空' ,trigger: 'blur' }]"
      >
        <el-input v-model="updateModelGroupForm.name" style="width: 100%"></el-input>
      </el-form-item>

      <el-form-item class="text_right">
        <el-button type="primary" @click='_closeModelGroup()'>取 消</el-button>
        <el-button type="primary" @click='_updateModelGroup()'>保 存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
export default {
  name: "preUpdateModelGroup",
  data () {
    return {
      idFlag: false,
      updateModelGroupForm: {
        id : '',
        name: '',
        status: '',
      },
    }
  },
  methods: {
    _updateModelGroup () {
      this.$refs['updateModelGroupForm'].validate((valid) => {
        if (valid) {//表单数据验证完成之后，提交数据;
          this.$http({
            url: '/api/api/modelGroup/updateModelGroup',
            "content-type": "application/json",
            method: 'put',
            data: {
              id : this.updateModelGroupForm.id,
              name: this.updateModelGroupForm.name,
              status: this.updateModelGroupForm.status
            }
          }).then(res => {
            if (res.data.status == 1) {
              this.$message({message: '操作成功', type: 'success'});
              this.$emit('updateModelGroupListeners');
              this._closeModelGroup();

            } else {
              this.$message({message: res.data.msg, type: 'error'});
            }
          })
        }
      })

    },
    _closeModelGroup () {
      this.$emit('closeUpdateModelGroupDialog');
    }
  }
}
</script>

<style scoped>
  .text_right {
    text-align: right;
  }

</style>
