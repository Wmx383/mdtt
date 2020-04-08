<template>
  <div class="custom-tree-container" v-loading="loading">
    <el-scrollbar style="height: 100%">
      <el-tree
        :data="data"
        default-expand-all
        :props="defaultProps"
        @node-click="handleNodeClick"
        :expand-on-click-node="false"
      >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span><i :class="data.icon"></i> {{node.label}}</span>
      </span>
      </el-tree>
    </el-scrollbar>
  </div>
</template>

<script>
  import * as utils from '../../utils/utils'

  export default {
    name: "viewOrg",
    data() {
      return {
        data: [],
        defaultProps: {
          children: 'childList',
          label: 'ogName'
        },
        loading : true
      }
    },
    methods: {
      handleNodeClick(data) {
        this.$emit('_handleOnClickOrg', data.id, data.ogId, data.level);
      },
      _getUserRoleOrgTree() {
        this.$http({
          url: "/api/api/user/getUserRoleOrgTree",
          "content-type": "application/json",
          method: 'get',
          /*headers: {Authorization: token},*/
        }).then(res => {
          if (res.data.status == 1) {
            this.loading = false;
            this.data = res.data.result;
          } else {
            //TO-DO 临时先这么写提醒吧 哈哈哈哈
            this.loading = false;
            alert(res.data.msg);
            this.$router.push({path: "/"});
          }
        })
      }
    },
    mounted() {
      this._getUserRoleOrgTree();
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
    padding-right: 8px;
  }

</style>

<style>
  .el-tree-node:focus > .el-tree-node__content {
    /*background: -moz-linear-gradient(right,#FF9933,white);*/
    background-color: #ffd30b !important;
    color: white;
  }

  .el-scrollbar .el-scrollbar__wrap {
    overflow-x: hidden;
    overflow-y: visible;
  }

  .el-tree > .el-tree-node {
    min-width: 100%;
    display: inline-block;
  }
</style>
