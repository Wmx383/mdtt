<!--管理模型组页面-->
<template>
  <div>
    <div class="contentFullDiv" :style="contentDivStyle">

      <div
        style="border: 1px solid; border-top-style: none; border-left-style: none; border-right-style: none; border-bottom-color: darkgrey;">
        <h3 style="margin-left: 2%">模型组</h3>
      </div>

      <div style="margin-left: 5px; margin-top: 5px">
        <el-form
          :inline="true"
          class="demo-form-inline search-form">

          <el-form-item>
            <el-button type="primary" size="small" @click="_preInsertModelGroup">新增</el-button>
            <el-button type="primary" size="small" @click="_preUpdateModelGroup">修改</el-button>
            <el-button type="primary" size="small" @click="_deleteModelGroup">删除</el-button>
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
          @row-click="_clickRow"
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
                  @click="_preChooseModel(scope.$index, scope.row)">绑定模型
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
          @close="_closeModelViewDialog"
        >
          <template>
            <viewModelCom
              ref="viewModelRef"
              v-if="viewModel.dialogVisible"
              @_closeModelViewDialog="_closeModelViewDialog()"
            ></viewModelCom>
          </template>
        </el-dialog>

        <!--选择-->
        <el-dialog
          :title="chooseModel.title"
          :visible.sync="chooseModel.show"
          :close-on-click-modal='false'
          :close-on-press-escape='false'
          :modal-append-to-body="false"
          :modal="true"
          :width="chooseModel.width"
          style="height: 400px"
          @close="_closeChooseModelDialog"
        >
          <el-cascader
            ref="chooseModelRef"
            placeholder="请选择或输入模型...."
            v-model="chooseModel.modelId"
            :options="chooseModel.orgTreeList"
            :props="chooseModel.defaultProps"
            style="width: 100%"
            filterable>
          </el-cascader>
          <div class="text_right">
            <el-button type="primary" size="small" @click="_closeChooseModelDialog">取消</el-button>
            <el-button type="primary" size="small" @click="_recursionOrgTree">确定</el-button>
          </div>
        </el-dialog>

      </div>


    </div>
    <!--添加模型组-->
    <el-dialog
      :title="insertModelGroupDialog.title"
      :visible.sync="insertModelGroupDialog.show"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :modal-append-to-body="false"
      :modal="false"
      :style="insertModelGroupDialog.style"
      :width="insertModelGroupDialog.width"
      @close="closeInsertModelGroupDialog"
    >
      <template>
        <insertModelGroupCom ref="insertModelGroupRef" v-if="insertModelGroupDialog.dialogVisible"
                             @insertModelGroupListeners="_completeInsertModelGroup"
                             @closeInsertModelGroupDialog="closeInsertModelGroupDialog()"></insertModelGroupCom>
      </template>
    </el-dialog>

    <!--修改模型组-->
    <el-dialog
      :title="updateModelGroupDialog.title"
      :visible.sync="updateModelGroupDialog.show"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :modal-append-to-body="false"
      :modal="false"
      :style="updateModelGroupDialog.style"
      :width="updateModelGroupDialog.width"
      @close="closeUpdateModelGroupDialog"
    >
      <template>
        <updateModelGroupCom ref="updateModelGroupRef" v-if="updateModelGroupDialog.dialogVisible"
                             @updateModelGroupListeners="_completeUpdateModelGroup"
                             @closeUpdateModelGroupDialog="closeUpdateModelGroupDialog()"></updateModelGroupCom>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import viewModelCom from './viewModel.vue';
import insertModelGroupCom from './preInsertModelGroup.vue';
import updateModelGroupCom from './preUpdateModelGroup.vue';

