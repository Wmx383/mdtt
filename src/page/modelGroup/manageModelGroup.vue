<!--管理模型组页面-->
<template>
  <div>
    <div class="contentFullDiv" :style="contentDivStyle">

      <div
        style="border: 1px solid; border-top-style: none; border-left-style: none; border-right-style: none; border-bottom-color: darkgrey;">
        <h3 style="margin-left: 2%">模型组</h3>
      </div>

      <div style="margin-left: 2%; margin-top: 1%; ">
        <el-form
          :inline="true"
          class="demo-form-inline search-form">

          <el-form-item>
            <el-button type="primary" size="small" @click="_handleUpdateModelParamDisplay">新增</el-button>
            <el-button type="primary" size="small" @click="_handleUpdateModelParamDisplay">修改</el-button>
            <el-button type="primary" size="small" @click="_handleUpdateModelParamDisplay">删除</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="table_container">
        <el-table
          v-loading="modelGroup.gridLoading"
          :data="modelGroup.modelGroupPageList"
          :style="modelGroup.gridTableStyle"
          :height="modelGroup.gridTableStyle.height"
          align='center'
          ref="modelGroupTable"
          highlight-current-row
        >
          <el-table-column
            v-if="idFlag"
            prop="id"
            label="ID"
            align='center'
          >
          </el-table-column>
          <el-table-column
            prop="name"
            label="模型组名称"
            min-width="400"
          >
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            align="center"
            width="230px"
          >
            <template slot-scope="scope">
              <div class="operate-groups">
                <el-button
                  type="info"
                  size="mini"
                  @click="_viewModel(scope.$index, scope.row)">查看模型
                </el-button>
                <el-button
                  type="info"
                  size="mini"
                  @click="_insertDaily(scope.$index, scope.row)">绑定模型
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-col :span="24">
            <div class="pagination">
              <el-pagination
                :page-sizes="modelGroup.pagination.page_sizes"
                :page-size="modelGroup.pagination.page_size"
                :layout="modelGroup.pagination.layout"
                :total="modelGroup.pagination.total"
                :current-page='modelGroup.pagination.page_index'
                @current-change='_handleCurrentChange'
                @size-change='_handleSizeChange'>
              </el-pagination>
            </div>
          </el-col>
        </el-row>

        <!--查看模型-->
        <el-dialog
          :title="viewModel.title"
          :visible.sync="viewModel.show"
          :close-on-click-modal='false'
          :close-on-press-escape='false'
          :modal-append-to-body="false"
          :modal="true"
          :width="viewModel.width"
          @close="closeProjectPersonDialog"
        >
          <template>
            <viewModelCom ref="viewModelRef" v-if="viewModel.dialogVisible" :modelGroupId="modelGroupId"
                              ></viewModelCom>
          </template>
        </el-dialog>
        
      </div>


    </div>
  </div>
</template>

<script>
  import viewModelCom from './viewModel.vue';

  export default {
    name: "manageModel",
    components: {viewModelCom},
    data() {
      return {
        idFlag: false,
        contentDivStyle: {
          height: ''
        },
        modelGroup: {
          sortNum: 0,
          gridLoading: false,
          modelGroupAllList: [],
          modelGroupPageList: [],
          modelGroupList: [],
          gridTableStyle: {
            width: '100%',
            height: window.innerHeight - 290 + 'px',
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
        //管理人员窗口
        viewModel: {
          show: false,
          title: '查看模型',
          viewModelLoading: false,
          dialogVisible : true,
          formLabelWidth: '120px',
          width: '700px',
          modelGroupId : ''
        },
      }
    },
    created() {
      this._initModel()
    },
    mounted() {
      this._selectModelGroup();
    },
    methods: {
      _initModel() {
        this.contentDivStyle.height = window.innerHeight - 110 + 'px'
      },
      _selectModelGroup() {
        this.modelGroup.gridLoading = true;

        this.$http({
          url: '/api/api/modelGroup/getModelGroupList',
          "content-type": "application/json",
          method: 'get',
        }).then(res => {
          if (res.data.status == 1) {
            const modelGroupList = res.data.result;
            for (let i = 0; i < modelGroupList.length; i++) {
              let tableItem = {
                sortNum: this.modelGroup.sortNum + (i + 1),
                id: modelGroupList[i].id,
                name: modelGroupList[i].name
              };

              this.modelGroup.modelGroupAllList.push(tableItem);
              this.modelGroup.modelGroupList.push(tableItem);

            }

            //模拟分页
            this._selectModelGroupByPaging();

          } else {
            this.$message({message: res.data.msg, type: 'error'});

            this.modelGroup.gridLoading = false;
          }
        })
      },
      //点击查看模型
      _viewModel(index, row){
        let that = this;
        this.viewModel.show = true;
        this.viewModel.dialogVisible = true;
        console.log(row.id)
        this.$nextTick(_ => {
          this.$refs.viewModelRef._selectModel(row.id);
        })
      },
      _handleUpdateModelParamDisplay() {

      },
      _selectModelGroupByPaging() {
        this.modelGroup.modelGroupPageList = this.modelGroup.modelGroupAllList.filter((item, index) =>
          index < this.modelGroup.pagination.page_index * this.modelGroup.pagination.page_size && index >= this.modelGroup.pagination.page_size * (this.modelGroup.pagination.page_index - 1)
        );
        this.modelGroup.pagination.total = this.modelGroup.modelGroupList.length;

        this.modelGroup.gridLoading = false;
      },
      // 每页多少条切换
      _handleSizeChange(page_size) {
        this.modelGroup.pagination.page_size = page_size;
        this._selectModelGroupByPaging()
      },
      // 上下分页
      _handleCurrentChange(page) {
        this.modelGroup.pagination.page_index = page;
        this._selectModelGroupByPaging()
      }
    }
  }
</script>

<style scoped>
  .contentFullDiv {
    position: absolute;
    left: 10px;
    right: 10px;
    box-shadow: 0 10px 10px 0px #aaa, 10px 0 10px 0px #aaa;
  }
</style>

<style>
  /*//用来设置当前页面element全局table 选中某行时的背景色*/
  .table_container .el-table__body tr.current-row>td{
    background-color: #9999FF !important;
    color: #fff;
  }

  /* .el-table__body tr:hover>td {
    background-color:  	#d0d0d0;
     color: #fff;
  }*/
</style>
