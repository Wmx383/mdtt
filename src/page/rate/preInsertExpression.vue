<template>
  <div>
    <div class="insertExpression">
      <el-form
        ref="insertExpressionForm"
        :model="insertExpressionForm"
        style="margin:10px;width:auto; "
      >
        <el-form-item
          prop='name'
          label="公式名称:"
          label-width="100px"
          style="margin-bottom: 30px"
          :rules="[{ required: true, message: '模型组不能为空' ,trigger: 'blur' }]"
        >
          <el-input v-model="insertExpressionForm.name" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item
          prop='formula'
          label="公式:"
          label-width="100px"
          style="margin-bottom: 30px"
        >
          <el-input v-model="insertExpressionForm.formula" style="width: 100%" disabled></el-input>
        </el-form-item>
        <el-form-item
          prop='type'
          label="类型:"
          label-width="100px"
          style="margin-bottom: 30px"
        >
          <el-select
            v-model="insertExpressionForm.type"
            style="width: 100%"
          >
            <el-option
              v-for="item in typeList"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop='type'
          label="单位:"
          label-width="100px"
          style="margin-bottom: 30px"
        >
          <el-input
            v-model="insertExpressionForm.unit"
            label-width="100px"
            style="margin-bottom: 30px"
          ></el-input>
        </el-form-item>

        <el-form-item class="text_right">
          <el-button plain size="small" @click="_addParam"><i class="el-icon-plus"></i>&nbsp;&nbsp;添加参数</el-button>
          <el-button plain size="small" @click="_addOperator"><i class="el-icon-plus"></i>&nbsp;&nbsp;添加运算符
          </el-button>
        </el-form-item>

        <el-row v-for="(item,index) in insertExpressionForm.formList"
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
            <span style="cursor: pointer" @click="_removeModel(false, index)"><i class="el-icon-remove-outline"></i></span>
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
            <span class="removeIcon" style="cursor: pointer" @click="_removeModel(true, index)"><i class="el-icon-remove-outline"></i></span>
          </el-form-item>
        </el-row>

      </el-form>
    </div>
    <div class="text_right">
      <el-divider></el-divider>
      <el-button type="primary" size="small" @click='_closeExpression()'>取 消</el-button>
      <el-button type="primary" size="small" @click='_insertExpression()'>保 存</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "preInsertExpression",
  data () {
    return {
      idFlag: false,
      insertExpressionForm: {
        name: '',
        roomId: '',
        expression: '',
        formula : '',
        formList: [],
        type : '',
        unit : ''
      },
      typeList : [{
        code : '1',
        name : '收率'
      },{
        code : '2',
        name : '选择性',
      },{
        code : '3',
        name : '吴明旭'
      }],
      currentNodeList: {},
      treeDataList: [],
      defaultProps: {
        children: 'childList',
        label: 'ogName',
        value : 'id'
        //value: 'formatIdName'
      },
      operatorList: [{
        name: '+'
      },{
        name: '-'
      },{
        name: '*'
      },{
        name: '/'
      },{
        name: '('
      },{
        name: ')'
      }]
    }
  },
  methods: {
    _initInsertExpression (ogId, dataList) {
      this.insertExpressionForm.roomId = ogId;
      this.treeDataList = dataList
    },
    _addParam () {
      this.insertExpressionForm.formList.push({
        id:  '',
        operator: '',
        labelName : '',
        isOperator: false //不是运算符
      })

      //假设
     /* console.log('赋值默认开始');
      this.insertExpressionForm.formList[0].id = [10, 11, 142, 687];
      console.log('赋值默认结束');*/
    },
    _addOperator () {
      this.insertExpressionForm.formList.push({
        id: '',
        operator: '',
        isOperator: true //是运算符
      })
    },
    _removeModel(isOperator, index){
      this.insertExpressionForm.formList.splice(index, 1);
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
              this.insertExpressionForm.formList[index].labelName = dataList[i].ogName;
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
      for(let i = 0; i < this.insertExpressionForm.formList.length; i++){
        if(this.insertExpressionForm.formList[i].isOperator){
          formula += this.insertExpressionForm.formList[i].operator;
          expression += this.insertExpressionForm.formList[i].operator;
        }else{
          if(this.insertExpressionForm.formList[i].id != ''){
            let id = this.insertExpressionForm.formList[i].id[this.insertExpressionForm.formList[i].id.length - 1];
            let expressionId = 'param' + id;
            let name = this.insertExpressionForm.formList[i].labelName;
            formula += name;
            expression += expressionId;
          }
        }
      }
      this.insertExpressionForm.formula = formula;
      this.insertExpressionForm.expression = expression;
    },
    _insertExpression () {
      let tempItem = {};
      for(let i = 0; i < this.insertExpressionForm.formList.length; i++){
        if(i == 0){
          tempItem = this.insertExpressionForm.formList[i];
        }else{
          if(tempItem.isOperator == false && this.insertExpressionForm.formList[i].isOperator == false){
            this.$message({message: '模型不能连续在一起, 并且不能为空', type: 'warning'});
            return;
          }else{
            tempItem = this.insertExpressionForm.formList[i];
          }
        }
      }

      this.$refs['insertExpressionForm'].validate((valid) => {
        if (valid) {//表单数据验证完成之后，提交数据;
          this.$http({
            url: '/api/api/expression/createExpression',
            "content-type": "application/json",
            method: 'post',
            data: {
              expression: this.insertExpressionForm.expression,
              name: this.insertExpressionForm.name,
              roomId: this.insertExpressionForm.roomId,
              typeId : this.insertExpressionForm.type,
              unitId : this.insertExpressionForm.unit,
            }
            /*headers: {Authorization: token},*/
          }).then(res => {
            if(res.data.status == '1'){
              this.$message({message: '操作成功', type: 'success'});
              this.$emit('insertExpressionListeners');
              this._closeExpression();
            }else{
              this.$message({message: '系统异常,请联系管理员', type: 'error'});
            }
          })
        }
      })
    },
    _closeExpression () {
      this.$emit('closeInsertExpressionDialog');
    }
  }
}
</script>

<style scoped>
  .text_right {
    text-align: right;
  }

  .insertExpression {
    height: 400px;
    overflow-y: auto;
  }
</style>
