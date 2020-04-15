<!--优化管理页面-->
<template>
  <div>
    <div class="orgTree" :style="orgTreeStyle">
      <viewOrgCom ref="viewOrgComRef"
                  @_handleOnClickOrg="_handleOnClickOrg(arguments)"></viewOrgCom>
    </div>
    <div class="contentDiv" :style="contentDivStyle">

      <div
        style="border: 1px solid; border-top-style: none; border-left-style: none; border-right-style: none; border-bottom-color: darkgrey;">
        <h3 style="margin-left: 2%">系统优化</h3>
      </div>

      <div class="table_container">
        <el-table
          v-loading="optimization.gridLoading"
          :data="optimization.optimizationPageList"
          :style="optimization.gridTableStyle"
          :height="optimization.gridTableStyle.height"
          align='center'
          ref="multipleTable"
          highlight-current-row
        >
          <el-table-column
            v-if="idFlag"
            prop="id"
            label="项目需求ID"
            align='center'
          >
          </el-table-column>
          <el-table-column
            prop="name"
            label="参数"
            align='left'
            min-width="500"
          >
          </el-table-column>
          <el-table-column
            prop="maxValue"
            label="最优输出值"
            align='left'
            min-width="200"
            sortable
          >
          </el-table-column>
        </el-table>
      </div>


    </div>
  </div>
</template>

<script>
import viewOrgCom from "../org/viewOrg.vue";

export default {
  name: "manageOptimization",
  components: {viewOrgCom},
  data() {
    return {
      orgTreeStyle: {
        height: ''
      },
      contentDivStyle: {
        height: ''
      },
      idFlag: false,
      optimization: {
        sortNum: 0,
        gridLoading: false,
        optimizationAllList: [],
        optimizationPageList: [],
        optimizationList: [],
        gridTableStyle: {
          width: '100%',
          height: window.innerHeight - 170 + 'px'
        },
        pagination: {
          page_index: 1,  // 当前位于哪页
          total: 0,        // 总数
          page_size: 10,   // 1页显示多少条
          page_sizes: [5, 10, 15, 20],  //每页显示多少条
          layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
        },
        selectedDate: [],
      },
      numbers: [],
      multipleSelection: []
    }
  },
  created() {
    this._initData();
    this.$nextTick(_ => {
      this.$refs.viewOrgComRef._getUserRoleOrgTree();
    })
  },
  methods: {
    _handleOnClickOrg (args) {
      const orgLevel = args[2];
      if (orgLevel == 5) {
        this._selectDataConfig(args[1]);
      }
    },
    _initData () {
      this.orgTreeStyle.height = window.innerHeight - 110 + 'px';
      this.contentDivStyle.height = window.innerHeight - 110 + 'px'
    },
    async _selectDataConfig (ogId) {
      this.numbers = [];
      this.multipleSelection = [];
      this.optimization.gridLoading = true;
      this.optimization.optimizationAllList = [];
      this.optimization.optimizationPageList = [];
      this.optimization.optimizationList = [];
      //await this._getModelParamList(ogId);
      //await this._getDisplayModelParamList(ogId);
      await this._getOptimizationsList(ogId);
      await this._getModelParamList(ogId);
      this.optimization.gridLoading = false;
    },
    async _getOptimizationsList (ogId) {
      await this.$http({
        url: '/api/api/optimization/getOptimizations?modelId=' + ogId + '',
        "content-type": "application/json",
        method: 'get',
        /*headers: {Authorization: token},*/
      }).then(res => {
        if (res.data.status == 1) {
          //this.optimization.optimizationAllList = res.data.result;
        } else {
          this.$message({message: res.data.msg, type: 'error'});
        }
      })
    },
    async _getModelParamList (ogId) {
      await this.$http({
        url: '/api/api/modelParam/getModelParamList?modelId=' + ogId + '',
        "content-type": "application/json",
        method: 'get',
        /*headers: {Authorization: token},*/
      }).then(res => {
        if (res.data.status == 1) {
          //this.optimization.optimizationAllList = res.data.result;
        } else {
          this.$message({message: res.data.msg, type: 'error'});
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>

</style>
