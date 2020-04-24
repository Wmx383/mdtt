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
              <div id="inputOutParamDiff">

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
          <div class="table_container">
            <el-table
              v-loading="forecastParameterTable.gridLoading"
              :data="forecastParameterTable.forecastParameterTablePageList"
              :style="forecastParameterTable.gridTableStyle"
              :height="forecastParameterTable.gridTableStyle.height"
              align='center'
              ref="forecastParameterTableTable"
              highlight-current-row
            >
              <el-table-column
                prop="name"
                label="参数"
                min-width="300"
              >
              </el-table-column>
              <el-table-column
                prop=""
                label="时间"
                min-width="300"
              >
              </el-table-column>
              <el-table-column
                prop="output"
                label="预测输出值"
                min-width="300"
              >
              </el-table-column>
              <el-table-column
                prop="limsOutput"
                label="实际输出值"
                min-width="300"
              >
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-scrollbar>
    </div>

    <!--查看历史-->
    <el-dialog
      :title="viewForecastParameterHistory.title"
      :visible.sync="viewForecastParameterHistory.show"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :modal-append-to-body="false"
      :modal="true"
      :width="viewForecastParameterHistory.width"
      :style="viewForecastParameterHistory.style"
      @close="_closeForecastParameterHistoryViewDialog"
    >
      <template>
        <viewForecastParameterHistoryCom
          ref="viewForecastParameterHistoryRef"
          v-if="viewForecastParameterHistory.dialogVisible"
          @_closeForecastParameterHistoryViewDialog="_closeForecastParameterHistoryViewDialog()"
        ></viewForecastParameterHistoryCom>
      </template>
    </el-dialog>

    <!--查看输入输出关系历史-->
    <el-dialog
      :title="viewInputOutRelationHistory.title"
      :visible.sync="viewInputOutRelationHistory.show"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :modal-append-to-body="false"
      :modal="true"
      :width="viewInputOutRelationHistory.width"
      :style="viewInputOutRelationHistory.style"
      @close="_closeInputOutRelationHistoryViewDialog"
    >
      <template>
        <viewInputOutRelationHistoryCom
          ref="viewInputOutRelationHistoryRef"
          v-if="viewInputOutRelationHistory.dialogVisible"
          @_closeInputOutRelationHistoryViewDialog="_closeInputOutRelationHistoryViewDialog()"
        ></viewInputOutRelationHistoryCom>
      </template>
    </el-dialog>

  </div>
</template>

<script>
import viewOrgCom from "../org/viewOrg.vue";
import viewForecastParameterHistoryCom from "./viewForecastParameterHistory.vue";
import viewInputOutRelationHistoryCom from "./viewInputOutRelationHistory.vue";
import echarts from 'echarts';