export default {
  name: "manageModel",
  components: {viewModelCom, insertModelGroupCom, updateModelGroupCom},
  data () {
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
        selectedDate: {},
      },
      //查看模型
      viewModel: {
        show: false,
        title: '查看模型',
        viewModelLoading: false,
        dialogVisible: true,
        formLabelWidth: '120px',
        width: '700px',
      },
      //绑定模型
      chooseModel: {
        show: false,
        title: '选择模型',
        chooseModelLoading: false,
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
      insertModelGroupDialog: {
        show: false,
        title: '新增',
        insertModelGroupDialogLoading: false,
        dialogVisible: true,
        formLabelWidth: '120px',
        width: '500px'
      },
      updateModelGroupDialog: {
        show: false,
        title: '修改',
        insertModelGroupDialogLoading: false,
        dialogVisible: true,
        formLabelWidth: '120px',
        width: '500px'
      }
    }
  },
  created () {
    this._initModel()
  },
  mounted () {
    this._selectModelGroup();
    this._selectUserRoleOrgTree();
  },
  methods: {
    _initModel () {
      this.contentDivStyle.height = window.innerHeight - 110 + 'px'
    },
    _selectModelGroup () {
      this.modelGroup.modelGroupAllList = [];
      this.modelGroup.modelGroupList = [];
      this.modelGroup.modelGroupPageList = [];
      this.modelGroup.selectedDate = {};
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
    _preInsertModelGroup () {
      this.insertModelGroupDialog.show = true;
      this.insertModelGroupDialog.dialogVisible = true;
    },
    _preUpdateModelGroup () {
      if (JSON.stringify(this.modelGroup.selectedDate) === '{}') {
        this.$message({message: '请选择一条数据...', type: 'warning'});
        return;
      }
      this.updateModelGroupDialog.show = true;
      this.updateModelGroupDialog.dialogVisible = true;

      this.$nextTick(_ => {
        this.$refs.updateModelGroupRef.updateModelGroupForm.id = this.modelGroup.selectedDate.id;
        this.$refs.updateModelGroupRef.updateModelGroupForm.name = this.modelGroup.selectedDate.name;
        this.$refs.updateModelGroupRef.updateModelGroupForm.status = this.modelGroup.selectedDate.status;
      })
    },
    _deleteModelGroup () {
      if (JSON.stringify(this.modelGroup.selectedDate) === '{}') {
        this.$message({message: '请选择一条数据...', type: 'warning'});
        return;
      }

      this.$http({
        url: '/api/api/modelGroup/deleteModelGroup?id=' + this.modelGroup.selectedDate.id + '',
        "content-type": "application/json",
        method: 'delete'
      }).then(res => {
        if (res.data.status == 1) {
          this._selectModelGroup();
        } else {
          this.$message({message: res.data.msg, type: 'error'});

          this.modelGroup.gridLoading = false;
        }
      })
    },
    closeInsertModelGroupDialog () {
      this.insertModelGroupDialog.dialogVisible = false;
      this.insertModelGroupDialog.show = false;
    },
    closeUpdateModelGroupDialog () {
      this.updateModelGroupDialog.dialogVisible = false;
      this.updateModelGroupDialog.show = false;
    },
    _completeInsertModelGroup () {
      this._selectModelGroup();
    },
    _completeUpdateModelGroup(){
      this._selectModelGroup();
    },
    //点击查看模型
    _viewModel (index, row) {
      this.viewModel.show = true;
      this.viewModel.dialogVisible = true;
      this.$nextTick(_ => {
        this.$refs.viewModelRef._selectModel(row.id);
      })
    },
    //打开绑定模型
    _preChooseModel (index, row) {
      this.chooseModel.modelId = '';
      this.chooseModel.show = true;
      this.chooseModel.dialogVisible = true;
    },
    _handleUpdateModelParamDisplay () {
      this.$message({message: '此功能暂未开发,敬请期待', type: 'warning'});
    },
    //关闭查询模型监听
    _closeModelViewDialog () {
      this.viewModel.dialogVisible = false;
      this.viewModel.show = false;
    },
    //关闭选择模型监听
    _closeChooseModelDialog () {
      this.chooseModel.dialogVisible = false;
      this.chooseModel.show = false;
    },
    _selectModelGroupByPaging () {
      this.modelGroup.modelGroupPageList = this.modelGroup.modelGroupAllList.filter((item, index) =>
        index < this.modelGroup.pagination.page_index * this.modelGroup.pagination.page_size && index >= this.modelGroup.pagination.page_size * (this.modelGroup.pagination.page_index - 1)
      );
      this.modelGroup.pagination.total = this.modelGroup.modelGroupList.length;

      this.modelGroup.gridLoading = false;
    },
    // 每页多少条切换
    _handleSizeChange (page_size) {
      this.modelGroup.pagination.page_size = page_size;
      this._selectModelGroupByPaging()
    },
    // 上下分页
    _handleCurrentChange (page) {
      this.modelGroup.pagination.page_index = page;
      this._selectModelGroupByPaging()
    },
    //下拉联动树查询
    _selectUserRoleOrgTree () {
      this.$http({
        url: "/api/api/user/getUserRoleOrgTree",
        "content-type": "application/json",
        method: 'get',
      }).then(res => {
        if (res.data.status == 1) {
          this.chooseModel.orgTreeList = res.data.result;

        } else {
          this.$message({message: res.data.msg, type: 'error'});
        }
      })
    },
    _clickRow (row) {
      this.modelGroup.selectedDate = row;
    },
    _recursionOrgTree () {
      let nodesList = this.$refs['chooseModelRef'].getCheckedNodes(true);
      if (nodesList.length <= 0) {
        this.$message({message: '请选择模型...', type: 'warning'});
        return;
      }

      this.$http({
        url: '/api/api/modelGroup/'+ this.chooseModel.modelId[this.chooseModel.modelId.length - 1] +'/relateModel?modelId=' + nodesList[0].data.ogId + '',
        "content-type": "application/json",
        method: 'put',
        /*headers: {Authorization: token},*/
      }).then(res => {
        if (res.data.status == 1) {
          this.$message({message: '操作成功', type: 'success'});

          this._closeChooseModelDialog();
        } else {
          this.$message({message: res.data.msg, type: 'error'});
        }
      })
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

  .text_right {
    margin-top: 60px;
    text-align: right;
  }
</style>

<style>
  /*//用来设置当前页面element全局table 选中某行时的背景色*/
  /* .table_container .el-table__body tr.current-row > td {
     background-color: #9999FF !important;
     color: #fff;
   }*/

  /* .el-table__body tr:hover>td {
    background-color:  	#d0d0d0;
     color: #fff;
  }*/
</style>
