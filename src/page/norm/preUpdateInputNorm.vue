<template>
  <div>
    <el-form
      ref="updateInputNormForm"
      :model="updateInputNormForm"
      style="margin:10px;width:auto; "
    >
      <el-form-item
        prop='ownerId'
        label="类型:"
        label-width="70px"
        style="margin-bottom: 30px"
        :rules="[{ required: true, message: '类型不能为空' ,trigger: 'blur' }]"
      >
        <el-select
          v-model="updateInputNormForm.ownerId"
          style="width: 100%"
          disabled
        >
          <el-option
            v-for="item in typeList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        prop='upperLimit'
        label="上限:"
        label-width="70px"
        style="margin-bottom: 30px"
        :rules="[{ required: true, message: '上限不能为空' ,trigger: 'blur' }]"
      >
        <el-input-number
          v-model="updateInputNormForm.upperLimit"
          controls-position="right"
          style="width: 100%">
        </el-input-number>
      </el-form-item>
      <el-form-item
        prop='lowerLimit'
        label="下限:"
        label-width="70px"
        style="margin-bottom: 30px"
        :rules="[{ required: true, message: '下限不能为空' ,trigger: 'blur' }]"
      >
        <el-input-number
          v-model="updateInputNormForm.lowerLimit"
          controls-position="right"
          style="width: 100%"
        >
        </el-input-number>
      </el-form-item>

      <el-form-item class="text_right">
        <el-button type="primary" @click='_closeInputNorm()'>取 消</el-button>
        <el-button type="primary" @click='_updateInputNorm()'>保 存</el-button>
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
        typeList: [],
        updateInputNormForm: {
          id : '',
          ownerId: '',
          upperLimit: '',
          lowerLimit: '',
          type: '',
          num: '',
          code: '000'
        },
      }
    },
    methods:{
      _updateInputNorm() {
        this.$refs['updateInputNormForm'].validate((valid) => {
          if (valid) {//表单数据验证完成之后，提交数据;
            this.$http({
              url: '/api/api/target/updateTarget',
              "content-type": "application/json",
              method: 'put',
              data: {
                id : this.updateInputNormForm.id,
                code: this.updateInputNormForm.code,
                lowerLimit: this.updateInputNormForm.lowerLimit,
                upperLimit: this.updateInputNormForm.upperLimit,
                ownerId: this.updateInputNormForm.ownerId,
                type: this.updateInputNormForm.type,
                num : this.updateInputNormForm.num
              }
            }).then(res => {
              if (res.data.status == 1) {
                this.$message({message: '操作成功', type: 'success'});
                this.$emit('updateInputNormListeners');
                this._closeInputNorm();

              } else {
                this.$message({message: res.data.msg, type: 'error'});
              }
            })
          }
        })

      },
      _closeInputNorm(){
        this.$emit('closeUpdateInputNormDialog');
      }
    }
  }
</script>

<style scoped>
  .text_right{
    text-align: right;
  }

</style>
