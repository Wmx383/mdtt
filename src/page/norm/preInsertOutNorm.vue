<template>
  <div>
    <el-form
      ref="insertOutNormForm"
      :model="insertOutNormForm"
      style="margin:10px;width:auto; "
    >
      <el-form-item
        prop='ownerId'
        label="类型:"
        label-width="70px"
        style="margin-bottom: 30px"
        :rules="[{ required: true, message: '类型不能为空' ,trigger: 'blur' }]"
      >
        <el-select v-model="insertOutNormForm.ownerId" style="width: 100%">
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
          v-model="insertOutNormForm.code"
          style="width: 100%"
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
          v-model="insertOutNormForm.upperLimit"
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
          v-model="insertOutNormForm.lowerLimit"
          controls-position="right"
          style="width: 100%"
        >
        </el-input-number>
      </el-form-item>

      <el-form-item class="text_right">
        <el-button type="primary" @click='_closeOutNorm()'>取 消</el-button>
        <el-button type="primary" @click='_insertOutNorm()'>保 存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
export default {
  name: "preInsertOutNorm",
  data () {
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
      insertOutNormForm: {
        ownerId: '',
        upperLimit: '',
        lowerLimit: '',
        type: '',
        num: '',
        code: '001'
      },
    }
  },
  methods: {
    _insertOutNorm () {
      this.$refs['insertOutNormForm'].validate((valid) => {
        if (valid) {//表单数据验证完成之后，提交数据;
          this.typeList.forEach((item, index) => {
            if (this.insertOutNormForm.ownerId == item.id) {
              this.insertOutNormForm.num = item.num;
              return;
            }
          });

          this.$http({
            url: '/api/api/target/createTarget',
            "content-type": "application/json",
            method: 'post',
            data: {
              code: this.insertOutNormForm.code,
              lowerLimit: this.insertOutNormForm.lowerLimit,
              upperLimit: this.insertOutNormForm.upperLimit,
              ownerId: this.insertOutNormForm.ownerId,
              type: this.insertOutNormForm.type,
              num: this.insertOutNormForm.num
            }
          }).then(res => {
            if (res.data.status == 1) {
              this.$message({message: '操作成功', type: 'success'});
              this.$emit('insertOutNormListeners');
              this._closeOutNorm();

            } else {
              this.$message({message: res.data.msg, type: 'error'});
            }
          })
        }
      })

    },
    _closeOutNorm () {
      this.$emit('closeInsertOutNormDialog');
    }
  }
}
</script>

<style scoped>
  .text_right {
    text-align: right;
  }

</style>
