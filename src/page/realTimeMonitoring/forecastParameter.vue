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
            </div>
          </div>
          <div class="first_right_panel">
            <div>
              <div
                style="border: 1px solid; border-top-style: none; border-left-style: none; border-right-style: none; border-bottom-color: darkgrey;">
                <h3 style="margin-left: 5px">{{forecastParameter.title}}输入参数</h3>
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
        newestParameterList : [],
        option_A : {
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
            show : true,
            text : '',
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
                  width: 10
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
                textShadowColor: '#222'
              },
              title: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                show : false,
                fontWeight: 'bolder',
                fontSize: 20,
                fontStyle: 'italic',
              },
              detail: {
                formatter: '{value}',
                fontWeight: 'bolder',
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
              data: [{value: 0, name : '0'}]
            }
          ]
        },
        option_B : {
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
            show : true,
            text : '',
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
                  width: 10
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
                textShadowColor: '#222'
              },
              title: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                show : false,
                fontWeight: 'bolder',
                fontSize: 20,
                fontStyle: 'italic',
              },
              detail: {
                formatter: '{value}',
                fontWeight: 'bolder',
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
              data: [{value: 0, name : '0'}]
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
    this._initInputOutRelationMeter();
  },
  methods: {
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
      }
    },
    _onMeterAChange(id){
      for(let i = 0; i < this.inputOutRelation.relationList_A.length; i++){
        if(id == this.inputOutRelation.relationList_A[i].id){
          let name = this.inputOutRelation.relationList_A[i].name;
          name = name.substring(0 , name.indexOf('-'));
          this._setMerter_A(this.inputOutRelation.relationList_A[i].input, this.inputOutRelation.relationList_A[i].inputCountValue, name);
          return;
        }
      }
    },
    _onMeterBChange(id){
      for(let i = 0; i < this.inputOutRelation.relationList_B.length; i++){
        if(id == this.inputOutRelation.relationList_B[i].id){
          this._setMerter_B(this.inputOutRelation.relationList_B[i].output, this.inputOutRelation.relationList_B[i].outputCountValue, this.inputOutRelation.relationList_B[i].name);
          return;
        }
      }
    },
    _setMerter_A(input, inputCountValue, name){
      let myChart_A = echarts.init(document.getElementById('inputOutRelationMeter_A'));
      this.inputOutRelation.option_A.series[0].data[0].value = inputCountValue;
      this.inputOutRelation.option_A.series[0].data[0].name = input;
      this.inputOutRelation.option_A.series[0].name = name;
      myChart_A.setOption(this.inputOutRelation.option_A, true);
    },
    _setMerter_B(input, inputCountValue, name){
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
    async _selectNewestParameter(ogId){
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

          for(let i = 0 ; i < this.inputOutRelation.relationList_A.length; i++){
            this.inputOutRelation.relationList_A[i].input = list.input[i];
            this.inputOutRelation.relationList_A[i].inputCountValue = list.inputCountValue[i];
          }

          for(let i = 0 ; i < this.inputOutRelation.relationList_B.length; i++){
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
  }

  .second_panel {
    position: relative;
    width: 100%;
    /*background-color: brown;*/
    height: calc(~"50vh - 62px");
    min-width: 1050px;
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

</style>
