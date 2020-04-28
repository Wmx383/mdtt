<template>
  <div>
    <div style="margin-left: 5px; margin-top: 5px">
      <el-form
        :inline="true"
        class="demo-form-inline search-form black-form">

        <el-form-item>
          <span style="color:#000;">选择日期:&nbsp;&nbsp;&nbsp;</span>
          <el-date-picker
            v-model="expressionResultHistoryForm.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            unlink-panels
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="类型:"
        >
          <el-select
            v-model="expressionResultHistoryForm.type"
            class="expressionResultFormClass"
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
          label="单位:"
        >
          <el-input
            v-model="expressionResultHistoryForm.unit"
            class="expressionResultFormClass"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="_selectExpressionResultHistory">查 询</el-button>
          <el-button type="primary" size="small" @click="_closeExpressionResultHistoryViewDialog">取 消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="expressionResultContentDiv">
      <div class="leftDiv">
        <div class="selectedLegend">
          <el-checkbox-group
            v-model="expressionResultHistory.expressionResultNameCheckedList"
            @change="_handleOutCheckedExpressionResultNameChange"
            >
            <el-checkbox v-for="(item,index) in expressionResultHistory.expressionResultNameList" :label="item.expressionName"
                         :key="item.id"
            ><span
              :style="{color : expressionResultHistory.expressionResultNameColorCheckedList[item.expressionName] ? item.color : '#000'}"
              :title="item.title">{{item.expressionName}}</span></el-checkbox>
          </el-checkbox-group>
        </div>
      </div>

      <div id="expressionResultHistoryEcharts" class="middleDiv">

      </div>

    </div>
  </div>
</template>

<script>
import moment from 'moment';
import echarts from 'echarts';

