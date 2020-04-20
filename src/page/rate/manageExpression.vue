<!--我是管理收率公式页面-->
<template>
  <div>
    <div class="orgTree" :style="orgTreeStyle">
      <viewOrgCom ref="viewOrgComRef"
                  @_handleOnClickOrg="_handleOnClickOrg(arguments)"></viewOrgCom>
    </div>
    <div class="contentDiv" :style="contentDivStyle">

      <div style="margin-left: 5px; margin-top: 5px">
        <el-form
          :inline="true"
          class="demo-form-inline search-form">

          <el-form-item>
            <el-button type="primary" size="small" @click="_preInsertExpression">添加</el-button>
            <el-button type="primary" size="small" @click="_handleUpdateModelParamDisplay">修改</el-button>
            <el-button type="primary" size="small" @click="_handleUpdateModelParamDisplay">删除</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="table_container">
        <el-table
          v-loading="expression.gridLoading"
          :data="expression.expressionPageList"
          :style="expression.gridTableStyle"
          :height="expression.gridTableStyle.height"
          align='center'
          ref="multipleTable"
          highlight-current-row
        >
          <el-table-column
            prop="name"
            label="公式名称"
            align='left'
            min-width="300"
          >
          </el-table-column>
          <el-table-column
            prop="expression"
            label="公式"
            align='left'
            min-width="400"
          >
          </el-table-column>
        </el-table>
        <el-row>
          <el-col :span="24">
            <div class="pagination">
              <el-pagination
                :page-sizes="expression.pagination.page_sizes"
                :page-size="expression.pagination.page_size"
                :layout="expression.pagination.layout"
                :total="expression.pagination.total"
                :current-page='expression.pagination.page_index'
                @current-change='_handleCurrentChange'
                @size-change='_handleSizeChange'>
              </el-pagination>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <!--添加公式-->
    <el-dialog
      :title="insertExpressionDialog.title"
      :visible.sync="insertExpressionDialog.show"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :modal-append-to-body="false"
      :modal="false"
      :width="insertExpressionDialog.width"
      @close="closeInsertExpressionDialog"
    >
      <template>
        <insertExpressionCom ref="insertExpressionRef" v-if="insertExpressionDialog.dialogVisible"
                             @insertExpressionListeners="_completeInsertExpression"
                             @closeInsertExpressionDialog="closeInsertExpressionDialog()"></insertExpressionCom>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import viewOrgCom from "../org/viewOrg.vue";
import insertExpressionCom from './preInsertExpression.vue';

