<!--数据管理页面-->
<template>
  <div>
    <div class="orgTree" :style="orgTreeStyle">
      <viewOrgCom ref="viewOrgComRef"
                  @_handleOnClickOrg="_handleOnClickOrg(arguments)"></viewOrgCom>
    </div>
    <div class="contentDiv" :style="contentDivStyle">

      <div
        style="border: 1px solid; border-top-style: none; border-left-style: none; border-right-style: none; border-bottom-color: darkgrey;">
        <h3 style="margin-left: 2%">数据配置</h3>
      </div>

      <div style="margin-left: 5px; margin-top: 5px">
        <el-form
          :inline="true"
          class="demo-form-inline search-form">

          <el-form-item>
            <el-button type="primary" size="small" @click="_handleUpdateModelParamDisplay">添加配置项</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="table_container">
        <el-table
          v-loading="dataConfig.gridLoading"
          :data="dataConfig.dataConfigPageList"
          :style="dataConfig.gridTableStyle"
          :height="dataConfig.gridTableStyle.height"
          align='center'
          ref="multipleTable"
          @select="_handleSelection"
          @select-all="_handleSelectionAll"
          @selection-change="_handleSelectionChange"
          @row-click="_clickRow"
        >
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column
            v-if="idFlag"
            prop="id"
            label="项目需求ID"
            align='center'
          >
          </el-table-column>
          <el-table-column
            prop="name"
            label="参数名称"
            align='left'
            min-width="300"
          >
          </el-table-column>
          <el-table-column
            prop="maxValue"
            label="最大值"
            align='left'
            width="200"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="minValue"
            label="最小值"
            align='left'
            width="200"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="typeName"
            label="参数类型"
            align='left'
            width="300"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="displayName"
            label="是否展示"
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
                :page-sizes="dataConfig.pagination.page_sizes"
                :page-size="dataConfig.pagination.page_size"
                :layout="dataConfig.pagination.layout"
                :total="dataConfig.pagination.total"
                :current-page='dataConfig.pagination.page_index'
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

  export default {
    name: "manageData",
    components: {viewOrgCom},
    data() {
      return {
        orgTreeStyle: {
          height: ''
        },
        contentDivStyle: {
          height: ''
        },
        idFlag: false,
        dataConfig: {
          sortNum: 0,
          gridLoading: false,
          dataConfigAllList: [],
          dataConfigPageList: [],
          dataConfigList: [],
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
        numbers: [],
        multipleSelection: []
      }
    },
    created() {
      this._initData()
    },
    methods: {
      _handleOnClickOrg(args) {
        const orgLevel = args[2];
        if (orgLevel == 5) {
          this._selectDataConfig(args[1]);
        }
      },
      _initData() {
        this.orgTreeStyle.height = window.innerHeight - 110 + 'px'
        this.contentDivStyle.height = window.innerHeight - 110 + 'px'
      },
      async _selectDataConfig(ogId) {
        this.numbers = [];
        this.multipleSelection = [];
        this.dataConfig.gridLoading = true;
        this.dataConfig.dataConfigAllList = [];
        this.dataConfig.dataConfigList = [];
        await this._getModelParamList(ogId);
        await this._getDisplayModelParamList(ogId);
      },
      async _getModelParamList(ogId) {
        await this.$http({
          url: '/api/api/modelParam/getModelParamList?modelId=' + ogId + '',
          "content-type": "application/json",
          method: 'get',
          /*headers: {Authorization: token},*/
        }).then(res => {
          if (res.data.status == 1) {
            this.dataConfig.dataConfigAllList = res.data.result;
          } else {
            this.$message({message: res.data.msg, type: 'error'});
          }
        })
      },
      async _getDisplayModelParamList(ogId) {
        await this.$http({
          url: '/api/api/modelParam/getDisplayModelParamList?modelId=' + ogId + '',
          "content-type": "application/json",
          method: 'get',
        }).then(res => {
          if (res.data.status == 1) {
            const displayModelParamList = res.data.result;
            let num = 0;
            for (let i = 0; i < this.dataConfig.dataConfigAllList.length; i++) {
              if (this.dataConfig.dataConfigAllList[i].type == 1) {
                let tableItem = {
                  sortNum: this.dataConfig.sortNum + (num + 1),
                  id: this.dataConfig.dataConfigAllList[i].id,
                  modelId: this.dataConfig.dataConfigAllList[i].modelId,
                  num: this.dataConfig.dataConfigAllList[i].num,
                  type: this.dataConfig.dataConfigAllList[i].type,
                  target: this.dataConfig.dataConfigAllList[i].target,
                  name: this.dataConfig.dataConfigAllList[i].name,
                  minValue: this.dataConfig.dataConfigAllList[i].minValue,
                  maxValue: this.dataConfig.dataConfigAllList[i].maxValue,
                  value: this.dataConfig.dataConfigAllList[i].value,
                  typeName: this.dataConfig.dataConfigAllList[i].type == 1 ? '输入参数' : '输出参数',
                  displayName: '未展示'
                };
                for (let j = 0; j < displayModelParamList.length; j++) {
                  if (tableItem.id == displayModelParamList[j].id) {
                    tableItem.displayName = '展示';
                    break;
                  }
                }

                num++;
                this.dataConfig.dataConfigList.push(tableItem);

              }
            }

            //模拟分页
            this._selectDataConfigByPaging();

          } else {
            this.$message({message: res.data.msg, type: 'error'});

            this.dataConfig.gridLoading = false;
          }
        })
      },
      //前端分页
      _selectDataConfigByPaging() {
        this.dataConfig.dataConfigPageList = this.dataConfig.dataConfigList.filter((item, index) =>
          index < this.dataConfig.pagination.page_index * this.dataConfig.pagination.page_size && index >= this.dataConfig.pagination.page_size * (this.dataConfig.pagination.page_index - 1)
        )
        this.dataConfig.pagination.total = this.dataConfig.dataConfigList.length;

        this.dataConfig.gridLoading = false;
      },
      _handleSelection(selection, row) {
        // 表单绑定的数据
        this.dataConfig.dataConfigPageList.forEach((item, i) => {
          if (item.id == row.id) {
            if (this.numbers.indexOf(i) == -1) {
              this.numbers.push(i);
            } else {
              this.numbers.splice(this.numbers.indexOf(i), 1);
            }
          }
        });
      },
      _handleSelectionAll(selection) {
        this.multipleSelection = selection;
        this.numbers = [];
        if (this.multipleSelection.length != 0) {
          for (let i = 0; i < this.dataConfig.dataConfigPageList.length; i++) {
            this.numbers.push(i);
          }
        }
      },
      _handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      _clickRow(row) {
        this.$refs.multipleTable.toggleRowSelection(row, true);

        this.dataConfig.dataConfigPageList.forEach((r, i) => {
          if (r.id == row.id) {
            if (this.numbers.indexOf(i) == -1) {
              this.numbers.push(i);
            } else {
              this.numbers.splice(this.numbers.indexOf(i), 1);
              this.$refs.multipleTable.toggleRowSelection(row, false);
            }
          }
        });
      },
      // 每页多少条切换
      _handleSizeChange(page_size) {
        this.dataConfig.pagination.page_size = page_size
        this._selectDataConfigByPaging()
      },
      // 上下分页
      _handleCurrentChange(page) {
        this.dataConfig.pagination.page_index = page;
        this._selectDataConfigByPaging()
      },
      //添加配置项
      _handleUpdateModelParamDisplay() {
        let ids = [];

        if (this.multipleSelection.length == 0) {
          this.$message({message: '请至少选择一条配置项', type: 'warning'});
          return;
        }

        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id);
        }

        this.$http({
          url: '/api/api/modelParam/updateModelParamDisplay?modelId=' + this.multipleSelection[0].modelId + '&ids='+ ids +'',
          "content-type": "application/json",
          method: 'put',
          /*headers: {Authorization: token},*/
        }).then(res => {
          if (res.data.status == 1) {
            this.$message({message: '操作成功', type: 'success'});

            this._selectDataConfig(this.multipleSelection[0].modelId);
          } else {
            this.$message({message: '系统异常,请联系管理员', type: 'error'});
          }
        })
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
</style>
