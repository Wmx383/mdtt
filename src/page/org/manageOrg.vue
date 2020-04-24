<!--用户管理页面-->
<template>

  <div>
    <div>

      <div class="orgTree" :style="orgTreeAndOrgHeight">
        <viewOrgCom ref="viewOrgComRef"
                    @_handleOnClickOrg="_handleOnClickOrg(arguments)"></viewOrgCom>
      </div>

      <div class="userTable" :style="orgTreeAndOrgHeight">

        <div
          style="border: 1px solid; border-top-style: none; border-left-style: none; border-right-style: none; border-bottom-color: darkgrey;">
          <h3 style="margin-left: 2%">组织机构</h3>
        </div>

        <div style="margin-left: 5px; margin-top: 5px">
          <el-form
            :inline="true"
            class="demo-form-inline search-form">

            <el-form-item>
              <el-button type="primary" size="small" icon="el-icon-plus" @click='preInsertOrg()'>添加
              </el-button>
              <!--<el-button type="primary" size="small" icon="el-icon-plus" @click='preInsertRootOrg()'>添加根机构
              </el-button>-->
              <el-button type="primary" size="small" icon="el-icon-edit" @click='preUpdateOrg()'>修改
              </el-button>
              <el-button type="primary" size="small" icon="el-icon-delete" @click='preDeleteOrg()'>删除
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <div class="table_container">
          <el-table
            :data="orgGrid.orgList"
            v-loading="orgGrid.orgGridLoading"
            :style="orgGrid.gridTableStyle"
            :height="orgGrid.gridTableStyle.height"
            highlight-current-row
            @row-click="clickRow"
          >
            <el-table-column
              v-if="idFlag"
              prop="ogId"
              label="ogId"
              align='center'>
            </el-table-column>
            <el-table-column
              v-if="idFlag"
              prop="id"
              label="id"
              align='center'>
            </el-table-column>
            <el-table-column
              v-if="idFlag"
              prop="parentId"
              label="parentId"
              align='center'>
            </el-table-column>
            <el-table-column
              label="名称"
              align='left'
              prop="ogName"
              sortable
            >
            </el-table-column>
            <el-table-column
              label="机构层级"
              align='left'
              prop="level"
              sortable
            >
            </el-table-column>
          </el-table>
          <el-row>
            <el-col :span="24">
              <div class="pagination">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="orgGrid.pagination.page_index"
                  :page-sizes="orgGrid.pagination.page_sizes"
                  :page-size="orgGrid.pagination.page_size"
                  :layout="orgGrid.pagination.layout"
                  :total="orgGrid.pagination.total"
                >
                </el-pagination>
              </div>
            </el-col>
          </el-row>

          <!--新增组织机构页面-->
          <el-dialog
            :title="insertOrgDialog.title"
            :visible.sync="insertOrgDialog.show"
            :close-on-click-modal='false'
            :close-on-press-escape='false'
            :modal-append-to-body="false"
            :modal="true"
            :style="insertOrgDialog.style"
            :width="insertOrgDialog.width"
          >
            <template>
              <insertOrgCom ref="insert_org_ref" v-if="insertOrgDialog.dialogVisible"
                             @_closeInsertOrgDialog="closeInsertOrgDialog"
                             @insertOrgListeners="insertOrgReturn"></insertOrgCom>
            </template>
          </el-dialog>

          <!--新增根组织机构页面-->
          <el-dialog
            :title="insertRootOrgDialog.title"
            :visible.sync="insertRootOrgDialog.show"
            :close-on-click-modal='false'
            :close-on-press-escape='false'
            :modal-append-to-body="false"
            :modal="true"
            :style="insertRootOrgDialog.style"
            :width="insertRootOrgDialog.width"
          >
            <template>
              <insertRootOrgCom ref="insert_rootOrg_ref" v-if="insertRootOrgDialog.dialogVisible"
                            @_closeInsertRootOrgDialog="closeInsertRootOrgDialog"
                            @insertRootOrgListeners="insertRootOrgReturn"></insertRootOrgCom>
            </template>
          </el-dialog>

          <!--修改组织机构页面-->
          <el-dialog
            :title="updateOrgDialog.title"
            :visible.sync="updateOrgDialog.show"
            :close-on-click-modal='false'
            :close-on-press-escape='false'
            :modal-append-to-body="false"
            :modal="true"
            :style="updateOrgDialog.style"
            :width="updateOrgDialog.width"
          >
            <template>
              <updateOrgCom ref="update_org_ref" v-if="updateOrgDialog.dialogVisible"
                             @_closeUpdateOrgDialog="closeUpdateOrgDialog"
                             @updateOrgListeners="updateOrgReturn"></updateOrgCom>
            </template>
          </el-dialog>

        </div>

      </div>

    </div>


  </div>
