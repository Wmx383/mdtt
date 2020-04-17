<!--操作合格率页面-->
<template>
  <div>
    <div class="orgTree" :style="orgTreeStyle">
      <viewOrgCom ref="viewOrgComRef"
                  @_handleOnClickOrg="_handleOnClickOrg(arguments)"></viewOrgCom>
    </div>
    <div class="contentDiv" :style="contentDivStyle">

      <div
        style="border: 1px solid; border-top-style: none; border-left-style: none; border-right-style: none; border-bottom-color: darkgrey;">
        <h3 style="margin-left: 2%">合格率统计</h3>
      </div>

      <div class="table_container">
        <el-table
          v-loading="operationRate.gridLoading"
          :data="operationRate.operationRatePageList"
          :style="operationRate.gridTableStyle"
          :height="operationRate.gridTableStyle.height"
          align='center'
          ref="multipleTable"
          highlight-current-row
        >
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column
            prop="startTime"
            label="开始时间"
            align='left'
            min-width="300"
          >
          </el-table-column>
          <el-table-column
            prop="endTime"
            label="结束时间"
            align='left'
            min-width="300"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="excessNum"
            label="超标点数"
            align='left'
            min-width="300"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="totalNum"
            label="总点数"
            align='left'
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="rate"
            label="比率"
            align='left'
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="rate_HG"
            label="合格率"
            align='left'
            sortable
          >
          </el-table-column>
        </el-table>
        <el-row>
          <el-col :span="24">
            <div class="pagination">
              <el-pagination
                :page-sizes="operationRate.pagination.page_sizes"
                :page-size="operationRate.pagination.page_size"
                :layout="operationRate.pagination.layout"
                :total="operationRate.pagination.total"
                :current-page='operationRate.pagination.page_index'
                @current-change='_handleCurrentChange'
                @size-change='_handleSizeChange'>
              </el-pagination>
            </div>
          </el-col>
        </el-row>
      </div>


    </div>
  </div>
</template>

<script>
import viewOrgCom from "../org/viewOrg.vue";
import moment from 'moment';

export default {
  name: "viewOperationRate",
  components: {viewOrgCom},
  data () {
    return {
      initStartDate : moment(moment().format('YYYY/MM/DD'),'YYYY/MM/DD').valueOf(),
      initEndDate : moment(moment().format('YYYY/MM/DD'),'YYYY/MM/DD').valueOf() + 86400000,
      orgTreeStyle: {
        height: ''
      },
      contentDivStyle: {
        height: ''
      },
      idFlag: false,
      operationRate: {
        sortNum: 0,
        gridLoading: false,
        operationRateAllList: [],
        operationRatePageList: [],
        operationRateList: [],
        gridTableStyle: {
          width: '100%',
          height: window.innerHeight - 205+ 'px'
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
      numbers: [],
      multipleSelection: []
    }
  },
  created () {
    this._initData();
    this.$nextTick(_ => {
      this.$refs.viewOrgComRef._getUserRoleOrgTree();
    });
    console.log(Math.floor((1 / 3) * 100000) / 100000 + '%') ;
  },
  methods: {
    _handleOnClickOrg (args) {
      const orgId = args[1];
      const orgLevel = args[2];
      const modelType = args[3];
      if (orgLevel == 5) {
        this._selectOperationRate(orgId, modelType);
      }
    },
    _initData () {
      this.orgTreeStyle.height = window.innerHeight - 110 + 'px'
      this.contentDivStyle.height = window.innerHeight - 110 + 'px'
    },
    async _selectOperationRate (ogId, modelType) {
      this.operationRate.gridLoading = true;
      this.operationRate.operationRateAllList = [];
      this.operationRate.operationRatePageList = [];
      this.operationRate.operationRateList = [];
      let url = '';
      console.log(modelType);
      if(modelType == 3){
        //特征
        url = 'featuresRate/countModelQualifiedRate';
      }else{
        //参数
        url = 'paramRate/countModelQualifiedRate';
      }
      await this._getOperationRateList(ogId, url);
    },
    async _getOperationRateList (ogId, url) {
      await this.$http({
        url: '/api/api/'+ url +'?modelId=' + ogId + '&fromTime=' + this.initStartDate +'&toTime='+ this.initEndDate +'&isAllDuty=false',
        "content-type": "application/json",
        method: 'get',
      }).then(res => {
        if (res.data.status == 1) {
          const list = res.data.result;
          if(list != null){
            for (let i = 0; i < list.length; i++) {
              let item = {
                startTime : moment(this.initStartDate).format("YYYY-MM-DD HH:mm:ss"),
                endTime : moment(this.initEndDate).format("YYYY-MM-DD HH:mm:ss"),
                excessNum : list[i].excessNum,
                rate : list[i].rate,
                totalNum : list[i].totalNum,
                rate_HG : Math.floor(( 1- list[i].excessNum / list[i].totalNum) * 100000) / 100000 + '%'
              }

              this.operationRate.operationRateList.push(item);
            }
          }
          //模拟分页
          this._selectOperationRateByPaging();

        } else {
          this.$message({message: res.data.msg, type: 'error'});

          this.operationRate.gridLoading = false;
        }
      })
    },
    //前端分页
    _selectOperationRateByPaging () {
      this.operationRate.operationRatePageList = this.operationRate.operationRateList.filter((item, index) =>
        index < this.operationRate.pagination.page_index * this.operationRate.pagination.page_size && index >= this.operationRate.pagination.page_size * (this.operationRate.pagination.page_index - 1)
      )
      this.operationRate.pagination.total = this.operationRate.operationRateList.length;

      this.operationRate.gridLoading = false;
    },
    // 每页多少条切换
    _handleSizeChange (page_size) {
      this.operationRate.pagination.page_size = page_size
      this._selectOperationRateByPaging()
    },
    // 上下分页
    _handleCurrentChange (page) {
      this.operationRate.pagination.page_index = page;
      this._selectOperationRateByPaging()
    },
  }
}
</script>

<style lang="less" scoped>

</style>