export default {
  name: "forecastParameter",
  components: {viewOrgCom, viewForecastParameterHistoryCom, viewInputOutRelationHistoryCom},
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
      forecastParameterTable: {
        sortNum: 0,
        gridLoading: false,
        forecastParameterTableAllList: [],
        forecastParameterTablePageList: [],
        forecastParameterTableList: [],
        gridTableStyle: {
          width: '100%',
          height: '350px',
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
      inputOutRelation: {
        code_a: '',
        code_b: '',
        relationList_A: [],
        relationList_B: [],
        relationListBefore_A: [],
        relationListBefore_B: [],
        newestParameterList: [],
        option_A: {
          tooltip: {
            formatter: '{a} <br/>输入值:{b} <br/>归一化输入值: {c}'
          },
          toolbox: {
            feature: {
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
                  color: [[0.2, '#FFB721'], [0.4, '#64CC35'], [0.8, '#64CC35'], [1, '#FF1C3A']]
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
                /*textShadowColor: '#222',*/
                formatter: function (value) {
                  switch (value + '') {
                    case '0' :
                      return '0';
                    /*case '0.2' :
                      return '0.2';
                    case '0.4' :
                      return '0.4';
                    case '0.6' :
                      return '0.6';*/
                    case '0.5' :
                      return '0.5';
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
                /*textBorderColor: '#000',*/
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
              myTool1: {
                show: true,
                title: '查看历史',
                icon: 'path://M525.4 721.2H330.9c-9 0-18.5-7.7-18.5-18.1V311c0-9 9.3-18.1 18.5-18.1h336.6c9.3 0 18.5 9.1 18.5 18.1v232.7c0 6 8.8 12.1 15 12.1 6.2 0 15-6 15-12.1V311c0-25.6-25.3-48.9-50.1-48.9h-335c-26.2 0-50.1 23.3-50.1 48.9v389.1c0 36.3 20 51.5 50.1 51.5h197.6c6.2 0 9.3-7.5 9.3-15.1 0-6-6.2-15.3-12.4-15.3zM378.8 580.6c-6.2 0-12.3 8.6-12.3 14.6s6.2 14.6 12.3 14.6h141.4c6.2 0 12.3-5.8 12.3-13.4 0.3-9.5-6.2-15.9-12.3-15.9H378.8z m251.6-91.2c0-6-6.2-14.6-12.3-14.6H375.7c-6.2 0-12.4 8.6-12.4 14.6s6.2 14.6 12.4 14.6h240.8c6.2 0.1 13.9-8.5 13.9-14.6z m-9.2-120.5H378.8c-6.2 0-12.3 8.6-12.3 14.6s6.2 14.6 12.3 14.6h240.8c7.7 0 13.9-8.6 13.9-14.6s-6.2-14.6-12.3-14.6z m119.4 376.6L709 714.1c9.2-12 14.6-27 14.6-43.2 0-39.4-32.1-71.4-71.8-71.4-39.7 0-71.8 32-71.8 71.4s32.1 71.4 71.8 71.4c16.3 0 31.3-5.4 43.4-14.5l31.6 31.5c3.8 3.8 10 3.8 13.8 0 3.8-3.8 3.8-10 0-13.8z m-88.8-23.6c-28.3 0-51.3-22.8-51.3-51s23-51 51.3-51c28.3 0 51.3 22.8 51.3 51s-23 51-51.3 51z',
                onclick: this._viewInputOutRelationHistory
              }
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
                  color: [[0.2, '#FFB721'], [0.4, '#64CC35'], [0.8, '#64CC35'], [1, '#FF1C3A']]
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
                /*textShadowColor: '#222',*/
                formatter: function (value) {
                  switch (value + '') {
                    case '0' :
                      return '0';
                    /*case '0.2' :
                      return '0.2';
                    case '0.4' :
                      return '0.4';
                    case '0.6' :
                      return '0.6';*/
                    case '0.5' :
                      return '0.5';
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
                /*textBorderColor: '#000',*/
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
              saveAsImage: {show: true},
              myTool1: {
                show: true,
                title: '查看历史',
                icon: 'path://M525.4 721.2H330.9c-9 0-18.5-7.7-18.5-18.1V311c0-9 9.3-18.1 18.5-18.1h336.6c9.3 0 18.5 9.1 18.5 18.1v232.7c0 6 8.8 12.1 15 12.1 6.2 0 15-6 15-12.1V311c0-25.6-25.3-48.9-50.1-48.9h-335c-26.2 0-50.1 23.3-50.1 48.9v389.1c0 36.3 20 51.5 50.1 51.5h197.6c6.2 0 9.3-7.5 9.3-15.1 0-6-6.2-15.3-12.4-15.3zM378.8 580.6c-6.2 0-12.3 8.6-12.3 14.6s6.2 14.6 12.3 14.6h141.4c6.2 0 12.3-5.8 12.3-13.4 0.3-9.5-6.2-15.9-12.3-15.9H378.8z m251.6-91.2c0-6-6.2-14.6-12.3-14.6H375.7c-6.2 0-12.4 8.6-12.4 14.6s6.2 14.6 12.4 14.6h240.8c6.2 0.1 13.9-8.5 13.9-14.6z m-9.2-120.5H378.8c-6.2 0-12.3 8.6-12.3 14.6s6.2 14.6 12.3 14.6h240.8c7.7 0 13.9-8.6 13.9-14.6s-6.2-14.6-12.3-14.6z m119.4 376.6L709 714.1c9.2-12 14.6-27 14.6-43.2 0-39.4-32.1-71.4-71.8-71.4-39.7 0-71.8 32-71.8 71.4s32.1 71.4 71.8 71.4c16.3 0 31.3-5.4 43.4-14.5l31.6 31.5c3.8 3.8 10 3.8 13.8 0 3.8-3.8 3.8-10 0-13.8z m-88.8-23.6c-28.3 0-51.3-22.8-51.3-51s23-51 51.3-51c28.3 0 51.3 22.8 51.3 51s-23 51-51.3 51z',
                onclick: this._viewForecastParameterHistoryByInput
              },
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
                  color: [[0.2, '#FFB721'], [0.4, '#64CC35'], [0.8, '#64CC35'], [1, '#FF1C3A']]
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
                /* textShadowColor: '#222',*/
                formatter: function (value) {
                  switch (value + '') {
                    case '0' :
                      return '0';
                    /* case '0.2' :
                       return '0.2';
                     case '0.4' :
                       return '0.4';
                     case '0.6' :
                       return '0.6';*/
                    case '0.5' :
                      return '0.5';
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
                /*textBorderColor: '#000',*/
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
                  color: [[0.2, '#FFB721'], [0.4, '#64CC35'], [0.8, '#64CC35'], [1, '#FF1C3A']]
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
                /*textShadowColor: '#222',*/
                formatter: function (value) {
                  switch (value + '') {
                    case '0' :
                      return '0';
                    /*case '0.2' :
                      return '0.2';
                    case '0.4' :
                      return '0.4';
                    case '0.6' :
                      return '0.6';*/
                    case '0.5' :
                      return '0.5';
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
                /*textBorderColor: '#000',*/
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
                /*textShadowColor: '#222',*/
                formatter: function (value) {
                  switch (value + '') {
                    case '0' :
                      return '0';
                    /*case '0.2' :
                      return '0.2';
                    case '0.4' :
                      return '0.4';
                    case '0.6' :
                      return '0.6';*/
                    case '0.5' :
                      return '0.5';
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
                /* textShadowColor: '#222',*/
                formatter: function (value) {
                  switch (value + '') {
                    case '0' :
                      return '0';
                    /*case '0.2' :
                      return '0.2';
                    case '0.4' :
                      return '0.4';
                    case '0.6' :
                      return '0.6';*/
                    case '0.5' :
                      return '0.5';
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
          /*color: ['#3398DB'],*/
          tooltip: {
            /* formatter: '{a} <br/>预测输出值:{b} <br/>归一化预测输出值: {c}',*/
            formatter: this._getToolTip,
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            data: ['预测输出', 'lims输出', '在线输出'],
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
              myTool2: {
                show: true,
                title: '切换为折线图',
                icon: 'path://M981.4 938.7H271.1c-102.6 0-185.7-83.1-185.7-185.7V652.2c5-1.7 9.8-4.5 14-8.8L343.8 399c13.9-13.9 36.6-13.9 50.5 0l173.2 173.2 40.3 40.3c13.9 13.9 36.6 13.9 50.5 0l40.3-40.3 320.6-320.6 0.2-0.2c5.9-5.9 6-15.1 0.2-21l-45-44.8c-5.9-5.9-15.3-5.5-21 0.2l-0.2 0.2-295.3 295.5c-13.9 13.9-36.6 13.9-50.5 0L394.3 268.1c-13.9-13.9-36.6-13.9-50.5 0L85.4 526.4V42.7C85.4 19.1 66.3 0 42.7 0 19 0 0 19.1 0 42.7v795.6C0 940.9 83 1024 185.7 1024h795.6c23.6 0 42.7-19.1 42.8-42.6 0-23.6-19.1-42.7-42.7-42.7z',
                onclick: this.changeLine1
              },
              myTool3: {
                show: true,
                title: '切换为柱状图',
                icon: 'path ://M881.2 131.1c0-5.7-2.2-11-6.2-15L846.9 88c-8.3-8.3-21.8-8.3-30.1 0l-44.6 44.6c-4 4-6.2 9.4-6.2 15v595.1c0 13.2 10.8 24 24 24h67.2c13.2 0 24-10.8 24-24V131.1zM702.3 253.9c0-19-22.9-28.4-36.4-15l-72.6 72.6c-4 4-6.2 9.4-6.2 15v416.3c0 13.2 10.8 24 24 24h67.2c13.2 0 24-10.8 24-24V253.9zM523.4 263.6c0-5.7-2.2-11-6.2-15l-72.7-72.7c-8.3-8.3-21.8-8.3-30.1 0-4 4-6.2 9.4-6.2 15v551.9c0 13.2 10.8 24 24 24h67.2c13.2 0 24-10.8 24-24V263.6zM344.5 297.1c0-19-22.9-28.4-36.4-15l-72.6 72.6c-4 4-6.2 9.4-6.2 15v372.9c0 13.2 10.8 24 24 24h67.2c13.2 0 24-10.8 24-24V297.1z M981.3 1024H185.7C83.1 1024 0 940.9 0 838.3V42.7C0 19.1 19.1 0 42.7 0s42.7 19.1 42.7 42.7V753c0 102.6 83.1 185.7 185.7 185.7h710.3c23.6 0 42.7 19.1 42.7 42.7-0.1 23.5-19.2 42.6-42.8 42.6z',
                onclick: this.changeBar1
              },
              myTool1: {
                show: true,
                title: '查看历史',
                icon: 'path://M525.4 721.2H330.9c-9 0-18.5-7.7-18.5-18.1V311c0-9 9.3-18.1 18.5-18.1h336.6c9.3 0 18.5 9.1 18.5 18.1v232.7c0 6 8.8 12.1 15 12.1 6.2 0 15-6 15-12.1V311c0-25.6-25.3-48.9-50.1-48.9h-335c-26.2 0-50.1 23.3-50.1 48.9v389.1c0 36.3 20 51.5 50.1 51.5h197.6c6.2 0 9.3-7.5 9.3-15.1 0-6-6.2-15.3-12.4-15.3zM378.8 580.6c-6.2 0-12.3 8.6-12.3 14.6s6.2 14.6 12.3 14.6h141.4c6.2 0 12.3-5.8 12.3-13.4 0.3-9.5-6.2-15.9-12.3-15.9H378.8z m251.6-91.2c0-6-6.2-14.6-12.3-14.6H375.7c-6.2 0-12.4 8.6-12.4 14.6s6.2 14.6 12.4 14.6h240.8c6.2 0.1 13.9-8.5 13.9-14.6z m-9.2-120.5H378.8c-6.2 0-12.3 8.6-12.3 14.6s6.2 14.6 12.3 14.6h240.8c7.7 0 13.9-8.6 13.9-14.6s-6.2-14.6-12.3-14.6z m119.4 376.6L709 714.1c9.2-12 14.6-27 14.6-43.2 0-39.4-32.1-71.4-71.8-71.4-39.7 0-71.8 32-71.8 71.4s32.1 71.4 71.8 71.4c16.3 0 31.3-5.4 43.4-14.5l31.6 31.5c3.8 3.8 10 3.8 13.8 0 3.8-3.8 3.8-10 0-13.8z m-88.8-23.6c-28.3 0-51.3-22.8-51.3-51s23-51 51.3-51c28.3 0 51.3 22.8 51.3 51s-23 51-51.3 51z',
                onclick: this._viewForecastParameterHistoryByOutput
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
              type: 'value',
              max: function (value) {
                return  (value.max * (1.2)).toFixed(0);
              }
            }
          ],
          series: [
            {
              name: '预测输出',
              type: 'bar',
              barGap: 0,
              data: []
            },
            {
              name: 'lims输出',
              type: 'bar',
              data: []
            },
            {
              name: '在线输出',
              type: 'bar',
              data: []
            }
          ]
        },
        inputOutParamDiffOption: {
          tooltip: {
            /* formatter: '{a} <br/>预测输出值:{b} <br/>归一化预测输出值: {c}',*/
            formatter: this._getToolTipByDiff,
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          toolbox: {
            feature: {
              saveAsImage: {},
              /* magicType: {
                 type: ['line', 'bar']
               },*/
              myTool2: {
                show: true,
                title: '切换为折线图',
                icon: 'path://M981.4 938.7H271.1c-102.6 0-185.7-83.1-185.7-185.7V652.2c5-1.7 9.8-4.5 14-8.8L343.8 399c13.9-13.9 36.6-13.9 50.5 0l173.2 173.2 40.3 40.3c13.9 13.9 36.6 13.9 50.5 0l40.3-40.3 320.6-320.6 0.2-0.2c5.9-5.9 6-15.1 0.2-21l-45-44.8c-5.9-5.9-15.3-5.5-21 0.2l-0.2 0.2-295.3 295.5c-13.9 13.9-36.6 13.9-50.5 0L394.3 268.1c-13.9-13.9-36.6-13.9-50.5 0L85.4 526.4V42.7C85.4 19.1 66.3 0 42.7 0 19 0 0 19.1 0 42.7v795.6C0 940.9 83 1024 185.7 1024h795.6c23.6 0 42.7-19.1 42.8-42.6 0-23.6-19.1-42.7-42.7-42.7z',
                onclick: this.changeLine2
              },
              myTool3: {
                show: true,
                title: '切换为柱状图',
                icon: 'path ://M881.2 131.1c0-5.7-2.2-11-6.2-15L846.9 88c-8.3-8.3-21.8-8.3-30.1 0l-44.6 44.6c-4 4-6.2 9.4-6.2 15v595.1c0 13.2 10.8 24 24 24h67.2c13.2 0 24-10.8 24-24V131.1zM702.3 253.9c0-19-22.9-28.4-36.4-15l-72.6 72.6c-4 4-6.2 9.4-6.2 15v416.3c0 13.2 10.8 24 24 24h67.2c13.2 0 24-10.8 24-24V253.9zM523.4 263.6c0-5.7-2.2-11-6.2-15l-72.7-72.7c-8.3-8.3-21.8-8.3-30.1 0-4 4-6.2 9.4-6.2 15v551.9c0 13.2 10.8 24 24 24h67.2c13.2 0 24-10.8 24-24V263.6zM344.5 297.1c0-19-22.9-28.4-36.4-15l-72.6 72.6c-4 4-6.2 9.4-6.2 15v372.9c0 13.2 10.8 24 24 24h67.2c13.2 0 24-10.8 24-24V297.1z M981.3 1024H185.7C83.1 1024 0 940.9 0 838.3V42.7C0 19.1 19.1 0 42.7 0s42.7 19.1 42.7 42.7V753c0 102.6 83.1 185.7 185.7 185.7h710.3c23.6 0 42.7 19.1 42.7 42.7-0.1 23.5-19.2 42.6-42.8 42.6z',
                onclick: this.changeBar2
              },
              myTool1: {
                show: true,
                title: '查看历史',
                icon: 'path://M525.4 721.2H330.9c-9 0-18.5-7.7-18.5-18.1V311c0-9 9.3-18.1 18.5-18.1h336.6c9.3 0 18.5 9.1 18.5 18.1v232.7c0 6 8.8 12.1 15 12.1 6.2 0 15-6 15-12.1V311c0-25.6-25.3-48.9-50.1-48.9h-335c-26.2 0-50.1 23.3-50.1 48.9v389.1c0 36.3 20 51.5 50.1 51.5h197.6c6.2 0 9.3-7.5 9.3-15.1 0-6-6.2-15.3-12.4-15.3zM378.8 580.6c-6.2 0-12.3 8.6-12.3 14.6s6.2 14.6 12.3 14.6h141.4c6.2 0 12.3-5.8 12.3-13.4 0.3-9.5-6.2-15.9-12.3-15.9H378.8z m251.6-91.2c0-6-6.2-14.6-12.3-14.6H375.7c-6.2 0-12.4 8.6-12.4 14.6s6.2 14.6 12.4 14.6h240.8c6.2 0.1 13.9-8.5 13.9-14.6z m-9.2-120.5H378.8c-6.2 0-12.3 8.6-12.3 14.6s6.2 14.6 12.3 14.6h240.8c7.7 0 13.9-8.6 13.9-14.6s-6.2-14.6-12.3-14.6z m119.4 376.6L709 714.1c9.2-12 14.6-27 14.6-43.2 0-39.4-32.1-71.4-71.8-71.4-39.7 0-71.8 32-71.8 71.4s32.1 71.4 71.8 71.4c16.3 0 31.3-5.4 43.4-14.5l31.6 31.5c3.8 3.8 10 3.8 13.8 0 3.8-3.8 3.8-10 0-13.8z m-88.8-23.6c-28.3 0-51.3-22.8-51.3-51s23-51 51.3-51c28.3 0 51.3 22.8 51.3 51s-23 51-51.3 51z',
                onclick: this._viewForecastParameterHistoryByDiff
              },
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: []
          },
          legend: {
            data: ['输入值', '上次输入值'],
            left: 'left'
          },
          yAxis: {
            type: 'value',
            max: function (value) {
              return  (value.max * (1.2)).toFixed(0);
            }
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
          grid : {
            show : true,
            backgroundColor : 'white'
          },
          series: [{
            name: '输入值',
            data: [],
            type: 'line',
            barGap: 0,
            areaStyle: {
              color: '#ff4d51'
            },
            //smooth: true
          }, {
            name: '上次输入值',
            data: [],
            type: 'line',
            barGap: 0,
            areaStyle: {
              color: '#ff4d51'
            },
            //smooth: true
          }, {
            name: '假的',
            data: [],
            type: 'line',
            barGap: 0,
            areaStyle: {
              color: 'white',
              origin: 'start',
              shadowColor: 'white',
              shadowOffsetX: 1,
            },
            lineStyle : {
              opacity : 0
            },
            //smooth: true
          }]
        }
      },
      viewForecastParameterHistory: {
        show: false,
        title: '查看历史',
        viewExceptionHistoryLoading: false,
        dialogVisible: true,
        formLabelWidth: '120px',
        width: '1080px',
        style: {
          height: '800px',
        }
      },
      viewInputOutRelationHistory: {
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
      timingTask: {},
      tempList: [
        {
          "input": ["48.3168830872", "303.334106445", "327.420837402", "14.93264341354", "202.301818848", "309.436004639", "325.953674316", "57.1867294312", "68.1822967529"],
          "output": ["44.00644", "421.51526", "333.30406", "319.63722", "63.9175"],
          "dataTime": 1574667658000,
          "inputCountValue": ["0.427", "0.65688", "0.66680", "1.21111", "0.67544", "0.80329", "0.73357", "1.20924", "1.20545"],
          "outputCountValue": ["0.25", "0.6", "1.66", "0.78949", "0.97270"],
          "actualOutput":["77.92", "65.2", "85.2", "55.9", "74.5"],
          "actualOutputCV": ["0.65", "0.25", "0.99", "0.44", "0.63"],
          "collectTime": null,
          "limsOutput": ["99.88", "0.02", "0.10"]
        },
        {
          "input": ["88.3168830872", "273.334106445", "227.420837402", "24.93264341354", "288.301818848", "409.436004639", "215.953674316", "57.1867294312", "68.1822967529"],
          "output": ["219.00644", "295.51526", "327.30406", "349.63722", "363.9175"],
          "dataTime": 1574667658000,
          "inputCountValue": ["0.234287", "0.65688", "0.66680", "1.21111", "0.67544", "0.80329", "0.73357", "1.20924", "1.20545"],
          "outputCountValue": ["0.34426", "0.95355", "0.765", "0.78949", "0.97270"],
          "actualOutput": ["77.92", "65.2", "85.2", "55.9", "74.5"],
          "actualOutputCV": ["0.65", "0.35", "0.69", "0.45", "0.63"],
          "collectTime": null,
          "limsOutput": ["3", "4", "5"]
        },
        {
          "input": ["98.3168830872", "473.334106445", "427.420837402", "44.93264341354", "382.301818848", "309.436004639", "115.953674316", "57.1867294312", "68.1822967529"],
          "output": ["219.00644", "295.51526", "327.30406", "349.63722", "363.9175"],
          "dataTime": 1574667658000,
          "inputCountValue": ["0.24517", "0.65688", "0.66680", "1.21111", "0.67544", "0.80329", "0.73357", "1.20924", "1.20545"],
          "outputCountValue": ["0.34426", "0.95355", "0.4125", "0.78949", "0.97270"],
          "actualOutput": ["77.92", "65.2", "85.2", "55.9", "74.5"],
          "actualOutputCV": ["0.34", "0.45", "0.99", "0.44", "0.63"],
          "collectTime": null,
          "limsOutput": ["8", "25", "0.3"]
        },
        {
          "input": ["28.3168830872", "173.334106445", "347.420837402", "45.93264341354", "482.301818848", "359.436004639", "415.953674316", "57.1867294312", "68.1822967529"],
          "output": ["219.00644", "295.51526", "327.30406", "349.63722", "363.9175"],
          "dataTime": 1574667658000,
          "inputCountValue": ["0.51287", "0.65688", "0.66680", "1.21111", "0.67544", "0.80329", "0.73357", "1.20924", "1.20545"],
          "outputCountValue": ["0.34426", "0.95355", "0.668", "0.78949", "0.97270"],
          "actualOutput": ["77.92", "65.2", "85.2", "55.9", "74.5"],
          "actualOutputCV": ["0.23", "0.25", "0.49", "0.44", "0.78"],
          "collectTime": null,
          "limsOutput": ["48", "111", "12"]
        },
        {
          "input": ["148.3168830872", "373.334106445", "337.420837402", "24.93264341354", "182.301818848", "509.436004639", "315.953674316", "57.1867294312", "68.1822967529"],
          "output": ["219.00644", "295.51526", "327.30406", "349.63722", "363.9175"],
          "dataTime": 1574667658000,
          "inputCountValue": ["0.52187", "0.65688", "0.66680", "1.21111", "0.67544", "0.80329", "0.73357", "1.20924", "1.20545"],
          "outputCountValue": ["0.34426", "0.95355", "1.441", "0.78949", "0.97270"],
          "actualOutput": ["77.92", "65.2", "85.2", "55.9", "74.5"],
          "actualOutputCV": ["0.13", "0.35", "0.61", "0.44", "0.63"],
          "collectTime": null,
          "limsOutput": ["15", "233", "23"]
        }
      ]//用于假数据
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
    //初始化输入输出差值折线图
    this._initInputOutParamDiff();
    //初始化输入输出仪表关系比对
    this._initInputOutRelationMeter();

  },
  beforeDestroy () {
    clearInterval(this.timingTask);
  },
  methods: {
    changeLine1(){
      this.inputOutRelation.outPutOption.series[0].type= 'line';
      this.inputOutRelation.outPutOption.series[1].type= 'line';
      this.inputOutRelation.outPutOption.series[2].type= 'line';
      this._initOutPutParam();
    },
    changeBar1(){
      this.inputOutRelation.outPutOption.series[0].type= 'bar';
      this.inputOutRelation.outPutOption.series[1].type= 'bar';
      this.inputOutRelation.outPutOption.series[2].type= 'bar';
      this._initOutPutParam();
    },
    changeLine2(){
      this.inputOutRelation.inputOutParamDiffOption.series[0].type= 'line';
      this.inputOutRelation.inputOutParamDiffOption.series[1].type= 'line';
      this.inputOutRelation.inputOutParamDiffOption.series[2].type= 'line';
      this.inputOutRelation.inputOutParamDiffOption.xAxis.boundaryGap = false;
      this._initInputOutParamDiff();
    },
    changeBar2(){
      this.inputOutRelation.inputOutParamDiffOption.series[0].type= 'bar';
      this.inputOutRelation.inputOutParamDiffOption.series[1].type= 'bar';
      this.inputOutRelation.inputOutParamDiffOption.series[2].type= 'bar';
      this.inputOutRelation.inputOutParamDiffOption.xAxis.boundaryGap = true;
      this._initInputOutParamDiff();
    },
    _getToolTip (params) {
      return '' + params[0].axisValue + '<br/>预测输出值:' + params[0].data.name + '<br/>归一化预测输出值:' + params[0].data.value + '<br/>lims值:' + params[1].data.name + ' <br/>lims归一化输出值: ' + params[1].data.value + ' <br/>在线输出值: ' + params[2].data.name + '<br/>归一化在线输出值: ' + params[2].data.value + '';
    },
    _getToolTipByDiff (params) {
      return '' + params[0].axisValue + '<br/>输入值:' + params[0].data.value + ' <br/>上一次输入值: ' + params[1].data.value + ' <br/> 差值: ' + params[0].data.name + ' ';
    },
    _initOutPutParam () {
      if (this.inputOutRelation.relationList_B.length > 0) {
        let xAxisData = [];
        let seriesData_1 = [];
        let seriesData_2 = [];
        let seriesData_3 = [];
        this.inputOutRelation.relationList_B.forEach((item, index) => {
          xAxisData.push(item.name);
          seriesData_1.push({ //预测值
            value: item.outputCountValue,
            name: item.output
          });
          seriesData_2.push({ //lims值
            name: item.limsOutput,
            value: item.limsOutputGY
          });
          seriesData_3.push({ //在线值
            value: item.actualOutputCV,
            name: item.actualOutput
          });
        });

        this.inputOutRelation.outPutOption.xAxis[0].data = xAxisData;
        this.inputOutRelation.outPutOption.series[0].data = seriesData_1;
        this.inputOutRelation.outPutOption.series[1].data = seriesData_2;
        this.inputOutRelation.outPutOption.series[2].data = seriesData_3;
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

            if (item.name.indexOf('-') > 0) {
              this.inputOutRelation.inputOption.series[0].name = item.name.substring(0, item.name.indexOf('-'));
              this.inputOutRelation.inputMeterName_1 = item.name.substring(0, item.name.indexOf('-'));
            } else {
              this.inputOutRelation.inputOption.series[0].name = item.name;
              this.inputOutRelation.inputMeterName_1 = item.name
            }
          } else if (index == 1) {
            this.inputOutRelation.inputOption.series[1].data[0].value = item.inputCountValue;
            this.inputOutRelation.inputOption.series[1].data[0].name = item.input;

            if (item.name.indexOf('-') > 0) {
              this.inputOutRelation.inputOption.series[1].name = item.name.substring(0, item.name.indexOf('-'));
              this.inputOutRelation.inputMeterName_2 = item.name.substring(0, item.name.indexOf('-'));
            } else {
              this.inputOutRelation.inputOption.series[1].name = item.name;
              this.inputOutRelation.inputMeterName_2 = item.name;
            }
          } else if (index == 2) {
            this.inputOutRelation.inputOption.series[2].data[0].value = item.inputCountValue;
            this.inputOutRelation.inputOption.series[2].data[0].name = item.input;

            if (item.name.indexOf('-') > 0) {
              this.inputOutRelation.inputOption.series[2].name = item.name.substring(0, item.name.indexOf('-'));
              this.inputOutRelation.inputMeterName_3 = item.name.substring(0, item.name.indexOf('-'));
            } else {
              this.inputOutRelation.inputOption.series[2].name = item.name;
              this.inputOutRelation.inputMeterName_3 = item.name;
            }
          } else if (index == 3) {
            this.inputOutRelation.inputOption.series[3].data[0].value = item.inputCountValue;
            this.inputOutRelation.inputOption.series[3].data[0].name = item.input;

            if (item.name.indexOf('-') > 0) {
              this.inputOutRelation.inputOption.series[3].name = item.name.substring(0, item.name.indexOf('-'));
              this.inputOutRelation.inputMeterName_4 = item.name.substring(0, item.name.indexOf('-'));
            } else {
              this.inputOutRelation.inputOption.series[3].name = item.name;
              this.inputOutRelation.inputMeterName_4 = item.name;
            }
          }
          else {
            return;
          }


        });
      }
      let inputChart = echarts.init(document.getElementById('inputParam'));
      inputChart.setOption(this.inputOutRelation.inputOption, true);
    },
    _initInputOutParamDiff () {
      if (this.inputOutRelation.relationList_A.length > 0) {
        let xAxisData = [];
        let seriesData_1 = [];
        let seriesData_2 = [];
        let seriesData_3 = [];
        this.inputOutRelation.relationList_A.forEach((item, index) => {
          if (item.name.indexOf('-') > 0) {
            xAxisData.push(item.name.substring(0, item.name.indexOf('-')));
          } else {
            xAxisData.push(item.name);
          }

          let differ = Math.abs(item.input - this.inputOutRelation.relationListBefore_A[index].input);
          let differPlus = 0;
          //let differMinus = 0;

          if (differ > 0) {
            differPlus = differ;
          }

          seriesData_1.push({
            value: item.input,
            name: differPlus
          });
          seriesData_2.push({
            value: this.inputOutRelation.relationListBefore_A[index].input,
          });
          /*seriesData_3.push({
            value: item.input > this.inputOutRelation.relationListBefore_A[index].input ? this.inputOutRelation.relationListBefore_A[index].input : item.input ,
          });*/

          if((item.input - this.inputOutRelation.relationListBefore_A[index].input) >= 0){
            seriesData_3.push({
              value: this.inputOutRelation.relationListBefore_A[index].input
            })
          }else{
            seriesData_3.push({
              value: item.input
            })
          }

        });

        if (xAxisData.length > 0) {
          this.inputOutRelation.inputOutParamDiffOption.dataZoom[0].startValue = xAxisData[0];
          if (xAxisData.length >= 5) {
            this.inputOutRelation.inputOutParamDiffOption.dataZoom[0].endValue = xAxisData[4];
          } else {
            this.inputOutRelation.inputOutParamDiffOption.dataZoom[0].endValue = xAxisData[xAxisData.length - 1];
          }
        }

        this.inputOutRelation.inputOutParamDiffOption.xAxis.data = xAxisData;
        this.inputOutRelation.inputOutParamDiffOption.series[0].data = seriesData_1;
        this.inputOutRelation.inputOutParamDiffOption.series[1].data = seriesData_2;
        this.inputOutRelation.inputOutParamDiffOption.series[2].data = seriesData_3;
      }


      let inputOutParamDiffChart = echarts.init(document.getElementById('inputOutParamDiff'));
      inputOutParamDiffChart.setOption(this.inputOutRelation.inputOutParamDiffOption, true);
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
      clearInterval(this.timingTask);
      this._refresh();
      if (orgLevel == 5) {
        this._setTitle(ogName);
        await this._selectModelParamList(ogId);
        await this._selectNewestParameter(ogId, this.tempList[0]);
        this._selectOutputTable();
        this._timingTask();
      }

      this._initOutPutParam();
      this._initInputParam();
      this._initInputOutParamDiff();
      this._initInputOutRelationMeter();


    },
    _selectOutputTable () {

    },
    _timingTask () {
      let index = 0;
      let that = this;
      this.timingTask = setInterval(function () {
        index++;
        if (index == 5) {
          index = 0
        }
        let node = that.$refs.viewOrgComRef._getCurrentNode();
        that.inputOutRelation.relationListBefore_A = JSON.parse(JSON.stringify(that.inputOutRelation.relationList_A));
        that.inputOutRelation.relationListBefore_B = JSON.parse(JSON.stringify(that.inputOutRelation.relationList_B));
        that._selectNewestParameter(node.ogId, that.tempList[index]);
        //目前只能模拟定时器传假数据
      }, 15000);
    },
    _onMeterAChange () {
      for (let i = 0; i < this.inputOutRelation.relationList_A.length; i++) {
        if (this.inputOutRelation.code_a == this.inputOutRelation.relationList_A[i].id) {
          let name = this.inputOutRelation.relationList_A[i].name;
          if (name.indexOf('-') > 0) {
            name = name.substring(0, name.indexOf('-'));
          }
          this._setMerter_A(this.inputOutRelation.relationList_A[i].input, this.inputOutRelation.relationList_A[i].inputCountValue, name);
          return;
        }
      }
    },
    _onMeterBChange () {
      for (let i = 0; i < this.inputOutRelation.relationList_B.length; i++) {
        if (this.inputOutRelation.code_b == this.inputOutRelation.relationList_B[i].id) {
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
      this.inputOutRelation.outPutOption.series[1].data = [];
      this.inputOutRelation.outPutOption.series[2].data = [];

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

      this.inputOutRelation.inputOutParamDiffOption.xAxis.data = [];
      this.inputOutRelation.inputOutParamDiffOption.series[0].data = [];
      this.inputOutRelation.inputOutParamDiffOption.series[1].data = [];
      this.inputOutRelation.inputOutParamDiffOption.series[2].data = [];
      this.inputOutRelation.inputOutParamDiffOption.dataZoom[0].startValue = '';
      this.inputOutRelation.inputOutParamDiffOption.dataZoom[0].endValue = '';

      this.forecastParameterTable.forecastParameterTablePageList = [];
    },
    _setTitle (ogName) {
      this.forecastParameter.title = ogName;
    },
    async _selectNewestParameter (ogId, list) {
      await this.$http({
        url: '/api/api/preHistory/getNewestParameter?modelId=' + ogId + '',
        "content-type": "application/json",
        method: 'get',
        /*headers: {Authorization: token},*/
      }).then(res => {
        if (res.data.status == 1) {
          //const list = res.data.result;
          //假数据011104010104查询结果
          /*const list = {
            "input": ["48.3168830872", "373.334106445", "327.420837402", "4.93264341354", "282.301818848", "309.436004639", "315.953674316", "57.1867294312", "68.1822967529"],
            "output": ["219.00644", "295.51526", "327.30406", "349.63722", "363.9175"],
            "dataTime": 1574667658000,
            "inputCountValue": ["0.22387", "0.65688", "0.66680", "1.21111", "0.67544", "0.80329", "0.73357", "1.20924", "1.20545"],
            "outputCountValue": ["0.34426", "0.95355", "1.31815", "0.78949", "0.97270"],
            "actualOutput": null,
            "actualOutputCV": [],
            "collectTime": null,
            "limsOutput": ["99.8", "0.02", "0.10"]
          };*/
          this.inputOutRelation.newestParameterList = list;
          for (let i = 0; i < this.inputOutRelation.relationList_A.length; i++) {
            this.inputOutRelation.relationList_A[i].input = list.input[i];
            this.inputOutRelation.relationList_A[i].inputCountValue = list.inputCountValue[i];
          }

          for (let i = 0; i < this.inputOutRelation.relationList_B.length; i++) {
            //this.inputOutRelation.relationList_B[i].output = list.output[i];
            //this.inputOutRelation.relationList_B[i].outputCountValue = list.outputCountValue[i];
            //this.inputOutRelation.relationList_B[i].actualOutputCV = list.actualOutputCV[i];
            //this.inputOutRelation.relationList_B[i].actualOutput = list.actualOutput[i];
            if(list.output[i] == undefined){
              this.inputOutRelation.relationList_B[i].output = 0;
            }else{
              this.inputOutRelation.relationList_B[i].output = list.output[i];
            }
            if(list.outputCountValue[i] == undefined){
              this.inputOutRelation.relationList_B[i].outputCountValue = 0;
            }else{
              this.inputOutRelation.relationList_B[i].outputCountValue = list.outputCountValue[i];
            }
            if(list.actualOutputCV[i] == undefined){
              this.inputOutRelation.relationList_B[i].actualOutputCV = 0;
            }else{
              this.inputOutRelation.relationList_B[i].actualOutputCV = list.actualOutputCV[i];
            }
            if(list.actualOutput[i] == undefined){
              this.inputOutRelation.relationList_B[i].actualOutput = 0;
            }else{
              this.inputOutRelation.relationList_B[i].actualOutput = list.actualOutput[i];
            }
            if (list.limsOutput.length - 1 > i) {
              const limsOutput = (list.limsOutput[i] - this.inputOutRelation.relationList_B[i].minValue) / (this.inputOutRelation.relationList_B[i].maxValue - this.inputOutRelation.relationList_B[i].minValue);
              this.inputOutRelation.relationList_B[i].limsOutputGY = limsOutput;
              this.inputOutRelation.relationList_B[i].limsOutput = list.limsOutput[i];
            } else {
              this.inputOutRelation.relationList_B[i].limsOutputGY = 0;
              this.inputOutRelation.relationList_B[i].limsOutput = 0;
            }
          }

          //第一遍正常进入进行赋值
          if (this.inputOutRelation.relationListBefore_A.length <= 0) {
            this.inputOutRelation.relationListBefore_A = JSON.parse(JSON.stringify(this.inputOutRelation.relationList_A));
            this.inputOutRelation.relationListBefore_B = JSON.parse(JSON.stringify(this.inputOutRelation.relationList_B));
          }

          this.forecastParameterTable.forecastParameterTablePageList = JSON.parse(JSON.stringify(this.inputOutRelation.relationList_B));
          this._initOutPutParam();
          this._initInputParam();
          this._initInputOutParamDiff();
          this._onMeterAChange();
          this._onMeterBChange();
        } else {
          this.$message({message: res.data.msg, type: 'error'});
        }
      })
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
    _viewForecastParameterHistoryByOutput () {
      const node = this.$refs.viewOrgComRef._getCurrentNode();
      if (node == null || node.level != 5) {
        this.$message({message: '请选择最底层模型', type: 'warning'});
        return;
      }

      this.viewForecastParameterHistory.show = true;
      this.viewForecastParameterHistory.dialogVisible = true;
      this.$nextTick(_ => {
        this.$refs.viewForecastParameterHistoryRef.forecastParameterHistory.columnName = '预测输出值';
        this.$refs.viewForecastParameterHistoryRef._getModelFeaturesList(node.ogId, 'output');
      });
    },
    _viewForecastParameterHistoryByInput () {
      const node = this.$refs.viewOrgComRef._getCurrentNode();
      if (node == null || node.level != 5) {
        this.$message({message: '请选择最底层模型', type: 'warning'});
        return;
      }

      this.viewForecastParameterHistory.show = true;
      this.viewForecastParameterHistory.dialogVisible = true;
      this.$nextTick(_ => {
        this.$refs.viewForecastParameterHistoryRef.forecastParameterHistory.columnName = '输入值';
        this.$refs.viewForecastParameterHistoryRef._getModelFeaturesList(node.ogId, 'input');
      });
    },
    _viewForecastParameterHistoryByDiff(){
      const node = this.$refs.viewOrgComRef._getCurrentNode();
      if (node == null || node.level != 5) {
        this.$message({message: '请选择最底层模型', type: 'warning'});
        return;
      }

      this.viewForecastParameterHistory.show = true;
      this.viewForecastParameterHistory.dialogVisible = true;
      this.$nextTick(_ => {
        this.$refs.viewForecastParameterHistoryRef.forecastParameterHistory.columnName = '输入差值历史查询';
        this.$refs.viewForecastParameterHistoryRef._getModelFeaturesList(node.ogId, 'diff');
      });
    },
    //查看输入输出关系历史界面
    _viewInputOutRelationHistory(){
      const node = this.$refs.viewOrgComRef._getCurrentNode();
      if (node == null || node.level != 5) {
        this.$message({message: '请选择最底层模型', type: 'warning'});
        return;
      }

      this.viewInputOutRelationHistory.show = true;
      this.viewInputOutRelationHistory.dialogVisible = true;
      this.$nextTick(_ => {
        this.$refs.viewInputOutRelationHistoryRef._getModelParamList(node.ogId);
      });
    },
    _closeForecastParameterHistoryViewDialog () {
      this.viewForecastParameterHistory.dialogVisible = false;
      this.viewForecastParameterHistory.show = false;
    },
    _closeInputOutRelationHistoryViewDialog () {
      this.viewInputOutRelationHistory.dialogVisible = false;
      this.viewInputOutRelationHistory.show = false;
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

  .third_panel {
    position: relative;
    width: 100%;
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

  #inputOutParamDiff {
    width: 100%;
    height: calc(~"50vh - 125px");
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