export default {
  name: "viewExpressionResultHistory",
  data () {
    return {
      expressionResultHistoryForm: {
        date: [],
        roomId: '',
        type: '',
        unit: ''
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
      allList: [],
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
            saveAsImage: {show: true}
          },
          right: '10px'
        },
        legend: {
          show: false,
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
        }],//测试
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: [],
          axisLine: {
            lineStyle: {
              color: '#000'
            }
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '公式结果',
            max: function (value) {
              return (value.max * (1.2)).toFixed(0);
            },
            axisLine: {
              lineStyle: {
                color: '#000'
              }
            }
          }],
        series: []
      },
      allColors: ['red', 'orange', '#333366', '#57E81A', 'blue', '#CC9900', '#9900FF', '#CC1691', '#7B68EE', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF', '#663399', '#660033'],
      expressionResultHistory: {
        list: [],
        expressionResultNameList: [],
        expressionResultNameCheckedList: [],
        expressionResultNameColorCheckedList: {},
      }
    }
  },
  methods: {
    _selectExpressionResultHistory () {
      if (this.expressionResultHistoryForm.date != null && this.expressionResultHistoryForm.date[0] != this.expressionResultHistoryForm.date[1]) {
        this.$message({message: '请选择一天时间', type: 'warning'});
        this.expressionResultHistoryForm.date = [];
        this._clearEcharts();
        return;
      }

      this.expressionResultHistory.expressionResultNameList = [];
      this.expressionResultHistory.expressionResultNameCheckedList = [];
      this.expressionResultHistory.expressionResultNameColorCheckedList = [];
      this.option.xAxis.data = [];
      this.option.series = [];

      this._initExpressionResultHistoryEcharts();

      this.$http({
        url: '/api/api/expressionResult/getExpressionResults?roomId=' + this.expressionResultHistoryForm.roomId + '&typeId=' + this.expressionResultHistoryForm.type + '&unitId=' + this.expressionResultHistoryForm.unit + '&fromTime=' + parseInt(moment((this.expressionResultHistoryForm.date[0])).format('X') + '000') + '&toTime=' + (parseInt(moment((this.expressionResultHistoryForm.date[1])).format('X') + '000') + 24 * 60 * 60 * 1000 - 1) + '',
        "content-type": "application/json",
        method: 'get',
      }).then(res => {
        if (res.data.status == 1) {
          this.expressionResultHistory.list = res.data.result;
          //假数据
          this.expressionResultHistory.list = [
            {
              expressionId: '1',
              expressionName: '塑料厂苯乙烯烷基化乙苯选择性',
              roomId: '011601',
              expressionResultList: [{
                id: '4',
                parsedExpression: 0.78,
                expressionId: '1',
                createTime: 1571293102256
              }, {
                id: '5',
                parsedExpression: 0.15,
                expressionId: '1',
                createTime: 1571293102256
              }, {
                id: '2',
                parsedExpression: 0.15,
                expressionId: '1',
                createTime: 1571293102256
              }, {
                id: '1',
                parsedExpression: 0.88,
                expressionId: '1',
                createTime: 1571293188766
              }]
            },
            {
              expressionId: '2',
              expressionName: '测试数据2',
              roomId: '011601',
              expressionResultList: [{
                id: '42',
                parsedExpression: 0.33,
                expressionId: '2',
                createTime: 1571293102256
              }, {
                id: '52',
                parsedExpression: 0.64,
                expressionId: '2',
                createTime: 1571293102256
              }, {
                id: '22',
                parsedExpression: 0.35,
                expressionId: '2',
                createTime: 1571293102256
              }, {
                id: '12',
                parsedExpression: 0.16,
                expressionId: '2',
                createTime: 1571293188766
              }, {
                id: '52',
                parsedExpression: 0.16,
                expressionId: '2',
                createTime: 1571293188766
              }, {
                id: '72',
                parsedExpression: 0.16,
                expressionId: '2',
                createTime: 1571293188766
              }]
            },
            {
              expressionId: '3',
              expressionName: '测试数据3',
              roomId: '011601',
              expressionResultList: [{
                id: '43',
                parsedExpression: 0.98,
                expressionId: '3',
                createTime: 1571293101265
              }, {
                id: '53',
                parsedExpression: 0.06,
                expressionId: '3',
                createTime: 1571293102256
              }, {
                id: '23',
                parsedExpression: 0.09,
                expressionId: '3',
                createTime: 1571293100354
              }, {
                id: '13',
                parsedExpression: 0.15,
                expressionId: '3',
                createTime: 1571293188766
              }]
            }
          ];
          let expressionNameList = [];
          let expressionResultNameColorCheckedList = {};
          this.expressionResultHistory.list.forEach((item, index) => {
            let tableItem = {
              expressionName: item.expressionName,
              id: item.id,
              color: this.allColors[expressionNameList.length]
            };
            expressionResultNameColorCheckedList[item.expressionName] = false;
            expressionNameList.push(tableItem);
          });
          this.expressionResultHistory.expressionResultNameList = JSON.parse(JSON.stringify(expressionNameList));
          this.expressionResultHistory.expressionResultNameCheckedList = [];
          this.expressionResultHistory.expressionResultNameColorCheckedList = expressionResultNameColorCheckedList;
          this._initExpressionResultHistoryEcharts();
        } else {
          this.$message({message: res.data.msg, type: 'error'});
        }
      })
    },
    _initExpressionResultHistoryEcharts () {
      this.option.xAxis.data = [];
      this.option.legend.data = [];
      this.option.series = [];

      let legend = [];
      let maxLength = 0;
      if (this.expressionResultHistory.list.length > 0) {
        this.expressionResultHistory.list.forEach((item, index) => {
          for (let i = 0; i < this.expressionResultHistory.expressionResultNameCheckedList.length; i++) {
            if (this.expressionResultHistory.expressionResultNameCheckedList[i] == item.expressionName) {
              legend.push(item.expressionName);
              let data = [];
              if (maxLength < item.expressionResultList.length) {
                maxLength = item.expressionResultList.length;
              }
              item.expressionResultList.forEach((item2, index2) => {
                data.push({
                  value: item2.parsedExpression,
                  name: moment(parseInt(item2.createTime)).format('YYYY-MM-DD HH:mm:ss')
                })
              });
              this.option.series.push({
                name: item.expressionName,
                data: data,
                type: 'line',
                smooth: true,
                itemStyle: {
                  color: this.allColors[index]
                }
              });
            }
          }
        });

        this.option.legend.data.push(legend);
      }

      let xAxisData = Array.from(Array(maxLength), (v, k) => k);
      this.option.xAxis.data = xAxisData;

      let expressionResultHistoryEcharts = echarts.init(document.getElementById('expressionResultHistoryEcharts'));
      expressionResultHistoryEcharts.setOption(this.option, true);
    },
    _handleOutCheckedExpressionResultNameChange (dataList) {
      if (dataList.length == 0) {
        for (let key  in this.expressionResultHistory.expressionResultNameColorCheckedList) {
          this.expressionResultHistory.expressionResultNameColorCheckedList[key] = false;
        }
      } else {
        for (let key  in this.expressionResultHistory.expressionResultNameColorCheckedList) {
          for (let i = 0; i < dataList.length; i++) {
            if (key == dataList[i]) {
              this.expressionResultHistory.expressionResultNameColorCheckedList[key] = true;
              break;
            } else if (i == dataList.length - 1) {
              this.expressionResultHistory.expressionResultNameColorCheckedList[key] = false;
            }
          }
        }
      }
      this._initExpressionResultHistoryEcharts();
    },
    _getToolTip (params) {
      return  params.seriesName + '<br/>时间:' + params.name + '<br/>公式结果:' + params.value + '<br/>';
    },
    _getDate () {
      let date = new Date();
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
      this.expressionResultHistoryForm.date = [nowData, nowData]  // 默认赋值一年时间
    },
    _clearEcharts () {
      this.expressionResultHistory.expressionResultHistoryList = [];
      this.inputDataList = [];
      this.outDataList = [];
      this._initExpressionResultHistoryEcharts();
    },
    _closeExpressionResultHistoryViewDialog () {
      this.$emit('_closeExpressionResultHistoryViewDialog');
    },
  }
}
</script>

<style scoped>


  .expressionResultContentDiv {
    position: relative;
    width: 100%;
    height: 430px;
  }

  .leftDiv {
    position: absolute;
    left: 0;
    width: 240px;
    height: 430px;
    overflow: hidden;
    border: 1px solid rgba(0, 21, 41, 0.08);
  }

  .leftDiv .outTitle {
    font-size: 20px;
    font-weight: bold;
  }

  .selectedLegend {
    position: absolute;
    left: 0px;
    width: 240px;
    height: 430px;
    overflow: hidden;
  }

  .text_right {
    text-align: right;
    margin-top: 10px;
    margin-right: 6px;
  }

  #expressionResultHistoryEcharts {
    margin-left: 240px;
    height: 430px;
    width: 1012px;
    border: 1px solid rgba(0, 21, 41, 0.08);
    z-index: 999999;
  }

  .rightButton {
    position: absolute;
    right: 15px
  }
</style>
<style>
  .black-form .el-form-item .el-form-item__content .el-input__inner {
    border: 1px solid lightgray;
  }
</style>


