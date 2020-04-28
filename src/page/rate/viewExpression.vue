<!--收率展示页面-->
<template>
  <div>
    <div class="orgTree" :style="orgTreeStyle">
      <viewOrgCom ref="viewOrgComRef"
                  @_handleOnClickOrg="_handleOnClickOrg(arguments)"></viewOrgCom>
    </div>
    <div class="expression_heard">
      <span>类型:</span>
      <el-select
        v-model="expressionResultForm.type"
        class="expressionResultFormClass"
        @change="_onChangeExpressionType"
      >
        <el-option
          v-for="item in typeList"
          :key="item.code"
          :label="item.name"
          :value="item.code">
        </el-option>
      </el-select>
      <span>单位:</span>
      <el-input
        v-model="expressionResultForm.unit"
        class="expressionResultFormClass"
        @change="_onChangeExpressionUnit"
      ></el-input>
    </div>
    <div class="contentDiv" id="expressionEcharts" :style="contentDivStyle">
    </div>
    <!--查看公式结果历史-->
    <el-dialog
      :title="viewExpressionResultHistory.title"
      :visible.sync="viewExpressionResultHistory.show"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :modal-append-to-body="false"
      :modal="true"
      :width="viewExpressionResultHistory.width"
      :style="viewExpressionResultHistory.style"
      @close="_closeExpressionResultHistoryViewDialog"
    >
      <template>
        <viewExpressionResultHistoryCom
          ref="viewExpressionResultHistoryRef"
          v-if="viewExpressionResultHistory.dialogVisible"
          @_closeExpressionResultHistoryViewDialog="_closeExpressionResultHistoryViewDialog()"
        ></viewExpressionResultHistoryCom>
      </template>
    </el-dialog>



  </div>
</template>

<script>
import viewOrgCom from "../org/viewOrg.vue";
import echarts from 'echarts';
import viewExpressionResultHistoryCom from "./viewExpressionResultHistory.vue";

