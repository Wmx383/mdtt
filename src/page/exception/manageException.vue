<!--异常管理页面-->
<template>
  <div>
    <div class="orgTree" :style="orgTreeStyle">
      <viewOrgCom ref="viewOrgComRef"
                  @_handleOnClickOrg="_handleOnClickOrg(arguments)"></viewOrgCom>
    </div>
    <div class="contentDiv" :style="contentDivStyle">
      <el-row class="echartRowClass">
        <el-col :span="12" >
          <div class="echartsColClass ">
            <div
              style="border: 1px solid; border-top-style: none; border-left-style: none; border-right-style: none; border-bottom-color: darkgrey;">
              <h3 style="margin-left: 5px">当前异常处理情况</h3>
            </div>
          </div>
        </el-col>
        <el-col :span="12" class="expetionInfo">
          <div class="echartsColClass">
            <div
              style="border: 1px solid; border-top-style: none; border-left-style: none; border-right-style: none; border-bottom-color: darkgrey;">
              <h3 style="margin-left: 5px">异常详情</h3>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="rowTableClass">乌拉拉小魔仙变身</div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import viewOrgCom from "../org/viewOrg.vue";

export default {
  name: "manageException",
  components: {viewOrgCom},
  data () {
    return {
      idFlag: false,
      orgTreeStyle: {
        height: ''
      },
      contentDivStyle: {
        height: ''
      },
    }
  },
  created () {
    this._initException();
    this.$nextTick(_ => {
      this.$refs.viewOrgComRef._getUserRoleOrgTreeByException();
    })
  },
  methods: {
    _initException () {
      this.orgTreeStyle.height = window.innerHeight - 110 + 'px'
      this.contentDivStyle.height = window.innerHeight - 110 + 'px'
    },
    _handleOnClickOrg (args) {
      /*const orgLevel = args[2];
      if (orgLevel == 5) {
        this._selectDataConfig(args[1]);
      }*/
    },
  }
}
</script>

<style lang="less" scoped>
  .echartsColClass {
    width: 100%;
    height: calc(~"50vh - 48px");
    min-width: 540px;
  }

  .rowTableClass {
    width: 100%;
    background-color: blue;
    height: calc(~"50vh - 78px");
  }

  .expetionInfo{
    border-left: 2px solid #ccc;
  }
</style>
