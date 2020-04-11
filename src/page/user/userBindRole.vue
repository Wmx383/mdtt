<template>
  <div class="table_container">
    <el-table
      :data="userBindRoleGrid.roleList"
      v-loading="userBindRoleGrid.userBindRoleGridLoading"
      :style="userBindRoleGrid.gridTableStyle"
      :height="userBindRoleGrid.gridTableStyle.height"
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
        v-if="idFlag"
        prop="orgId"
        label="orgId"
        align='center'>
      </el-table-column>
      <el-table-column
        label="名称"
        align='left'
        prop="roleName"
        sortable
      >
      </el-table-column>
      <el-table-column
        label="编号"
        align='left'
        prop="roleCode"
        sortable
      >
      </el-table-column>
      <el-table-column
        label="所属组织"
        align='left'
        sortable
      >
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 1%; margin-bottom: 1%">
      <el-col :span="24">
        <div class="pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="userBindRoleGrid.pagination.page_index"
            :page-sizes="userBindRoleGrid.pagination.page_sizes"
            :page-size="userBindRoleGrid.pagination.page_size"
            :layout="userBindRoleGrid.pagination.layout"
            :total="userBindRoleGrid.pagination.total"
          >
          </el-pagination>
        </div>
      </el-col>
    </el-row>
    <el-row style="border-top: 1px solid #ccc; border-left:none; border-right:none; border-bottom:none;">
      <el-col :span="24" style="margin-top: 20px">
        <el-button type="primary" size="small" @click='createUserRoleRelation'>确 定</el-button>
        <el-button size="small" @click="_closeUserRole()">取 消</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import * as utils from '../../utils/utils';

  export default {
    name: "userBindRole",
    data() {
      return {
        userBindRoleGrid: {
          roleList: [],
          userBindRoleGridLoading: false,
          gridTableStyle: {
            width: '100%',
            height: window.screen.height / 2 - 200
          },
          pagination: {
            page_index: 1,  // 当前位于哪页
            total: 0,        // 总数
            page_size: 5,   // 1页显示多少条
            page_sizes: [5, 10, 15, 20],  //每页显示多少条
            layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
          }
        },
        roleDate: [],
        sortnum: 0,
        idFlag: false,
        roleId: '',
        userId: ''
      }
    },
    methods: {
      //获取角色存放于临时数据
      getRolePageList() {
        this.userBindRoleGrid.userBindRoleGridLoading = true;
        this.roleDate = [];
        const token = utils.getStore('Token');
        this.$http({
          url: "/api/api/role/getRoleList",
          "content-type": "application/json",
          method: 'get',
          headers: {Authorization: token},
        }).then(res => {
          if (res.data.status == 1) {
            let roleList = res.data.result;
            for (let i = 0; i < roleList.length; i++) {
              const tableItem = {
                sortnum: this.sortnum + (i + 1),
                id: roleList[i].id,
                roleName: roleList[i].roleName,
                roleCode: roleList[i].roleCode,
                orgId: roleList[i].orgId,
              };
              this.roleDate.push(tableItem);
            }
            this.getUserList()
            this.userBindRoleGrid.userBindRoleGridLoading = false;
          } else {
            //TO-DO 临时先这么写提醒吧 哈哈哈哈
            this.userBindRoleGrid.userBindRoleGridLoading = false;
            alert(res.data.msg);
            this.$router.push({path: "/"});
          }
        })
      },

      //对数据进行分页
      getUserList() {
        this.userBindRoleGrid.roleList = [];
        this.userBindRoleGrid.roleList = this.roleDate.filter((item, index) =>
          index < this.userBindRoleGrid.pagination.page_index * this.userBindRoleGrid.pagination.page_size && index >= this.userBindRoleGrid.pagination.page_size * (this.userBindRoleGrid.pagination.page_index - 1)
        )
        this.userBindRoleGrid.pagination.total = this.roleDate.length;
      },

      // 每页多少条切换
      handleSizeChange(page_size) {
        this.userBindRoleGrid.pagination.page_size = page_size
        this.getUserList()
      },
      // 上下分页
      handleCurrentChange(page) {
        this.userBindRoleGrid.pagination.page_index = page
        this.getUserList()
      },

      //点击数据行
      clickRow(row, column, event) {
        this.roleId = row.id;
      },

      //点击确定按钮
      createUserRoleRelation(){
        this.$http({
          url: '/api/api/user/createUserRoleRelation?roleId=' + this.roleId + '&userId='+ this.userId +'',
          "content-type": "application/json",
          method: 'POST',
        }).then(res => {
          if (res.data.status == '1') {
            this.$message({message: '操作成功', type: 'success'});
            this.$emit('userBindRoleListeners')
          } else {
            this.$message({message: '系统异常,请联系管理员', type: 'error'});
          }
        })
      },

      //点击取消按钮
      _closeUserRole(){
        this.$emit('closeUserBindRoleDialog')
      }

    }
  }
</script>

<style scoped>

</style>