export default {
  name: "viewExpression",
  components: {viewOrgCom, viewExpressionResultHistoryCom},
  data () {
    return {
      idFlag: false,
      orgTreeStyle: {
        height: ''
      },
      contentDivStyle: {
        height: '',
      },
      expressionResultForm: {
        type: '',
        unit : ''
      },
      typeList: [{
        code: '1',
        name: '收率'
      }, {
        code: '2',
        name: '选择性',
      }, {
        code: '3',
        name: '吴明旭'
      }],
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
        width: '800px'
      },
      currentNodeList: [],
      viewExpressionResultHistory: {
        show: false,
        title: '查看历史',
        viewExceptionHistoryLoading: false,
        dialogVisible: true,
        formLabelWidth: '120px',
        width: '1300px',
        style: {
          height: '800px',
        }
      },
      option: {
        /*color: ['#3398DB'],*/
        tooltip: {
          formatter: '{b} : {c} % ',
          //formatter: this._getToolTip,
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['在线输出', '实际输出'],
          left: 'left',
          /*selected: {
            // 选中'系列1'
            '在线输出': true,
            // 不选中'系列2'
            '实际输出': false
          }*/
        },
        toolbox: {
          feature: {
            saveAsImage: {},
            magicType: {
              type: ['line', 'bar']
            },
            myTool1: {
              show: true,
              title: '查看历史',
              icon: 'path://M525.4 721.2H330.9c-9 0-18.5-7.7-18.5-18.1V311c0-9 9.3-18.1 18.5-18.1h336.6c9.3 0 18.5 9.1 18.5 18.1v232.7c0 6 8.8 12.1 15 12.1 6.2 0 15-6 15-12.1V311c0-25.6-25.3-48.9-50.1-48.9h-335c-26.2 0-50.1 23.3-50.1 48.9v389.1c0 36.3 20 51.5 50.1 51.5h197.6c6.2 0 9.3-7.5 9.3-15.1 0-6-6.2-15.3-12.4-15.3zM378.8 580.6c-6.2 0-12.3 8.6-12.3 14.6s6.2 14.6 12.3 14.6h141.4c6.2 0 12.3-5.8 12.3-13.4 0.3-9.5-6.2-15.9-12.3-15.9H378.8z m251.6-91.2c0-6-6.2-14.6-12.3-14.6H375.7c-6.2 0-12.4 8.6-12.4 14.6s6.2 14.6 12.4 14.6h240.8c6.2 0.1 13.9-8.5 13.9-14.6z m-9.2-120.5H378.8c-6.2 0-12.3 8.6-12.3 14.6s6.2 14.6 12.3 14.6h240.8c7.7 0 13.9-8.6 13.9-14.6s-6.2-14.6-12.3-14.6z m119.4 376.6L709 714.1c9.2-12 14.6-27 14.6-43.2 0-39.4-32.1-71.4-71.8-71.4-39.7 0-71.8 32-71.8 71.4s32.1 71.4 71.8 71.4c16.3 0 31.3-5.4 43.4-14.5l31.6 31.5c3.8 3.8 10 3.8 13.8 0 3.8-3.8 3.8-10 0-13.8z m-88.8-23.6c-28.3 0-51.3-22.8-51.3-51s23-51 51.3-51c28.3 0 51.3 22.8 51.3 51s-23 51-51.3 51z',
              onclick: this._viewExpressionResultHistory
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            name: '%',
            type: 'value'
          }
        ],
        series: [
          {
            name: '',
            type: 'bar',
            data: []
          }
        ]
      }
    }
  },
  created () {
    this._initExpression();
    this.$nextTick(_ => {
      this.$refs.viewOrgComRef._getUserRoleOrgTreeByThreeLevel();
    });
  },
  mounted () {
    this._initEcharts();
  },
  methods: {
    _initEcharts () {
      if (this.expression.expressionAllList.length > 0) {
        let xAxisData = [];
        let seriesData_1 = [];
        this.expression.expressionAllList.forEach((item, index) => {
          xAxisData.push(item.expressionName);
          seriesData_1.push({
            value: item.expressionResult == null ? 0 : item.expressionResult * 100
          });
        });

        this.option.xAxis[0].data = xAxisData;
        this.option.series[0].data = seriesData_1;
      }
      let expressionEchartsChart = echarts.init(document.getElementById('expressionEcharts'));
      expressionEchartsChart.setOption(this.option, true);
    },
    _initExpression () {
      this.orgTreeStyle.height = window.innerHeight - 110 + 'px';
      this.contentDivStyle.height = window.innerHeight - 140 + 'px';
    },
    _selectExpression (ogId) {
      this.$http({
        url: '/api/api/expressionResult/getNewestExpressionResultList?roomId=' + ogId + '&typeId='+ this.expressionResultForm.type +'&unitId='+ this.expressionResultForm.unit + '',
        "content-type": "application/json",
        method: 'get',
      }).then(res => {
        if (res.data.status == 1) {
          this.expression.expressionAllList = res.data.result;
          this._initEcharts();
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
      } else {
        this._initEcharts();
      }
    },
    _onChangeExpressionType(){
      let node = this.$refs.viewOrgComRef._getCurrentNode();
      if(node == null || node.ogId == '' || node.level != 3){
        return;
      }

      this._selectExpression(node.ogId);
    },
    _onChangeExpressionUnit(value){
      let node = this.$refs.viewOrgComRef._getCurrentNode();
      if(node == null || node.ogId == '' || node.level != 3){
        return;
      }

      this._selectExpression(node.ogId);
    },
    _viewExpressionResultHistory(){
      const node = this.$refs.viewOrgComRef._getCurrentNode();
      if (node == null || node.level != 3) {
        this.$message({message: '请选择左侧数据', type: 'warning'});
        return;
      }

      this.viewExpressionResultHistory.show = true;
      this.viewExpressionResultHistory.dialogVisible = true;
      this.$nextTick(_ => {
        this.$refs.viewExpressionResultHistoryRef.expressionResultHistoryForm.roomId = node.ogId;
        this.$refs.viewExpressionResultHistoryRef._getDate();
        this.$refs.viewExpressionResultHistoryRef._selectExpressionResultHistory()
        //this.$refs.viewExpressionResultHistoryRef._getModelParamList(node.ogId, false);
      });
    },
    _clearData () {
      this.expressionResultForm.type = '';
      this.expressionResultForm.unit = '';
      this.expression.expressionAllList = [];
      this.option.xAxis[0].data = [];
      this.option.series[0].data = [];
    },
    _closeExpressionResultHistoryViewDialog () {
      this.viewExpressionResultHistory.dialogVisible = false;
      this.viewExpressionResultHistory.show = false;
    },
  }
}
</script>

<style lang="less" scoped>
  .contentDiv {
    top: 115px;
  }

  .expression_heard {
    position: absolute;
    left: 300px;
    right: 10px;
    height: 50px;
    padding: 10px;
  }

  .expressionResultFormClass{
    width: calc(~"50% - 50px");
  }
</style>
