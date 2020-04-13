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
                      >
                        <el-option
                          v-for="item in inputOutRelation.relationList_A"
                          :key="item.code"
                          :label="item.name"
                          :value="item.code">
                        </el-option>
                      </el-select>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="inputOutRelationDiv">
                      <el-select
                        v-model="inputOutRelation.code_b"
                        style="width: 100%"
                      >
                        <el-option
                          v-for="item in inputOutRelation.relationList_B"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select>
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
        relationList_B: []
      }
    }
  },
  created () {
    this._initForecastParameter();
    this.$nextTick(_ => {
      this.$refs.viewOrgComRef._getUserRoleOrgTree();
    })
  },
  methods: {
    _initForecastParameter () {
      this.orgTreeStyle.height = window.innerHeight - 110 + 'px'
      this.contentDivStyle.height = window.innerHeight - 110 + 'px'
    },
    _handleOnClickOrg (args) {
      const ogId = args[1];
      const orgLevel = args[2];
      const ogName = args[4];

      this._refresh();
      if (orgLevel == 5) {
        this._setTitle(ogName);
        this._selectModelParamList(ogId);
      }
    },
    _refresh () {
      this._setTitle('预测参数');
      this.inputOutRelation.relationList_A = [];
      this.inputOutRelation.relationList_B = [];
    },
    _setTitle (ogName) {
      this.forecastParameter.title = ogName;
    },
    _selectModelParamList (ogId) {
      this.$http({
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
  }

  .first_left_panel {
    position: absolute;
    top: 0px;
    left: 10px;
    width: 49%;
    bottom: 0px;
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

</style>
