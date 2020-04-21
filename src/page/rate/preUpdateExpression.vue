<template>
  <div>
    <div class="updateExpression">
      <el-form
        ref="updateExpressionForm"
        :model="updateExpressionForm"
        style="margin:10px;width:auto; "
      >
        <el-form-item
          prop='name'
          label="公式名称:"
          label-width="100px"
          style="margin-bottom: 30px"
          :rules="[{ required: true, message: '模型组不能为空' ,trigger: 'blur' }]"
        >
          <el-input v-model="updateExpressionForm.name" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item
          prop='formula'
          label="公式:"
          label-width="100px"
          style="margin-bottom: 30px"
        >
          <el-input v-model="updateExpressionForm.formula" style="width: 100%" disabled></el-input>
        </el-form-item>

        <el-form-item class="text_right">
          <el-button plain size="small" @click="_addParam"><i class="el-icon-plus"></i>&nbsp;&nbsp;添加参数</el-button>
          <el-button plain size="small" @click="_addOperator"><i class="el-icon-plus"></i>&nbsp;&nbsp;添加运算符
          </el-button>
        </el-form-item>

        <el-row v-for="(item,index) in updateExpressionForm.formList"
                :key="index">
          <el-form-item
            v-if="!item.isOperator"
            label="模型:"
            label-width="100px"
            :prop="'formList.' + index + '.id'"
            style="margin-bottom: 20px">
            <el-cascader
              ref="chooseModelRef"
              placeholder="请选择或输入模型...."
              v-model="item.id"
              :options="treeDataList"
              :props="defaultProps"
              style="width: 97%"
              filterable
              @change="_onChangeModel(item.id, index)"
            >
            </el-cascader>
            <span style="cursor: pointer" @click="_removeModel(false, index)"><i
              class="el-icon-remove-outline"></i></span>
          </el-form-item>
          <el-form-item
            v-if="item.isOperator"
            label="运算符:" label-width="100px"
            :prop="'formList.' + index + '.operator'"
            style="margin-bottom: 20px"
          >
            <el-select
              v-model="item.operator"
              @change="_onChangeOperator"
              style="width: 97%"
            >
              <el-option
                v-for="item2 in operatorList"
                :key="item2.name"
                :label="item2.name"
                :value="item2.name">
              </el-option>
            </el-select>
            <span class="removeIcon" style="cursor: pointer" @click="_removeModel(true, index)"><i
              class="el-icon-remove-outline"></i></span>
          </el-form-item>
        </el-row>

      </el-form>
    </div>
    <div class="text_right">
      <el-divider></el-divider>
      <el-button type="primary" size="small" @click='_closeExpression()'>取 消</el-button>
      <el-button type="primary" size="small" @click='_updateExpression()'>保 存</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "preUpdateExpression",
  data () {
    return {
      idFlag: false,
      updateExpressionForm: {
        id : '',
        name: '',
        roomId: '',
        expression: '',
        formula: '',
        formList: []
      },
      currentNodeList: {},
      treeDataList: [],
      defaultProps: {
        children: 'childList',
        label: 'ogName',
        value: 'formatIdName'
      },
      operatorList: [{
        name: '+'
      }, {
        name: '-'
      }, {
        name: '*'
      }, {
        name: '/'
      }, {
        name: '('
      }, {
        name: ')'
      }]
    }
  },
  methods: {
    _initUpdateExpression (data) {
      this.updateExpressionForm.formula = data.expression;
      this.updateExpressionForm.id = data.id;
      console.log(data.expression);
      console.log(data.expressionOld);
      let str = data.expressionOld;
      let result =  str.replace(/param/g, '');
      console.log(result.length);
      console.log(result);
    },
    _addParam () {
      this.updateExpressionForm.formList.push({
        id: '',
        operator: '',
        isOperator: false //不是运算符
      })
    },
    _addOperator () {
      this.updateExpressionForm.formList.push({
        id: '',
        operator: '',
        isOperator: true //是运算符
      })
    },
    _removeModel(isOperator, index){
      this.updateExpressionForm.formList.splice(index, 1);
      this._setFormula();
    },
    _onChangeModel(a, b){
      console.log(a);
      this._setFormula();
    },
    _onChangeOperator(){
      this._setFormula();
    },
    _setFormula(){
      let formula = '';
      let expression = '';
      for(let i = 0; i < this.updateExpressionForm.formList.length; i++){
        if(this.updateExpressionForm.formList[i].isOperator){
          formula += this.updateExpressionForm.formList[i].operator;
          expression += this.updateExpressionForm.formList[i].operator;
        }else{
          if(this.updateExpressionForm.formList[i].id != ''){
            console.log(this.updateExpressionForm.formList[i].id);
            let id = this.updateExpressionForm.formList[i].id[this.updateExpressionForm.formList[i].id.length - 1];
            let index = id.indexOf('-');
            let expressionId = 'param' + id.substring(0, index);
            let name = id.substring(index + 1, id.length);
            formula += name;
            expression += expressionId;
          }
        }
      }
      this.updateExpressionForm.formula = formula;
      this.updateExpressionForm.expression = expression;
    },
    _updateExpression () {
      let tempItem = {};
      for(let i = 0; i < this.updateExpressionForm.formList.length; i++){
        if(i == 0){
          tempItem = this.updateExpressionForm.formList[i];
        }else{
          if(tempItem.isOperator == false && this.updateExpressionForm.formList[i].isOperator == false){
            this.$message({message: '模型不能连续在一起, 并且不能为空', type: 'warning'});
            return;
          }else{
            tempItem = this.updateExpressionForm.formList[i];
          }
        }
      }

      this.$refs['updateExpressionForm'].validate((valid) => {
        if (valid) {//表单数据验证完成之后，提交数据;
          this.$http({
            url: '/api/api/expression/createExpression',
            "content-type": "application/json",
            method: 'post',
            data: {
              expression: this.updateExpressionForm.expression,
              name: this.updateExpressionForm.name,
              roomId: this.updateExpressionForm.roomId
            }
            /*headers: {Authorization: token},*/
          }).then(res => {
            if(res.data.status == '1'){
              this.$message({message: '操作成功', type: 'success'});
              this.$emit('updateExpressionListeners');
              this._closeExpression();
            }else{
              this.$message({message: '系统异常,请联系管理员', type: 'error'});
            }
          })
        }
      })
    },
    _closeExpression () {
      this.$emit('closeUpdateExpressionDialog');
    }
  }
}
</script>

<style scoped>
  .text_right {
    text-align: right;
  }

  .updateExpression {
    height: 400px;
    overflow-y: auto;
  }
</style>
