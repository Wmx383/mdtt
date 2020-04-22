<template>
  <div>
    <div style="margin-left: 5px; margin-top: 5px">
      <el-form
        :inline="true"
        class="demo-form-inline search-form">

        <el-form-item>
          <span>选择日期:&nbsp;&nbsp;&nbsp;</span>
          <el-date-picker
            v-model="forecastParameterHistoryForm.date"
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
    <div class="leftDiv">
      <div class="forecastParameterHistoryTitle">
        <span>{{title}}</span>
      </div>
      <div class="selectedLegend">
        <el-checkbox-group v-model="modelParamCheckedList" @change="_handleCheckedModelParamChange">
          <el-checkbox v-for="item in modelParamList" :label="item.name" :key="item.id"
                       :title="item.name"></el-checkbox>
        </el-checkbox-group>
      </div>

      <div id="forecastParameterHistoryEcharts">

      </div>
    </div>

    <div class="table_container">
      <el-table
        v-loading="forecastParameterHistory.gridLoading"
        :data="forecastParameterHistory.forecastParameterHistoryList"
        :style="forecastParameterHistory.gridTableStyle"
        :height="forecastParameterHistory.gridTableStyle.height"
        align='center'
        ref="forecastParameterHistoryTable"
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
          :label="forecastParameterHistory.columnName"
          align='left'
          min-width="200"
        >
        </el-table-column>
      </el-table>
    </div>
    <footer class="text_right">
      <el-button type="primary" size="small" @click="_closeForecastParameterHistoryViewDialog">取消</el-button>
    </footer>
  </div>

</template>

<script>
import moment from 'moment';
import echarts from 'echarts';

