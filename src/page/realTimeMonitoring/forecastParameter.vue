<!--预测参数页面-->
<template>
  <div class="forecastParameter">
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
                <h3 style="margin-left: 5px">{{forecastParameter.title}}输出参数</h3>
              </div>
              <div id="outPutParam">

              </div>
            </div>
          </div>
          <div class="first_right_panel">
            <div>
              <div
                style="border: 1px solid; border-top-style: none; border-left-style: none; border-right-style: none; border-bottom-color: darkgrey;">
                <h3 style="margin-left: 5px">{{forecastParameter.title}}输入参数</h3>
              </div>
              <div id="inputParam">

              </div>
              <div class="inputParamTitle1">
                {{inputOutRelation.inputMeterName_1}}
              </div>
              <div class="inputParamTitle2">
                {{inputOutRelation.inputMeterName_2}}
              </div>
              <div class="inputParamTitle3">
                {{inputOutRelation.inputMeterName_3}}、
              </div>
              <div class="inputParamTitle4">
                {{inputOutRelation.inputMeterName_4}}
              </div>
            </div>
          </div>
        </div>
        <div class="second_panel">
          <div class="second_left_panel">
            <div>
              <div
                style="border: 1px solid; border-top-style: none; border-left-style: none; border-right-style: none; border-bottom-color: darkgrey;">
                <h3 style="margin-left: 5px">{{forecastParameter.title}}输入差值</h3>
              </div>
            </div>
          </div>
          <div class="second_right_panel">
            <div>
              <div
                style="border: 1px solid; border-top-style: none; border-left-style: none; border-right-style: none; border-bottom-color: darkgrey;">
                <h3 style="margin-left: 5px">{{forecastParameter.title}}输入变化与输出的对应关系</h3>
              </div>
              <div>
                <el-row>
                  <el-col :span="12">
                    <div class="inputOutRelationDiv">
                      <el-select
                        v-model="inputOutRelation.code_a"
                        style="width: 100%"
                        @change="_onMeterAChange"
                      >
                        <el-option
                          v-for="item in inputOutRelation.relationList_A"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select>
                      <div id="inputOutRelationMeter_A" class="meter">
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="inputOutRelationDiv">
                      <el-select
                        v-model="inputOutRelation.code_b"
                        style="width: 100%"
                        @change="_onMeterBChange"
                      >
                        <el-option
                          v-for="item in inputOutRelation.relationList_B"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select>
                      <div id="inputOutRelationMeter_B" class="meter">
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </div>
        <div class="third_panel">
          3
        </div>
      </el-scrollbar>
    </div>

  </div>
</template>

<script>
import viewOrgCom from "../org/viewOrg.vue";
import echarts from 'echarts';

