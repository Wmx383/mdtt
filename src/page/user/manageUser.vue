<!--用户管理页面-->
<template>

  <div>
    <div>

      <div class="orgTree" :style="orgTreeAndUserHeight">
        <viewOrgCom ref="viewOrgComRef"
                    @_handleOnClickOrg="_handleOnClickOrg(arguments)"></viewOrgCom>
      </div>

      <div class="userTable" :style="orgTreeAndUserHeight">

        <div
          style="border: 1px solid; border-top-style: none; border-left-style: none; border-right-style: none; border-bottom-color: darkgrey;">
          <h3 style="margin-left: 2%">用户信息</h3>
        </div>

        <div style="margin-left: 5px; margin-top: 5px">
          <el-form
            :inline="true"
            class="demo-form-inline search-form">

            <el-form-item>
              <el-button type="primary" size="small" icon="el-icon-plus" :disabled="BUTTON_STATUS._preInsertUser" @click='preInsertUser()'>添加</el-button>
              <el-button type="primary" size="small" icon="el-icon-edit" :disabled="BUTTON_STATUS._preUpdateUser" @click='preUpdateUser()'>修改</el-button>
              <el-button type="primary" size="small" icon="el-icon-delete" :disabled="BUTTON_STATUS._preDeleteUser" @click='preDeleteUser()'>删除</el-button>
            </el-form-item>
          </el-form>
        </div>

        <div class="table_container">
          <el-table
            :data="userGrid.userList"
            v-loading="userGrid.userGridLoading"
            :style="userGrid.gridTableStyle"
            :height="userGrid.gridTableStyle.height"
            highlight-current-row
            @row-click="clickRow"
          >
            <el-table-column
              v-if="idFlag"
              prop="id"
              label="id"
              align='center'>
            </el-table-column>
            <el-table-column
              label="名称"
              align='left'
              prop="name"
              sortable
            >
            </el-table-column>
            <el-table-column
              label="用户名"
              align='left'
              prop="userName"
              sortable
            >
            </el-table-column>
            <el-table-column
              label="密码"
              align='left'
              prop="password"
              sortable
            >
            </el-table-column>
            <el-table-column
              label="编号"
              align='left'
              prop="idCard"
              sortable
            >
            </el-table-column>
            <el-table-column
              label="邮箱"
              align='left'
              prop="mail"
              sortable
            >
            </el-table-column>
            <el-table-column
              label="电话"
              align='left'
              prop="phone"
              sortable
            >
            </el-table-column>
            <el-table-column
              label="组织"
              align='left'
              prop="ogName"
              sortable
            >
            </el-table-column>
            <el-table-column
              label="操作"
              align='center'
            >
              <template slot-scope="scope">
                <div>
                  <el-button size="mini">绑定角色
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
                    :current-page="userGrid.pagination.page_index"
                    :page-sizes="userGrid.pagination.page_sizes"
                    :page-size="userGrid.pagination.page_size"
                    :layout="userGrid.pagination.layout"
                    :total="userGrid.pagination.total"
                 >
                </el-pagination>
              </div>
            </el-col>
          </el-row>

          <!--新增人员页面-->
          <el-dialog
            :title="insertUserDialog.title"
            :visible.sync="insertUserDialog.show"
            :close-on-click-modal='false'
            :close-on-press-escape='false'
            :modal-append-to-body="false"
            :modal="true"
            :style="insertUserDialog.style"
            :width="insertUserDialog.width"
          >
            <template>
              <insertUserCom ref="insert_user_ref" v-if="insertUserDialog.dialogVisible" :closeInsertUserDialog="closeInsertUserDialog" @insertUserListeners="insertUserReturn"></insertUserCom>
            </template>
          </el-dialog>

          <!--修改人员页面-->
          <el-dialog
            :title="updateUserDialog.title"
            :visible.sync="updateUserDialog.show"
            :close-on-click-modal='false'
            :close-on-press-escape='false'
            :modal-append-to-body="false"
            :modal="true"
            :style="updateUserDialog.style"
            :width="updateUserDialog.width"
          >
            <template>
              <updateUserCom ref="update_user_ref" v-if="updateUserDialog.dialogVisible" :closeUpdateUserDialog="closeUpdateUserDialog" @updateUserListeners="updateUserReturn"></updateUserCom>
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
  import insertUserCom from '../user/preInsertUser.vue';
  import updateUserCom from '../user/preUpdateUser.vue';

  export default {
    components: {viewOrgCom, insertUserCom, updateUserCom},
    name: "manageUser",
    data() {
      return {
        orgTreeAndUserHeight: {
          height: ''
        },
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        //按钮状态
        BUTTON_STATUS: {
          _preInsertUser: false,
          _preUpdateUser: false,
          _preDeleteUser: false
        },
        userGrid: {
          userList: [],
          userGridLoading: false,
          gridTableStyle: {
            width: '100%',
            height: window.screen.height / 2 + 130
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
        userdata: [],
        treeOrgId: '',
        treeOrgType: '',
        sortnum: 0,
        //新增窗口
        insertUserDialog: {
          show: false,
          title: '新增用户',
          insertProjectDialogLoading: false,
          dialogVisible : true,
          formLabelWidth: '120px',
          width: '500px'
        },
        //编辑窗口
        updateUserDialog: {
          show: false,
          title: '修改用户',
          updateProjectDialogLoading: false,
          dialogVisible : true,
          formLabelWidth: '120px',
          width: '500px'
        },
        rowValue: {
          rowId: '',
          rowName: '',
          rowUserName: '',
          rowPassword: '',
          rowIdCard: '',
          rowMail: '',
          rowPhone: '',
        },
      }
    },
    created() {
      this.setOrgTreeAndUserHeight()
      this.getOrgTree();
      this.getUserPageList();
    },
    methods: {
      //设置高度
      setOrgTreeAndUserHeight() {
        this.orgTreeAndUserHeight.height = window.innerHeight - 110 + 'px'
      },
      //获取树
      getOrgTree(){
        this.$http({
          url: "/api/api/user/getUserRoleOrgTree",
          "content-type": "application/json",
          method: 'get',
        }).then(res => {
          if (res.data.status == 1) {
            this.treeData = res.data.result;
          } else {
            //TO-DO 临时先这么写提醒吧 哈哈哈哈
            this.$router.push({path: "/"});
          }
        })
      },
      //点击树
      _handleOnClickOrg(args) {
        this.treeOrgId = args[1];
        this.treeOrgType = args[2];

        this.selectUserByOrg();
      },
      //后台获取数据存放于临时data
      getUserPageList(){
        this.userGrid.userGridLoading = true;
       // this._setButtonStatus();
        let that = this;
        const token = utils.getStore('Token');
        this.$http({
          url: "/api/api/user/getOrgUserList",
          "content-type": "application/json",
          method: 'get',
          headers: {Authorization: token},
        }).then(res => {
          if (res.data.status == 1) {
            let orgUser = res.data.result;
            let userList = [];
            for(let i = 0; i < orgUser.length; i ++){
              if(orgUser[i].users.length > 0){
                for(let j = 0; j < orgUser[i].users.length; j++){
                  let user = {
                    id: orgUser[i].users[j].id,
                    ogName: orgUser[i].ogName,
                    orgId: orgUser[i].orgId,
                    name: orgUser[i].users[j].name,
                    userName: orgUser[i].users[j].userName,
                    password: orgUser[i].users[j].password,
                    idCard: orgUser[i].users[j].idCard,
                    mail: orgUser[i].users[j].mail,
                    phone: orgUser[i].users[j].phone,
                  };
                  userList.push(user);
                }
              }
            }
            that.userdata = [];
            for(let i = 0; i < userList.length; i++){
              const tableItem = {
                sortnum: that.sortnum + (i + 1),
                id: userList[i].id,
                ogName: userList[i].ogName,
                orgId: userList[i].orgId,
                name: userList[i].name,
                userName: userList[i].userName,
                password: userList[i].password,
                idCard: userList[i].idCard,
                mail: userList[i].mail,
                phone: userList[i].phone
              }
              that.userdata.push(tableItem)
            }
            that.getUserList()
            that.userGrid.userGridLoading = false;
          } else {
            //TO-DO 临时先这么写提醒吧 哈哈哈哈
            that.userGrid.userGridLoading = false;
            alert(res.data.msg);
            that.$router.push({path: "/"});
          }
        })
      },
      //把临时数据存于tableData 做分页
      getUserList(){
        this.userGrid.userList = [];
        this.userGrid.userList = this.userdata.filter((item, index) =>
          index < this.userGrid.pagination.page_index * this.userGrid.pagination.page_size && index >= this.userGrid.pagination.page_size * (this.userGrid.pagination.page_index - 1)
        )
        this.userGrid.pagination.total = this.userdata.length;
      },
      // 每页多少条切换
      handleSizeChange(page_size) {
        this.userGrid.pagination.page_size = page_size
        this.getUserList()
      },
      // 上下分页
      handleCurrentChange(page) {
        this.userGrid.pagination.page_index = page
        this.getUserList()
      },

      //点击树调用的方法
      selectUserByOrg(){
        if(this.treeOrgType == '1'){
          let that = this;
          that.getUserList();
        }else{
          let that = this;
          that.userGrid.userList = [];
          let userList = [];
          for(let i = 0; i < that.userdata.length; i ++ ){
            if(that.userdata[i].orgId == that.treeOrgId){
              userList.push(that.userdata[i])
            }
          }
          that.userGrid.userList = userList.filter((item, index) =>
            index < that.userGrid.pagination.page_index * that.userGrid.pagination.page_size && index >= that.userGrid.pagination.page_size * (that.userGrid.pagination.page_index - 1)
          )
          that.userGrid.pagination.total = userList.length;
        }
      },

      //获取当前节点和子节点的所有treeId
      getTreeId(treeOrgId){

      },

      //点击新增按钮
      preInsertUser(){
        if(this.treeOrgId == ''){
          this.$message({
            message: '请选择左侧的组织',
            type: 'warning'
          });
          return;
        }else{
          this.insertUserDialog.show = true;
          this.insertUserDialog.dialogVisible = true;
          this.$nextTick(_ => {
            this.$refs.insert_user_ref.insertUserForm.org_id = this.treeOrgId;
            this.$refs.insert_user_ref.setInsertUserForm();
          })
        }
      },

      //关闭新增页面
      closeInsertUserDialog(){
        this.insertUserDialog.show = false;
      },

      //新增页面的返回函数
      insertUserReturn(){
        this.insertUserDialog.show = false;
      },

      //点击行事件
      clickRow(row, column, event){
        this.rowValue.rowId = row.id;
        this.rowValue.rowName = row.name;
        this.rowValue.rowUserName = row.userName;
        this.rowValue.rowPassword = row.password;
        this.rowValue.rowIdCard = row.idCard;
        this.rowValue.rowMail = row.mail;
        this.rowValue.rowPhone = row.phone;

        //this._setButtonStatus(row);
      },

      //点击修改按钮
      preUpdateUser(){
        this.updateUserDialog.show = true;
        this.updateUserDialog.dialogVisible = true;
        this.$nextTick(_ => {
          this.$refs.update_user_ref.updateUserForm.id = this.rowValue.rowId;
          this.$refs.update_user_ref.updateUserForm.name = this.rowValue.rowName;
          this.$refs.update_user_ref.updateUserForm.userName = this.rowValue.rowUserName;
          this.$refs.update_user_ref.updateUserForm.password = this.rowValue.rowPassword;
          this.$refs.update_user_ref.updateUserForm.idCard = this.rowValue.rowIdCard;
          this.$refs.update_user_ref.updateUserForm.mail = this.rowValue.rowMail;
          this.$refs.update_user_ref.updateUserForm.phone = this.rowValue.rowPhone;
        })
      },

      //关闭修改页面
      closeUpdateUserDialog(){
        this.updateUserDialog.show = false;
      },

      //修改页面的返回函数
      updateUserReturn(){
        this.updateUserDialog.show = false;
      },

      //点击删除按钮
      preDeleteUser(){
        this.$confirm('是否删除', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          this.$http({
            url: '/api/api/user/deleteUser?id=' + this.rowValue.rowId + '',
            "content-type": "application/json",
            method: 'DELETE',
          }).then(res => {
            if(res.data.status == '1'){
              this.$message({message: '操作成功', type: 'success'});
            }else{
              this.$message({message: '系统异常,请联系管理员', type: 'error'});
            }
          })

        });
      },

      //设置按钮状态
      _setButtonStatus(row){
        if(row == undefined){
          if(this.treeOrgId == ''){
            this.BUTTON_STATUS._preInsertUser = true;
            this.BUTTON_STATUS._preUpdateUser = true;
            this.BUTTON_STATUS._preDeleteUser = true;
          }else{
            this.BUTTON_STATUS._preInsertUser = false;
            this.BUTTON_STATUS._preUpdateUser = true;
            this.BUTTON_STATUS._preDeleteUser = true;
          }
        }else{
          this.BUTTON_STATUS._preInsertUser = true;
          this.BUTTON_STATUS._preUpdateUser = false;
          this.BUTTON_STATUS._preDeleteUser = false;
        }
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

