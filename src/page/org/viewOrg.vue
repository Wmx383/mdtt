<template>
  <div class="custom-tree-container orgTreeClass" v-loading="loading">
    <el-scrollbar style="height: 100%">
      <el-tree
        :data="data"
        ref="tree"
        node-key="id"
        :default-expanded-keys="[1,6]"
        highlight-current
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
  data () {
    return {
      data: [],
      dataAllList : [],
      featruesData: [],
      defaultProps: {
        children: 'childList',
        label: 'ogName'
      },
      loading: true
    }
  },
  methods: {
    handleNodeClick (data) {
      this.$emit('_handleOnClickOrg', data.id, data.ogId, data.level, data.modelType, data.ogName);
    },
    _getCurrentNode () {
      return this.$refs.tree.getCurrentNode();
    },
    async _getUserRoleOrgTree () {
      await this.$http({
        url: "/api/api/user/getUserRoleOrgTree",
        "content-type": "application/json",
        method: 'get',
        /*headers: {Authorization: token},*/
      }).then(res => {
        if (res.data.status == 1) {
          this.loading = false;
          this.data = res.data.result;
          console.log(this.data);
          this.doDelete(this.data, 0);
        } else {
          //TO-DO 临时先这么写提醒吧 哈哈哈哈
          this.$message({message: res.data.msg, type: 'error'});
        }
      })
    },
    async _selectOrgByUpdate(id){
      await this._getUserRoleOrgTree();
      this._setUserRoleOrgTree(id);
    },
    _setUserRoleOrgTree(id){
      this.$refs.tree.setCurrentKey(id);
      this.handleNodeClick(this.$refs.tree.getCurrentNode());
    },

    doDelete(data, status){
      for(let i = 0; i < data.length; i ++){
        if(data[i].status == status){
          data.splice(i, 1)
        }else{
          if(data[i].childList){
            this.doDelete(data[i].childList, status)
          }
        }
      }
    },


    _getUserRoleOrgTreeByThreeLevel () {
      this.$http({
        url: "/api/api/user/getUserRoleOrgTree",
        "content-type": "application/json",
        method: 'get',
        /*headers: {Authorization: token},*/
      }).then(res => {
        if (res.data.status == 1) {
          this.loading = false;
          this.dataAllList =  res.data.result;
          let dataList = res.data.result;
          this._handelData(dataList);
          this.data = dataList;
        } else {
          this.$message({message: res.data.msg, type: 'error'});
        }
      })
    },
    _getUserRoleOrgTreeByFeatures () {
      this.$http({
        url: "/api/api/user/getUserRoleOrgTree",
        "content-type": "application/json",
        method: 'get',
        /*headers: {Authorization: token},*/
      }).then(res => {
        if (res.data.status == 1) {
          this.loading = false;
          let dataList = res.data.result;
          let forecastFeaturesDataList = [];
          let features = {};
          for (let i = 0; i < dataList.length; i++) {
            features = {
              id: dataList[i].id,
              ogName: dataList[i].ogName,
              parentId: dataList[i].parentId,
              ogId: dataList[i].ogId,
              status: dataList[i].status,
              level: dataList[i].level,
              modelType: dataList[i].modelType,
              modelGroupId: dataList[i].modelGroupId,
              modelGroupName: dataList[i].modelGroupName,
              childList: []
            };
            this._handleForecast(features, dataList[i].childList);
            forecastFeaturesDataList.push(features);
          }

          this.data = forecastFeaturesDataList;
        } else {
          this.$message({message: res.data.msg, type: 'error'});
        }
      })
    },
    _handleForecast (features, dataList) {
      let childDataList = [];
      let childList = {};
      for (let i = 0; i < dataList.length; i++) {
        if (dataList[i].level == 5 ) {
          if(dataList[i].modelType == 3){
            childList = {
              id: dataList[i].id,
              ogName: dataList[i].ogName,
              parentId: dataList[i].parentId,
              ogId: dataList[i].ogId,
              status: dataList[i].status,
              level: dataList[i].level,
              modelType: dataList[i].modelType,
              modelGroupId: dataList[i].modelGroupId,
              modelGroupName: dataList[i].modelGroupName
            };
            childDataList.push(childList);
          }
        }else{
          childList = {
            id: dataList[i].id,
            ogName: dataList[i].ogName,
            parentId: dataList[i].parentId,
            ogId: dataList[i].ogId,
            status: dataList[i].status,
            level: dataList[i].level,
            modelType: dataList[i].modelType,
            modelGroupId: dataList[i].modelGroupId,
            modelGroupName: dataList[i].modelGroupName,
            childList: []
          };
          if(dataList[i].childList.length > 0){
            childDataList.push(childList);
            this._handleForecast(childList, dataList[i].childList);
          }

        }
      }
      features.childList = childDataList;
    },
    _handelData (dataList) {
      for (let i = 0; i < dataList.length; i++) {
        if (dataList[i].level < 3) {
          this._handelData(dataList[i].childList);
        } else if (dataList[i].level == 3) {
          dataList[i].childList = [];
        }
      }
    },
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
    /* background-color: red;*/
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
    overflow-y: hidden;
    /*background-color: #b5b6b9;*/
  }

  .orgTreeClass .el-tree > .el-tree-node {
    min-width: 100%;
    height: 370px;
    font-size: 15px;
    display: inline-block;
    /*background-color: ghostwhite;*/
  }
</style>
