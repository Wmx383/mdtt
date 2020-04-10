<template>
  <div>
    <el-form
      ref="insertModelGroupForm"
      :model="insertModelGroupForm"
      style="margin:10px;width:auto; "
    >
      <el-form-item
        prop='name'
        label="模型组名称:"
        label-width="100px"
        style="margin-bottom: 30px"
        :rules="[{ required: true, message: '模型组不能为空' ,trigger: 'blur' }]"
      >
        <el-input v-model="insertModelGroupForm.name" style="width: 100%"></el-input>
      </el-form-item>

      <el-form-item class="text_right">
        <el-button type="primary" @click='_closeModelGroup()'>取 消</el-button>
        <el-button type="primary" @click='_insertModelGroup()'>保 存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
export default {
  name: "preInsertModelGroup",
  data () {
    return {
      idFlag: false,
      insertModelGroupForm: {
        name: '',
        status: '1',
      },
    }
  },
  methods: {
    _insertModelGroup () {
      this.$refs['insertModelGroupForm'].validate((valid) => {
        if (valid) {//表单数据验证完成之后，提交数据;
          this.$http({
            url: '/api/api/modelGroup/createModelGroup',
            "content-type": "application/json",
            method: 'post',
            data: {
              name: this.insertModelGroupForm.name,
              status: this.insertModelGroupForm.status
            }
          }).then(res => {
            if (res.data.status == 1) {
              this.$message({message: '操作成功', type: 'success'});
              this.$emit('insertModelGroupListeners');
              this._closeModelGroup();

            } else {
              this.$message({message: res.data.msg, type: 'error'});
            }
          })
        }
      })

    },
    _closeModelGroup () {
      this.$emit('closeInsertModelGroupDialog');
    }
  }
}
</script>

<style scoped>
  .text_right {
    text-align: right;
  }

</style>
