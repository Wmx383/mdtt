<!--用户管理页面-->
<template>

  <div >
    <div>

      <div class="orgTree" :style="orgTreeAndUserHeight">
        <el-tree :data="data" :props="defaultProps">
        </el-tree>
      </div>

      <div class="userTable" :style="orgTreeAndUserHeight">

        <div style="border: 1px solid; border-top-style: none; border-left-style: none; border-right-style: none; border-bottom-color: darkgrey;">
          <h3 style="margin-left: 2%">用户信息</h3>
        </div>

        <div style="margin-left: 2%; margin-top: 1%; ">
          <el-button type="primary" icon="el-icon-plus">添加</el-button>
          <el-button type="primary" icon="el-icon-edit">修改</el-button>
          <el-button type="primary" icon="el-icon-delete">删除</el-button>
        </div>

        <div>
          <el-table>
            <el-table-column
              label="名称"
              align='center'
              sortable
            >
            </el-table-column>
            <el-table-column
              label="用户名"
              align='center'
              sortable
            >
            </el-table-column>
            <el-table-column
              label="密码"
              align='center'
              sortable
            >
            </el-table-column>
            <el-table-column
              label="编号"
              align='center'
              sortable
            >
            </el-table-column>
            <el-table-column
              label="邮箱"
              align='center'
              sortable
            >
            </el-table-column>
            <el-table-column
              label="电话"
              align='center'
              sortable
            >
            </el-table-column>
            <el-table-column
              label="组织"
              align='center'
              sortable
            >
            </el-table-column>
            <el-table-column
              label="操作"
              align='center'
            >
              <template slot-scope="scope">
                <div>
                  <el-button
                    type="primary"
                    size="mini">绑定角色
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-row>
            <el-col :span="24">
              <div class="pagination">
                <el-pagination
                  v-if='paginations.total > 0'
                  :page-sizes="paginations.page_sizes"
                  :page-size="paginations.page_size"
                  :layout="paginations.layout"
                  :total="paginations.total"
                  :current-page='paginations.page_index'>
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
  export default {
    name: "manageUser",

    data() {
      return {
        orgTreeAndUserHeight: {
          height: ''
        },
        data: [{
          label: '一级 1',
          children: [{
            label: '二级 1-1',
            children: [{
              label: '三级 1-1-1'
            }]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        paginations: {
          page_index: 1,  // 当前位于哪页
          total: 0,        // 总数
          page_size: 20,   // 1页显示多少条
          page_sizes: [5, 10, 15, 20],  //每页显示多少条
          layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
        },
      }
    },
    created(){
      this.setOrgTreeAndUserHeight()
    },
    methods: {
      setOrgTreeAndUserHeight(){
        this.orgTreeAndUserHeight.height= window.innerHeight - 110 + 'px'
      },
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

