<!--数据管理页面-->
<template>
  <div class="featuresBrand">
    <div class="orgTree" :style="orgTreeStyle">
      <viewOrgCom ref="viewOrgComRef"
                  @_handleOnClickOrg="_handleOnClickOrg(arguments)"></viewOrgCom>
    </div>
    <div class="contentDiv" :style="contentDivStyle">

      <div
        style="border: 1px solid; border-top-style: none; border-left-style: none; border-right-style: none; border-bottom-color: darkgrey;">
        <h3 style="margin-left: 2%">{{featuresBrand.title}}</h3>
      </div>

      <div style="margin-left: 5px; margin-top: 5px">
        <el-form
          :inline="true"
          class="demo-form-inline search-form">

          <el-form-item>
            <el-button type="primary" size="small" @click="_preUpdateFeaturesBrand">修 改</el-button>
            <el-button type="primary" size="small" @click="_clearFeaturesBrand">置 空</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="table_container">
        <el-table
          v-loading="featuresBrand.gridLoading"
          :data="featuresBrand.featuresBrandPageList"
          :style="featuresBrand.gridTableStyle"
          :height="featuresBrand.gridTableStyle.height"
          align='center'
          ref="multipleTable"
          highlight-current-row
          @row-click="_clickRow"
        >
          <el-table-column
            prop="name"
            label="特征值"
            align='left'
            min-width="300"
          >
          </el-table-column>
          <el-table-column
            prop="brandName"
            label="牌号"
            align='left'
            min-width="300"
          >
          </el-table-column>
          <el-table-column
            prop="brandRange"
            label="范围"
            align='left'
            min-width="300"
          >
          </el-table-column>
        </el-table>
        <el-row>
          <el-col :span="24">
            <div class="pagination">
              <el-pagination
                :page-sizes="featuresBrand.pagination.page_sizes"
                :page-size="featuresBrand.pagination.page_size"
                :layout="featuresBrand.pagination.layout"
                :total="featuresBrand.pagination.total"
                :current-page='featuresBrand.pagination.page_index'
                @current-change='_handleCurrentChange'
                @size-change='_handleSizeChange'>
              </el-pagination>
            </div>
          </el-col>
        </el-row>
      </div>


    </div>
    <!--修改-->
    <el-dialog
      :title="updateFeaturesBrandDialog.title"
      :visible.sync="updateFeaturesBrandDialog.show"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :modal-append-to-body="false"
      :modal="false"
      :style="updateFeaturesBrandDialog.style"
      :width="updateFeaturesBrandDialog.width"
      @close="closeUpdateFeaturesBrandDialog"
    >
      <template>
        <updateFeaturesBrandCom ref="updateFeaturesBrandRef" v-if="updateFeaturesBrandDialog.dialogVisible"
                             @updateFeaturesBrandListeners="_completeUpdateFeaturesBrand"
                             @closeUpdateFeaturesBrandDialog="closeUpdateFeaturesBrandDialog()"></updateFeaturesBrandCom>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import viewOrgCom from "../org/viewOrg.vue";
import updateFeaturesBrandCom from './preUpdateFeaturesBrand.vue';

