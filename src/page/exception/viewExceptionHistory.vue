<template>
  <div>
    <div style="margin-left: 5px; margin-top: 5px">
      <el-form
        :inline="true"
        class="demo-form-inline search-form">

        <el-form-item>
          <span>选择日期:&nbsp;&nbsp;&nbsp;</span>
          <el-date-picker
            v-model="exceptionHistoryForm.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            unlink-panels
            value-format="yyyy-MM-dd"
            @change="_onChangeDate"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
    </div>

    <div id="exceptionHistoryEcharts">

    </div>

    <div class="table_container">
      <el-table
        v-loading="exceptionHistory.gridLoading"
        :data="exceptionHistory.exceptionHistoryList"
        :style="exceptionHistory.gridTableStyle"
        :height="exceptionHistory.gridTableStyle.height"
        align='center'
        ref="exceptionHistoryTable"
        highlight-current-row
      >
        <el-table-column
          prop="modelName"
          label="异常模型"
          align='left'
          min-width="200"
        >
        </el-table-column>
        <el-table-column
          prop="alarmType"
          label="异常类型"
          align='left'
          min-width="200"
        >
        </el-table-column>
        <el-table-column
          prop="parent"
          label="模型所属层级"
          align='left'
          min-width="200"
        >
        </el-table-column>
        <el-table-column
          prop="limit"
          label="参数上下限"
          align='left'
          min-width="200"
        >
        </el-table-column>
        <el-table-column
          prop="alarmVal"
          label="超限值"
          align='left'
          min-width="200"
        >
        </el-table-column>
        <el-table-column
          prop="alarmDate"
          label="时间"
          align='left'
          min-width="200"
        >
        </el-table-column>
        <el-table-column
          prop="confirmTime"
          label="确认时间"
          align='left'
          min-width="200"
        >
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述"
          align='left'
          min-width="200"
        >
        </el-table-column>
        <el-table-column
          prop="reason"
          label="原因"
          align='left'
          min-width="200"
        >
        </el-table-column>
      </el-table>
      <el-row>
        <el-col :span="24">
          <div class="pagination">
            <el-pagination
              :page-sizes="exceptionHistory.pagination.page_sizes"
              :page-size="exceptionHistory.pagination.page_size"
              :layout="exceptionHistory.pagination.layout"
              :total="exceptionHistory.pagination.total"
              :current-page='exceptionHistory.pagination.page_index'
              @current-change='_handleCurrentChange'
              @size-change='_handleSizeChange'>
            </el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>
    <footer class="text_right">
      <el-button type="primary" size="small" @click="_closeExceptionHistoryViewDialog">取消</el-button>
    </footer>
  </div>

</template>

<script>
import moment from 'moment';
import echarts from 'echarts';

