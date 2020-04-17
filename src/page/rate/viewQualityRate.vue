<!--质量合格率页面-->
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
          v-loading="qualityRate.gridLoading"
          :data="qualityRate.qualityRatePageList"
          :style="qualityRate.gridTableStyle"
          :height="qualityRate.gridTableStyle.height"
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
            prop="totalNum"
            label="样品分析总数"
            align='left'
            min-width="300"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="qualifiedNum"
            label="样品分析合格率"
            align='left'
            width="300"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="rate"
            label="合格率"
            align='left'
            width="300"
            sortable
          >
          </el-table-column>
        </el-table>
        <el-row>
          <el-col :span="24">
            <div class="pagination">
              <el-pagination
                :page-sizes="qualityRate.pagination.page_sizes"
                :page-size="qualityRate.pagination.page_size"
                :layout="qualityRate.pagination.layout"
                :total="qualityRate.pagination.total"
                :current-page='qualityRate.pagination.page_index'
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
  name: "viewQualityRate",
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
      qualityRate: {
        sortNum: 0,
        gridLoading: false,
        qualityRateAllList: [],
        qualityRatePageList: [],
        qualityRateList: [],
        gridTableStyle: {
          width: '100%',
          height: window.innerHeight - 250 + 'px'
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
  },
  methods: {
    _handleOnClickOrg (args) {
      const orgId = args[1];
      const orgLevel = args[2];
      const modelType = args[3];
      if (orgLevel == 5) {
        this._selectQualityRate(orgId, modelType);
      }
    },
    _initData () {
      this.orgTreeStyle.height = window.innerHeight - 110 + 'px'
      this.contentDivStyle.height = window.innerHeight - 110 + 'px'
    },
    async _selectQualityRate (ogId, modelType) {
      this.qualityRate.gridLoading = true;
      this.qualityRate.qualityRateAllList = [];
      this.qualityRate.qualityRatePageList = [];
      this.qualityRate.qualityRateList = [];
      let url = '';
      console.log(modelType);
      if(modelType == 3){
        //特征
        url = 'featuresRate/countQualityRate';
      }else{
        //参数
        url = 'paramRate/countQualityRate';
      }
      await this._getQualityRateList(ogId, url);
    },
    async _getQualityRateList (ogId, url) {
      await this.$http({
        url: '/api/api/'+ url +'?modelId=' + ogId + '&fromTime=' + this.initStartDate +'&toTime='+ this.initEndDate +'',
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
                totalNum : list[i].totalNum,
                qualifiedNum : parseFloat(list[i].qualifiedNum)*100 +"%",
                rate : list[i].rate
              }

              this.qualityRate.qualityRateList.push(item);
            }
          }
          //模拟分页
          this._selectQualityRateByPaging();

        } else {
          this.$message({message: res.data.msg, type: 'error'});

          this.qualityRate.gridLoading = false;
        }
      })
    },
    //前端分页
    _selectQualityRateByPaging () {
      this.qualityRate.qualityRatePageList = this.qualityRate.qualityRateList.filter((item, index) =>
        index < this.qualityRate.pagination.page_index * this.qualityRate.pagination.page_size && index >= this.qualityRate.pagination.page_size * (this.qualityRate.pagination.page_index - 1)
      )
      this.qualityRate.pagination.total = this.qualityRate.qualityRateList.length;

      this.qualityRate.gridLoading = false;
    },
    // 每页多少条切换
    _handleSizeChange (page_size) {
      this.qualityRate.pagination.page_size = page_size
      this._selectQualityRateByPaging()
    },
    // 上下分页
    _handleCurrentChange (page) {
      this.qualityRate.pagination.page_index = page;
      this._selectQualityRateByPaging()
    },
  }
}
</script>

<style lang="less" scoped>

</style>
