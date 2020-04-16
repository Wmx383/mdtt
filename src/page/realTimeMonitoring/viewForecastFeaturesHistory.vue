<template>
  <div>
    <div style="margin-left: 5px; margin-top: 5px">
      <el-form
        :inline="true"
        class="demo-form-inline search-form">

        <el-form-item>
          <span>选择日期:&nbsp;&nbsp;&nbsp;</span>
          <el-date-picker
            v-model="forecastFeaturesHistoryForm.date"
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

    <div id="forecastFeaturesHistoryEcharts">

    </div>

    <div class="table_container">
      <el-table
        v-loading="forecastFeaturesHistory.gridLoading"
        :data="forecastFeaturesHistory.forecastFeaturesHistoryList"
        :style="forecastFeaturesHistory.gridTableStyle"
        :height="forecastFeaturesHistory.gridTableStyle.height"
        align='center'
        ref="forecastFeaturesHistoryTable"
        highlight-current-row
      >
        <el-table-column
          prop="alarmVal"
          label="参数"
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
          label="输入值"
          align='left'
          min-width="200"
        >
        </el-table-column>
      </el-table>
      <el-row>
        <el-col :span="24">
          <div class="pagination">
            <el-pagination
              :page-sizes="forecastFeaturesHistory.pagination.page_sizes"
              :page-size="forecastFeaturesHistory.pagination.page_size"
              :layout="forecastFeaturesHistory.pagination.layout"
              :total="forecastFeaturesHistory.pagination.total"
              :current-page='forecastFeaturesHistory.pagination.page_index'
              @current-change='_handleCurrentChange'
              @size-change='_handleSizeChange'>
            </el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>
    <footer class="text_right">
      <el-button type="primary" size="small" @click="_closeForecastFeaturesHistoryViewDialog">取消</el-button>
    </footer>
  </div>

</template>

<script>
import moment from 'moment';
import echarts from 'echarts';