export default {
  name: "manageExpression",
  components: {viewOrgCom, insertExpressionCom},
  data () {
    return {
      idFlag: false,
      orgTreeStyle: {
        height: ''
      },
      contentDivStyle: {
        height: ''
      },
      modelParamList: [],
      modelParamListByFormat: [],
      expression: {
        sortNum: 0,
        gridLoading: false,
        expressionAllList: [],
        expressionPageList: [],
        expressionList: [],
        gridTableStyle: {
          width: '100%',
          height: window.innerHeight - 190 + 'px'
        },
        pagination: {
          page_index: 1,  // 当前位于哪页
          total: 0,        // 总数
          page_size: 20,   // 1页显示多少条
          page_sizes: [10, 20, 50, 100],  //每页显示多少条
          layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
        },
        selectedDate: [],
      },
      insertExpressionDialog: {
        show: false,
        title: '新增',
        insertExpressionDialogLoading: false,
        dialogVisible: true,
        formLabelWidth: '120px',
        width: '800px'
      },
      updateExpressionDialog: {
        show: false,
        title: '修改',
        insertExpressionDialogLoading: false,
        dialogVisible: true,
        formLabelWidth: '120px',
        width: '500px'
      },
      currentNodeList : []
    }
  },
  created () {
    this._initExpression();
    this._selectExpression();
    this.$nextTick(_ => {
      this.$refs.viewOrgComRef._getUserRoleOrgTreeByThreeLevel();
    });
    this._getModelParamList();
  },
  mounted () {

  },
  methods: {
    _initExpression () {
      this.orgTreeStyle.height = window.innerHeight - 110 + 'px'
      this.contentDivStyle.height = window.innerHeight - 110 + 'px'
    },
    _preInsertExpression () {
      this.currentNodeList = [];
      const node = this.$refs.viewOrgComRef._getCurrentNode();
      if (node == null || node.level != 3) {
        this.$message({message: '请选择左侧模型', type: 'warning'});
        return;
      }

      let dataAllList = JSON.parse(JSON.stringify(this.$refs.viewOrgComRef.dataAllList));

      this._getModelList(node.id, dataAllList);
      this._setNewModelList(this.currentNodeList);
      this.insertExpressionDialog.show = true;
      this.insertExpressionDialog.dialogVisible = true;
      this.$nextTick(_ => {
        this.$refs.insertExpressionRef._initInsertExpression( node.ogId, this.currentNodeList);
      });
    },
    _getModelList(id, orgDataList){
      for (let i = 0; i < orgDataList.length; i++) {
        if (id == orgDataList[i].id) {
          this.currentNodeList.push(orgDataList[i]);
          return;
        } else if (orgDataList[i].childList != null) {
          this._getModelList(id, orgDataList[i].childList)
        }
      }
    },
    _setNewModelList(currentNodeList){
      for(let i = 0; i<currentNodeList.length; i++){
        if(currentNodeList[i].level == 5){
          for(let j = 0; j< this.modelParamList.length; j++){
            if(currentNodeList[i].ogId == this.modelParamList[j].modelId){
              if(!currentNodeList[i].childList){
                currentNodeList[i].childList = [];
              }
              currentNodeList[i].childList.push({
                id : this.modelParamList[j].id,
                ogId : this.modelParamList[j].id,
                ogName :  this.modelParamList[j].name,
                formatIdName : this.modelParamList[j].id + '-' +  this.modelParamList[j].name
              })
            }
            if(j == this.modelParamList.length - 1 && currentNodeList[i].childList == null){
              currentNodeList[i].disabled = true;
            }
          }
        }else{
          this._setNewModelList(currentNodeList[i].childList)
        }
      }
    },
    _selectExpression (ogId) {
      this.expression.gridLoading = true;
      this.expression.expressionAllList = [];
      this.expression.expressionPageList = [];
      this.expression.expressionList = [];

      this.$http({
        url: '/api/api/expression/getExpressionList?roomId=' + ogId + '',
        "content-type": "application/json",
        method: 'get',
      }).then(res => {
        if (res.data.status == 1) {
          let resultlist = res.data.result;
          resultlist.forEach((item, index) => {
            let tableItem = {
              id: item.id,
              name: item.name,
              expression: this._getExpressionName(item.expression, 1),
              roomId: item.roomId,
              typeId: item.typeId,
              unitId: item.unitId
            };
            this.expression.expressionAllList.push(tableItem);
          });

          //模拟分页
          this._selectExpressionByPaging();

        } else {
          this.$message({message: res.data.msg, type: 'error'});

          this.expression.gridLoading = false;
        }
      })
    },
    //前端分页
    _selectExpressionByPaging () {
      this.expression.expressionPageList = this.expression.expressionAllList.filter((item, index) =>
        index < this.expression.pagination.page_index * this.expression.pagination.page_size && index >= this.expression.pagination.page_size * (this.expression.pagination.page_index - 1)
      )
      this.expression.pagination.total = this.expression.expressionAllList.length;

      this.expression.gridLoading = false;
    },
    _getModelParamList () {
      this.$http({
        url: '/api/api/modelParam/getModelParamList?type=2',
        "content-type": "application/json",
        method: 'get',
      }).then(res => {
        if (res.data.status == 1) {
          this.modelParamList = res.data.result;
          let tempList = {};
          if (this.modelParamList) {
            for (let i = 0; i < this.modelParamList.length; i++) {
              tempList[this.modelParamList[i].id] = [this.modelParamList[i].id, this.modelParamList[i].name, this.modelParamList[i].modelId]
            }
          }
          this.modelParamListByFormat = tempList;

        } else {
          this.$message({message: res.data.msg, type: 'error'});
        }
      })
    },
    _handleOnClickOrg (args) {
      this._clearData();
      const id = args[0];
      const ogId = args[1];
      const orgLevel = args[2];
      const ogName = args[4];

      if (orgLevel == 3) {
        this._selectExpression(ogId);
      }
    },
    // 每页多少条切换
    _handleSizeChange (page_size) {
      this.expression.pagination.page_size = page_size
      this._selectExpressionByPaging()
    },
    // 上下分页
    _handleCurrentChange (page) {
      this.expression.pagination.page_index = page;
      this._selectExpressionByPaging()
    },
    _clearData () {

    },
    _handleUpdateModelParamDisplay () {

    },
    _getExpressionName (expression, type) {
      if (!expression || expression == "") {
        return false
      }

      if (type == 1) {
        let d = "";
        for (let i = 0; i < expression.toString().length; i++) {
          const val = expression.toString().charAt(i);
          if (this._checkIndex(val)) {
            d += ",";
          } else {
            d += val;
          }
        }

        let data = {}, val = expression.toString();
        const checkVal = d.split(",");
        for (let i = 0; i < checkVal.length; i++) {
          const index = checkVal[i].replace("param", "").trim();
          if (index == "") {
            continue
          }
          if (checkVal[i].indexOf('param') < 0) {
            continue;
          }
          data["param" + this.modelParamListByFormat[index][0]] = this.modelParamListByFormat[index][1];
        }
        //进行公式三遍替换（暂时先这样等有时间改）
        for (let key in data) {
          val = val.replace(key, data[key]).replace(key, data[key]).replace(key, data[key]);
        }
        return val;

      } else {
        return this.modelParamListByFormat[expression][1]
      }
    },
    _checkIndex (expression) {
      if (expression == "(" || expression == ")" || expression == "+" || expression == "-" || expression == "*" || expression == "/") {
        return true
      }
      return false
    },
    closeInsertExpressionDialog () {
      this.insertExpressionDialog.dialogVisible = false;
      this.insertExpressionDialog.show = false;
    },
    _completeInsertExpression () {
      this._selectExpression(this.$refs.viewOrgComRef._getCurrentNode().ogId);
    },
  }
}
</script>

<style scoped>

</style>