export default {
  name: "viewExceptionHistoryHistory",
  data () {
    return {
      exceptionHistoryForm: {
        date: []
      },
      oid: '',
      exceptionHistory: {
        option: {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          toolbox: {
            feature: {
              magicType: {show: true, type: ['line', 'bar']},
              saveAsImage: {show: true}
            }
          },
          legend: {
            data: ['已处理', '未处理']
          },
          xAxis: [
            {
              type: 'category',
              data: [],
              axisPointer: {
                type: 'shadow'
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '未处理'
            },
            {
              show: true,
              type: 'value',
              scale: true,
              name: '已处理',
              max: 50,
              min: 0,
            }
          ],
          series: [
            {
              name: '已处理',
              type: 'bar',
              yAxisIndex: 1,
              data: []
            },
            {
              name: '未处理',
              type: 'bar',
              data: []
            }
          ]
        },
        sortNum: 0,
        gridLoading: false,
        exceptionHistoryAllList: [],
        exceptionHistoryPageList: [],
        exceptionHistoryList: [],
        gridTableStyle: {
          width: '100%',
          height: window.innerHeight - 350 + 'px'
        },
        pagination: {
          page_index: 1,  // 当前位于哪页
          total: 0,        // 总数
          page_size: 20,   // 1页显示多少条
          page_sizes: [5, 10, 15, 20],  //每页显示多少条
          layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
        },
        selectedDate: [],
      },
      flag : true
    }
  },
  mounted () {
    this._initExceptionHistory();
    //this._selectExceptionHistory();
  },
  methods: {
    async _initExceptionHistory () {
      this.getDate();
      await this._selectExceptionHistory();
      this._initExceptionHistoryEcharts();
    },
    _initExceptionHistoryEcharts () {
      this.exceptionHistory.option.xAxis[0].data = [];
      this.exceptionHistory.option.series[0].data = [];
      this.exceptionHistory.option.series[1].data = [];

      if (this.exceptionHistory.exceptionHistoryAllList.length > 0) {
        let xAxisData = [];
        let seriesData_0 = [];
        let seriesData_1 = [];
        this.exceptionHistory.exceptionHistoryAllList.forEach((item, index) => {
          xAxisData.push(item.ogName);
          seriesData_0.push({
            value: item.paramHistoryNum + item.feaHistoryNum,
            name: 3
          });
          seriesData_1.push({
            value: item.paramCurrentNum + item.feaCurrentNum,
            name: 3
          })
        });

        this.exceptionHistory.option.xAxis[0].data = xAxisData;
        this.exceptionHistory.option.series[0].data = seriesData_0;
        this.exceptionHistory.option.series[1].data = seriesData_1;
      }

      let exceptionHistoryEcharts = echarts.init(document.getElementById('exceptionHistoryEcharts'));
      exceptionHistoryEcharts.setOption(this.exceptionHistory.option, true);

      let that = this;
      exceptionHistoryEcharts.on('click', function (params) {
        that._getHistoryAlarmInfoListByOrgId(params.data.name);
      })

    },
    getDate () {
      let lastDay = new Date();
      let seperator1 = '-'
      lastDay.setTime(lastDay.getTime() - 24 * 60 * 60 * 1000);
      let lastYear = lastDay.getFullYear();
      let lastMonth = lastDay.getMonth() + 1
      let lastStrDate = lastDay.getDate();

      if (lastMonth >= 1 && lastMonth <= 9) {
        lastMonth = '0' + lastMonth
      }
      if (lastStrDate >= 0 && lastStrDate <= 9) {
        lastStrDate = '0' + lastStrDate
      }

      let lastDayFormat = lastYear + seperator1 + lastMonth + seperator1 + lastStrDate;

      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      let nowData = year + seperator1 + month + seperator1 + strDate
      this.exceptionHistoryForm.date = [lastDayFormat, nowData]  // 默认赋值一年时间
    },
    _getHistoryAlarmInfoListByOrgId (orgId) {
      if(this.flag){
        this.flag = false;

        this.exceptionHistory.gridLoading = true;
        this.exceptionHistory.exceptionHistoryPageList = [];
        this.exceptionHistory.exceptionHistoryList = [];

        this.$http({
          url: '/api/api/alarm/getHistoryAlarmInfoListByOrgId?orgId=' + orgId + '&fromTime=' + parseInt(moment((this.exceptionHistoryForm.date[0])).format('X') + '000') + '&toTime=' + parseInt(moment((this.exceptionHistoryForm.date[1])).format('X') + '000') + '',
          "content-type": "application/json",
          method: 'get',
        }).then(res => {
          if (res.data.status == 1) {
            const resultList = res.data.result;
            let list = [];
            for (let i = 0; i < resultList.length; i++) {
              const limit = resultList[i].lowerLimit + "-" + resultList[i].upperLimit;
              const tableItem = {
                alarmVal: resultList[i].value,
                modelName: resultList[i].modelName,
                alarmType: resultList[i].type == 0 ? '参数异常' : '特征异常',
                limit: limit,
                parent: resultList[i].value,
                alarmDate: moment(resultList[i].dataTime).format('YYYY-MM-DD HH:mm:ss'),
                status: resultList[i].status,
                confirmTime: resultList[i].confirmTime == null ? "未确认" : moment(resultList[i].confirmTime).format('YYYY-MM-DD HH:mm:ss'),
                description: resultList[i].description,
                reason: resultList[i].reason,
                id: resultList[i].id,
                key: resultList[i].id
              }
              list.push(tableItem)
            }
            console.log(list);
            this.exceptionHistory.exceptionHistoryList = list;
            //模拟分页
            this._selectExceptionHistoryByPaging();
            this.flag = true;
          } else {
            this.$message({message: res.data.msg, type: 'error'});
            this.flag = true;
          }
        })
      }

    },
    _selectExceptionHistoryByPaging () {
      this.exceptionHistory.exceptionHistoryPageList = this.exceptionHistory.exceptionHistoryList.filter((item, index) =>
        index < this.exceptionHistory.pagination.page_index * this.exceptionHistory.pagination.page_size && index >= this.exceptionHistory.pagination.page_size * (this.exceptionHistory.pagination.page_index - 1)
      );
      this.exceptionHistory.pagination.total = this.exceptionHistory.exceptionHistoryList.length;

      this.exceptionHistory.gridLoading = false;
    },
    async _onChangeDate () {
      //this.$message({message: '此功能敬请开发', type: 'warning'});
      await this._selectExceptionHistory();
      this._initExceptionHistoryEcharts();
    },
    async _selectExceptionHistory () {
      this.exceptionHistory.exceptionHistoryAllList = [];
      await this.$http({
        url: '/api/api/alarm/getHistoryAlarmCountByUserRoleOrg?timeType=1&fromTime=' + parseInt(moment((this.exceptionHistoryForm.date[0])).format('X') + '000') + '&toTime=' + parseInt(moment((this.exceptionHistoryForm.date[1])).format('X') + '000') + '',
        "content-type": "application/json",
        method: 'get',
      }).then(res => {
        if (res.data.status == 1) {
          this.exceptionHistory.exceptionHistoryAllList = res.data.result;

        } else {
          this.$message({message: res.data.msg, type: 'error'});
        }
      })
    },
    _closeExceptionHistoryViewDialog () {
      this.$emit('_closeExceptionHistoryViewDialog');
    },
    // 每页多少条切换
    _handleSizeChange (page_size) {
      this.exceptionHistory.pagination.page_size = page_size;
      this._selectExceptionHistoryByPaging()
    },
    // 上下分页
    _handleCurrentChange (page) {
      this.exceptionHistory.pagination.page_index = page;
      this._selectExceptionHistoryByPaging()
    },
  }
}
</script>

<style scoped>
  .text_right {
    text-align: right;
  }

  #exceptionHistoryEcharts {
    height: 500px;
    width: 100%;
  }
</style>
