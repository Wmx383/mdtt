<template>
  <div>
    <div class="table_container">
      <el-table
        v-loading="model.gridLoading"
        :data="model.modelPageList"
        :style="model.gridTableStyle"
        :height="model.gridTableStyle.height"
        align='center'
        ref="modelTable"
        highlight-current-row
      >
        <el-table-column
          prop="modelName"
          label="模型名称"
          align='left'
          min-width="400"
        >
        </el-table-column>
      </el-table>
      <el-row>
        <el-col :span="24">
          <div class="pagination">
            <el-pagination
              :page-sizes="model.pagination.page_sizes"
              :page-size="model.pagination.page_size"
              :layout="model.pagination.layout"
              :total="model.pagination.total"
              :current-page='model.pagination.page_index'
              @current-change='_handleCurrentChange'
              @size-change='_handleSizeChange'>
            </el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>
    <footer class="text_right">
      <el-button type="primary" size="small" @click="_closeModelViewDialog">取消</el-button>
      <el-button type="primary" size="small" @click="_closeModelViewDialog">提交</el-button>
    </footer>
  </div>

</template>

<script>
  export default {
    name: "viewModel",
    data() {
      return {
        model: {
          sortNum: 0,
          gridLoading: false,
          modelAllList: [],
          modelPageList: [],
          modelList: [],
          gridTableStyle: {
            width: '100%',
            height: window.innerHeight / 2 - 50 + 'px'
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
      }
    },
    mounted() {
    },
    methods: {
      _selectModel(modelGroupId) {
        this.model.gridLoading = true;

        this.$http({
          url: '/api/api/modelGroup/getModelListByGroupId?modelGroupId='+ modelGroupId +'',
          "content-type": "application/json",
          method: 'get',
        }).then(res => {
          if (res.data.status == 1) {
            const modelList = res.data.result;
            for (let i = 0; i < modelList.length; i++) {
              let tableItem = {
                sortNum: this.model.sortNum + (i + 1),
                id: modelList[i].id,
                modelName: modelList[i].modelName,
                modelId: modelList[i].modelId,
                roomId: modelList[i].roomId,
                systemId: modelList[i].systemId,
                factoryId: modelList[i].factoryId,
                companyId: modelList[i].companyId,
                status: modelList[i].status,
                modelType: modelList[i].modelType,
                dataNumber: modelList[i].dataNumber,
                inputDimension: modelList[i].inputDimension,
                outputDimension: modelList[i].outputDimension
              };

              this.model.modelAllList.push(tableItem);
              this.model.modelList.push(tableItem);

            }

            //模拟分页
            this._selectModelByPaging();

          } else {
            this.$message({message: res.data.msg, type: 'error'});

            this.model.gridLoading = false;
          }
        })
      },
      _closeModelViewDialog(){
        this.$emit('_closeModelViewDialog');
      },
      _selectModelByPaging(){
        this.model.modelPageList = this.model.modelAllList.filter((item, index) =>
          index < this.model.pagination.page_index * this.model.pagination.page_size && index >= this.model.pagination.page_size * (this.model.pagination.page_index - 1)
        );
        this.model.pagination.total = this.model.modelList.length;

        this.model.gridLoading = false;
      },
      // 每页多少条切换
      _handleSizeChange(page_size) {
        this.model.pagination.page_size = page_size;
        this._selectModelGroupByPaging()
      },
      // 上下分页
      _handleCurrentChange(page) {
        this.model.pagination.page_index = page;
        this._selectModelGroupByPaging()
      }
    }
  }
</script>

<style scoped>
  .text_right {
    text-align: right;
  }
</style>