export default {
  name: "manageFeaturesBrand",
  components: {viewOrgCom, updateFeaturesBrandCom},
  data () {
    return {
      orgTreeStyle: {
        height: ''
      },
      contentDivStyle: {
        height: ''
      },
      idFlag: false,
      featuresBrand: {
        title: '特征牌号管理',
        sortNum: 0,
        gridLoading: false,
        featuresBrandAllList: [],
        featuresBrandPageList: [],
        featuresBrandList: [],
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
        },
        selectedDate: {},
      },
      updateFeaturesBrandDialog: {
        show: false,
        title: '修改',
        insertFeaturesBrandDialogLoading: false,
        dialogVisible: true,
        formLabelWidth: '120px',
        width: '500px'
      }
    }
  },
  created () {
    this._initFeaturesBrand();
    this.$nextTick(_ => {
      this.$refs.viewOrgComRef._getUserRoleOrgTreeByFeatures();
    })
  },
  methods: {
    _initFeaturesBrand () {
      this.orgTreeStyle.height = window.innerHeight - 110 + 'px'
      this.contentDivStyle.height = window.innerHeight - 110 + 'px'
    },
    async _handleOnClickOrg (args) {
      const ogId = args[1];
      const orgLevel = args[2];
      const ogName = args[4];
      this._refresh();
      if (orgLevel == 5) {
        this._setTitle(ogName);
        this._selectFeaturesBrand(ogId);
      }
    },
    _setTitle (ogName) {
      this.featuresBrand.title = ogName;
    },
    _refresh () {
      this.featuresBrand.featuresBrandList = [];
      this.featuresBrand.title = '特征牌号管理';
      this.featuresBrand.selectedDate = {};
    },
    async _selectFeaturesBrand (ogId) {
      this.featuresBrand.featuresBrandList = [];
      this.featuresBrand.featuresBrandAllList = [];
      this.featuresBrand.featuresBrandPageList = [];
      this.featuresBrand.selectedDate = {};
      await this.$http({
        url: '/api/api/modelFeatures/getModelFeaturesList?modelId=' + ogId + '',
        "content-type": "application/json",
        method: 'get',
      }).then(res => {
        if (res.data.status == 1) {
          const resultList = res.data.result;
          let list = [];
          for (let i = 0; i < resultList.length; i++) {
            if (resultList[i].type == '2') {
              let tableItem = {
                id : resultList[i].id,
                name : resultList[i].name,
                //brandName : resultList[i].brandName == null ? '无' : resultList[i].brandName,
                //brandRange : resultList[i].brandRange == null ? '无' : resultList[i].brandRange,
                brandName : resultList[i].brandName,
                brandRange : resultList[i].brandRange
              };
              list.push(tableItem);
            }
          }
          this.featuresBrand.featuresBrandList = list;
          //模拟分页
          this._selectFeaturesBrandByPaging();

          //模拟分页
          this._selectFeaturesBrandByPaging();

        } else {
          this.$message({message: res.data.msg, type: 'error'});

          this.featuresBrand.gridLoading = false;
        }
      })
    },
    _selectFeaturesBrandByPaging () {
      this.featuresBrand.featuresBrandPageList = this.featuresBrand.featuresBrandList.filter((item, index) =>
        index < this.featuresBrand.pagination.page_index * this.featuresBrand.pagination.page_size && index >= this.featuresBrand.pagination.page_size * (this.featuresBrand.pagination.page_index - 1)
      )
      this.featuresBrand.pagination.total = this.featuresBrand.featuresBrandList.length;

      this.featuresBrand.gridLoading = false;
    },
    _preUpdateFeaturesBrand () {
      if (JSON.stringify(this.featuresBrand.selectedDate) === '{}') {
        this.$message({message: '请选择一条数据...', type: 'warning'});
        return;
      }
      this.updateFeaturesBrandDialog.show = true;
      this.updateFeaturesBrandDialog.dialogVisible = true;

      this.$nextTick(_ => {
        this.$refs.updateFeaturesBrandRef.updateFeaturesBrandForm.id = this.featuresBrand.selectedDate.id;
        this.$refs.updateFeaturesBrandRef.updateFeaturesBrandForm.brandName = this.featuresBrand.selectedDate.brandName;
        this.$refs.updateFeaturesBrandRef.updateFeaturesBrandForm.brandRange = this.featuresBrand.selectedDate.brandRange;
      })
    },
    _clearFeaturesBrand () {
      if (JSON.stringify(this.featuresBrand.selectedDate) === '{}') {
        this.$message({message: '请选择一条数据...', type: 'warning'});
        return;
      }

      this.$confirm('是否置空', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let that = this;
        this.$http({
          url: '/api/api/modelFeatures/updateOutputFeaturesBrandName',
          "content-type": "application/json",
          method: 'put',
          data: {
            id : this.featuresBrand.selectedDate.id,
            brandName: '',
            brandRange: ''
          }
        }).then(res => {
          if (res.data.status == 1) {
            this.$message({message: '操作成功', type: 'success'});
            this._selectFeaturesBrand(this.$refs.viewOrgComRef._getCurrentNode().ogId);

          } else {
            this.$message({message: res.data.msg, type: 'error'});
          }
        })
      });
    },
    _handleSizeChange (page_size) {
      this.featuresBrand.pagination.page_size = page_size
      this._selectFeaturesBrandByPaging()
    },
    // 上下分页
    _handleCurrentChange (page) {
      this.featuresBrand.pagination.page_index = page;
      this._selectFeaturesBrandByPaging()
    },
    _clickRow (row) {
      this.featuresBrand.selectedDate = row;
    },
    closeUpdateFeaturesBrandDialog () {
      this.updateFeaturesBrandDialog.dialogVisible = false;
      this.updateFeaturesBrandDialog.show = false;
    },
    _completeUpdateFeaturesBrand(){
      this._selectFeaturesBrand(this.$refs.viewOrgComRef._getCurrentNode().ogId);
    },
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

