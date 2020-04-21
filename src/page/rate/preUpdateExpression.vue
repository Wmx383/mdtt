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
      tempIdList : [],
      tempOgName : '',
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
        value: 'id'
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
    _initUpdateExpression (dataList, data) {
      this.treeDataList = dataList;
      this.updateExpressionForm.name = data.name;
      this.updateExpressionForm.formula = data.expression;
      this.updateExpressionForm.id = data.id;
      let str = data.expressionOld;
      let result =  str.replace(/param/g, '');
      let strList = this._verifyData(result);
      this.updateExpressionForm.formList = strList;
      this._setFormula();
    },
    _verifyData(result){
      let regNum = '^[0-9]*$';
      let partenNum = new RegExp(regNum);
      let index = 0;
      let strList = [];
      let strIndex = 0;
      for(let i = 0; i < result.length; i++){
        if(partenNum.test(result[i])){
          if(i == result.length - 1){
            this.tempIdList = [];
            this.tempOgName = '';
            this._getLabelNameById([], result.substring(strIndex, i + 1), this.treeDataList);
            let idList  = JSON.parse(JSON.stringify(this.tempIdList));
            let item = {
              id:  idList,
              operator: '',
              labelName : this.tempOgName,
              isOperator: false //不是运算符
            };
            strList.push(item);
          }
          index++;
        }else{
          if(index != 0){
            this.tempIdList = [];
            this.tempOgName = '';
            this._getLabelNameById([], result.substring(strIndex, i), this.treeDataList);
            let idList  = JSON.parse(JSON.stringify(this.tempIdList));
            let item = {
              id:  idList,
              operator: '',
              labelName : this.tempOgName,
              isOperator: false //不是运算符
            };
            strIndex = strIndex + index;
            strList.push(item);
          }
          let item = {
            id:  '',
            operator: result[i],
            labelName : '',
            isOperator: true //是运算符
          };
          strIndex++;
          strList.push(item);
          index = 0;
        }
      }

      return strList;

    },
    _getLabelNameById(idList, id, dataList){
      if(dataList){
        for(let i = 0; i < dataList.length; i++){
          if(dataList[i].level < 6){
            idList.push(dataList[i].id);
          }

          if(dataList[i].level == 6){
            if(id == dataList[i].id){
              idList.push(dataList[i].id);
              this.tempIdList = JSON.parse(JSON.stringify(idList));
              this.tempOgName = dataList[i].ogName;
              return;
            }else if(i == dataList.length - 1){
              idList = [];
            }
          }else{
            this._getLabelNameById(idList, id,dataList[i].childList)
          }
        }
      }
    },
    _addParam () {
      this.updateExpressionForm.formList.push({
        id: '',
        operator: '',
        labelName : '',
        isOperator: false //不是运算符
      })
    },
    _addOperator () {
      this.updateExpressionForm.formList.push({
        id: '',
        operator: '',
        labelName : '',
        isOperator: true //是运算符
      })
    },
    _removeModel(isOperator, index){
      this.updateExpressionForm.formList.splice(index, 1);
      this._setFormula();
    },
    _onChangeModel(idList, index){
      this._setLabelNameById(idList[idList.length - 1], index, this.treeDataList);
      this._setFormula();
    },
    _setLabelNameById(id, index, dataList){
      if(dataList){
        for(let i = 0; i < dataList.length; i++){
          if(dataList[i].level == 6){
            if(id == dataList[i].id){
              this.updateExpressionForm.formList[index].labelName = dataList[i].ogName;
              return;
            }
          }else{
            this._setLabelNameById(id, index, dataList[i].childList)
          }
        }
      }
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
            let id = this.updateExpressionForm.formList[i].id[this.updateExpressionForm.formList[i].id.length - 1];
            let expressionId = 'param' + id;
            let name = this.updateExpressionForm.formList[i].labelName;
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
            url: '/api/api/expression/updateExpression',
            "content-type": "application/json",
            method: 'put',
            data: {
              id : this.updateExpressionForm.id,
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
