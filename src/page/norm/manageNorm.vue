<!--管理指标页面-->
<template>
  <div>
    <div class="orgTree" :style="orgTreeStyle">
      <viewOrgCom ref="viewOrgComRef"
                  @_handleOnClickOrg="_handleOnClickOrg(arguments)"></viewOrgCom>
    </div>
    <div class="contentDiv" :style="contentDivStyle">
      <div
        style="border: 1px solid; border-top-style: none; border-left-style: none; border-right-style: none; border-bottom-color: darkgrey;">
        <h3 style="margin-left: 2%">指标管理</h3>
      </div>
      <div style="margin-left: 5px; margin-top: 15px">
        <el-tabs v-model="activeName">
          <el-tab-pane label="输 入" name="first">
            <el-form
              :inline="true"
              class="demo-form-inline search-form">

              <el-form-item>
                <el-button type="primary" size="small" @click="_preInsertInputNorm">添加</el-button>
                <el-button type="primary" size="small" @click="_preUpdateInputNorm">修改</el-button>

              </el-form-item>
            </el-form>
            <div class="table_container">
              <el-table
                v-loading="inputNorm.gridLoading"
                :data="inputNorm.inputNormPageList"
                :style="inputNorm.gridTableStyle"
                :height="inputNorm.gridTableStyle.height"
                align='center'
                highlight-current-row
                @row-click="_clickInputNormRow"
              >
                <el-table-column
                  prop="name"
                  label="参数名称"
                  align='left'
                  min-width="300"
                >
                </el-table-column>
                <el-table-column
                  prop="upperLimit"
                  label="上限"
                  align='left'
                  width="300px"
                >
                </el-table-column>
                <el-table-column
                  prop="lowerLimit"
                  label="下限"
                  align='left'
                  width="300px"
                >
                </el-table-column>
              </el-table>
              <el-row>
                <el-col :span="24">
                  <div class="pagination">
                    <el-pagination
                      :page-sizes="inputNorm.pagination.page_sizes"
                      :page-size="inputNorm.pagination.page_size"
                      :layout="inputNorm.pagination.layout"
                      :total="inputNorm.pagination.total"
                      :current-page='inputNorm.pagination.page_index'
                      @current-change='_handleCurrentChangeInput'
                      @size-change='_handleSizeChangeInput'>
                    </el-pagination>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="输 出" name="second">
            <el-form
              :inline="true"
              class="demo-form-inline search-form">

              <el-form-item>
                <el-button type="primary" size="small" @click="_preInsertOutNorm">添加</el-button>
                <el-button type="primary" size="small" @click="_preUpdateOutNorm">修改</el-button>

              </el-form-item>
            </el-form>
            <div class="table_container">
              <el-table
                v-loading="outNorm.gridLoading"
                :data="outNorm.outNormPageList"
                :style="outNorm.gridTableStyle"
                :height="outNorm.gridTableStyle.height"
                align='center'
                highlight-current-row
                @row-click="_clickOutNormRow"
              >
                <el-table-column
                  prop="name"
                  label="参数名称"
                  align='left'
                  min-width="300"
                >
                </el-table-column>
                <el-table-column
                  prop="codeName"
                  label="指标名称"
                  align='left'
                  min-width="300"
                >
                </el-table-column>
                <el-table-column
                  prop="upperLimit"
                  label="上限"
                  align='left'
                  width="300px"
                >
                </el-table-column>
                <el-table-column
                  prop="lowerLimit"
                  label="下限"
                  align='left'
                  width="300px"
                >
                </el-table-column>
              </el-table>
              <el-row>
                <el-col :span="24">
                  <div class="pagination">
                    <el-pagination
                      :page-sizes="outNorm.pagination.page_sizes"
                      :page-size="outNorm.pagination.page_size"
                      :layout="outNorm.pagination.layout"
                      :total="outNorm.pagination.total"
                      :current-page='outNorm.pagination.page_index'
                      @current-change='_handleCurrentChangeOut'
                      @size-change='_handleSizeChangeOut'>
                    </el-pagination>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!--添加输入参数-->
    <el-dialog
      :title="insertInputNormDialog.title"
      :visible.sync="insertInputNormDialog.show"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :modal-append-to-body="false"
      :modal="false"
      :style="insertInputNormDialog.style"
      :width="insertInputNormDialog.width"
      @close="closeInsertInputNormDialog"
    >
      <template>
        <insertInputNormCom ref="insertInputNormRef" v-if="insertInputNormDialog.dialogVisible"
                            @insertInputNormListeners="_completeInsertInputNorm"
                            @closeInsertInputNormDialog="closeInsertInputNormDialog()"></insertInputNormCom>
      </template>
    </el-dialog>

    <!--修改输入参数-->
    <el-dialog
      :title="updateInputNormDialog.title"
      :visible.sync="updateInputNormDialog.show"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :modal-append-to-body="false"
      :modal="false"
      :style="updateInputNormDialog.style"
      :width="updateInputNormDialog.width"
      @close="closeUpdateInputNormDialog"
    >
      <template>
        <updateInputNormCom ref="updateInputNormRef" v-if="updateInputNormDialog.dialogVisible"
                            @updateInputNormListeners="_completeUpdateInputNorm"
                            @closeUpdateInputNormDialog="closeUpdateInputNormDialog()"></updateInputNormCom>
      </template>
    </el-dialog>

    <!--添加输入参数-->
    <el-dialog
      :title="insertOutNormDialog.title"
      :visible.sync="insertOutNormDialog.show"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :modal-append-to-body="false"
      :modal="false"
      :style="insertOutNormDialog.style"
      :width="insertOutNormDialog.width"
      @close="closeInsertOutNormDialog"
    >
      <template>
        <insertOutNormCom ref="insertOutNormRef" v-if="insertOutNormDialog.dialogVisible"
                            @insertOutNormListeners="_completeInsertOutNorm"
                            @closeInsertOutNormDialog="closeInsertOutNormDialog()"></insertOutNormCom>
      </template>
    </el-dialog>

    <!--修改输入参数-->
    <el-dialog
      :title="updateOutNormDialog.title"
      :visible.sync="updateOutNormDialog.show"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :modal-append-to-body="false"
      :modal="false"
      :style="updateOutNormDialog.style"
      :width="updateOutNormDialog.width"
      @close="closeUpdateOutNormDialog"
    >
      <template>
        <updateOutNormCom ref="updateOutNormRef" v-if="updateOutNormDialog.dialogVisible"
                            @updateOutNormListeners="_completeUpdateOutNorm"
                            @closeUpdateOutNormDialog="closeUpdateOutNormDialog()"></updateOutNormCom>
      </template>
    </el-dialog>

  </div>
