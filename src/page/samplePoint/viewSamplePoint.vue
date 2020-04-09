<template>
  <div class="custom-tree-container samplePointTreeClass" v-loading="loading">
    <el-scrollbar style="height: 100%">
      <el-tree ref="samplePointTree" :data="data" :props="defaultProps" @node-click="handleNodeClick" node-key="id" highlight-current></el-tree>
    </el-scrollbar>
  </div>
</template>

<script>
  export default {
    name: "viewSamplePoint",
    data() {
      return {
        data: [],
        defaultProps: {
          label: 'sampleName'
        },
        loading: true
      }
    },
    methods: {
      handleNodeClick(data) {
        this.$emit('_handleOnClickSamplePoint', data.id, data.sourceName, data.sampleName, data.modelId, data.status);
      },
      async _selectSamplePoint() {
        await this.$http({
          url: "/api/api/samplePoint/getSamplePointList",
          "content-type": "application/json",
          method: 'get',
          /*headers: {Authorization: token},*/
        }).then(res => {
          if (res.data.status == 1) {
            this.loading = false;
            this.data = res.data.result;
          } else {
            this.loading = false;
            this.$message({message: res.data.msg, type: 'error'});
          }
        })
      },
      async _selectSamplePointByUpdate(id){
        await this._selectSamplePoint();
        this._setSamplePoint(id);
      },
      _setSamplePoint(id){
        this.$refs.samplePointTree.setCurrentKey(id);
        this.handleNodeClick(this.$refs.samplePointTree.getCurrentNode());
      },
    },
    mounted() {
      this._selectSamplePoint();
    }

  }
</script>

<style lang="less" scoped>
  .custom-tree-container {
    height: calc(~"100%");
    flex: 1;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-block: 0px;
    /*padding-right: 8px;*/
    background-color: ghostwhite;
  }

</style>

<style>
  /*.el-tree-node:focus > .el-tree-node__content {
    !*background: -moz-linear-gradient(right,#FF9933, #42b983);*!
    background-color: #ffd30b !important;
    color: white;
  }*/

  .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background-color: #ffd30b;
  }

  .el-scrollbar .el-scrollbar__wrap {
    overflow-x: hidden;
    overflow-y: visible;
    /*background-color: #b5b6b9;*/
  }

  .samplePointTreeClass .el-tree > .el-tree-node {
    min-width: 100%;
    font-size: 15px;
    display: inline-block;
    background-color: ghostwhite;
  }
</style>