export default {
  name: "forecastParameter",
  components: {viewOrgCom},
  data () {
    return {
      idFlag: false,
      orgTreeStyle: {
        height: ''
      },
      contentDivStyle: {
        height: ''
      },
      forecastParameter: {
        title: '预测参数'
      },
      inputOutRelation: {
        code_a: '',
        code_b: '',
        relationList_A: [],
        relationList_B: [],
        newestParameterList: [],
        option_A: {
          tooltip: {
            formatter: '{a} <br/>输入值:{b} <br/>归一化输入值: {c}'
          },
          toolbox: {
            feature: {
              restore: {},
              saveAsImage: {}
            }
          },
          title: {
            show: true,
            text: '',
          },
          series: [
            {
              name: '',
              type: 'gauge',
              min: 0,
              max: 1,
              radius: '75%',
              axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                  width: 10,
                  color: [[0.2, '#ccc'], [0.4, 'red'], [0.6, 'blue'], [0.8, 'orange'], [1, 'black']]
                }
              },
              axisTick: {            // 坐标轴小标记
                length: 15,        // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                  color: 'auto'
                }
              },
              splitLine: {           // 分隔线
                length: 20,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                  color: 'auto'
                }
              },
              axisLabel: {
                backgroundColor: 'auto',
                borderRadius: 2,
                color: '#eee',
                padding: 3,
                textShadowBlur: 2,
                textShadowOffsetX: 1,
                textShadowOffsetY: 1,
                textShadowColor: '#222',
                formatter: function (value) {
                  switch (value + '') {
                    case '0' :
                      return '0';
                    case '0.2' :
                      return '0.2';
                    case '0.4' :
                      return '0.4';
                    case '0.6' :
                      return '0.6';
                    case '0.8' :
                      return '0.8';
                    case '1' :
                      return '1';
                  }
                }
              },
              title: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                show: false,
                fontWeight: 'bolder',
                fontSize: 20,
                fontStyle: 'italic',
              },
              detail: {
                formatter: '{value}',
                fontWeight: 'bolder',
                offsetCenter: [0, '70%'],
                borderRadius: 3,
                fontSize: 20,
                backgroundColor: 'auto',
                borderColor: '#aaa',
                shadowBlur: 5,
                shadowColor: '#333',
                shadowOffsetX: 0,
                shadowOffsetY: 3,
                borderWidth: 2,
                textBorderColor: '#000',
                textBorderWidth: 2,
                textShadowBlur: 2,
                textShadowColor: '#fff',
                textShadowOffsetX: 0,
                textShadowOffsetY: 0,
                fontFamily: 'Arial',
                width: 60,
                color: '#eee',
                rich: {}
              },
              data: [{value: 0, name: '0'}]
            }
          ]
        },
        option_B: {
          tooltip: {
            formatter: '{a} <br/>输出值:{b} <br/>归一化输出值: {c}',
          },
          toolbox: {
            feature: {
              restore: {},
              saveAsImage: {}
            }
          },
          title: {
            show: true,
            text: '',
          },
          series: [
            {
              name: '',
              type: 'gauge',
              min: 0,
              max: 1,
              radius: '75%',
              axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                  width: 10,
                  color: [[0.2, '#ccc'], [0.4, 'red'], [0.6, 'blue'], [0.8, 'orange'], [1, 'black']]
                }
              },
              axisTick: {            // 坐标轴小标记
                length: 15,        // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                  color: 'auto'
                }
              },
              splitLine: {           // 分隔线
                length: 20,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                  color: 'auto'
                }
              },
              axisLabel: {
                backgroundColor: 'auto',
                borderRadius: 2,
                color: '#eee',
                padding: 3,
                textShadowBlur: 2,
                textShadowOffsetX: 1,
                textShadowOffsetY: 1,
                textShadowColor: '#222',
                formatter: function (value) {
                  switch (value + '') {
                    case '0' :
                      return '0';
                    case '0.2' :
                      return '0.2';
                    case '0.4' :
                      return '0.4';
                    case '0.6' :
                      return '0.6';
                    case '0.8' :
                      return '0.8';
                    case '1' :
                      return '1';
                  }
                }
              },
              title: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                show: false,
                fontWeight: 'bolder',
                fontSize: 20,
                fontStyle: 'italic',
              },
              detail: {
                formatter: '{value}',
                fontWeight: 'bolder',
                offsetCenter: [0, '70%'],
                borderRadius: 3,
                fontSize: 20,
                backgroundColor: 'auto',
                borderColor: '#aaa',
                shadowBlur: 5,
                shadowColor: '#333',
                shadowOffsetX: 0,
                shadowOffsetY: 3,
                borderWidth: 2,
                textBorderColor: '#000',
                textBorderWidth: 2,
                textShadowBlur: 2,
                textShadowColor: '#fff',
                textShadowOffsetX: 0,
                textShadowOffsetY: 0,
                fontFamily: 'Arial',
                width: 60,
                color: '#eee',
                rich: {}
              },
              data: [{value: 0, name: '0'}]
            }
          ]
        },
        inputOption: {
          tooltip: {
            formatter: '{a} <br/>输入值:{b} <br/>归一化输入值: {c}',
          },
          toolbox: {
            show: true,
            feature: {
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          series: [
            {
              name: '',
              type: 'gauge',
              center: ['20%', '55%'],    // 默认全局居中
              radius: '60%',
              min: 0,
              max: 1,
              endAngle: 45,
              splitNumber: 5,
              axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                  width: 10,
                  color: [[0.2, '#ccc'], [0.4, 'red'], [0.6, 'blue'], [0.8, 'orange'], [1, 'black']]
                }
              },
              axisTick: {            // 坐标轴小标记
                length: 12,        // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                  color: 'auto'
                }
              },
              splitLine: {           // 分隔线
                length: 20,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                  color: 'auto'
                }
              },
              axisLabel: {
                backgroundColor: 'auto',
                borderRadius: 1,
                color: '#eee',
                padding: 2,
                textShadowBlur: 1,
                textShadowOffsetX: 1,
                textShadowOffsetY: 1,
                textShadowColor: '#222',
                formatter: function (value) {
                  switch (value + '') {
                    case '0' :
                      return '0';
                    case '0.2' :
                      return '0.2';
                    case '0.4' :
                      return '0.4';
                    case '0.6' :
                      return '0.6';
                    case '0.8' :
                      return '0.8';
                    case '1' :
                      return '1';
                  }
                }
              },
              pointer: {
                width: 5
              },
              title: {
                show: false,
                offsetCenter: [0, '-30%'],       // x, y，单位px
              },
              detail: {
                formatter: '{value}',
                fontWeight: 'bolder',
                offsetCenter: [0, '70%'],
                borderRadius: 3,
                fontSize: 18,
                backgroundColor: 'auto',
                borderColor: '#aaa',
                shadowBlur: 5,
                shadowColor: '#333',
                shadowOffsetX: 0,
                shadowOffsetY: 3,
                borderWidth: 2,
                textBorderColor: '#000',
                textBorderWidth: 2,
                textShadowBlur: 2,
                textShadowColor: '#fff',
                textShadowOffsetX: 0,
                textShadowOffsetY: 0,
                fontFamily: 'Arial',
                width: 60,
                color: '#eee',
                rich: {}
              },
              data: [{value: 0, name: ''}]
            },
            {
              name: '',
              type: 'gauge',
              z: 3,
              min: 0,
              max: 1,
              radius: '75%',
              splitNumber: 10,
              axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                  width: 10,
                  color: [[0.2, '#ccc'], [0.4, 'red'], [0.6, 'blue'], [0.8, 'orange'], [1, 'black']]
                }
              },
              axisTick: {            // 坐标轴小标记
                length: 15,        // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                  color: 'auto'
                }
              },
              splitLine: {           // 分隔线
                length: 20,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                  color: 'auto'
                }
              },
              axisLabel: {
                backgroundColor: 'auto',
                borderRadius: 2,
                color: '#eee',
                padding: 3,
                textShadowBlur: 2,
                textShadowOffsetX: 1,
                textShadowOffsetY: 1,
                textShadowColor: '#222',
                formatter: function (value) {
                  switch (value + '') {
                    case '0' :
                      return '0';
                    case '0.2' :
                      return '0.2';
                    case '0.4' :
                      return '0.4';
                    case '0.6' :
                      return '0.6';
                    case '0.8' :
                      return '0.8';
                    case '1' :
                      return '1';
                  }
                }
              },
              title: {
                show: false,
                fontWeight: 'bolder',
                fontSize: 20,
                fontStyle: 'italic',
              },
              detail: {
                formatter: '{value}',
                fontWeight: 'bolder',
                offsetCenter: [0, '70%'],
                borderRadius: 3,
                fontSize: 20,
                backgroundColor: 'auto',
                borderColor: '#aaa',
                shadowBlur: 5,
                shadowColor: '#333',
                shadowOffsetX: 0,
                shadowOffsetY: 3,
                borderWidth: 2,
                textBorderColor: '#000',
                textBorderWidth: 2,
                textShadowBlur: 2,
                textShadowColor: '#fff',
                textShadowOffsetX: 0,
                textShadowOffsetY: 0,
                fontFamily: 'Arial',
                width: 60,
                color: '#eee',
                rich: {}
              },
              data: [{value: 0, name: ''}]
            },
            {
              name: '',
              type: 'gauge',
              center: ['80%', '50%'],    // 默认全局居中
              radius: '60%',
              min: 0,
              max: 1,
              startAngle: 135,
              endAngle: 45,
              splitNumber: 2,
              axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                  width: 10,
                  color: [[0.5, '#ccc'], [1, 'orange']]
                }
              },
              axisTick: {            // 坐标轴小标记
                splitNumber: 5,
                length: 10,        // 属性length控制线长
                lineStyle: {        // 属性lineStyle控制线条样式
                  color: 'auto'
                }
              },
              axisLabel: {
                backgroundColor: 'auto',
                borderRadius: 2,
                color: '#eee',
                padding: 3,
                textShadowBlur: 2,
                textShadowOffsetX: 1,
                textShadowOffsetY: 1,
                textShadowColor: '#222',
                formatter: function (value) {
                  switch (value + '') {
                    case '0' :
                      return '0';
                    case '0.2' :
                      return '0.2';
                    case '0.4' :
                      return '0.4';
                    case '0.6' :
                      return '0.6';
                    case '0.8' :
                      return '0.8';
                    case '1' :
                      return '1';
                  }
                }
              },
              splitLine: {           // 分隔线
                length: 15,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                  color: 'auto'
                }
              },
              pointer: {
                width: 2
              },
              title: {
                show: false
              },
              detail: {
                show: false
              },
              data: [{value: 0.5, name: ''}]
            },
            {
              name: '',
              type: 'gauge',
              center: ['80%', '50%'],    // 默认全局居中
              radius: '60%',
              min: 0,
              max: 1,
              startAngle: 315,
              endAngle: 225,
              splitNumber: 2,
              axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                  width: 10,
                  color: [[0.5, '#ccc'], [1, 'orange']]
                }
              },
              axisTick: {            // 坐标轴小标记
                show: false
              },
              axisLabel: {
                backgroundColor: 'auto',
                borderRadius: 2,
                color: '#eee',
                padding: 3,
                textShadowBlur: 2,
                textShadowOffsetX: 1,
                textShadowOffsetY: 1,
                textShadowColor: '#222',
                formatter: function (value) {
                  switch (value + '') {
                    case '0' :
                      return '0';
                    case '0.2' :
                      return '0.2';
                    case '0.4' :
                      return '0.4';
                    case '0.6' :
                      return '0.6';
                    case '0.8' :
                      return '0.8';
                    case '1' :
                      return '1';
                  }
                }
              },
              splitLine: {           // 分隔线
                length: 15,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                  color: 'auto'
                }
              },
              pointer: {
                width: 2
              },
              title: {
                show: false
              },
              detail: {
                show: false
              },
              data: [{value: 0.5, name: ''}]
            }
          ]
        },
        inputMeterName_1: '',
        inputMeterName_2: '',
        inputMeterName_3: '',
        inputMeterName_4: '',
        outPutOption: {
          color: ['#3398DB'],
          tooltip: {
            /* formatter: '{a} <br/>预测输出值:{b} <br/>归一化预测输出值: {c}',*/
            formatter: this._getToolTip,
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          toolbox: {
            feature: {
              saveAsImage: {}
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
              type: 'bar',
              barWidth: '60%',
              data: []
            }
          ]
        }
      }
    }
  },
  created () {
    this._initForecastParameter();
    this.$nextTick(_ => {
      this.$refs.viewOrgComRef._getUserRoleOrgTree();
    })
  },
  mounted () {
    //初始化输出参数
    this._initOutPutParam();
    //初始化输入参数
    this._initInputParam();
    //初始化输入输出仪表关系比对
    this._initInputOutRelationMeter();
  },
  methods: {
    _getToolTip (params) {
      return '' + params[0].axisValue + '<br/>预测输出值:' + params[0].data.name + ' <br/>归一化预测输出值: ' + params[0].data.value + '';
    },
    _initOutPutParam () {
      if (this.inputOutRelation.relationList_B.length > 0) {
        let xAxisData = [];
        let seriesData = [];
        this.inputOutRelation.relationList_B.forEach((item, index) => {
          xAxisData.push(item.name);
          seriesData.push({
            value: item.outputCountValue,
            name: item.output
          })
        });

        this.inputOutRelation.outPutOption.xAxis[0].data = xAxisData;
        this.inputOutRelation.outPutOption.series[0].data = seriesData;
      }
      let OutPutChart = echarts.init(document.getElementById('outPutParam'));
      OutPutChart.setOption(this.inputOutRelation.outPutOption, true);
    },
    _initInputParam () {
      if (this.inputOutRelation.relationList_A.length > 0) {
        this.inputOutRelation.relationList_A.forEach((item, index) => {
          if (index == 0) {
            this.inputOutRelation.inputOption.series[0].data[0].value = item.inputCountValue;
            this.inputOutRelation.inputOption.series[0].data[0].name = item.input;
            this.inputOutRelation.inputOption.series[0].name = item.name.substring(0, item.name.indexOf('-'));
            this.inputOutRelation.inputMeterName_1 = item.name.substring(0, item.name.indexOf('-'));
          } else if (index == 1) {
            this.inputOutRelation.inputOption.series[1].data[0].value = item.inputCountValue;
            this.inputOutRelation.inputOption.series[1].data[0].name = item.input;
            this.inputOutRelation.inputOption.series[1].name = item.name.substring(0, item.name.indexOf('-'));
            this.inputOutRelation.inputMeterName_2 = item.name.substring(0, item.name.indexOf('-'));
          } else if (index == 2) {
            this.inputOutRelation.inputOption.series[2].data[0].value = item.inputCountValue;
            this.inputOutRelation.inputOption.series[2].data[0].name = item.input;
            this.inputOutRelation.inputOption.series[2].name = item.name.substring(0, item.name.indexOf('-'));
            this.inputOutRelation.inputMeterName_3 = item.name.substring(0, item.name.indexOf('-'));
          } else if (index == 3) {
            this.inputOutRelation.inputOption.series[3].data[0].value = item.inputCountValue;
            this.inputOutRelation.inputOption.series[3].data[0].name = item.input;
            this.inputOutRelation.inputOption.series[3].name = item.name.substring(0, item.name.indexOf('-'));
            this.inputOutRelation.inputMeterName_4 = item.name.substring(0, item.name.indexOf('-'));
          }
          else {
            return;
          }


        });
      }
      let inputChart = echarts.init(document.getElementById('inputParam'));
      inputChart.setOption(this.inputOutRelation.inputOption, true);
    },
    _initInputOutRelationMeter () {
      let myChart_A = echarts.init(document.getElementById('inputOutRelationMeter_A'));
      myChart_A.setOption(this.inputOutRelation.option_A, true);

      let myChart_B = echarts.init(document.getElementById('inputOutRelationMeter_B'));
      myChart_B.setOption(this.inputOutRelation.option_B, true);
    },
    _initForecastParameter () {
      this.orgTreeStyle.height = window.innerHeight - 110 + 'px'
      this.contentDivStyle.height = window.innerHeight - 110 + 'px'
    },
    async _handleOnClickOrg (args) {
      const ogId = args[1];
      const orgLevel = args[2];
      const ogName = args[4];

      this._refresh();
      if (orgLevel == 5) {
        this._setTitle(ogName);
        await this._selectModelParamList(ogId);
        await this._selectNewestParameter(ogId);
        this._initOutPutParam();
        this._initInputParam();
      }
    },
    _onMeterAChange (id) {
      for (let i = 0; i < this.inputOutRelation.relationList_A.length; i++) {
        if (id == this.inputOutRelation.relationList_A[i].id) {
          let name = this.inputOutRelation.relationList_A[i].name;
          name = name.substring(0, name.indexOf('-'));
          this._setMerter_A(this.inputOutRelation.relationList_A[i].input, this.inputOutRelation.relationList_A[i].inputCountValue, name);
          return;
        }
      }
    },
    _onMeterBChange (id) {
      for (let i = 0; i < this.inputOutRelation.relationList_B.length; i++) {
        if (id == this.inputOutRelation.relationList_B[i].id) {
          this._setMerter_B(this.inputOutRelation.relationList_B[i].output, this.inputOutRelation.relationList_B[i].outputCountValue, this.inputOutRelation.relationList_B[i].name);
          return;
        }
      }
    },
    _setMerter_A (input, inputCountValue, name) {
      let myChart_A = echarts.init(document.getElementById('inputOutRelationMeter_A'));
      this.inputOutRelation.option_A.series[0].data[0].value = inputCountValue;
      this.inputOutRelation.option_A.series[0].data[0].name = input;
      this.inputOutRelation.option_A.series[0].name = name;
      myChart_A.setOption(this.inputOutRelation.option_A, true);
    },
    _setMerter_B (input, inputCountValue, name) {
      let myChart_B = echarts.init(document.getElementById('inputOutRelationMeter_B'));
      this.inputOutRelation.option_B.series[0].data[0].value = inputCountValue;
      this.inputOutRelation.option_B.series[0].data[0].name = input;
      this.inputOutRelation.option_B.series[0].name = name;
      myChart_B.setOption(this.inputOutRelation.option_B, true);
    },
    _refresh () {
      this._setTitle('预测参数');
      this.inputOutRelation.code_a = '';
      this.inputOutRelation.code_b = '';
      this.inputOutRelation.relationList_A = [];
      this.inputOutRelation.relationList_B = [];
      this.inputOutRelation.newestParameterList = [];

      this.inputOutRelation.option_A.series[0].name = '';
      this.inputOutRelation.option_A.series[0].data[0].value = 0;
      this.inputOutRelation.option_A.series[0].data[0].name = '0';
      this.inputOutRelation.option_B.series[0].name = '';
      this.inputOutRelation.option_B.series[0].data[0].value = 0;
      this.inputOutRelation.option_B.series[0].data[0].name = '0';

      this.inputOutRelation.outPutOption.xAxis[0].data = [];
      this.inputOutRelation.outPutOption.series[0].data = [];

      this.inputOutRelation.inputOption.series[0].data[0].value = 0;
      this.inputOutRelation.inputOption.series[0].data[0].name = '0';
      this.inputOutRelation.inputOption.series[0].name = '';
      this.inputOutRelation.inputMeterName_1 = '';
      this.inputOutRelation.inputOption.series[1].data[0].value = 0;
      this.inputOutRelation.inputOption.series[1].data[0].name = '0';
      this.inputOutRelation.inputOption.series[1].name = '';
      this.inputOutRelation.inputMeterName_2 = '';
      this.inputOutRelation.inputOption.series[2].data[0].value = 0;
      this.inputOutRelation.inputOption.series[2].data[0].name = '0';
      this.inputOutRelation.inputOption.series[2].name = '';
      this.inputOutRelation.inputMeterName_3 = '';
      this.inputOutRelation.inputOption.series[3].data[0].value = 0;
      this.inputOutRelation.inputOption.series[3].data[0].name = '0';
      this.inputOutRelation.inputOption.series[3].name = '';
      this.inputOutRelation.inputMeterName_4 = '';

      this._initInputParam();
      this._initInputOutRelationMeter();

    },
    _setTitle (ogName) {
      this.forecastParameter.title = ogName;
    },
    async _selectModelParamList (ogId) {
      await this.$http({
        url: '/api/api/modelParam/getModelParamList?modelId=' + ogId + '',
        "content-type": "application/json",
        method: 'get',
        /*headers: {Authorization: token},*/
      }).then(res => {
        if (res.data.status == 1) {
          const dataList = res.data.result;

          let relationList_A = [];
          let relationList_B = [];

          dataList.forEach((item, index) => {
            if (item.type == '1') {
              relationList_A.push(item);
            } else if (item.type == '2') {
              relationList_B.push(item);
            }
          });

          this.inputOutRelation.relationList_A = relationList_A;
          this.inputOutRelation.relationList_B = relationList_B;

        } else {
          this.$message({message: res.data.msg, type: 'error'});
        }
      })
    },
    async _selectNewestParameter (ogId) {
      await this.$http({
        url: '/api/api/preHistory/getNewestParameter?modelId=' + ogId + '',
        "content-type": "application/json",
        method: 'get',
        /*headers: {Authorization: token},*/
      }).then(res => {
        if (res.data.status == 1) {
          //const list = res.data.result;
          //假数据011104010104查询结果
          const list = {
            "input": ["48.3168830872", "373.334106445", "327.420837402", "4.93264341354", "282.301818848", "309.436004639", "315.953674316", "57.1867294312", "68.1822967529"],
            "output": ["219.00644", "295.51526", "327.30406", "349.63722", "363.9175"],
            "dataTime": 1574667658000,
            "inputCountValue": ["0.22387", "0.65688", "0.66680", "1.21111", "0.67544", "0.80329", "0.73357", "1.20924", "1.20545"],
            "outputCountValue": ["0.34426", "0.95355", "1.31815", "0.78949", "0.97270"],
            "actualOutput": null,
            "actualOutputCV": [],
            "collectTime": null,
            "limsOutput": null
          };

          this.inputOutRelation.newestParameterList = list;

          for (let i = 0; i < this.inputOutRelation.relationList_A.length; i++) {
            this.inputOutRelation.relationList_A[i].input = list.input[i];
            this.inputOutRelation.relationList_A[i].inputCountValue = list.inputCountValue[i];
          }

          for (let i = 0; i < this.inputOutRelation.relationList_B.length; i++) {
            this.inputOutRelation.relationList_B[i].output = list.output[i];
            this.inputOutRelation.relationList_B[i].outputCountValue = list.outputCountValue[i];
          }

        } else {
          this.$message({message: res.data.msg, type: 'error'});
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
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

  .second_left_panel {
    position: absolute;
    top: 0px;
    left: 10px;
    width: 49%;
    bottom: 0px;
  }

  .second_right_panel {
    position: absolute;
    top: 0px;
    width: 49%;
    right: 10px;
    bottom: 0px;
  }

  .inputOutRelationDiv {
    margin-top: 10px;
  }

  .meter {
    width: 100%;
    height: calc(~"50vh - 155px");
  }

  #outPutParam, #inputParam {
    width: 100%;
    height: calc(~"50vh - 128px");
  }

  .inputParamTitle1 {
    position: absolute;
    margin-top: -40px;
    width: 40%;
    text-align: center;
    font-size: 12px;
  }

  .inputParamTitle2 {
    position: absolute;
    left: 40%;
    margin-top: -40px;
    width: 20%;
    text-align: center;
    font-size: 12px;
  }

  .inputParamTitle3 {
    position: absolute;
    left: 60%;
    margin-top: -40px;
    width: 20%;
    text-align: right;
    font-size: 12px;
  }

  .inputParamTitle4 {
    position: absolute;
    left: 80%;
    margin-top: -40px;
    width: 20%;
    text-align: left;
    font-size: 12px;
  }

</style>