</template>

<script>
import viewOrgCom from "../org/viewOrg.vue";
import insertInputNormCom from "./preInsertInputNorm.vue";
import updateInputNormCom from "./preUpdateInputNorm.vue";
import insertOutNormCom from "./preInsertOutNorm.vue";
import updateOutNormCom from "./preUpdateOutNorm.vue";

export default {
  name: "manageNorm",
  components: {viewOrgCom, insertInputNormCom, updateInputNormCom, insertOutNormCom, updateOutNormCom},
  data () {
    return {
      orgTreeStyle: {
        height: ''
      },
      contentDivStyle: {
        height: ''
      },
      activeName: 'first',
      inputNorm: {
        sortNum: 0,
        gridLoading: false,
        inputNormAllList: [],
        inputNormPageList: [],
        inputNormList: [],
        gridTableStyle: {
          width: '100%',
          height: window.innerHeight - 320 + 'px'
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
      outNorm: {
        sortNum: 0,
        gridLoading: false,
        outNormAllList: [],
        outNormPageList: [],
        outNormList: [],
        gridTableStyle: {
          width: '100%',
          height: window.innerHeight - 320 + 'px'
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
      insertInputNormDialog: {
        show: false,
        title: '新增',
        insertInputNormDialogLoading: false,
        dialogVisible: true,
        formLabelWidth: '120px',
        width: '500px'
      },
      updateInputNormDialog: {
        show: false,
        title: '修改',
        updateInputNormDialogLoading: false,
        dialogVisible: true,
        formLabelWidth: '120px',
        width: '500px'
      },
      insertOutNormDialog: {
        show: false,
        title: '新增',
        insertOutNormDialogLoading: false,
        dialogVisible: true,
        formLabelWidth: '120px',
        width: '500px'
      },
      updateOutNormDialog: {
        show: false,
        title: '修改',
        updateOutNormDialogLoading: false,
        dialogVisible: true,
        formLabelWidth: '120px',
        width: '500px'
      },
    }
  },
  created () {
    this._initNorm();
    this.$nextTick(_ => {
      this.$refs.viewOrgComRef._getUserRoleOrgTree();
    })
  },
  methods: {
    _initNorm () {
      this.orgTreeStyle.height = window.innerHeight - 110 + 'px'
      this.contentDivStyle.height = window.innerHeight - 110 + 'px'
    },
    _handleOnClickOrg (args) {
      const orgLevel = args[2];
      if (orgLevel == 5) {
        this._selectNorm(args[1], args[3]);
      }
    },
    async _selectNorm (ogId, modelType) {
      this.inputNorm.gridLoading = true;
      this.inputNorm.inputNormAllList = [];
      this.inputNorm.inputNormPageList = [];
      this.inputNorm.inputNormList = [];
      this.inputNorm.selectedDate = {};
      this.outNorm.gridLoading = true;
      this.outNorm.outNormAllList = [];
      this.outNorm.outNormPageList = [];
      this.outNorm.outNormList = [];
      this.outNorm.selectedDate = {};

      //查询所有指标,并分类是输入指标和输出指标
      if (modelType == '1') {
        await this._getNormListByModelTypeOne(ogId);
        await this._getInputFeaturesTargetByModelTypeOne(ogId);
        await this._getOutFeaturesTargetByModelTypeOne(ogId);
      } else if (modelType == '2') {
        this.$message({message: '模型类型为2暂时有问题....', type: 'warning'});
      }
      else if (modelType == '3') {
        await this._getNormList(ogId);
        await this._getInputFeaturesTarget(ogId);
        await this._getOutFeaturesTarget(ogId);
      } else {
        this.$message({message: '模型类型未知请联系管理员....', type: 'warning'});
      }

      this.inputNorm.gridLoading = false;
      this.outNorm.gridLoading = false;
    },
    async _getNormListByModelTypeOne (ogId) {
      await this.$http({
        url: '/api/api/modelParam/getModelParamList?modelId=' + ogId + '',
        "content-type": "application/json",
        method: 'get',
        /*headers: {Authorization: token},*/
      }).then(res => {
        if (res.data.status == 1) {
          const normList = res.data.result;
          normList.forEach((item, index) => {
            if (item.type == 1) {
              this.inputNorm.inputNormAllList.push(item);
            } else if (item.type == 2) {
              this.outNorm.outNormAllList.push(item);
            }
          })
        } else {
          this.$message({message: res.data.msg, type: 'error'});
        }
      })
    },
    async _getNormList (ogId) {
      await this.$http({
        url: '/api/api/modelFeatures/getModelFeaturesList?modelId=' + ogId + '',
        "content-type": "application/json",
        method: 'get',
        /*headers: {Authorization: token},*/
      }).then(res => {
        if (res.data.status == 1) {
          const normList = res.data.result;
          normList.forEach((item, index) => {
            if (item.type == 1) {
              this.inputNorm.inputNormAllList.push(item);
            } else if (item.type == 2) {
              this.outNorm.outNormAllList.push(item);
            }
          })
        } else {
          this.$message({message: res.data.msg, type: 'error'});
        }
      })
    },
    async _getInputFeaturesTarget (ogId) {
      await this.$http({
        url: '/api/api/target/getFeaturesTargetList?modelId=' + ogId + '&type=1',
        "content-type": "application/json",
        method: 'get',
      }).then(res => {
        if (res.data.status == 1) {
          const inputFeaturesTargetList = res.data.result;
          for (let i = 0; i < inputFeaturesTargetList.length; i++) {
            for (let j = 0; j < this.inputNorm.inputNormAllList.length; j++) {
              if (inputFeaturesTargetList[i].ownerId == this.inputNorm.inputNormAllList[j].id) {
                let tableItem = {
                  id: inputFeaturesTargetList[i].id,
                  code: inputFeaturesTargetList[i].code,
                  upperLimit: inputFeaturesTargetList[i].upperLimit,
                  lowerLimit: inputFeaturesTargetList[i].lowerLimit,
                  ownerId: inputFeaturesTargetList[i].ownerId,
                  type: inputFeaturesTargetList[i].type,
                  num: inputFeaturesTargetList[i].num,
                  name: this.inputNorm.inputNormAllList[j].name,
                  modelId: this.inputNorm.inputNormAllList[j].modelId,
                };
                this.inputNorm.inputNormList.push(tableItem);
                break;
              }
            }
          }
          //模拟分页
          this._selectInputNormByPaging();

        } else {
          this.$message({message: res.data.msg, type: 'error'});
        }
      })
    },
    async _getInputFeaturesTargetByModelTypeOne (ogId) {
      await this.$http({
        url: '/api/api/target/getParamTargetList?modelId=' + ogId + '&type=1',
        "content-type": "application/json",
        method: 'get',
      }).then(res => {
        if (res.data.status == 1) {
          const inputParamTargetList = res.data.result;
          for (let i = 0; i < inputParamTargetList.length; i++) {
            for (let j = 0; j < this.inputNorm.inputNormAllList.length; j++) {
              if (inputParamTargetList[i].ownerId == this.inputNorm.inputNormAllList[j].id) {
                let tableItem = {
                  id: inputParamTargetList[i].id,
                  code: inputParamTargetList[i].code,
                  upperLimit: inputParamTargetList[i].upperLimit,
                  lowerLimit: inputParamTargetList[i].lowerLimit,
                  ownerId: inputParamTargetList[i].ownerId,
                  type: inputParamTargetList[i].type,
                  num: inputParamTargetList[i].num,
                  name: this.inputNorm.inputNormAllList[j].name,
                  modelId: this.inputNorm.inputNormAllList[j].modelId,
                };
                this.inputNorm.inputNormList.push(tableItem);
                break;
              }
            }
          }

          //模拟分页
          this._selectInputNormByPaging();
        } else {
          this.$message({message: res.data.msg, type: 'error'});
        }
      })
    },
    async _getOutFeaturesTarget (ogId) {
      await this.$http({
        url: '/api/api/target/getFeaturesTargetList?modelId=' + ogId + '&type=2',
        "content-type": "application/json",
        method: 'get',
      }).then(res => {
        if (res.data.status == 1) {
          const outFeaturesTargetList = res.data.result;
          for (let i = 0; i < outFeaturesTargetList.length; i++) {
            for (let j = 0; j < this.outNorm.outNormAllList.length; j++) {
              if (outFeaturesTargetList[i].ownerId == this.outNorm.outNormAllList[j].id) {
                let tableItem = {
                  id: outFeaturesTargetList[i].id,
                  code: outFeaturesTargetList[i].code,
                  upperLimit: outFeaturesTargetList[i].upperLimit,
                  lowerLimit: outFeaturesTargetList[i].lowerLimit,
                  codeName: outFeaturesTargetList[i].code == '001' ? '内控指标' : (outFeaturesTargetList[i].code == '002' ? '执行指标' : ''),
                  ownerId: outFeaturesTargetList[i].ownerId,
                  type: outFeaturesTargetList[i].type,
                  num: outFeaturesTargetList[i].num,
                  name: this.outNorm.outNormAllList[j].name,
                  modelId: this.outNorm.outNormAllList[j].modelId,
                };
                this.outNorm.outNormList.push(tableItem);
                break;
              }
            }
          }

          //模拟分页
          this._selectOutNormByPaging();
        } else {
          this.$message({message: res.data.msg, type: 'error'});
        }
      })
    },
    async _getOutFeaturesTargetByModelTypeOne (ogId) {
      await this.$http({
        url: '/api/api/target/getParamTargetList?modelId=' + ogId + '&type=2',
        "content-type": "application/json",
        method: 'get',
      }).then(res => {
        if (res.data.status == 1) {
          const outParamTargetList = res.data.result;
          for (let i = 0; i < outParamTargetList.length; i++) {
            for (let j = 0; j < this.outNorm.outNormAllList.length; j++) {
              if (outParamTargetList[i].ownerId == this.outNorm.outNormAllList[j].id) {
                let tableItem = {
                  id: outParamTargetList[i].id,
                  code: outParamTargetList[i].code,
                  upperLimit: outParamTargetList[i].upperLimit,
                  lowerLimit: outParamTargetList[i].lowerLimit,
                  codeName: outParamTargetList[i].code == '001' ? '内控指标' : (outParamTargetList[i].code == '002' ? '执行指标' : ''),
                  ownerId: outParamTargetList[i].ownerId,
                  type: outParamTargetList[i].type,
                  num: outParamTargetList[i].num,
                  name: this.outNorm.outNormAllList[j].name,
                  modelId: this.outNorm.outNormAllList[j].modelId,
                };
                this.outNorm.outNormList.push(tableItem);
                break;
              }
            }
          }
          //模拟分页
          this._selectOutNormByPaging();
        } else {
          this.$message({message: res.data.msg, type: 'error'});
        }
      })
    },
    _selectInputNormByPaging () {
      this.inputNorm.inputNormPageList = this.inputNorm.inputNormList.filter((item, index) =>
        index < this.inputNorm.pagination.page_index * this.inputNorm.pagination.page_size && index >= this.inputNorm.pagination.page_size * (this.inputNorm.pagination.page_index - 1)
      );
      this.inputNorm.pagination.total = this.inputNorm.inputNormList.length;
    },
    _selectOutNormByPaging () {
      this.outNorm.outNormPageList = this.outNorm.outNormList.filter((item, index) =>
        index < this.outNorm.pagination.page_index * this.outNorm.pagination.page_size && index >= this.outNorm.pagination.page_size * (this.outNorm.pagination.page_index - 1)
      );
      this.outNorm.pagination.total = this.outNorm.outNormList.length;

      this.outNorm.gridLoading = false;
    },
    _preInsertInputNorm () {
      const node = this.$refs.viewOrgComRef._getCurrentNode();
      if (node == null || node.level != 5) {
        this.$message({message: '请选择最底层模型', type: 'warning'});
        return;
      }

      this.insertInputNormDialog.show = true;
      this.insertInputNormDialog.dialogVisible = true;

      this.$nextTick(_ => {
        this.$refs.insertInputNormRef.typeList = this.inputNorm.inputNormAllList;
        this.$refs.insertInputNormRef.insertInputNormForm.type = node.modelType == '1' ? '1' : '2';
      });
    },
    _preUpdateInputNorm () {
      if (JSON.stringify(this.inputNorm.selectedDate) === '{}') {
        this.$message({message: '请选择一条数据', type: 'warning'});
        return;
      }

      this.updateInputNormDialog.show = true;
      this.updateInputNormDialog.dialogVisible = true;

      this.$nextTick(_ => {
        this.$refs.updateInputNormRef.typeList = this.inputNorm.inputNormAllList;
        this.$refs.updateInputNormRef.updateInputNormForm.id = this.inputNorm.selectedDate.id;
        this.$refs.updateInputNormRef.updateInputNormForm.ownerId = this.inputNorm.selectedDate.ownerId;
        this.$refs.updateInputNormRef.updateInputNormForm.upperLimit = this.inputNorm.selectedDate.upperLimit;
        this.$refs.updateInputNormRef.updateInputNormForm.lowerLimit = this.inputNorm.selectedDate.lowerLimit;
        this.$refs.updateInputNormRef.updateInputNormForm.num = this.inputNorm.selectedDate.num;
      });
    },
    _preInsertOutNorm () {
      const node = this.$refs.viewOrgComRef._getCurrentNode();
      if (node == null || node.level != 5) {
        this.$message({message: '请选择最底层模型', type: 'warning'});
        return;
      }

      this.insertOutNormDialog.show = true;
      this.insertOutNormDialog.dialogVisible = true;

      this.$nextTick(_ => {
        this.$refs.insertOutNormRef.typeList = this.outNorm.outNormAllList;
        this.$refs.insertOutNormRef.insertOutNormForm.type = node.modelType == '1' ? '1' : '2';
      });
    },
    _preUpdateOutNorm () {
      if (JSON.stringify(this.outNorm.selectedDate) === '{}') {
        this.$message({message: '请选择一条数据', type: 'warning'});
        return;
      }

      this.updateOutNormDialog.show = true;
      this.updateOutNormDialog.dialogVisible = true;

      this.$nextTick(_ => {
        this.$refs.updateOutNormRef.typeList = this.outNorm.outNormAllList;
        this.$refs.updateOutNormRef.updateOutNormForm.id = this.outNorm.selectedDate.id;
        this.$refs.updateOutNormRef.updateOutNormForm.ownerId = this.outNorm.selectedDate.ownerId;
        this.$refs.updateOutNormRef.updateOutNormForm.type = this.outNorm.selectedDate.type;
        this.$refs.updateOutNormRef.updateOutNormForm.upperLimit = this.outNorm.selectedDate.upperLimit;
        this.$refs.updateOutNormRef.updateOutNormForm.lowerLimit = this.outNorm.selectedDate.lowerLimit;
        this.$refs.updateOutNormRef.updateOutNormForm.num = this.outNorm.selectedDate.num;
        this.$refs.updateOutNormRef.updateOutNormForm.code = this.outNorm.selectedDate.code;
      });
    },
    _clickInputNormRow (row) {
      this.inputNorm.selectedDate = row;
    },
    _clickOutNormRow (row) {
      this.outNorm.selectedDate = row;
    },
    closeInsertInputNormDialog () {
      this.insertInputNormDialog.dialogVisible = false;
      this.insertInputNormDialog.show = false;
    },
    closeUpdateInputNormDialog () {
      this.updateInputNormDialog.dialogVisible = false;
      this.updateInputNormDialog.show = false;
    },
    _completeInsertInputNorm () {
      const node = this.$refs.viewOrgComRef._getCurrentNode();
      this._selectNorm(node.ogId, node.modelType);
    },
    _completeUpdateInputNorm () {
      const node = this.$refs.viewOrgComRef._getCurrentNode();
      this._selectNorm(node.ogId, node.modelType);
    },
    closeInsertOutNormDialog () {
      this.insertOutNormDialog.dialogVisible = false;
      this.insertOutNormDialog.show = false;
    },
    _completeInsertOutNorm () {
      const node = this.$refs.viewOrgComRef._getCurrentNode();
      this._selectNorm(node.ogId, node.modelType);
    },
    closeUpdateOutNormDialog () {
      this.updateOutNormDialog.dialogVisible = false;
      this.updateOutNormDialog.show = false;
    },
    _completeUpdateOutNorm(){
      const node = this.$refs.viewOrgComRef._getCurrentNode();
      this._selectNorm(node.ogId, node.modelType);
    },
    // 上下分页
    _handleCurrentChangeInput (page) {
      this.inputNorm.pagination.page_index = page;
      this._selectInputNormByPaging()
    }
    ,
    // 每页多少条切换
    _handleSizeChangeInput (page_size) {
      this.inputNorm.pagination.page_size = page_size;
      this._selectInputNormByPaging()
    }
    ,
    // 上下分页
    _handleCurrentChangeOut (page) {
      this.outNorm.pagination.page_index = page;
      this._selectOutNormByPaging()
    }
    ,
    // 每页多少条切换
    _handleSizeChangeOut (page_size) {
      this.outNorm.pagination.page_size = page_size;
      this._selectOutNormByPaging()

    }
  }
}
</script>

<style scoped>

</style>
