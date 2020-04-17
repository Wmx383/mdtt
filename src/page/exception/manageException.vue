<!--异常管理页面-->
<template>
  <div>
    <div class="orgTree" :style="orgTreeStyle">
      <viewOrgCom ref="viewOrgComRef"
                  @_handleOnClickOrg="_handleOnClickOrg(arguments)"></viewOrgCom>
    </div>
    <div class="contentEchartsDiv">
      <el-scrollbar style="height: 100%">
        <div class="first_panel">
          <div class="first_left_panel">
            <div>
              <div
                style="border: 1px solid; border-top-style: none; border-left-style: none; border-right-style: none; border-bottom-color: darkgrey;">
                <h3 style="margin-left: 5px">当前异常处理情况</h3>
              </div>
              <div id="expetionHandling">

              </div>
            </div>
          </div>
          <div class="first_right_panel">
            <div>
              <div
                style="border: 1px solid; border-top-style: none; border-left-style: none; border-right-style: none; border-bottom-color: darkgrey;">
                <h3 style="margin-left: 5px">异常详情</h3>
              </div>

            </div>
          </div>
        </div>
        <div class="second_panel">
          <div class="table_container">
            <el-table
              v-loading="exception.gridLoading"
              :data="exception.exceptionList"
              :style="exception.gridTableStyle"
              :height="exception.gridTableStyle.height"
              align='center'
              ref="exception"
              highlight-current-row
            >
              <el-table-column
                prop="ogName"
                label="所属区域"
                min-width="300"
              >
              </el-table-column>
              <el-table-column
                prop="paramHistoryNum"
                label="已处理参数异常"
                min-width="150"
              >
              </el-table-column>
              <el-table-column
                prop="feaHistoryNum"
                label="已处理特征异常"
                min-width="150"
              >
              </el-table-column>
              <el-table-column
                prop="paramCurrentNum"
                label="未处理参数异常"
                min-width="150"
              >
              </el-table-column>
              <el-table-column
                prop="feaCurrentNum"
                label="未处理特征异常"
                min-width="150"
              >
              </el-table-column>
              <el-table-column
                label="异常报告"
                fixed="right"
                align='center'
                width="100px"
              >
                <template slot-scope="scope">
                  <div class="operate-groups">
                    <el-button
                      type="info"
                      size="mini"
                      @click="_viewException(scope.$index, scope.row)">查看
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-scrollbar>
    </div>

    <!--查看-->
    <el-dialog
      :title="viewException.title"
      :visible.sync="viewException.show"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :modal-append-to-body="false"
      :modal="true"
      :width="viewException.width"
      @close="_closeExceptionViewDialog"
    >
      <template>
        <viewExceptionCom
          ref="viewExceptionRef"
          v-if="viewException.dialogVisible"
          @_closeExceptionViewDialog="_closeExceptionViewDialog()"
        ></viewExceptionCom>
      </template>
    </el-dialog>

    <!--查看历史-->
    <el-dialog
      :title="viewExceptionHistory.title"
      :visible.sync="viewExceptionHistory.show"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :modal-append-to-body="false"
      :modal="true"
      :width="viewExceptionHistory.width"
      :style="viewExceptionHistory.style"
      @close="_closeExceptionHistoryViewDialog"
    >
      <template>
        <viewExceptionHistoryCom
          ref="viewExceptionHistoryRef"
          v-if="viewExceptionHistory.dialogVisible"
          @_closeExceptionHistoryViewDialog="_closeExceptionHistoryViewDialog()"
        ></viewExceptionHistoryCom>
      </template>
    </el-dialog>

  </div>
</template>

<script>
import viewOrgCom from "../org/viewOrg.vue";
import viewExceptionCom from "./viewException.vue";
import viewExceptionHistoryCom from "./viewExceptionHistory.vue";
import echarts from 'echarts';

