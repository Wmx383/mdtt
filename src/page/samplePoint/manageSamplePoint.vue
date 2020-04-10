<!--数据管理页面-->
<template>
  <div>
    <div class="orgTree" :style="samplePointTreeStyle">
      <viewSamplePointCom ref="viewSamplePointComRef"
                          @_handleOnClickSamplePoint="_handleOnClickSamplePoint(arguments)"></viewSamplePointCom>
    </div>
    <div class="contentDiv" :style="contentDivStyle">
      <div
        style="border: 1px solid; border-top-style: none; border-left-style: none; border-right-style: none; border-bottom-color: darkgrey;">
        <h3 style="margin-left: 2%">采样点管理</h3>
      </div>
      <div style="margin-left: 5px; margin-top: 15px">
        <el-tabs v-model="activeName">
          <el-tab-pane label="采样点" name="first">
            <el-form
              :inline="true"
              class="demo-form-inline search-form">

              <el-form-item>
                <el-button type="primary" size="small" @click="_preInsertSamplePoint">新增</el-button>
                <el-button type="primary" size="small" @click="_preUpdateSamplePoint">修改</el-button>
                <el-button type="primary" size="small" @click="_deleteSamplePoint">删除</el-button>
                <el-button type="primary" size="small" @click="_preRelateModel">关联配置项</el-button>

              </el-form-item>
            </el-form>
            <div class="table_container">
              <el-table
                v-loading="samplePoint.gridLoading"
                :data="samplePoint.samplePointPageList"
                :style="samplePoint.gridTableStyle"
                :height="samplePoint.gridTableStyle.height"
                align='center'
              >
                <el-table-column
                  prop="sampleName"
                  label="样品名称"
                  align='left'
                  min-width="300"
                >
                </el-table-column>
                <el-table-column
                  prop="sourceName"
                  label="检测源"
                  align='left'
                  width="400px"
                >
                </el-table-column>
                <el-table-column
                  prop="modelId"
                  label="关联位号"
                  align='left'
                  width="300px"
                  sortable
                >
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="化验值" name="second">
            <el-form
              :inline="true"
              class="demo-form-inline search-form">

              <el-form-item>
                <el-button type="primary" size="small" @click="_preInsertAssay">新增</el-button>
                <el-button type="primary" size="small" @click="_preUpdateAssay">修改</el-button>
                <el-button type="primary" size="small" @click="_deleteAssay">删除</el-button>

              </el-form-item>
            </el-form>
            <div class="table_container">
              <el-table
                v-loading="assay.gridLoading"
                :data="assay.assayPageList"
                :style="assay.gridTableStyle"
                :height="assay.gridTableStyle.height"
                align='center'
                highlight-current-row
                @row-click="_clickRow"
              >
                <el-table-column
                  prop="num"
                  label="序号"
                  align='left'
                  width="200px"
                >
                </el-table-column>
                <el-table-column
                  prop="itemName"
                  label="化验值名称"
                  align='left'
                  min-width="300"
                >
                </el-table-column>
              </el-table>
              <el-row>
                <el-col :span="24">
                  <div class="pagination">
                    <el-pagination
                      :page-sizes="assay.pagination.page_sizes"
                      :page-size="assay.pagination.page_size"
                      :layout="assay.pagination.layout"
                      :total="assay.pagination.total"
                      :current-page='assay.pagination.page_index'
                      @current-change='_handleCurrentChange'
                      @size-change='_handleSizeChange'>
                    </el-pagination>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

    </div>
    <!--添加采样点-->
    <el-dialog
      :title="insertSamplePointDialog.title"
      :visible.sync="insertSamplePointDialog.show"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :modal-append-to-body="false"
      :modal="false"
      :style="insertSamplePointDialog.style"
      :width="insertSamplePointDialog.width"
      @close="closeInsertSamplePointDialog"
    >
      <template>
        <insertSamplePointCom ref="insertSamplePointRef" v-if="insertSamplePointDialog.dialogVisible"
                              @insertSamplePointListeners="_completeInsertSamplePoint"
                              @closeInsertSamplePointDialog="closeInsertSamplePointDialog()"></insertSamplePointCom>
      </template>
    </el-dialog>

    <!--修改采样点-->
    <el-dialog
      :title="updateSamplePointDialog.title"
      :visible.sync="updateSamplePointDialog.show"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :modal-append-to-body="false"
      :modal="false"
      :style="updateSamplePointDialog.style"
      :width="updateSamplePointDialog.width"
      @close="closeUpdateSamplePointDialog"
    >
      <template>
        <updateSamplePointCom ref="updateSamplePointRef" v-if="updateSamplePointDialog.dialogVisible"
                              @updateSamplePointListeners="_completeUpdateSamplePoint"
                              @closeUpdateSamplePointDialog="closeUpdateSamplePointDialog()"></updateSamplePointCom>
      </template>
    </el-dialog>

    <!--关联模型-->
    <el-dialog
      :title="relateModel.title"
      :visible.sync="relateModel.show"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :modal-append-to-body="false"
      :modal="true"
      :width="relateModel.width"
      style="height: 400px"
      @close="_closeRelateModelDialog"
    >
      <el-cascader
        ref="relateModelRef"
        placeholder="请选择或输入模型...."
        v-model="relateModel.modelId"
        :options="relateModel.orgTreeList"
        :props="relateModel.defaultProps"
        style="width: 100%"
        filterable>
      </el-cascader>
      <div class="text_right">
        <el-button type="primary" size="small" @click="_closeRelateModelDialog">取消</el-button>
        <el-button type="primary" size="small" @click="_relateModel">确定</el-button>
      </div>

    </el-dialog>

    <!--添加化验值-->
    <el-dialog
      :title="insertAssayDialog.title"
      :visible.sync="insertAssayDialog.show"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :modal-append-to-body="false"
      :modal="false"
      :style="insertAssayDialog.style"
      :width="insertAssayDialog.width"
      @close="closeInsertAssayDialog"
    >
      <template>
        <insertAssayCom ref="insertAssayRef" v-if="insertAssayDialog.dialogVisible"
                        @insertAssayListeners="_completeInsertAssay"
                        @closeInsertAssayDialog="closeInsertAssayDialog()"></insertAssayCom>
      </template>
    </el-dialog>

    <!--修改化验值-->
    <el-dialog
      :title="updateAssayDialog.title"
      :visible.sync="updateAssayDialog.show"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :modal-append-to-body="false"
      :modal="false"
      :style="updateAssayDialog.style"
      :width="updateAssayDialog.width"
      @close="closeUpdateAssayDialog"
    >
      <template>
        <updateAssayCom ref="updateAssayRef" v-if="updateAssayDialog.dialogVisible"
                        @updateAssayListeners="_completeUpdateAssay"
                        @closeUpdateAssayDialog="closeUpdateAssayDialog()"></updateAssayCom>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  import viewSamplePointCom from "../samplePoint/viewSamplePoint.vue";
  import insertSamplePointCom from "../samplePoint/preInsertSamplePoint.vue";
  import updateSamplePointCom from "../samplePoint/preUpdateSamplePoint.vue";
  import insertAssayCom from "../samplePoint/preInsertAssay.vue";
  import updateAssayCom from "../samplePoint/preUpdateAssay.vue";

  export default {
    name: "manageData",
    components: {viewSamplePointCom, insertSamplePointCom, updateSamplePointCom, insertAssayCom, updateAssayCom},
    data() {
      return {
        activeName: 'first',
        samplePointTreeStyle: {
          height: ''
        },
        contentDivStyle: {
          height: ''
        },
        idFlag: false,
        samplePoint: {
          sortNum: 0,
          gridLoading: false,
          samplePointAllList: [],
          samplePointPageList: [],
          samplePointList: [],
          gridTableStyle: {
            width: '100%',
            height: window.innerHeight - 290 + 'px'
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
        assay: {
          sortNum: 0,
          gridLoading: false,
          assayAllList: [],
          assayPageList: [],
          assayList: [],
          gridTableStyle: {
            width: '100%',
            height: window.innerHeight - 320 + 'px'
          },
          pagination: {
            page_index: 1,  // 当前位于哪页
            total: 0,        // 总数
            page_size: 10,   // 1页显示多少条
            page_sizes: [5, 10, 15, 20],  //每页显示多少条
            layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
          },
          selectedDate: {},
        },
        insertSamplePointDialog: {
          show: false,
          title: '新增采样点',
          insertSamplePointDialogLoading: false,
          dialogVisible: true,
          formLabelWidth: '120px',
          width: '500px'
        },
        insertAssayDialog: {
          show: false,
          title: '新增化验值',
          insertAssayDialogLoading: false,
          dialogVisible: true,
          formLabelWidth: '120px',
          width: '500px'
        },
        updateSamplePointDialog: {
          show: false,
          title: '修改采样点',
          updateSamplePointDialogLoading: false,
          dialogVisible: true,
          formLabelWidth: '120px',
          width: '500px'
        },
        updateAssayDialog: {
          show: false,
          title: '修改化验值',
          updateAssayDialogLoading: false,
          dialogVisible: true,
          formLabelWidth: '120px',
          width: '500px'
        },
        //绑定模型
        relateModel: {
          show: false,
          title: '关联模型',
          relateModelLoading: false,
          dialogVisible: true,
          formLabelWidth: '120px',
          width: '700px',
          orgTreeList: [],
          defaultProps: {
            children: 'childList',
            label: 'ogName',
            value: 'ogId'
          },
          modelId: ''
        },
      }
    },
    created() {
      this._initData()
    },
    mounted() {
      this._selectUserRoleOrgTree();
    },
    methods: {
      _selectAssay(id) {
        this.assay.assayAllList = [];
        this.assay.assayList = [];
        this.assay.assayPageList = [];
        this.assay.selectedDate = {};
        this.assay.gridLoading = true;

        this.$http({
          url: '/api/api/assay/getAssayList?samplePointId=' + id + '',
          "content-type": "application/json",
          method: 'get',
        }).then(res => {
          if (res.data.status == 1) {
            const assayList = res.data.result;
            for (let i = 0; i < assayList.length; i++) {
              let tableItem = {
                sortNum: this.assay.sortNum + (i + 1),
                id: assayList[i].id,
                samplePointId: assayList[i].samplePointId,
                itemName: assayList[i].itemName,
                num: assayList[i].num
              };

              this.assay.assayAllList.push(tableItem);
              this.assay.assayList.push(tableItem);
            }

            //模拟分页
            this._selectAssayByPaging();

          } else {
            this.$message({message: res.data.msg, type: 'error'});

            this.assay.gridLoading = false;
          }
        })
      },
      _selectAssayByPaging() {
        this.assay.assayPageList = this.assay.assayAllList.filter((item, index) =>
          index < this.assay.pagination.page_index * this.assay.pagination.page_size && index >= this.assay.pagination.page_size * (this.assay.pagination.page_index - 1)
        );
        this.assay.pagination.total = this.assay.assayList.length;

        this.assay.gridLoading = false;
      },
      // 每页多少条切换
      _handleSizeChange(page_size) {
        this.assay.selectedDate = {};
        this.assay.pagination.page_size = page_size;
        this._selectAssayByPaging()
      },
      // 上下分页
      _handleCurrentChange(page) {
        this.assay.selectedDate = {};

        this.assay.pagination.page_index = page;
        this._selectAssayByPaging()
      },
      _preInsertAssay() {
        if (this.samplePoint.samplePointPageList.length <= 0) {
          this.$message({message: '请选择一条采样点...', type: 'warning'});
          return;
        }

        this.insertAssayDialog.show = true;
        this.insertAssayDialog.dialogVisible = true;
        this.$nextTick(_ => {
          this.$refs.insertAssayRef.insertAssayForm.samplePointId = this.samplePoint.samplePointPageList[0].id;
        })
      },
      _preUpdateAssay() {
        if (JSON.stringify(this.assay.selectedDate) === '{}') {
          this.$message({message: '请选择一项化验值...', type: 'warning'});
          return;
        }

        this.updateAssayDialog.show = true;
        this.updateAssayDialog.dialogVisible = true;
        this.$nextTick(_ => {
          this.$refs.updateAssayRef.updateAssayForm.id = this.assay.selectedDate.id;
          this.$refs.updateAssayRef.updateAssayForm.itemName = this.assay.selectedDate.itemName;
          this.$refs.updateAssayRef.updateAssayForm.samplePointId = this.assay.selectedDate.samplePointId;
          this.$refs.updateAssayRef.updateAssayForm.num = this.assay.selectedDate.num;
          this.$refs.updateAssayRef.updateAssayForm.status = this.assay.selectedDate.status;
        })
      },
      _deleteAssay() {
        if (JSON.stringify(this.assay.selectedDate) === '{}') {
          this.$message({message: '请选择一项化验值...', type: 'warning'});
          return;
        }

        this.$confirm('是否删除', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          this.$message({message: '此功能正在努力开发中...', type: 'warning'});
        });
      },
      //下拉联动树查询
      _selectUserRoleOrgTree() {
        this.$http({
          url: "/api/api/user/getUserRoleOrgTree",
          "content-type": "application/json",
          method: 'get',
        }).then(res => {
          if (res.data.status == 1) {
            this.relateModel.orgTreeList = res.data.result;

          } else {
            this.$message({message: res.data.msg, type: 'error'});
          }
        })
      },
      _handleOnClickSamplePoint(args) {
        this.samplePoint.samplePointPageList = [{
          id: args[0],
          sourceName: args[1],
          sampleName: args[2],
          modelId: args[3],
          status: args[4]
        }];
        this._selectAssay(args[0]);
      },
      _initData() {
        this.samplePointTreeStyle.height = window.innerHeight - 110 + 'px'
        this.contentDivStyle.height = window.innerHeight - 110 + 'px'
      },

      //点击添加按钮
      _preInsertSamplePoint() {
        this.insertSamplePointDialog.show = true;
        this.insertSamplePointDialog.dialogVisible = true;
      },
      //点击修改按钮
      _preUpdateSamplePoint() {
        if (this.samplePoint.samplePointPageList.length <= 0) {
          this.$message({message: '请选择一条采样点...', type: 'warning'});
          return;
        }

        this.updateSamplePointDialog.show = true;
        this.updateSamplePointDialog.dialogVisible = true;
        this.$nextTick(_ => {
          this.$refs.updateSamplePointRef.updateSamplePointForm.id = this.samplePoint.samplePointPageList[0].id;
          this.$refs.updateSamplePointRef.updateSamplePointForm.sampleName = this.samplePoint.samplePointPageList[0].sampleName;
          this.$refs.updateSamplePointRef.updateSamplePointForm.sourceName = this.samplePoint.samplePointPageList[0].sourceName;
          this.$refs.updateSamplePointRef.updateSamplePointForm.status = this.samplePoint.samplePointPageList[0].status;
        })
      },
      _preRelateModel() {
        if (this.samplePoint.samplePointPageList.length <= 0) {
          this.$message({message: '请选择一条采样点...', type: 'warning'});
          return;
        }

        this.relateModel.modelId = '';

        this.relateModel.show = true;
        this.relateModel.dialogVisible = true;
      },
      //点击删除按钮
      _deleteSamplePoint() {
        if (this.samplePoint.samplePointPageList.length <= 0) {
          this.$message({message: '请选择一条采样点...', type: 'warning'});
          return;
        }

        this.$http({
          url: '/api/api/samplePoint/deleteSamplePoint?id=' + this.samplePoint.samplePointPageList[0].id + '',
          "content-type": "application/json",
          method: 'delete',
          /*headers: {Authorization: token},*/
        }).then(res => {
          if (res.data.status == 1) {
            this.$message({message: '操作成功', type: 'success'});

            this.samplePoint.samplePointPageList = [];
            this.$nextTick(_ => {
              this.$refs.viewSamplePointComRef._selectSamplePoint();
            });
            this.assay.assayAllList = [];
            this.assay.assayList = [];
            this.assay.assayPageList = [];
            this.assay.selectedDate = {};

          } else {
            this.$message({message: res.data.msg, type: 'error'});
          }
        })
      },
      //关闭新增采样点界面监听
      closeInsertSamplePointDialog() {
        this.insertSamplePointDialog.dialogVisible = false;
        this.insertSamplePointDialog.show = false;
      },
      //关闭修改采样点界面监听
      closeUpdateSamplePointDialog() {
        this.updateSamplePointDialog.dialogVisible = false;
        this.updateSamplePointDialog.show = false;
      },
      _completeInsertSamplePoint() {
        if (this.samplePoint.samplePointPageList.length > 0) {
          this.$nextTick(_ => {
            this.$refs.viewSamplePointComRef._selectSamplePointByUpdate(this.samplePoint.samplePointPageList[0].id);
          });
        } else {
          this.$nextTick(_ => {
            this.$refs.viewSamplePointComRef._selectSamplePoint();
          });
        }

      },
      //修改采样点完成监听方法
      _completeUpdateSamplePoint() {
        this.$nextTick(_ => {
          this.$refs.viewSamplePointComRef._selectSamplePointByUpdate(this.samplePoint.samplePointPageList[0].id);
        });
        //this.samplePoint.samplePointPageList[0].sourceName =
      },
      //关闭关联模型监听
      _closeRelateModelDialog() {
        this.relateModel.dialogVisible = false;
        this.relateModel.show = false;
      },
      //关闭新增化验值界面监听
      closeInsertAssayDialog() {
        this.insertAssayDialog.dialogVisible = false;
        this.insertAssayDialog.show = false;
      },
      //关闭修改化验值界面监听
      closeUpdateAssayDialog(){
        this.updateAssayDialog.dialogVisible = false;
        this.updateAssayDialog.show = false;
      },
      _completeInsertAssay(){
        this._selectAssay(this.samplePoint.samplePointPageList[0].id);
      },
      _completeUpdateAssay(){
        this._selectAssay(this.samplePoint.samplePointPageList[0].id);
      },
      _relateModel() {
        let nodesList = this.$refs['relateModelRef'].getCheckedNodes(true);
        if (nodesList.length <= 0) {
          this.$message({message: '请选择模型...', type: 'warning'});
          return;
        }

        this.$http({
          url: '/api/api/samplePoint/' + this.samplePoint.samplePointPageList[0].id + '/relateModel?modelId=' + nodesList[0].data.ogId + '',
          "content-type": "application/json",
          method: 'put',
        }).then(res => {
          if (res.data.status == 1) {
            this.$message({message: '操作成功', type: 'success'});

            this._closeRelateModelDialog();
            this._completeUpdateSamplePoint();
          } else {
            this.$message({message: res.data.msg, type: 'error'});
          }
        })
      },
      _clickRow(row){
        this.assay.selectedDate = row;
      }
    }
  }
</script>

<style lang="less" scoped>
  .orgTree {
    position: absolute;
    left: 0;
    width: 280px;
    border: 1px solid rgba(0, 21, 41, 0.08);
    /*box-shadow: 0 10px 10px 0px #aaa, 10px 0 10px 0px #aaa;*/
  }

  .contentDiv {
    position: absolute;
    left: 300px;
    right: 10px;
    /*box-shadow: 0 10px 10px 0px #aaa, 10px 0 10px 0px #aaa;*/
  }

  .text_right {
    text-align: right;
    margin-top: 60px;
  }

</style>

<style>

</style>