export default {
  name: "viewForecastParameterHistoryHistory",
  data () {
    return {
      forecastParameterHistoryForm: {
        date: []
      },
      title: '',
      modelParamCheckedList: [],
      modelParamList: [],//每次进来查询的对应输出还是输入的 modelParamList 永恒不变
      oid: '',
      forecastParameterHistory: {
        allList: [],
        columnName: '',
        dataList: [],
        option: {
          title: {
            text: '',
            show: false
          },
          grid: {},
          tooltip: {
            formatter: this._getToolTip,
            trigger: 'item',
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
            show: true,
            data: [],
            top: 20,
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
          series: []
        },
        sortNum: 0,
        gridLoading: false,
        forecastParameterHistoryAllList: [],
        forecastParameterHistoryPageList: [],
        forecastParameterHistoryList: [],
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
      modelId: '',
      type: '',
    }
  },
  methods: {
    _getToolTip (params) {
      let result = '';
      if (this.type == 'output') {
        let index = 0;
        let minValue = 0;
        let maxValue = 0;
        for (let i = 0; i < this.modelParamList.length; i++) {
          if (params.seriesName == this.modelParamList[i].name) {
            index = i;
            minValue = this.modelParamList[i].minValue;
            maxValue = this.modelParamList[i].maxValue;
            break;
          }
        }
        let gyz = 0;
        if (this.forecastParameterHistory.allList.limsOutputData.length > 0) {
          gyz = ((this.forecastParameterHistory.allList.limsOutputData[params.dataIndex][index] - minValue) / (maxValue - minValue)).toFixed(5);
        }
        result = params.seriesName + '<br/>时间:' + params.name + '<br/>预测参数归一值:' + params.value + '<br/>在线参数归一化:' + this.forecastParameterHistory.allList.actualOutputData[params.dataIndex][index] + '<br/>limis归一值:' + gyz + '';
      } else if (this.type == 'input') {
        result = params.seriesName + '<br/>时间:' + params.name + '<br/>输入值:' + params.value + '<br/>';
      } else {
        result = params.seriesName + '<br/>时间:' + params.name + '<br/>差值:' + params.value + '<br/>';
      }


      return result;
    },
    async _onChangeDate () {
      this.forecastParameterHistory.forecastParameterHistoryList = [];
      if (this.forecastParameterHistoryForm.date != null) {
        if (this.type == 'diff') {
          await this._getInputFeaturesStatistics();
        } else {
          await this._selectForecastParameterHistory();
        }
      } else {
        this._clearEcharts()
      }
    },
    _initForecastParameterHistoryEchartsByOutput () {
      this.title = '输出历史查询';
      this.forecastParameterHistory.option.xAxis.data = [];
      this.forecastParameterHistory.option.legend.data = [];
      this.forecastParameterHistory.option.series = [];
      //this.forecastParameterHistory.option.series[0].data = [];
      if (this.modelParamList.length > 0) {
        let legend = [];
        this.modelParamList.forEach((item, index) => {
          for (let i = 0; i < this.modelParamCheckedList.length; i++) {
            if (item.name == this.modelParamCheckedList[i]) {
              legend.push(item.name);
              let xAxisData = [];
              let data = [];
              this.forecastParameterHistory.dataList.forEach((item2, index2) => {
                xAxisData.push(index2);
                data.push({
                  value: item2[index + 1],
                  name: moment(parseInt(item2[0])).format('YYYY-MM-DD HH:mm:ss')
                })
              });

              this.forecastParameterHistory.option.series.push({
                name: item.name,
                data: data,
                type: 'line',
                smooth: true
              });

              this.forecastParameterHistory.option.xAxis.data = xAxisData;
            }
          }

        });
        this.forecastParameterHistory.option.legend.data = legend;
      }

      let forecastParameterHistoryEcharts = echarts.init(document.getElementById('forecastParameterHistoryEcharts'));
      forecastParameterHistoryEcharts.setOption(this.forecastParameterHistory.option, true);
      let that = this;
      forecastParameterHistoryEcharts.on('click', function (params) {
        that._handleOnclickByOutput(params);
      })
    },
    _initForecastParameterHistoryEchartsByInput () {
      this.title = '输入历史查询';
      this.forecastParameterHistory.option.xAxis.data = [];
      this.forecastParameterHistory.option.legend.data = [];
      this.forecastParameterHistory.option.series = [];

      if (this.modelParamList.length > 0) {
        let legend = [];
        this.modelParamList.forEach((item, index) => {
          for (let i = 0; i < this.modelParamCheckedList.length; i++) {
            if (item.name == this.modelParamCheckedList[i]) {
              legend.push(item.name);
              let xAxisData = [];
              let data = [];
              this.forecastParameterHistory.dataList.forEach((item2, index2) => {
                xAxisData.push(index2);
                data.push({
                  value: item2[index + 1],
                  name: moment(parseInt(item2[0])).format('YYYY-MM-DD HH:mm:ss')
                })
              });

              this.forecastParameterHistory.option.series.push({
                name: item.name,
                data: data,
                type: 'line',
                smooth: true
              });

              this.forecastParameterHistory.option.xAxis.data = xAxisData;
            }
          }

        });
        this.forecastParameterHistory.option.legend.data = legend;
      }

      let forecastParameterHistoryEcharts = echarts.init(document.getElementById('forecastParameterHistoryEcharts'));
      forecastParameterHistoryEcharts.setOption(this.forecastParameterHistory.option, true);

      let that = this;
      forecastParameterHistoryEcharts.on('click', function (params) {
        that._handleOnclickByOutput(params);
      })
    },
    _initForecastParameterHistoryEchartsByDiff () {
      this.title = '输入差值历史查询';
      this.forecastParameterHistory.option.xAxis.data = [];
      this.forecastParameterHistory.option.legend.data = [];
      this.forecastParameterHistory.option.series = [];

      if (this.modelParamList.length > 0) {
        let legend = [];
        this.modelParamList.forEach((item, index) => {
          for (let i = 0; i < this.modelParamCheckedList.length; i++) {
            if (item.name == this.modelParamCheckedList[i]) {
              legend.push(item.name);
              let xAxisData = [];
              let data = [];
              this.forecastParameterHistory.dataList.forEach((item2, index2) => {
                xAxisData.push(index2);
                data.push({
                  value: item2[index + 1],
                  name: moment(parseInt(item2[0])).format('YYYY-MM-DD HH:mm:ss')
                })
              });

              this.forecastParameterHistory.option.series.push({
                name: item.name,
                data: data,
                type: 'line',
                smooth: true
              });

              this.forecastParameterHistory.option.xAxis.data = xAxisData;
            }
          }

        });
        this.forecastParameterHistory.option.legend.data = legend;
      }

      let forecastParameterHistoryEcharts = echarts.init(document.getElementById('forecastParameterHistoryEcharts'));
      forecastParameterHistoryEcharts.setOption(this.forecastParameterHistory.option, true);

      let that = this;
      forecastParameterHistoryEcharts.on('click', function (params) {
        that._handleOnclickByOutput(params);
      })
    },
    _handleOnclickByOutput (params) {
      console.log(params);
      this.forecastParameterHistory.forecastParameterHistoryList = [
        {
          name: params.seriesName,
          date: params.name,
          data: params.value
        }
      ];
    },
    async _getModelFeaturesList (modelId, type) {
      this.modelId = modelId;
      this.type = type;
      this.forecastParameterHistory.forecastParameterHistoryAllList = [];
      await this.$http({
        url: '/api/api/modelParam/getModelParamList?modelId=' + modelId + '',
        "content-type": "application/json",
        method: 'get',
      }).then(res => {
        if (res.data.status == 1) {
          this.modelFeaturesList = res.data.result;
          if (type == 'output') {
            let modelParamConstList = [];
            let nameList = [];
            this.modelFeaturesList.forEach((item, index) => {
              if (item.type == '2') {
                nameList.push(item.name);
                modelParamConstList.push(item);
              }
            });
            this.modelParamCheckedList = nameList;
            this.modelParamList = JSON.parse(JSON.stringify(modelParamConstList));
            this._initForecastParameterHistoryEchartsByOutput();
            this._getDate();
            this._onChangeDate();
          } else if (type == 'input') {
            let modelParamConstList = [];
            let nameList = [];
            this.modelFeaturesList.forEach((item, index) => {
              if (item.type == '1') {
                nameList.push(item.name);
                modelParamConstList.push(item);
              }
            });
            this.modelParamCheckedList = nameList;
            this.modelParamList = JSON.parse(JSON.stringify(modelParamConstList));
            this._initForecastParameterHistoryEchartsByInput();
            this._getDate();
            this._onChangeDate();
          } else if (type == 'diff') {
            let modelParamConstList = [];
            let nameList = [];
            this.modelFeaturesList.forEach((item, index) => {
              if (item.type == '1') {
                nameList.push(item.name);
                modelParamConstList.push(item);
              }
            });
            this.modelParamCheckedList = nameList;
            this.modelParamList = JSON.parse(JSON.stringify(modelParamConstList));
            this._initForecastParameterHistoryEchartsByDiff();
            this._getDate();
            this._onChangeDate();
          }

        } else {
          this.$message({message: res.data.msg, type: 'error'});
        }
      })
    },
    _getDate () {
      console.log('初始化时间');
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
      let nowData = year + '-' + month + '-' + strDate
      this.forecastParameterHistoryForm.date = [nowData, nowData]  // 默认赋值一年时间
    },
    _getHistoryAlarmInfoListByOrgId (orgId) {

      alert('你点击到了我');
      /*if(this.flag){
        this.flag = false;

        this.forecastParameterHistory.gridLoading = true;
        this.forecastParameterHistory.forecastParameterHistoryPageList = [];
        this.forecastParameterHistory.forecastParameterHistoryList = [];

        this.$http({
          url: '/api/api/alarm/getHistoryAlarmInfoListByOrgId?orgId=' + orgId + '&fromTime=' + parseInt(moment((this.forecastParameterHistoryForm.date[0])).format('X') + '000') + '&toTime=' + parseInt(moment((this.forecastParameterHistoryForm.date[1])).format('X') + '000') + '',
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
            this.forecastParameterHistory.forecastParameterHistoryList = list;
            //模拟分页
            this._selectForecastParameterHistoryByPaging();
            this.flag = true;
          } else {
            this.$message({message: res.data.msg, type: 'error'});
            this.flag = true;
          }
        })
      }*/

    },
    _selectForecastParameterHistoryByPaging () {
      this.forecastParameterHistory.forecastParameterHistoryPageList = this.forecastParameterHistory.forecastParameterHistoryList.filter((item, index) =>
        index < this.forecastParameterHistory.pagination.page_index * this.forecastParameterHistory.pagination.page_size && index >= this.forecastParameterHistory.pagination.page_size * (this.forecastParameterHistory.pagination.page_index - 1)
      );
      this.forecastParameterHistory.pagination.total = this.forecastParameterHistory.forecastParameterHistoryList.length;

      this.forecastParameterHistory.gridLoading = false;
    },
    _clearEcharts () {
      this.forecastParameterHistory.forecastParameterHistoryList = [];
      this.forecastParameterHistory.dataList = [];
      if (this.type == 'output') {
        this._initForecastParameterHistoryEchartsByOutput();
      } else if (this.type == 'input') {
        this._initForecastParameterHistoryEchartsByInput();
      } else if (this.type == 'diff') {
        this._initForecastParameterHistoryEchartsByDiff();
      }
    },
    async _selectForecastParameterHistory () {
      this.forecastParameterHistory.dataList = [];
      await this.$http({
        url: '/api/api/preHistory/getFeaturesHistoryListByTime?modelId=' + this.modelId + '&fromTime=' + parseInt(moment((this.forecastParameterHistoryForm.date[0])).format('X') + '000') + '&toTime=' + parseInt(moment((this.forecastParameterHistoryForm.date[1])).format('X') + '000') + '&type=1',
        "content-type": "application/json",
        method: 'get',
      }).then(res => {
        if (res.data.status == 1) {
          let dataList = res.data.result.outputData;
          dataList = {
            inputData: [
              ["1565254804000", "0.44", "0.32", "0.51", "0.32", "0.86", "0.12", "0.52", "0.65", "0.78"],
              ["1565254819000", "0.44", "0.32", "0.51", "0.32", "0.86", "0.12", "0.52", "0.65", "0.78"],
              ["1565254834000", "0.44", "0.32", "0.51", "0.32", "0.86", "0.12", "0.52", "0.65", "0.78"],
              ["1565254849000", "0.44", "0.32", "0.51", "0.32", "0.86", "0.12", "0.52", "0.65", "0.78"],
              ["1565254864000", "0.44", "0.32", "0.51", "0.32", "0.86", "0.12", "0.52", "0.65", "0.78"],
              ["1565254879000", "0.44", "0.32", "0.51", "0.32", "0.86", "0.12", "0.52", "0.65", "0.78"],
              ["1565254894000", "0.44", "0.32", "0.51", "0.32", "0.86", "0.12", "0.52", "0.65", "0.78"],
              ["1565254909000", "0.44", "0.32", "0.51", "0.32", "0.86", "0.12", "0.52", "0.65", "0.78"],
              ["1565254924000", "0.44", "0.32", "0.51", "0.32", "0.86", "0.12", "0.52", "0.65", "0.78"],
              ["1565254939000", "0.44", "0.32", "0.51", "0.32", "0.86", "0.12", "0.52", "0.65", "0.78"],
              ["1565254954000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12", "0.65", "0.78"],
              ["1565254969000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12", "0.65", "0.78"],
              ["1565254984000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12", "0.65", "0.78"],
              ["1565254999000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12", "0.65", "0.78"],
              ["1565255014000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12", "0.65", "0.78"],
              ["1565255029000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12", "0.65", "0.78"],
              ["1565255044000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12", "0.65", "0.78"],
              ["1565255059000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12", "0.65", "0.78"],
              ["1565255074000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12", "0.65", "0.78"],
              ["1565255089000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12", "0.65", "0.78"],
              ["1565255104000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12", "0.65", "0.78"],
              ["1565255119000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12", "0.65", "0.78"],
              ["1565255134000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12", "0.65", "0.78"],
              ["1565255149000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12", "0.65", "0.78"],
              ["1565255164000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12", "0.65", "0.78"],
              ["1565255179000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12", "0.65", "0.78"],
              ["1565255194000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12", "0.65", "0.78"],
              ["1565255209000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12", "0.65", "0.78"],
              ["1565255224000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12", "0.65", "0.78"],
              ["1565255239000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12", "0.65", "0.78"],
              ["1565255254000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12", "0.65", "0.78"],
              ["1565255269000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12", "0.65", "0.78"],
              ["1565255284000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12", "0.65", "0.78"],
              ["1565255299000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12", "0.65", "0.78"],
              ["1565255314000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12", "0.65", "0.78"],
              ["1565255329000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12", "0.65", "0.78"],
              ["1565255344000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12", "0.65", "0.78"],
              ["1565255359000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12", "0.65", "0.78"],
              ["1565255374000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12", "0.65", "0.78"],
              ["1565255389000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12", "0.65", "0.78"],
              ["1565255404000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12", "0.65", "0.78"],
              ["1565255419000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12", "0.65", "0.78"],
              ["1565255434000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12", "0.65", "0.78"],
              ["1565255449000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12", "0.65", "0.78"],
              ["1565255464000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12", "0.65", "0.78"],
              ["1565255479000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12", "0.65", "0.78"],
              ["1565255494000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12", "0.65", "0.78"],
              ["1565255509000", "0.44", "0.32", "0.51", "0.32", "0.86", "0.12", "0.52", "0.65", "0.78"],
              ["1565255524000", "0.44", "0.32", "0.51", "0.32", "0.86", "0.12", "0.52", "0.65", "0.78"],
              ["1565255539000", "0.44", "0.32", "0.51", "0.32", "0.86", "0.12", "0.52", "0.65", "0.78"],
              ["1565255554000", "0.44", "0.32", "0.51", "0.32", "0.86", "0.12", "0.52", "0.65", "0.78"],
              ["1565255569000", "0.44", "0.32", "0.51", "0.32", "0.86", "0.12", "0.52", "0.65", "0.78"],
              ["1565255584000", "0.44", "0.32", "0.51", "0.32", "0.86", "0.12", "0.52", "0.65", "0.78"],
              ["1565255599000", "0.44", "0.32", "0.51", "0.32", "0.86", "0.12", "0.52", "0.65", "0.78"],
              ["1565255614000", "0.44", "0.32", "0.51", "0.32", "0.86", "0.12", "0.52", "0.65", "0.78"]

            ],
            outputData: [
              ["1565254804000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565254819000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565254834000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565254849000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565254864000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565254879000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565254894000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565254909000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565254924000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565254939000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565254954000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565254969000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565254984000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565254999000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565255014000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565255029000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565255044000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565255059000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565255074000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565255089000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565255104000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565255119000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565255134000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565255149000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565255164000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565255179000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565255194000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565255209000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565255224000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565255239000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565255254000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565255269000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565255284000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565255299000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565255314000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565255329000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565255344000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565255359000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565255374000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565255389000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565255404000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565255419000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565255434000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565255449000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565255464000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565255479000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565255494000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565255509000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565255524000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565255539000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565255554000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565255569000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565255584000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565255599000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565255614000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565255629000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565255644000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565255659000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565255674000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565255689000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565255704000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565255719000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565255734000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565255749000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565255764000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565255779000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565255794000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565255809000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565255824000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565255839000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565255854000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565255869000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565255884000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565255899000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565255914000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565255929000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565255944000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565255959000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565255974000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565255989000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565256004000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565256019000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565256034000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565256049000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565256064000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565256079000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565256094000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565256109000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565256124000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565256139000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565256154000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565256169000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565256184000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565256199000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565256214000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565256229000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565256244000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565256259000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565256274000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565256289000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565256304000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565256319000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565256334000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565256349000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565256364000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565256379000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565256394000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565256409000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565256424000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565256439000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565256454000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565256469000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565256484000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565256499000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565256514000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565256529000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565256544000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565256559000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565256574000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565256589000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565256604000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565256619000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565256634000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565256649000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565256664000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565256679000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565256694000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565256709000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565256724000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565256739000", "0.57", "0.53", "0.58", "0.54", "0.59"],
              ["1565256754000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565256769000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565256784000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565256799000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565256814000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565256829000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565256844000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565256859000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565256874000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565256889000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565256904000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565256919000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565256934000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565256949000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565256964000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565256979000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565256994000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565257009000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565257024000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565257039000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565257054000", "0.77", "0.23", "0.78", "0.84", "0.99"],
              ["1565257069000", "0.77", "0.23", "0.78", "0.84", "0.99"]
            ],//预测
            actualOutputData: [
              ["0.39", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"],
              ["0.36", "0.54", "0.39", "0.22", "0.56"]
            ],//在线
            limsOutputData: [
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.57", "0.53", "0.58", "0.54", "0.59"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"],
              ["0.23", "0.06", "0.22", "0.39", "0.14"]
            ],//实际
          };
          this.forecastParameterHistory.allList = dataList;
          //假数据
          if (this.type == 'output') {
            this.forecastParameterHistory.dataList = dataList.outputData;
            this._initForecastParameterHistoryEchartsByOutput();
          } else if (this.type == 'input') {
            this.forecastParameterHistory.dataList = dataList.inputData;
            this._initForecastParameterHistoryEchartsByInput();
          }


        } else {
          this.$message({message: res.data.msg, type: 'error'});
        }
      })
    },
    async _getInputFeaturesStatistics () {
      this.forecastParameterHistory.dataList = [];
      await this.$http({
        url: '/api/api/featuresHistory/getInputFeaturesStatistics?modelId=' + this.modelId + '&fromTime=' + parseInt(moment((this.forecastParameterHistoryForm.date[0])).format('X') + '000') + '&toTime=' + parseInt(moment((this.forecastParameterHistoryForm.date[1])).format('X') + '000') + '&type=1',
        "content-type": "application/json",
        method: 'get',
      }).then(res => {
        if (res.data.status == 1) {
          let dataList = res.data.result.differenctValue;
          dataList = [["1565254804000", "0.44", "0.32", "0.51", "0.32", "0.86", "0.12", "0.52"],
            ["1565254819000", "0.44", "0.32", "0.51", "0.32", "0.86", "0.12", "0.52"],
            ["1565254834000", "0.44", "0.32", "0.51", "0.32", "0.86", "0.12", "0.52"],
            ["1565254849000", "0.44", "0.32", "0.51", "0.32", "0.86", "0.12", "0.52"],
            ["1565254864000", "0.44", "0.32", "0.51", "0.32", "0.86", "0.12", "0.52"],
            ["1565254879000", "0.44", "0.32", "0.51", "0.32", "0.86", "0.12", "0.52"],
            ["1565254894000", "0.44", "0.32", "0.51", "0.32", "0.86", "0.12", "0.52"],
            ["1565254909000", "0.44", "0.32", "0.51", "0.32", "0.86", "0.12", "0.52"],
            ["1565254924000", "0.44", "0.32", "0.51", "0.32", "0.86", "0.12", "0.52"],
            ["1565254939000", "0.44", "0.32", "0.51", "0.32", "0.86", "0.12", "0.52"],
            ["1565254954000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12"],
            ["1565254969000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12"],
            ["1565254984000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12"],
            ["1565254999000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12"],
            ["1565255014000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12"],
            ["1565255029000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12"],
            ["1565255044000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12"],
            ["1565255059000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12"],
            ["1565255074000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12"],
            ["1565255089000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12"],
            ["1565255104000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12"],
            ["1565255119000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12"],
            ["1565255134000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12"],
            ["1565255149000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12"],
            ["1565255164000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12"],
            ["1565255179000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12"],
            ["1565255194000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12"],
            ["1565255209000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12"],
            ["1565255224000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12"],
            ["1565255239000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12"],
            ["1565255254000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12"],
            ["1565255269000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12"],
            ["1565255284000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12"],
            ["1565255299000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12"],
            ["1565255314000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12"],
            ["1565255329000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12"],
            ["1565255344000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12"],
            ["1565255359000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12"],
            ["1565255374000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12"],
            ["1565255389000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12"],
            ["1565255404000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12"],
            ["1565255419000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12"],
            ["1565255434000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12"],
            ["1565255449000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12"],
            ["1565255464000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12"],
            ["1565255479000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12"],
            ["1565255494000", "0.21", "0.92", "0.11", "0.92", "0.66", "0.22", "0.12"],
            ["1565255509000", "0.44", "0.32", "0.51", "0.32", "0.86", "0.12", "0.52"],
            ["1565255524000", "0.44", "0.32", "0.51", "0.32", "0.86", "0.12", "0.52"],
            ["1565255539000", "0.44", "0.32", "0.51", "0.32", "0.86", "0.12", "0.52"],
            ["1565255554000", "0.44", "0.32", "0.51", "0.32", "0.86", "0.12", "0.52"],
            ["1565255569000", "0.44", "0.32", "0.51", "0.32", "0.86", "0.12", "0.52"],
            ["1565255584000", "0.44", "0.32", "0.51", "0.32", "0.86", "0.12", "0.52"],
            ["1565255599000", "0.44", "0.32", "0.51", "0.32", "0.86", "0.12", "0.52"],
            ["1565255614000", "0.44", "0.32", "0.51", "0.32", "0.86", "0.12", "0.52"]];
          this.forecastParameterHistory.dataList = dataList;
          this._initForecastParameterHistoryEchartsByDiff();
        } else {
          this.$message({message: res.data.msg, type: 'error'});
        }
      })
    },
    _closeForecastParameterHistoryViewDialog () {
      this.$emit('_closeForecastParameterHistoryViewDialog');
    },
    _handleCheckedModelParamChange (value) {
      //console.log(this.modelParamCheckedList);
      //console.log(this.forecastParameterHistory.option.series[0].name);
      //console.log(this.forecastParameterHistory.option.series[1].name);
      this._initForecastParameterHistoryEchartsByOutput();
    }
  }
}
</script>

<style scoped>
  .leftDiv {
    position: relative;
    width: 240px;
    height: 380px;
    border: 1px solid rgba(0, 21, 41, 0.08);
  }

  .forecastParameterHistoryTitle {
    position: absolute;
    left: 0;
    width: 240px;
    height: 30px;
    overflow: hidden;
    font-size: 20px;
    text-align: center;
    font-weight: bold;
  }

  .selectedLegend {
    position: absolute;
    left: 0px;
    top: 40px;
    width: 240px;
    height: 380px;
    overflow: hidden;
  }

  .text_right {
    text-align: right;
  }

  #forecastParameterHistoryEcharts {
    margin-left: 180px;
    height: 380px;
    width: 900px;
  }
</style>