export default {
  name: "manageException",
  components: {viewOrgCom, viewExceptionCom, viewExceptionHistoryCom},
  data () {
    return {
      idFlag: false,
      orgTreeStyle: {
        height: ''
      },
      contentDivStyle: {
        height: ''
      },
      exception: {
        sortNum: 0,
        gridLoading: false,
        exceptionAllList: [],
        exceptionList: [],
        gridTableStyle: {
          width: '100%',
          height: (window.innerHeight / 2) - 60 + 'px'
        },
        pagination: {
          page_index: 1,  // 当前位于哪页
          total: 0,        // 总数
          page_size: 5,   // 1页显示多少条
          page_sizes: [5, 10, 15, 20],  //每页显示多少条
          layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
        },
        selectedDate: [],
        expetionHandlingOption: {
          /*color: ['#3398DB'],*/
          tooltip: {
            formatter: '{b} <br/>已处理参数异常:{c0} <br/>已处理特征异常: {c1}<br/>未处理参数异常: {c2}<br/>未处理特征异常: {c3}',
            /* formatter: '{a} <br/>预测输出值:{b} <br/>归一化预测输出值: {c}',*/
            //formatter: this._getExceptionToolTip,
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            data: ['已处理参数异常', '已处理特征异常', '未处理参数异常', '未处理特征异常'],
            left: 'left',
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
                icon:'path://M525.4 721.2H330.9c-9 0-18.5-7.7-18.5-18.1V311c0-9 9.3-18.1 18.5-18.1h336.6c9.3 0 18.5 9.1 18.5 18.1v232.7c0 6 8.8 12.1 15 12.1 6.2 0 15-6 15-12.1V311c0-25.6-25.3-48.9-50.1-48.9h-335c-26.2 0-50.1 23.3-50.1 48.9v389.1c0 36.3 20 51.5 50.1 51.5h197.6c6.2 0 9.3-7.5 9.3-15.1 0-6-6.2-15.3-12.4-15.3zM378.8 580.6c-6.2 0-12.3 8.6-12.3 14.6s6.2 14.6 12.3 14.6h141.4c6.2 0 12.3-5.8 12.3-13.4 0.3-9.5-6.2-15.9-12.3-15.9H378.8z m251.6-91.2c0-6-6.2-14.6-12.3-14.6H375.7c-6.2 0-12.4 8.6-12.4 14.6s6.2 14.6 12.4 14.6h240.8c6.2 0.1 13.9-8.5 13.9-14.6z m-9.2-120.5H378.8c-6.2 0-12.3 8.6-12.3 14.6s6.2 14.6 12.3 14.6h240.8c7.7 0 13.9-8.6 13.9-14.6s-6.2-14.6-12.3-14.6z m119.4 376.6L709 714.1c9.2-12 14.6-27 14.6-43.2 0-39.4-32.1-71.4-71.8-71.4-39.7 0-71.8 32-71.8 71.4s32.1 71.4 71.8 71.4c16.3 0 31.3-5.4 43.4-14.5l31.6 31.5c3.8 3.8 10 3.8 13.8 0 3.8-3.8 3.8-10 0-13.8z m-88.8-23.6c-28.3 0-51.3-22.8-51.3-51s23-51 51.3-51c28.3 0 51.3 22.8 51.3 51s-23 51-51.3 51z',
                onclick: this._viewExceptionHistory
              },
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
              type: 'value'
            }
          ],
          series: [
            {
              name: '已处理参数异常',
              type: 'bar',
              barGap: 0,
              data: []
            },
            {
              name: '已处理特征异常',
              type: 'bar',
              data: []
            },
            {
              name: '未处理参数异常',
              type: 'bar',
              data: []
            },
            {
              name: '未处理特征异常',
              type: 'bar',
              data: []
            }
          ]
        }
      },
      ogIdList: [],
      currentNodeList: {},
      //查看模型
      viewException: {
        show: false,
        title: '查看',
        viewExceptionLoading: false,
        dialogVisible: true,
        formLabelWidth: '120px',
        width: '1080px',
      },
      viewExceptionHistory: {
        show: false,
        title: '查看历史',
        viewExceptionHistoryLoading: false,
        dialogVisible: true,
        formLabelWidth: '120px',
        width: '1080px',
        style : {
          height : '800px',
        }
      },
    }
  },
  created () {
    this._initException();
    this._selectException();
    this.$nextTick(_ => {
      this.$refs.viewOrgComRef._getUserRoleOrgTreeByException();
    })
  },
  mounted () {
    this._initExpetionHandling();
  },
  methods: {
    _initException () {
      this.orgTreeStyle.height = window.innerHeight - 110 + 'px'
      this.contentDivStyle.height = window.innerHeight - 110 + 'px'
    },
    _initExpetionHandling () {
      if (this.exception.exceptionList.length > 0) {
        let xAxisData = [];
        let seriesData_0 = [];
        let seriesData_1 = [];
        let seriesData_2 = [];
        let seriesData_3 = [];
        this.exception.exceptionList.forEach((item, index) => {
          xAxisData.push(item.ogName);
          seriesData_0.push({
            value: item.paramHistoryNum
          });
          seriesData_1.push({
            value: item.feaHistoryNum,
          })
          seriesData_2.push({
            value: item.paramCurrentNum,
          })
          seriesData_3.push({
            value: item.feaCurrentNum,
          })
        });

        this.exception.expetionHandlingOption.xAxis[0].data = xAxisData;
        this.exception.expetionHandlingOption.series[0].data = seriesData_0;
        this.exception.expetionHandlingOption.series[1].data = seriesData_1;
        this.exception.expetionHandlingOption.series[2].data = seriesData_2;
        this.exception.expetionHandlingOption.series[3].data = seriesData_3;
      }

      let expetionHandlingChart = echarts.init(document.getElementById('expetionHandling'));
      expetionHandlingChart.setOption(this.exception.expetionHandlingOption, true);
    },
    _handleOnClickOrg (args) {
      this._clearData();

      const id = args[0];
      const ogId = args[1];
      const orgLevel = args[2];
      const ogName = args[4];
      const orgDataList = this.$refs.viewOrgComRef.data;
      this._getCurrenNodeList(id, orgDataList);

      if (this.currentNodeList.level == 3) {
        this.ogIdList.push(this.currentNodeList.ogId);
      } else {
        this._getOgIdList(this.currentNodeList.childList);
      }

      this._setExceptionTableData();
      this._initExpetionHandling();
    },
    _setExceptionTableData () {
      let data = [];
      for (let i = 0; i < this.exception.exceptionAllList.length; i++) {
        for (let j = 0; j < this.ogIdList.length; j++) {
          if (this.exception.exceptionAllList[i].ogId == this.ogIdList[j]) {
            data.push(this.exception.exceptionAllList[i]);
            break;
          }
        }
      }

      this.exception.exceptionList = data;
    },
    _clearData () {
      this.ogIdList = [];
      this.currentNodeList = {};
      this.exception.exceptionList = [];

      this.exception.expetionHandlingOption.xAxis[0].data = [];
      this.exception.expetionHandlingOption.series[0].data = [];
      this.exception.expetionHandlingOption.series[1].data = [];
      this.exception.expetionHandlingOption.series[2].data = [];
      this.exception.expetionHandlingOption.series[3].data = [];
    },
    _getCurrenNodeList (id, orgDataList) {
      for (let i = 0; i < orgDataList.length; i++) {
        if (id == orgDataList[i].id) {
          this.currentNodeList = orgDataList[i];
          return;
        } else if (orgDataList[i].childList != null) {
          this._getCurrenNodeList(id, orgDataList[i].childList)
        }
      }
    },
    _getOgIdList (currentNodeList) {
      for (let i = 0; i < currentNodeList.length; i++) {
        if (currentNodeList[i].level == 3) {
          this.ogIdList.push(currentNodeList[i].ogId);
        } else if (currentNodeList[i].childList.length > 0) {
          this._getOgIdList(currentNodeList[i].childList)
        }
      }
    },
    _selectException () {
      this.exception.exceptionAllList = [];

      this.$http({
        url: '/api/api/alarm/getTodayAlarmCountByUserRoleOrg',
        "content-type": "application/json",
        method: 'get',
      }).then(res => {
        if (res.data.status == 1) {
          this.exception.exceptionAllList = res.data.result;

        } else {
          this.$message({message: res.data.msg, type: 'error'});
        }
      })
    },
    _viewException (index, row) {
      this.viewException.show = true;
      this.viewException.dialogVisible = true;
      this.$nextTick(_ => {
        this.$refs.viewExceptionRef.oid = row.oid;
        this.$refs.viewExceptionRef._selectException();
      })
    },
    _viewExceptionHistory (index, row) {
      this.viewExceptionHistory.show = true;
      this.viewExceptionHistory.dialogVisible = true;
    },
    //关闭查询模型监听
    _closeExceptionViewDialog () {
      this.viewException.dialogVisible = false;
      this.viewException.show = false;
    },
    //关闭查看历史监听
    _closeExceptionHistoryViewDialog () {
      this.viewExceptionHistory.dialogVisible = false;
      this.viewExceptionHistory.show = false;
    }
  }
}
</script>

<style lang="less" scoped>
  .echartsColClass {
    width: 100%;
    height: calc(~"50vh - 48px");
    min-width: 540px;
  }

  .rowTableClass {
    width: 100%;
    background-color: blue;
    height: calc(~"50vh - 78px");
  }

  .expetionInfo {
    border-left: 2px solid #ccc;
  }

  .first_panel {
    position: relative;
    width: 100%;
    /*background-color: aqua;*/
    height: calc(~"50vh - 62px");
    margin-bottom: 10px;
    min-width: 1050px;
    min-height: 300px;
  }

  .first_left_panel {
    position: absolute;
    top: 0px;
    left: 10px;
    width: 49%;
    bottom: 0px;
    min-width: 480px;
  }

  .first_right_panel {
    position: absolute;
    top: 0px;
    width: 49%;
    right: 10px;
    bottom: 0px;
    min-width: 480px;
  }

  .second_panel {
    position: relative;
    width: 100%;
    /*background-color: brown;*/
    height: calc(~"50vh - 62px");
    min-width: 1050px;
    min-height: 300px;
  }

  #expetionHandling {
    width: 100%;
    height: calc(~"50vh - 128px");
  }
</style>
