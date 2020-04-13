<!--管理角色页面-->
<template>
    <div>
      <div>

        <div class="orgTree" :style="orgTreeAndUserHeight">
          <viewOrgCom ref="viewOrgComRef"
                      @_handleOnClickOrg="_handleOnClickOrg(arguments)"></viewOrgCom>
        </div>

        <div class="userTable" :style="orgTreeAndUserHeight">

          <div style="border: 1px solid; border-top-style: none; border-left-style: none; border-right-style: none; border-bottom-color: darkgrey;">
            <h3 style="margin-left: 2%">角色信息</h3>
          </div>

          <div style="margin-left: 5px; margin-top: 5px">
            <el-form
              :inline="true"
              class="demo-form-inline search-form">

              <el-form-item>
                <el-button type="primary" size="small" icon="el-icon-plus"  @click='preInsertRole()'>添加</el-button>
                <el-button type="primary" size="small" icon="el-icon-edit"  @click='preUpdateRole()'>修改</el-button>
                <el-button type="primary" size="small" icon="el-icon-delete"  @click='preDeleteRole()'>删除</el-button>
              </el-form-item>
            </el-form>
          </div>

          <div class="table_container">
            <el-table
              :data="roleGrid.roleList"
              v-loading="roleGrid.roleGridLoading"
              :style="roleGrid.gridTableStyle"
              :height="roleGrid.gridTableStyle.height"
              highlight-current-row
              @row-click="clickRow"
            >
              <el-table-column
                v-if="idFlag"
                prop="id"
                label="id"
                align='center'
              >
              </el-table-column>
              <el-table-column
                prop="roleName"
                label="名称"
                align='center'
                sortable
              >
              </el-table-column>
              <el-table-column
                prop="roleCode"
                label="编号"
                align='center'
                sortable
              >
              </el-table-column>
              <el-table-column
                prop="orgId"
                label="所属组织"
                align='center'
                sortable
              >

              </el-table-column>
              <el-table-column
                label="操作"
                align='center'
              >
                <template slot-scope="scope">
                  <div class="operate-groups">
                    <el-button
                      type=""
                      size="mini"
                      @click='permissionRole(scope.$index, scope.row)'>权限
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>

            <el-row>
              <el-col :span="24">
                <div class="pagination">
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="roleGrid.pagination.page_index"
                    :page-sizes="roleGrid.pagination.page_sizes"
                    :page-size="roleGrid.pagination.page_size"
                    :layout="roleGrid.pagination.layout"
                    :total="roleGrid.pagination.total"
                  >
                  </el-pagination>
                </div>
              </el-col>
            </el-row>

            <!--新增角色页面-->
            <el-dialog
              :title="insertRoleDialog.title"
              :visible.sync="insertRoleDialog.show"
              :close-on-click-modal='false'
              :close-on-press-escape='false'
              :modal-append-to-body="false"
              :modal="true"
              :style="insertRoleDialog.style"
              :width="insertRoleDialog.width"
              @close="closeInsertRoleDialog"
            >
              <template>
                <insertRoleCom ref="insert_role_ref" v-if="insertRoleDialog.dialogVisible" :closeInsertRolerDialog="closeInsertRoleDialog" @insertRoleListeners="insertRoleReturn"></insertRoleCom>
              </template>
            </el-dialog>

            <!--修改角色页面-->
            <el-dialog
              :title="updateRoleDialog.title"
              :visible.sync="updateRoleDialog.show"
              :close-on-click-modal='false'
              :close-on-press-escape='false'
              :modal-append-to-body="false"
              :modal="true"
              :style="updateRoleDialog.style"
              :width="updateRoleDialog.width"
              @close="closeUpdateRoleDialog"
            >
              <template>
                <updateRoleCom ref="update_role_ref" v-if="updateRoleDialog.dialogVisible" :closeUpdateRoleDialog="closeUpdateRoleDialog" @updateRoleListeners="updateRoleReturn"></updateRoleCom>
              </template>
            </el-dialog>

            <!--权限页面-->
            <el-dialog
              :title="permissionRoleDialog.title"
              :visible.sync="permissionRoleDialog.show"
              :close-on-click-modal='false'
              :close-on-press-escape='false'
              :modal-append-to-body="false"
              :modal="true"
              :style="permissionRoleDialog.style"
              :width="permissionRoleDialog.width"
              @close="closePermissionRoleDialog"
            >
              <template>
                <permissiomRoleCom ref="permission_role_ref" v-if="permissionRoleDialog.dialogVisible" :closePermissionRolerDialog="closePermissionRoleDialog" :permissionRoleListeners="permissionRoleReturn"></permissiomRoleCom>
              </template>
            </el-dialog>

          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import viewOrgCom from "../org/viewOrg.vue";
  import * as utils from '../../utils/utils';
  import insertRoleCom from '../role/preInsertRole.vue';
  import updateRoleCom from '../role/preUpdateRole.vue';
  import permissionRoleCom from '../role/prePermissionRole.vue';
  export default {
    components: {viewOrgCom, insertRoleCom, updateRoleCom, permissionRoleCom},
    name: "manageUser",
    data() {
      return {
        idFlag: false,
        roledata: [],
        treeOrgId: '',
        treeOrgType: '',
        sortnum: 0,
        treeData: [],
        orgTreeAndUserHeight: {
          height: ''
        },

        bratTreeData:[],
        treeOgIdList:[],
        abc:false,
        orgIdList:[],
        orgTreeAndUserHeight: {
          height: ''
        },
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        roleGrid: {
          roleList: [],
          roleGridLoading: false,
          gridTableStyle: {
            width: '100%',
            height: window.screen.height / 2 + 100
          },
          pagination: {
            page_index: 1,  // 当前位于哪页
            total: 0,        // 总数
            page_size: 10,   // 1页显示多少条
            page_sizes: [5, 10, 15, 20],  //每页显示多少条
            layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
          }
        },
        //新增窗口
        insertRoleDialog: {
          show: false,
          title: '新增',
          insertProjectDialogLoading: false,
          dialogVisible: true,
          formLabelWidth: '120px',
          width: '500px',
        },
        //编辑窗口
        updateRoleDialog: {
          show: false,
          title: '修改用户',
          updateProjectDialogLoading: false,
          dialogVisible: true,
          formLabelWidth: '120px',
          width: '500px',
        },
        //权限窗口
        permissionRoleDialog:{
          show: false,
          title: '添加角色权限',
          permissionProjectDialogLoading: false,
          dialogVisible: true,
          formLabelWidth: '120px',
          width: '500px',
        },
        rowValue: {
          rowId: '',
          rowRoleName: '',
          rowRoleCode: '',
          rowStatus: '',
          rowOrgId: '',
        },
      }
    },

    created() {
      this.setOrgTreeAndUserHeight()
      this.getOrgTree();
      this.getRolePageList();
      this.$nextTick(_ => {
        this.$refs.viewOrgComRef._getUserRoleOrgTree();
      })
    },

    methods: {
      //设置高度
      setOrgTreeAndUserHeight() {
        this.orgTreeAndUserHeight.height = window.innerHeight - 110 + 'px'
      },

      //获取树
      getOrgTree() {
        this.$http({
          url: "/api/api/user/getUserRoleOrgTree",
          "content-type": "application/json",
          method: 'get',
        }).then(res => {
          if (res.data.status == 1) {
            this.treeData = res.data.result;
          } else {
            this.$router.push({path: "/"});
          }
        })
      },

      //点击树
      _handleOnClickOrg(args) {
        this.treeOrgId = args[1];
        this.treeOrgType = args[2];
        this.rowValue.rowId = ''

        if(this.treeOrgType == '1'){
          this.getRoleList();
        }else {
          this.treeOgIdList = [],
          this._selectBratTreeData(args[0],args[1]);
          this.getRoleList();
        }
      },

      _selectBratTreeData(id,orId){
        for(let i = 0;i < this.treeData.length;i++){
          if (id == this.treeData[i].id) {
            this.bratTreeData = this.treeData[i];
            return ;
          } else if (this.treeData[i].childList != null) {
            this._getRecursionData(id ,this.treeData[i].childList);
          }
        }
        this._getTreeIdList();
      },

      _getRecursionData(id,treeDataList){
        for(let i = 0; i  < treeDataList.length; i++){
          if(id == treeDataList[i].id){
            this.bratTreeData = treeDataList[i];
            return ;
          } else if(treeDataList[i].childList != null){
            this._getRecursionData(id,treeDataList[i].childList)
          }
        }
      },

      _getTreeIdList() {
        this.treeOgIdList.push(this.bratTreeData.ogId);
        if (this.bratTreeData.childList != null) {
          this._getRecursionDataTreeOgId(this.bratTreeData.childList);
        }
      },

      _getRecursionDataTreeOgId(bratTreeData) {
        for (let i = 0; i < bratTreeData.length; i++) {
          this.treeOgIdList.push(bratTreeData[i].ogId);
          if (bratTreeData[i].childList != null) {
            this._getRecursionDataTreeOgId(bratTreeData[i].childList);
          }
        }
      },

      //后台获取数据存放于临时data
      getRolePageList() {
        this.roleGrid.roleGridLoading = true;
        let that = this;
        const token = utils.getStore('Token');
        this.$http({
          url: "/api/api/role/getRoleList",
          "content-type": "application/json",
          method: 'get',
          headers: {Authorization: token},
        }).then(res => {
          if (res.data.status == 1) {
            let orgRole = res.data.result;
            console.log(orgRole);
            let roleList = [];
            for (let i = 0; i < orgRole.length; i++) {
              let role = {
                id: orgRole[i].id,
                roleName: orgRole[i].roleName,
                roleCode: orgRole[i].roleCode,
                status: orgRole[i].status,
                orgId: orgRole[i].orgId,
              };
              roleList.push(role);
            }
            that.roledata = [];
            for (let i = 0; i < roleList.length; i++) {
              const tableItem = {
                sortnum: that.sortnum + (i + 1),
                id: roleList[i].id,
                roleName: roleList[i].roleName,
                roleCode: roleList[i].roleCode,
                status: roleList[i].status,
                orgId: orgRole[i].orgId,
              }
              that.roledata.push(tableItem)
            }
            that.getRoleList()
            that.roleGrid.roleGridLoading = false;
          } else {
            //TO-DO 临时先这么写提醒吧 哈哈哈哈
            that.roleGrid.roleGridLoading = false;
            alert(res.data.msg);
            that.$router.push({path: "/"});
          }
        })
      },

      //把临时数据存于tableData 做分页
      getRoleList(){
        this.roleGrid.roleList = [];

        if (this.treeOrgType == '1') {
          this.roleGrid.roleList = this.roledata.filter((item, index) =>
            index < this.roleGrid.pagination.page_index * this.roleGrid.pagination.page_size && index >= this.roleGrid.pagination.page_size * (this.roleGrid.pagination.page_index - 1)
          )
          this.roleGrid.pagination.total = this.roledata.length;
        } else if (this.treeOrgType == '') {
          this.roleGrid.roleList = this.roledata.filter((item, index) =>
            index < this.roleGrid.pagination.page_index * this.roleGrid.pagination.page_size && index >= this.roleGrid.pagination.page_size * (this.roleGrid.pagination.page_index - 1)
          )
          this.roleGrid.pagination.total = this.roledata.length;
        } else {
          let newRole = [];
          for (let i = 0; i < this.roledata.length; i++) {
            for (let j = 0; j < this.treeOgIdList.length; j++) {
              if (this.treeOgIdList[j] == this.roledata[i].orgId) {
                newRole.push(this.roledata[i]);
              }
            }
          }

          this.roleGrid.roleList = newRole.filter((item, index) =>
            index < this.roleGrid.pagination.page_index * this.roleGrid.pagination.page_size && index >= this.roleGrid.pagination.page_size * (this.roleGrid.pagination.page_index - 1)
          )
          this.roleGrid.pagination.total = newRole.length;
        }
      },

      // 每页多少条切换
      handleSizeChange(page_size) {
        this.roleGrid.pagination.page_size = page_size
        this.getRoleList()
      },
      // 上下分页
      handleCurrentChange(page) {
        this.roleGrid.pagination.page_index = page
        this.getRoleList()
      },

      //点击树调用的方法
      selectRoleByOrg(){
        if(this.treeOrgType == '1'){
          let that = this;
          that.getRoleList();
        }else{
          let that = this;
          that.roleGrid.roleList = [];
          let roleList = [];
          for(let i = 0; i < that.roledata.length; i ++ ){
            if(that.roledata[i].orgId == that.treeOrgId){
              roleList.push(that.roledata[i])
            }
          }

          that.roleGrid.roleList = roleList.filter((item, index) =>
            index < that.roleGrid.pagination.page_index * that.roleGrid.pagination.page_size && index >= that.roleGrid.pagination.page_size * (that.roleGrid.pagination.page_index - 1)
          )
          that.roleGrid.pagination.total = roleList.length;
        }
      },

      //获取当前节点和子节点的所有treeId
      // getTreeId(treeOrgId){
      //
      // },

      //点击新增按钮
      preInsertRole(){
        if(this.treeOrgId == ''){
          this.$message({
            message: '请选择左侧的组织',
            type: 'warning'
          });
          return;
        }else{
          this.insertRoleDialog.show = true;
          this.insertRoleDialog.dialogVisible = true;
          this.$nextTick(_ => {
            console.log(this.treeOrgId);
            this.$refs.insert_role_ref.insertRoleForm.org_id = this.treeOrgId;
            this.$refs.insert_role_ref.setInsertRoleForm();
          })
        }
      },

      //关闭新增页面
      closeInsertRoleDialog(){
        this.insertRoleDialog.show = false;
        this.insertRoleDialog.dialogVisible = false;
      },

      //新增页面的返回函数
      insertRoleReturn(){
        const node = this.$refs.viewOrgComRef._getCurrentNode();
        this.getRolePageList();
        this.insertRoleDialog.show = false;
        this.insertRoleDialog.dialogVisible = false;
      },

      //点击行事件
      clickRow(row, column, event){
        this.rowValue.rowId = row.id;
        this.rowValue.rowRoleName = row.roleName;
        this.rowValue.rowRoleCode = row.roleCode;
        this.rowValue.rowStatus = row.status;
        this.rowValue.rowOrgId = row.orgId;
        //this._setButtonStatus(row);
      },

      //点击修改按钮
      preUpdateRole(){
        if(this.rowValue.rowId == ''  || this.rowValue.rowId == undefined){
          this.$message({
            message: '请选择你要修改的项',
            type:'warning'
          });
          return;
        }else {
          this.updateRoleDialog.show = true;
          this.updateRoleDialog.dialogVisible = true;
          this.$nextTick(_ => {
            this.$refs.update_role_ref.updateRoleForm.id = this.rowValue.rowId;
            this.$refs.update_role_ref.updateRoleForm.roleName = this.rowValue.rowRoleName;
            this.$refs.update_role_ref.updateRoleForm.roleCode = this.rowValue.rowRoleCode;
            this.$refs.update_role_ref.updateRoleForm.status = this.rowValue.rowStatus;
            this.$refs.update_role_ref.updateRoleForm.orgId = this.rowValue.rowOrgId;
          });
        }
      },

      //关闭修改页面
      closeUpdateRoleDialog(){
        this.updateRoleDialog.show = false;
        this.updateRoleDialog.dialogVisible = false;
      },

      //修改页面的返回函数
      updateRoleReturn(){
        const node = this.$refs.viewOrgComRef._getCurrentNode();
        this.getRoleList();
        this.rowValue.rowId = '';
        this.updateRoleDialog.show = false;
      },

      //点击删除按钮
      preDeleteRole(){
        if(this.rowValue.rowId == '' || this.rowValue.rowId == undefined){
          this.$message({
            message: '请选择一个删除项',
            type:'warning'
          });
          return ;
        }else {
          const id = this.rowValue.rowId;
          this.$confirm('是否删除该行数据?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http({
              url: '/api/api/role/deleteRole?id=' + id + '',
              "content-type": "application/json",
              method: 'DELETE',
            }).then(res => {
              if(res.data.status == '1'){
                this.$message({message: '操作成功', type: 'success'});
                this.getRoleList();
              }else{
                this.$message({message: '系统异常,请联系管理员', type: 'error'});
              }
            })

          });
        }

      },

      //设置按钮状态
      _setButtonStatus(row){
        if(row == undefined){
          if(this.treeOrgId == ''){
            this.BUTTON_STATUS._preInsertRole = true;
            this.BUTTON_STATUS._preUpdateRole = true;
            this.BUTTON_STATUS._preDeleteRole = true;
          }else{
            this.BUTTON_STATUS._preInsertRole = false;
            this.BUTTON_STATUS._preUpdateRole = true;
            this.BUTTON_STATUS._preDeleteRole = true;
          }
        }else{
          this.BUTTON_STATUS._preInsertRole = true;
          this.BUTTON_STATUS._preUpdateRole = false;
          this.BUTTON_STATUS._preDeleteRole = false;
        }
      }
    },
    //点击权限
    permissionRole(row) {
      this.permissionRoleDialog.show = true;
      this.permissionRoleDialog.dialogVisible = true;
      this.$nextTick(_ => {
        // this.$refs.permission_role_ref.getRolePageList();
        // this.$refs.permission_role_ref.roleId = row.id;
      });
    },
    //  关闭权限页面
    closePermissionRoleDialog(){
      this.permissionRoleDialog.show = false;
      this.permissionRoleDialog.dialogVisible = false;
    },

    //  权限页面的返回函数
    permissionRoleReturn(){
      this.permissionRoleDialog.show = false;
      this.permissionRoleDialog.dialogVisible = false;
    }
  }
</script>

<style scoped>
  .orgTree{
    position: absolute;
    left: 0;
    width: 280px;
    border: 1px solid rgba(0, 21, 41, 0.08);
    box-shadow: 0 10px 10px 0px #aaa, 10px 0 10px 0px #aaa;
  }
  .userTable{
    position: absolute;
    left: 300px;
    right: 10px;
    box-shadow: 0 10px 10px 0px #aaa, 10px 0 10px 0px #aaa;
  }


</style>