export default {
  name: "viewForecastFeaturesHistoryHistory",
  data () {
    return {
      forecastFeaturesHistoryForm: {
        date: []
      },
      oid: '',
      forecastFeaturesHistory: {
        outputDataList : [],
        option: {
          title: {
            text: ''
          },
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
            data: [],
            left: 'center'
          },
          dataZoom: [{
            type: 'inside',
            startValue: '',
            endValue: '',
          }, {
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            handleStyle: {
              color: '#fff',
              shadowBlur: 3,
              shadowColor: 'rgba(0, 0, 0, 0.6)',
              shadowOffsetX: 2,
              shadowOffsetY: 2
            }
          }],
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: []
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '',
              data: [],
              type: 'line',
              areaStyle: {
                color:'#fff546'
              },
              smooth: true
            }
          ]
        },
        sortNum: 0,
        gridLoading: false,
        forecastFeaturesHistoryAllList: [],
        forecastFeaturesHistoryPageList: [],
        forecastFeaturesHistoryList: [],
        gridTableStyle: {
          width: '100%',
          height: window.innerHeight / 2 - 100 + 'px'
        },
        pagination: {
          page_index: 1,  // 当前位于哪页
          total: 0,        // 总数
          page_size: 5,   // 1页显示多少条
          page_sizes: [5, 10, 15, 20],  //每页显示多少条
          layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
        },
        selectedDate: [],
      },
      modelFeaturesList: [],
      flag: true,
      modelId : ''
    }
  },
  methods: {
    _initForecastFeaturesHistoryEchartsByOutput () {
      this.forecastFeaturesHistory.option.title.text = '输出历史查询';
      this.forecastFeaturesHistory.option.xAxis[0].data = [];
      this.forecastFeaturesHistory.option.series[0].data = [];

      if (this.forecastFeaturesHistory.outputDataList.length > 0) {
        let xAxisData = [];
        let seriesData_0 = [];
        this.forecastFeaturesHistory.outputDataList.forEach((item, index) => {
          xAxisData.push(item.ogName);
          seriesData_0.push({
            value: item.paramHistoryNum + item.feaHistoryNum,
            name: 3
          })
        });

        this.forecastFeaturesHistory.option.xAxis[0].data = xAxisData;
        this.forecastFeaturesHistory.option.series[0].data = seriesData_0;
      }

      let forecastFeaturesHistoryEcharts = echarts.init(document.getElementById('forecastFeaturesHistoryEcharts'));
      forecastFeaturesHistoryEcharts.setOption(this.forecastFeaturesHistory.option, true);

      let that = this;
      forecastFeaturesHistoryEcharts.on('click', function (params) {
        that._getHistoryAlarmInfoListByOrgId(params.data.name);
      })
    },
    async _getModelFeaturesList (modelId) {
      this.modelId = modelId;
      this.forecastFeaturesHistory.forecastFeaturesHistoryAllList = [];
      await this.$http({
        url: '/api/api/modelFeatures/getModelFeaturesList?modelId=' + modelId + '',
        "content-type": "application/json",
        method: 'get',
      }).then(res => {
        if (res.data.status == 1) {
          this.modelFeaturesList = res.data.result;
          console.log(res.data.result);

        } else {
          this.$message({message: res.data.msg, type: 'error'});
        }
      })
    },
    _getDate () {
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
      this.forecastFeaturesHistoryForm.date = [lastDayFormat, nowData]  // 默认赋值一年时间
    },
    _getHistoryAlarmInfoListByOrgId (orgId) {

      alert('你点击到了我');
      /*if(this.flag){
        this.flag = false;

        this.forecastFeaturesHistory.gridLoading = true;
        this.forecastFeaturesHistory.forecastFeaturesHistoryPageList = [];
        this.forecastFeaturesHistory.forecastFeaturesHistoryList = [];

        this.$http({
          url: '/api/api/alarm/getHistoryAlarmInfoListByOrgId?orgId=' + orgId + '&fromTime=' + parseInt(moment((this.forecastFeaturesHistoryForm.date[0])).format('X') + '000') + '&toTime=' + parseInt(moment((this.forecastFeaturesHistoryForm.date[1])).format('X') + '000') + '',
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
            this.forecastFeaturesHistory.forecastFeaturesHistoryList = list;
            //模拟分页
            this._selectForecastFeaturesHistoryByPaging();
            this.flag = true;
          } else {
            this.$message({message: res.data.msg, type: 'error'});
            this.flag = true;
          }
        })
      }*/

    },
    _selectForecastFeaturesHistoryByPaging () {
      this.forecastFeaturesHistory.forecastFeaturesHistoryPageList = this.forecastFeaturesHistory.forecastFeaturesHistoryList.filter((item, index) =>
        index < this.forecastFeaturesHistory.pagination.page_index * this.forecastFeaturesHistory.pagination.page_size && index >= this.forecastFeaturesHistory.pagination.page_size * (this.forecastFeaturesHistory.pagination.page_index - 1)
      );
      this.forecastFeaturesHistory.pagination.total = this.forecastFeaturesHistory.forecastFeaturesHistoryList.length;

      this.forecastFeaturesHistory.gridLoading = false;
    },
    async _onChangeDate () {
      //this.$message({message: '此功能敬请开发', type: 'warning'});
      await this._selectForecastFeaturesHistory();
      this._initForecastFeaturesHistoryEcharts();
    },
    async _selectForecastFeaturesHistory () {
      this.forecastFeaturesHistory.outputDataList = [];
      await this.$http({
        url: '/api/api/preHistory/getFeaturesHistoryListByTime?modelId='+ this.modelId +'&fromTime=' + parseInt(moment((this.forecastFeaturesHistoryForm.date[0])).format('X') + '000') + '&toTime=' + parseInt(moment((this.forecastFeaturesHistoryForm.date[1])).format('X') + '000') + '&type=1',
        "content-type": "application/json",
        method: 'get',
      }).then(res => {
        if (res.data.status == 1) {
          const outputDataList = res.data.result;
          console.log(outputDataList);
          this.forecastFeaturesHistory.outputDataList = outputDataList;

          this._initForecastFeaturesHistoryEchartsByOutput();

        } else {
          this.$message({message: res.data.msg, type: 'error'});
        }
      })
    },
    _closeForecastFeaturesHistoryViewDialog () {
      this.$emit('_closeForecastFeaturesHistoryViewDialog');
    },
    // 每页多少条切换
    _handleSizeChange (page_size) {
      this.forecastFeaturesHistory.forecastFeaturesHistoryList.pagination.page_size = page_size;
      this._selectForecastFeaturesHistoryByPaging()
    },
    // 上下分页
    _handleCurrentChange (page) {
      this.forecastFeaturesHistory.forecastFeaturesHistoryList.pagination.page_index = page;
      this._selectForecastFeaturesHistoryByPaging()
    },
  }
}
</script>

<style scoped>
  .text_right {
    text-align: right;
  }

  #forecastFeaturesHistoryEcharts {
    height: 500px;
    width: 100%;
  }
</style>