</template>

<script>
  import viewOrgCom from "../org/viewOrg.vue";
  import insertOrgCom from "../org/preInsertOrg.vue";
  import updateOrgCom from "../org/preUpdateOrg.vue";
  import insertRootOrgCom from "../org/preInsertRootOrg.vue"

  export default {
    components: {viewOrgCom, insertOrgCom, updateOrgCom, insertRootOrgCom},
    name: "manageOrg",
    data() {
      return {
        orgTreeAndOrgHeight: {
          height: ''
        },
        orgGrid: {
          orgList: [],
          orgGridLoading: false,
          gridTableStyle: {
            width: '100%',
            height: window.innerHeight - 250 + 'px'
          },
          pagination: {
            page_index: 1,  // 当前位于哪页
            total: 0,        // 总数
            page_size: 10,   // 1页显示多少条
            page_sizes: [5, 10, 15, 20],  //每页显示多少条
            layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
          }
        },
        idFlag: false,
        sortnum: 0,

        treeData: [],
        bratTreeData: [],
        treeOgList: [],
        treeOrgLevel: '',
        treeId: '',
        insertOrgDialog: {
          show: false,
          title: '新增组织机构',
          insertOrgDialogLoading: false,
          dialogVisible: true,
          formLabelWidth: '120px',
          width: '500px'
        },
        insertRootOrgDialog: {
          show: false,
          title: '新增根组织机构',
          insertRootOrgDialogLoading: false,
          dialogVisible: true,
          formLabelWidth: '120px',
          width: '500px'
        },
        //编辑窗口
        updateOrgDialog: {
          show: false,
          title: '修改组织机构',
          updateOrgDialogLoading: false,
          dialogVisible: true,
          formLabelWidth: '120px',
          width: '500px'
        },
        rowValue: {
          ogId: '',
          id: '',
          ogName: '',
          parentId: '',
          level: '',
        },
      }
    },
    created() {
      this.setOrgTreeAndUserHeight()
      this.$nextTick(_ => {
        this.$refs.viewOrgComRef._getUserRoleOrgTree();
      })
    },
    methods: {
      //设置高度
      setOrgTreeAndUserHeight() {
        this.orgTreeAndOrgHeight.height = window.innerHeight - 110 + 'px'
      },
      //获取树
      getOrgTree() {
        this.treeData = JSON.parse(JSON.stringify(this.$refs.viewOrgComRef.data));
      },

      //点击树
      _handleOnClickOrg(args){
        this.treeOgList = [];
        this.treeId = args[0];
        this.treeOrgLevel = args[2];
        this.getOrgTree();
        this.showTree();
        this.getOrgList();
      },
      showTree(){
        if(this.treeOrgLevel == '1'){
          for(let i = 0; i < this.treeData[0].childList.length; i++){
            let org = {
              ogId: this.treeData[0].childList[i].ogId,
              id: this.treeData[0].childList[i].id,
              ogName: this.treeData[0].childList[i].ogName,
              parentId: this.treeData[0].childList[i].parentId,
              level: this.treeData[0].childList[i].level,
              status: this.treeData[0].childList[i].status,
            };
            this.treeOgList.push(org)
          }
        }else{
          this._selectBratTreeData(this.treeId);
        }
      },
      _selectBratTreeData(id) {
        for (let i = 0; i < this.treeData.length; i++) {
          if (id == this.treeData[i].id) {
            this.bratTreeData = this.treeData[i];
            return;
          } else if (this.treeData[i].childList != null) {
            this._getRecursionData(id, this.treeData[i].childList)
          }
        }
        this._getTreeIdList();
      },
      _getRecursionData(id, treeDataList) {
        for (let i = 0; i < treeDataList.length; i++) {
          if (id == treeDataList[i].id) {
            this.bratTreeData = treeDataList[i];
            return;
          } else if (treeDataList[i].childList != null) {
            this._getRecursionData(id, treeDataList[i].childList)
          }
        }
      },
      _getTreeIdList() {
        let org = {
          ogId: this.bratTreeData.ogId,
          id: this.bratTreeData.id,
          ogName: this.bratTreeData.ogName,
          parentId: this.bratTreeData.parentId,
          level: this.bratTreeData.level,
          status: this.bratTreeData.status
        };
        this.treeOgList.push(org);
        if (this.bratTreeData.childList != null) {
          this._getRecursionDataTreeOgId(this.bratTreeData.childList);
        }
      },
      _getRecursionDataTreeOgId(bratTreeData) {
        for (let i = 0; i < bratTreeData.length; i++) {
          let org = {
            ogId: bratTreeData[i].ogId,
            id: bratTreeData[i].id,
            ogName: bratTreeData[i].ogName,
            parentId: bratTreeData[i].parentId,
            level: bratTreeData[i].level,
            status: bratTreeData[i].status
          };
          this.treeOgList.push(org);
          if (bratTreeData[i].childList != null) {
            this._getRecursionDataTreeOgId(bratTreeData[i].childList);
          }
        }
      },

      getOrgList(){
        this.orgGrid.orgList = [];
        if(this.treeOrgLevel == '1'){
          this.orgGrid.orgList = this.treeOgList.filter((item, index) =>
            index < this.orgGrid.pagination.page_index * this.orgGrid.pagination.page_size && index >= this.orgGrid.pagination.page_size * (this.orgGrid.pagination.page_index - 1)
          )
          this.orgGrid.pagination.total = this.treeOgList.length;
        }else{
          let newOrg = [];
          for(let i = 0; i < this.treeOgList.length; i++){
            if (this.treeId == this.treeOgList[i].parentId) {
              if(this.treeOgList[i].status == 1){
                newOrg.push(this.treeOgList[i]);
              }

            }
          }
          this.orgGrid.orgList = newOrg.filter((item, index) =>
            index < this.orgGrid.pagination.page_index * this.orgGrid.pagination.page_size && index >= this.orgGrid.pagination.page_size * (this.orgGrid.pagination.page_index - 1)
          )
          this.orgGrid.pagination.total = newOrg.length;
        }
      },

      // 每页多少条切换
      handleSizeChange(page_size) {
        this.orgGrid.pagination.page_size = page_size
        this.getOrgList()
      },
      // 上下分页
      handleCurrentChange(page) {
        this.orgGrid.pagination.page_index = page
      },

      //点击新增按钮
      preInsertOrg(){
        if (this.treeId == '') {
          this.$message({
            message: '请选择左侧的组织',
            type: 'warning'
          });
          return;
        } else {
          this.insertOrgDialog.show = true;
          this.insertOrgDialog.dialogVisible = true;
          this.$nextTick(_ => {
            this.$refs.insert_org_ref.insertOrgForm.parentId = this.treeId;
            this.$refs.insert_org_ref.insertOrgForm.level = this.treeOrgLevel
            this.$refs.insert_org_ref.setInsertOrgForm();
          })
        }
      },
      closeInsertOrgDialog(){
        this.insertOrgDialog.dialogVisible = false;
        this.insertOrgDialog.show = false;
      },
      insertOrgReturn(returnValue){
        this.$nextTick(_ => {
          this.$refs.viewOrgComRef._selectOrgByUpdate(returnValue);
        });
        this.getOrgTree();
        this.showTree();
        this.getOrgList()
        this.insertOrgDialog.show = false;

      },

      //点击行事件
      clickRow(row, column, event) {
        this.rowValue.ogId = row.ogId;
        this.rowValue.id = row.id;
        this.rowValue.ogName = row.ogName;
        this.rowValue.parentId = row.parentId;
        this.rowValue.level = row.level;
      },

      //点击修改按钮
      preUpdateOrg() {
        if(this.rowValue.id == '' || this.rowValue.id == undefined){
          this.$message({
            message: '请选择一个数据',
            type: 'warning'
          });
          return;
        }
        this.updateOrgDialog.show = true;
        this.updateOrgDialog.dialogVisible = true;
        this.$nextTick(_ => {
          this.$refs.update_org_ref.updateOrgForm.ogId = this.rowValue.ogId;
          this.$refs.update_org_ref.updateOrgForm.id = this.rowValue.id;
          this.$refs.update_org_ref.updateOrgForm.ogName = this.rowValue.ogName;
          this.$refs.update_org_ref.updateOrgForm.parentId = this.rowValue.parentId;
          this.$refs.update_org_ref.updateOrgForm.level = this.rowValue.level;
        })
      },

      //关闭修改页面
      closeUpdateOrgDialog() {
        this.updateOrgDialog.dialogVisible = false;
        this.updateOrgDialog.show = false;
      },

      //修改页面的返回函数
      updateOrgReturn(returnValue) {
        this.$nextTick(_ => {
          this.$refs.viewOrgComRef._selectOrgByUpdate(returnValue);
        });
        this.getOrgTree();
        this.showTree();
        this.rowValue.id = '';
        this.updateOrgDialog.show = false;
      },

      //点击删除按钮
      preDeleteOrg() {
        if(this.rowValue.id == '' || this.rowValue.id == undefined){
          this.$message({
            message: '请选择一个数据',
            type: 'warning'
          });
          return;
        }
        this.$confirm('是否删除', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          this.$http({
            url: '/api/api/organization/deleteOrganization?id=' + this.rowValue.id + '',
            "content-type": "application/json",
            method: 'DELETE',
          }).then(res => {
            if (res.data.status == '1') {
              this.$message({message: '操作成功', type: 'success'});
              this.$nextTick(_ => {
                this.$refs.viewOrgComRef._selectOrgByUpdate(this.treeId);
              });
              this.getOrgTree();
              this.showTree();
              this.rowValue.id = '';
            } else {
              this.$message({message: '系统异常,请联系管理员', type: 'error'});
            }
          })

        });
      },

      //新增跟机构
      preInsertRootOrg(){
        this.insertRootOrgDialog.show = true;
        this.insertRootOrgDialog.dialogVisible = true;
        this.$nextTick(_ => {
          this.$refs.insert_rootOrg_ref.setInsertRootOrgForm();
        })
      },

      closeInsertRootOrgDialog(){
        this.insertRootOrgDialog.dialogVisible = false;
        this.insertRootOrgDialog.show = false;
      },
      insertRootOrgReturn(){
        this.$refs.viewOrgComRef._getUserRoleOrgTree();
        this.insertRootOrgDialog.show = false;

      },

    }

  }
</script>

<style scoped>

  .orgTree {
    position: absolute;
    left: 0;
    width: 280px;
    border: 1px solid rgba(0, 21, 41, 0.08);
    /*box-shadow: 0 0px 0px 0px #aaa, 0px 0 0px 0px #aaa;*/
  }

  .userTable {
    position: absolute;
    left: 300px;
    right: 10px;
    /*box-shadow: 0 0px 0px 0px #aaa, 0px 0 0px 0px #aaa;*/
  }

</style>

