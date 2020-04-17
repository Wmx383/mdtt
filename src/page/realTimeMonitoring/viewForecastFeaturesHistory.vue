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
          prop="name"
          label="参数"
          align='left'
          min-width="200"
        >
        </el-table-column>
        <el-table-column
          prop="date"
          label="时间"
          align='left'
          min-width="200"
        >
        </el-table-column>
        <el-table-column
          prop="data"
          label="输入值"
          align='left'
          min-width="200"
        >
        </el-table-column>
      </el-table>
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
            formatter: '{a} <br/>输入值:{b} <br/>归一化输入值: {c}',
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
            show : true,
            data: [],
            left: 'center'
          },
          dataZoom: [{
            type: 'inside',
            start: 0,
            end: 40,
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
          ]
        },
        sortNum: 0,
        gridLoading: false,
        forecastFeaturesHistoryAllList: [],
        forecastFeaturesHistoryPageList: [],
        forecastFeaturesHistoryList: [],
        gridTableStyle: {
          width: '100%',
          height: '100px'
        },
        pagination: {
          page_index: 1,  // 当前位于哪页
          total: 0,        // 总数
          page_size: 100,   // 1页显示多少条
          page_sizes: [20, 50, 100, 150],  //每页显示多少条
          layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
        },
        selectedDate: [],
      },
      modelFeaturesList: [],
      flag: true,
      modelId : '',
      type : ''
    }
  },
  methods: {
    _initForecastFeaturesHistoryEchartsByOutput () {
      this.forecastFeaturesHistory.option.title.text = '输出历史查询';
      this.forecastFeaturesHistory.option.xAxis.data = [];
      this.forecastFeaturesHistory.option.legend.data = [];
      this.forecastFeaturesHistory.option.series = [];
      //this.forecastFeaturesHistory.option.series[0].data = [];

      if(this.modelFeaturesList.length > 0){
        let legendData = [];
        this.modelFeaturesList.forEach((item, index) => {
          if(item.type == '2'){
            legendData.push(item.name);
            this.forecastFeaturesHistory.option.series.push({
              name: item.name,
              data: [],
              type: 'line',
              areaStyle: {
                color:'#fff546'
              },
              smooth: true
            });
          }
        });
        this.forecastFeaturesHistory.option.legend.data = legendData;
      }

      if (this.forecastFeaturesHistory.outputDataList.length > 0) {

        let seriesData_0 = [];
        let xAxisData = [];
        this.forecastFeaturesHistory.outputDataList.forEach((item, index) => {
          xAxisData.push(index);
          seriesData_0.push({
            value: item[1],
            name : moment(parseInt(item[1])).format('YYYY-MM-DD HH:mm:ss')
          })
        });

        this.forecastFeaturesHistory.option.xAxis.data = xAxisData;
        this.forecastFeaturesHistory.option.series[0].data = seriesData_0;
      }

      let forecastFeaturesHistoryEcharts = echarts.init(document.getElementById('forecastFeaturesHistoryEcharts'));
      forecastFeaturesHistoryEcharts.setOption(this.forecastFeaturesHistory.option, true);

      let that = this;
      forecastFeaturesHistoryEcharts.on('click', function (params) {
        that._handleOnclickByOutput(params);
      })
    },
    _handleOnclickByOutput(params){
      this.forecastFeaturesHistory.forecastFeaturesHistoryList = [
        {
          name : params.seriesName,
          date : params.name,
          data : params.value
        }
      ];
      console.log(params);
    },
    async _getModelFeaturesList (modelId, type) {
      this.modelId = modelId;
      this.type = type;
      this.forecastFeaturesHistory.forecastFeaturesHistoryAllList = [];
      await this.$http({
        url: '/api/api/modelFeatures/getModelFeaturesList?modelId=' + modelId + '',
        "content-type": "application/json",
        method: 'get',
      }).then(res => {
        if (res.data.status == 1) {
          this.modelFeaturesList = res.data.result;
          if(type == 'output'){
            this._initForecastFeaturesHistoryEchartsByOutput();
          }

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
      if(this.forecastFeaturesHistoryForm.date != null){
        if(this.type == 'output'){
          await this._selectForecastFeaturesHistory();
          this._initForecastFeaturesHistoryEchartsByOutput();
        }
      }else{
        this._clearEcharts()
      }
    },
    _clearEcharts(){
      this.forecastFeaturesHistory.forecastFeaturesHistoryList = [];
      this.forecastFeaturesHistory.outputDataList = [];
      this._initForecastFeaturesHistoryEchartsByOutput();
    },
    async _selectForecastFeaturesHistory () {
      this.forecastFeaturesHistory.outputDataList = [];
      await this.$http({
        url: '/api/api/preHistory/getFeaturesHistoryListByTime?modelId='+ this.modelId +'&fromTime=' + parseInt(moment((this.forecastFeaturesHistoryForm.date[0])).format('X') + '000') + '&toTime=' + parseInt(moment((this.forecastFeaturesHistoryForm.date[1])).format('X') + '000') + '&type=1',
        "content-type": "application/json",
        method: 'get',
      }).then(res => {
        if (res.data.status == 1) {
          let outputDataList = res.data.result.outputData;
          //假数据
          outputDataList = [
            ["1565254804000", "7"],
            ["1565254819000", "7"],
            ["1565254834000", "7"],
            ["1565254849000", "7"],
            ["1565254864000", "7"],
            ["1565254879000", "7"],
            ["1565254894000", "7"],
            ["1565254909000", "7"],
            ["1565254924000", "7"],
            ["1565254939000", "7"],
            ["1565254954000", "7"],
            ["1565254969000", "5"],
            ["1565254984000", "5"],
            ["1565254999000", "5"],
            ["1565255014000", "5"],
            ["1565255029000", "5"],
            ["1565255044000", "5"],
            ["1565255059000", "5"],
            ["1565255074000", "5"],
            ["1565255089000", "5"],
            ["1565255104000", "5"],
            ["1565255119000", "5"],
            ["1565255134000", "5"],
            ["1565255149000", "5"],
            ["1565255164000", "5"],
            ["1565255179000", "5"],
            ["1565255194000", "5"],
            ["1565255209000", "5"],
            ["1565255224000", "5"],
            ["1565255239000", "5"],
            ["1565255254000", "5"],
            ["1565255269000", "5"],
            ["1565255284000", "5"],
            ["1565255299000", "5"],
            ["1565255314000", "5"],
            ["1565255329000", "5"],
            ["1565255344000", "5"],
            ["1565255359000", "5"],
            ["1565255374000", "5"],
            ["1565255389000", "5"],
            ["1565255404000", "5"],
            ["1565255419000", "5"],
            ["1565255434000", "5"],
            ["1565255449000", "5"],
            ["1565255464000", "5"],
            ["1565255479000", "5"],
            ["1565255494000", "5"],
            ["1565255509000", "7"],
            ["1565255524000", "7"],
            ["1565255539000", "7"],
            ["1565255554000", "7"],
            ["1565255569000", "7"],
            ["1565255584000", "7"],
            ["1565255599000", "7"],
            ["1565255614000", "7"],
            ["1565255629000", "7"],
            ["1565255644000", "7"],
            ["1565255659000", "7"],
            ["1565255674000", "7"],
            ["1565255689000", "7"],
            ["1565255704000", "7"],
            ["1565255719000", "7"],
            ["1565255734000", "7"],
            ["1565255749000", "7"],
            ["1565255764000", "7"],
            ["1565255779000", "7"],
            ["1565255794000", "7"],
            ["1565255809000", "7"],
            ["1565255824000", "7"],
            ["1565255839000", "7"],
            ["1565255854000", "7"],
            ["1565255869000", "7"],
            ["1565255884000", "7"],
            ["1565255899000", "7"],
            ["1565255914000", "7"],
            ["1565255929000", "7"],
            ["1565255944000", "7"],
            ["1565255959000", "7"],
            ["1565255974000", "7"],
            ["1565255989000", "7"],
            ["1565256004000", "7"],
            ["1565256019000", "7"],
            ["1565256034000", "7"],
            ["1565256049000", "5"],
            ["1565256064000", "5"],
            ["1565256079000", "5"],
            ["1565256094000", "5"],
            ["1565256109000", "5"],
            ["1565256124000", "5"],
            ["1565256139000", "5"],
            ["1565256154000", "5"],
            ["1565256169000", "5"],
            ["1565256184000", "5"],
            ["1565256199000", "5"],
            ["1565256214000", "5"],
            ["1565256229000", "7"],
            ["1565256244000", "7"],
            ["1565256259000", "7"],
            ["1565256274000", "7"],
            ["1565256289000", "7"],
            ["1565256304000", "7"],
            ["1565256319000", "7"],
            ["1565256334000", "7"],
            ["1565256349000", "7"],
            ["1565256364000", "7"],
            ["1565256379000", "7"],
            ["1565256394000", "7"],
            ["1565256409000", "5"],
            ["1565256424000", "5"],
            ["1565256439000", "5"],
            ["1565256454000", "5"],
            ["1565256469000", "5"],
            ["1565256484000", "5"],
            ["1565256499000", "5"],
            ["1565256514000", "5"],
            ["1565256529000", "5"],
            ["1565256544000", "5"],
            ["1565256559000", "5"],
            ["1565256574000", "5"],
            ["1565256589000", "5"],
            ["1565256604000", "5"],
            ["1565256619000", "5"],
            ["1565256634000", "5"],
            ["1565256649000", "5"],
            ["1565256664000", "5"],
            ["1565256679000", "5"],
            ["1565256694000", "5"],
            ["1565256709000", "5"],
            ["1565256724000", "5"],
            ["1565256739000", "5"],
            ["1565256754000", "5"],
            ["1565256769000", "7"],
            ["1565256784000", "7"],
            ["1565256799000", "7"],
            ["1565256814000", "7"],
            ["1565256829000", "7"],
            ["1565256844000", "7"],
            ["1565256859000", "7"],
            ["1565256874000", "7"],
            ["1565256889000", "7"],
            ["1565256904000", "7"],
            ["1565256919000", "7"],
            ["1565256934000", "7"],
            ["1565256949000", "7"],
            ["1565256964000", "7"],
            ["1565256979000", "7"],
            ["1565256994000", "7"],
            ["1565257009000", "7"],
            ["1565257024000", "7"],
            ["1565257039000", "7"],
            ["1565257054000", "7"],
            ["1565257069000", "7"]
          ];
          this.forecastFeaturesHistory.outputDataList = outputDataList;

          this._initForecastFeaturesHistoryEchartsByOutput();

        } else {
          this.$message({message: res.data.msg, type: 'error'});
        }
      })
    },
    _closeForecastFeaturesHistoryViewDialog () {
      this.$emit('_closeForecastFeaturesHistoryViewDialog');
    }
  }
}
</script>

<style scoped>
  .text_right {
    text-align: right;
  }

  #forecastFeaturesHistoryEcharts {
    height: 380px;
    width: 100%;
  }
</style>
