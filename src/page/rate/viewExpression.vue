<!--收率展示页面-->
<template>
  <div>
    <div class="orgTree" :style="orgTreeStyle">
      <viewOrgCom ref="viewOrgComRef"
                  @_handleOnClickOrg="_handleOnClickOrg(arguments)"></viewOrgCom>
    </div>
    <div class="contentDiv" id="expressionEcharts" :style="contentDivStyle">
    </div>
  </div>
</template>

<script>
import viewOrgCom from "../org/viewOrg.vue";
import echarts from 'echarts';

export default {
  name: "viewExpression",
  components: {viewOrgCom},
  data () {
    return {
      idFlag: false,
      orgTreeStyle: {
        height: ''
      },
      contentDivStyle: {
        height: '',
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
        width: '800px'
      },
      currentNodeList: [],
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
    this._initEcharts ();
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
      this.contentDivStyle.height = window.innerHeight - 110 + 'px';
    },
    _selectExpression (ogId) {
      this.$http({
        url: '/api/api/expressionResult/getNewestExpressionResultList?roomId=' + ogId + '',
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
      }
    },
    _clearData () {
      this.expression.expressionAllList = [];
      this.option.xAxis[0].data = [];
      this.option.series[0].data = [];
    },
  }
}
</script>

<style lang="less" scoped>
  .contentDiv {
  }
</style>
