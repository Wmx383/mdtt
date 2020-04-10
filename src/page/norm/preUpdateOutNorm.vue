<template>
  <div>
    <el-form
      ref="updateOutNormForm"
      :model="updateOutNormForm"
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
          v-model="updateOutNormForm.ownerId"
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
        prop='code'
        label="指标:"
        label-width="70px"
        style="margin-bottom: 30px"
        :rules="[{ required: true, message: '指标不能为空' ,trigger: 'blur' }]"
      >
        <el-select
          v-model="updateOutNormForm.code"
          style="width: 100%"
          disabled
        >
          <el-option
            v-for="item in codeList"
            :key="item.code"
            :label="item.name"
            :value="item.code">
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
          v-model="updateOutNormForm.upperLimit"
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
          v-model="updateOutNormForm.lowerLimit"
          controls-position="right"
          style="width: 100%"
        >
        </el-input-number>
      </el-form-item>

      <el-form-item class="text_right">
        <el-button type="primary" @click='_closeOutNorm()'>取 消</el-button>
        <el-button type="primary" @click='_updateOutNorm()'>保 存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
  export default {
    name: "preUpdateOutNorm",
    data() {
      return {
        idFlag: false,
        typeList: [],
        codeList: [{
          code : '001',
          name : '内控指标'
        },{
          code : '002',
          name : '执行指标'
        }],
        updateOutNormForm: {
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
      _updateOutNorm() {
        this.$refs['updateOutNormForm'].validate((valid) => {
          if (valid) {//表单数据验证完成之后，提交数据;
            this.$http({
              url: '/api/api/target/updateTarget',
              "content-type": "application/json",
              method: 'put',
              data: {
                id : this.updateOutNormForm.id,
                code: this.updateOutNormForm.code,
                lowerLimit: this.updateOutNormForm.lowerLimit,
                upperLimit: this.updateOutNormForm.upperLimit,
                ownerId: this.updateOutNormForm.ownerId,
                type: this.updateOutNormForm.type,
                num : this.updateOutNormForm.num
              }
            }).then(res => {
              if (res.data.status == 1) {
                this.$message({message: '操作成功', type: 'success'});
                this.$emit('updateOutNormListeners');
                this._closeOutNorm();

              } else {
                this.$message({message: res.data.msg, type: 'error'});
              }
            })
          }
        })

      },
      _closeOutNorm(){
        this.$emit('closeUpdateOutNormDialog');
      }
    }
  }
</script>

<style scoped>
  .text_right{
    text-align: right;
  }

</style>
