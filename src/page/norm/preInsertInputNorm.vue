<template>
  <div>
    <el-form
      ref="insertInputNormForm"
      :model="insertInputNormForm"
      style="margin:10px;width:auto; "
    >
      <el-form-item
        prop='ownerId'
        label="类型:"
        label-width="70px"
        style="margin-bottom: 30px"
        :rules="[{ required: true, message: '类型不能为空' ,trigger: 'blur' }]"
      >
        <el-select v-model="insertInputNormForm.ownerId" style="width: 100%">
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
          v-model="insertInputNormForm.upperLimit"
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
          v-model="insertInputNormForm.lowerLimit"
          controls-position="right"
          style="width: 100%"
        >
        </el-input-number>
      </el-form-item>

      <el-form-item class="text_right">
        <el-button type="primary" @click='_closeInputNorm()'>取 消</el-button>
        <el-button type="primary" @click='_insertInputNorm()'>保 存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
  export default {
    name: "preInsertInputNorm",
    data() {
      return {
        idFlag: false,
        typeList: [],
        insertInputNormForm: {
          ownerId: '',
          upperLimit: '',
          lowerLimit: '',
          type: '',
          num: '',
          code: '000'
        },
      }
    },
    methods: {
      _insertInputNorm() {
        this.$refs['insertInputNormForm'].validate((valid) => {
          if (valid) {//表单数据验证完成之后，提交数据;
            this.typeList.forEach((item, index)=>{
              if(this.insertInputNormForm.ownerId == item.id){
                this.insertInputNormForm.num = item.num;
                return;
              }
            });

            this.$http({
              url: '/api/api/target/createTarget',
              "content-type": "application/json",
              method: 'post',
              data: {
                code: this.insertInputNormForm.code,
                lowerLimit: this.insertInputNormForm.lowerLimit,
                upperLimit: this.insertInputNormForm.upperLimit,
                ownerId: this.insertInputNormForm.ownerId,
                type: this.insertInputNormForm.type,
                num : this.insertInputNormForm.num
              }
            }).then(res => {
              if (res.data.status == 1) {
                this.$message({message: '操作成功', type: 'success'});
                this.$emit('insertInputNormListeners');
                this._closeInputNorm();

              } else {
                this.$message({message: res.data.msg, type: 'error'});
              }
            })
          }
        })

      },
      _closeInputNorm() {
        this.$emit('closeInsertInputNormDialog');
      }
    }
  }
</script>

<style scoped>
  .text_right {
    text-align: right;
  }

</style>
