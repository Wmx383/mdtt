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

        <div style="margin-left: 2%; margin-top: 1%; ">
          <el-button type="primary" size="small" icon="el-icon-plus" @click='preInsertUser()'>添加</el-button>
          <el-button type="primary" size="small" icon="el-icon-edit" :disabled="BUTTON_STATUS._preUpdateUser" @click='preUpdateUser()'>修改</el-button>
          <el-button type="primary" size="small" icon="el-icon-delete" :disabled="BUTTON_STATUS._preDeleteUser" @click='preDeleteUser()'>删除</el-button>
        </div>

        <div>
          <el-table
            :data="userGrid.userList"
            v-loading="userGrid.userGridLoading"
            :style="userGrid.gridTableStyle"
            :height="userGrid.gridTableStyle.height"
            highlight-current-row
          >
            <el-table-column
              label="名称"
              align='center'
              prop="name"
              sortable
            >
            </el-table-column>
            <el-table-column
              label="用户名"
              align='center'
              prop="userName"
              sortable
            >
            </el-table-column>
            <el-table-column
              label="密码"
              align='center'
              prop="password"
              sortable
            >
            </el-table-column>
            <el-table-column
              label="编号"
              align='center'
              prop="idCard"
              sortable
            >
            </el-table-column>
            <el-table-column
              label="邮箱"
              align='center'
              prop="mail"
              sortable
            >
            </el-table-column>
            <el-table-column
              label="电话"
              align='center'
              prop="phone"
              sortable
            >
            </el-table-column>
            <el-table-column
              label="组织"
              align='center'
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
                    :current-page="page"
                    :page-sizes="[1, 2, 5, 10]"
                    :page-size="limit"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                 >
                </el-pagination>
              </div>
            </el-col>
          </el-row>
        </div>

      </div>

    </div>


  </div>
</template>

<script>
  import viewOrgCom from "../org/viewOrg.vue";
  import * as utils from '../../utils/utils'

  export default {
    components: {viewOrgCom},
    name: "manageUser",
    data() {
      return {
        orgTreeAndUserHeight: {
          height: ''
        },
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        //按钮状态
        BUTTON_STATUS: {
          _preUpdateUser: true,
          _preDeleteUser: true
        },
        userGrid: {
          userList: [],
          userGridLoading: false,
          gridTableStyle: {
            width: '100%',
            height: window.screen.height / 2 + 130
          },
        },
        userdata: [],
        limit: 2,
        total: null,
        page: 1,
        orgId: '',
        sortnum: 0,
      }
    },
    created() {
      this.setOrgTreeAndUserHeight()
      this.getUserPageList();
    },
    methods: {
      //设置高度
      setOrgTreeAndUserHeight() {
        this.orgTreeAndUserHeight.height = window.innerHeight - 110 + 'px'
      },
      //点击树
      _handleOnClickOrg(args) {
        this.orgId = args[1];
      },
      //后台获取数据存放于临时data
      getUserPageList(){
        this.userGrid.userGridLoading = true;
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
            this.userGrid.userGridLoading = false;
          } else {
            //TO-DO 临时先这么写提醒吧 哈哈哈哈
            this.userGrid.userGridLoading = false;
            alert(res.data.msg);
            this.$router.push({path: "/"});
          }
        })
      },
      //把临时数据存于tableData 做分页
      getUserList(){
        this.userGrid.userList = this.userdata.filter((item, index) =>
          index < this.page * this.limit && index >= this.limit * (this.page - 1)
        )
        this.total = this.userdata.length;
      },
      // 每页多少条切换
      handleSizeChange(val) {
        this.limit = val
        this.getUserList()
      },
      // 上下分页
      handleCurrentChange(val) {
        this.page = val
        this.getUserList()
      },


      //点击新增按钮
      preInsertUser(){

      },

      //点击修改按钮
      preUpdateUser(){

      },

      //点击删除按钮
      preDeleteUser(){

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
    box-shadow: 0 0px 0px 0px #aaa, 0px 0 0px 0px #aaa;
  }

  .userTable {
    position: absolute;
    left: 283px;
    right: 0px;
    box-shadow: 0 0px 0px 0px #aaa, 0px 0 0px 0px #aaa;
  }

</style>

