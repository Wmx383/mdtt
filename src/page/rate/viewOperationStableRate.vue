<!--操作平稳率页面-->
<template>
  <div>
    <div class="orgTree" :style="orgTreeStyle">
      <viewOrgCom ref="viewOrgComRef"
                  @_handleOnClickOrg="_handleOnClickOrg(arguments)"></viewOrgCom>
    </div>
    <div class="contentDiv" :style="contentDivStyle">
      <div
        style="border: 1px solid; border-top-style: none; border-left-style: none; border-right-style: none; border-bottom-color: darkgrey;">
        <h3 style="margin-left: 2%">操作平稳率统计</h3>
      </div>

      <div class="table_container">
        <el-table
          v-loading="operationStableRate.gridLoading"
          :data="operationStableRate.operationStableRatePageList"
          :style="operationStableRate.gridTableStyle"
          :height="operationStableRate.gridTableStyle.height"
          align='center'
          ref="multipleTable"
          highlight-current-row
        >
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
            prop="avg"
            label="平稳率"
            align='left'
            min-width="200"
          >
          </el-table-column>
          <el-table-column
            prop="rate"
            label="比率"
            align='left'
            min-width="200"
          >
          </el-table-column>
        </el-table>
        <el-row>
          <el-col :span="24">
            <div class="pagination">
              <el-pagination
                :page-sizes="operationStableRate.pagination.page_sizes"
                :page-size="operationStableRate.pagination.page_size"
                :layout="operationStableRate.pagination.layout"
                :total="operationStableRate.pagination.total"
                :current-page='operationStableRate.pagination.page_index'
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
  name: "viewOperationStableRate",
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
      operationStableRate: {
        sortNum: 0,
        gridLoading: false,
        operationStableRateAllList: [],
        operationStableRatePageList: [],
        operationStableRateList: [],
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
        this._selectOperationStableRate(orgId, modelType);
      }
    },
    _initData () {
      this.orgTreeStyle.height = window.innerHeight - 110 + 'px'
      this.contentDivStyle.height = window.innerHeight - 110 + 'px'
    },
    async _selectOperationStableRate (ogId, modelType) {
      this.operationStableRate.gridLoading = true;
      this.operationStableRate.operationStableRateAllList = [];
      this.operationStableRate.operationStableRatePageList = [];
      this.operationStableRate.operationStableRateList = [];
      let url = '';
      console.log(modelType);
      if(modelType == 3){
        //特征
        url = 'featuresRate/countModelStableRate';
      }else{
        //参数
        url = 'paramRate/countModelStableRate';
      }
      await this._getOperationStableRateList(ogId, url);
    },
    async _getOperationStableRateList (ogId, url) {
      await this.$http({
        url: '/api/api/'+ url +'?modelId=' + ogId + '&fromTime=' + this.initStartDate +'&toTime='+ this.initEndDate +'&isAllDuty=true',
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
                avg : list[i].avg + '%',
                rate : list[i].rate + '%',
              }

              this.operationStableRate.operationStableRateList.push(item);
            }
          }
          //模拟分页
          this._selectOperationStableRateByPaging();

        } else {
          this.$message({message: res.data.msg, type: 'error'});

          this.operationStableRate.gridLoading = false;
        }
      })
    },
    //前端分页
    _selectOperationStableRateByPaging () {
      this.operationStableRate.operationStableRatePageList = this.operationStableRate.operationStableRateList.filter((item, index) =>
        index < this.operationStableRate.pagination.page_index * this.operationStableRate.pagination.page_size && index >= this.operationStableRate.pagination.page_size * (this.operationStableRate.pagination.page_index - 1)
      )
      this.operationStableRate.pagination.total = this.operationStableRate.operationStableRateList.length;

      this.operationStableRate.gridLoading = false;
    },
    // 每页多少条切换
    _handleSizeChange (page_size) {
      this.operationStableRate.pagination.page_size = page_size
      this._selectOperationStableRateByPaging()
    },
    // 上下分页
    _handleCurrentChange (page) {
      this.operationStableRate.pagination.page_index = page;
      this._selectOperationStableRateByPaging()
    },
  }
}
</script>

<style lang="less" scoped>

</style>
