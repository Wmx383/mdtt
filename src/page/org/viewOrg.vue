<template>
  <div class="custom-tree-container">
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
  export default {
    name: "viewOrg",
    data() {
      return {
        data: [{
          "id": 0,
          "ogName": "公司1",
          'icon': 'el-icon-mobile',
          "parentId": -1,
          "ogId": "10",
          "status": 1,
          "level": 1,
          "childList": [{
            "id": 2,
            'icon': 'el-icon-mobile',
            "ogName": "工厂2",
            "parentId": 0,
            "ogId": "1002",
            "status": 1,
            "level": 2,
            "childList": [{
              "id": 9,
              "ogName": "车间3",
              'icon': 'el-icon-mobile',
              "parentId": 2,
              "ogId": "100201",
              "status": 1,
              "level": 3,
              "childList": [{
                "id": 10,
                "ogName": "系统3",
                'icon': 'el-icon-mobile',
                "parentId": 9,
                "ogId": "10020101",
                "status": 1,
                "level": 4,
                "childList": [{
                  "id": 11,
                  "ogName": "模型3",
                  'icon': 'el-icon-mobile',
                  "parentId": 10,
                  "ogId": "1002010101",
                  "status": 1,
                  "level": 5,
                  "modelType": 3
                }]
              }, {
                "id": 17,
                "ogName": "系统test1",
                'icon': 'el-icon-mobile',
                "parentId": 9,
                "ogId": "02",
                "status": 0,
                "level": 4
              }]
            }]
          }, {
            "id": 1,
            "ogName": "工厂1",
            'icon': 'el-icon-mobile',
            "parentId": 0,
            "ogId": "1001",
            "status": 1,
            "level": 2,
            "childList": [{
              "id": 3,
              "ogName": "车间1",
              'icon': 'el-icon-mobile',
              "parentId": 1,
              "ogId": "100101",
              "status": 1,
              "level": 3,
              "childList": [{
                "id": 7,
                "ogName": "系统1",
                'icon': 'el-icon-mobile',
                "parentId": 3,
                "ogId": "10010101",
                "status": 1,
                "level": 4,
                "childList": [{
                  "id": 5,
                  "ogName": "模型1",
                  'icon': 'el-icon-mobile',
                  "parentId": 7,
                  "ogId": "1001010101",
                  "status": 1,
                  "level": 5,
                  "modelType": 1,
                  "modelGroupId": 999,
                  "modelGroupName": "组1"
                }, {
                  "id": 1013,
                  "ogName": "模型4",
                  "parentId": 7,
                  "ogId": "1001010102",
                  'icon': 'el-icon-mobile',
                  "status": 1,
                  "level": 5,
                  "modelType": 1
                }, {
                  "id": 1012,
                  "ogName": "模型4",
                  "parentId": 7,
                  "ogId": "1001010102",
                  'icon': 'el-icon-mobile',
                  "status": 1,
                  "level": 5,
                  "modelType": 1
                }, {
                  "id": 1011,
                  "ogName": "模型4",
                  "parentId": 7,
                  "ogId": "1001010102",
                  'icon': 'el-icon-mobile',
                  "status": 1,
                  "level": 5,
                  "modelType": 1
                }, {
                  "id": 1009,
                  "ogName": "模型4",
                  "parentId": 7,
                  "ogId": "1001010102",
                  'icon': 'el-icon-mobile',
                  "status": 1,
                  "level": 5,
                  "modelType": 1
                }, {
                  "id": 1008,
                  "ogName": "模型4",
                  "parentId": 7,
                  "ogId": "1001010102",
                  'icon': 'el-icon-mobile',
                  "status": 1,
                  "level": 5,
                  "modelType": 1
                }, {
                  "id": 1007,
                  "ogName": "模型4",
                  "parentId": 7,
                  "ogId": "1001010102",
                  'icon': 'el-icon-mobile',
                  "status": 1,
                  "level": 5,
                  "modelType": 1
                }, {
                  "id": 1006,
                  "ogName": "模型4",
                  "parentId": 7,
                  "ogId": "1001010102",
                  'icon': 'el-icon-mobile',
                  "status": 1,
                  "level": 5,
                  "modelType": 1
                }, {
                  "id": 1005,
                  "ogName": "模型4",
                  "parentId": 7,
                  "ogId": "1001010102",
                  'icon': 'el-icon-mobile',
                  "status": 1,
                  "level": 5,
                  "modelType": 1
                }, {
                  "id": 1004,
                  "ogName": "模型4",
                  "parentId": 7,
                  "ogId": "1001010102",
                  'icon': 'el-icon-mobile',
                  "status": 1,
                  "level": 5,
                  "modelType": 1
                }, {
                  "id": 1003,
                  "ogName": "模型4",
                  "parentId": 7,
                  "ogId": "1001010102",
                  'icon': 'el-icon-mobile',
                  "status": 1,
                  "level": 5,
                  "modelType": 1
                }, {
                  "id": 1002,
                  "ogName": "模型4",
                  "parentId": 7,
                  "ogId": "1001010102",
                  'icon': 'el-icon-mobile',
                  "status": 1,
                  "level": 5,
                  "modelType": 1
                }, {
                  "id": 1001,
                  "ogName": "模型4",
                  "parentId": 7,
                  "ogId": "1001010102",
                  'icon': 'el-icon-mobile',
                  "status": 1,
                  "level": 5,
                  "modelType": 1
                }, {
                  "id": 1000,
                  "ogName": "模型4",
                  "parentId": 7,
                  "ogId": "1001010102",
                  'icon': 'el-icon-mobile',
                  "status": 1,
                  "level": 5,
                  "modelType": 1
                }, {
                  "id": 999,
                  "ogName": "模型4",
                  "parentId": 7,
                  "ogId": "1001010102",
                  'icon': 'el-icon-mobile',
                  "status": 1,
                  "level": 5,
                  "modelType": 1
                }, {
                  "id": 998,
                  "ogName": "模型4",
                  "parentId": 7,
                  "ogId": "1001010102",
                  'icon': 'el-icon-mobile',
                  "status": 1,
                  "level": 5,
                  "modelType": 1
                }, {
                  "id": 997,
                  "ogName": "模型4",
                  "parentId": 7,
                  "ogId": "1001010102",
                  'icon': 'el-icon-mobile',
                  "status": 1,
                  "level": 5,
                  "modelType": 1
                }, {
                  "id": 996,
                  "ogName": "模型4",
                  "parentId": 7,
                  "ogId": "1001010102",
                  'icon': 'el-icon-mobile',
                  "status": 1,
                  "level": 5,
                  "modelType": 1
                }, {
                  "id": 995,
                  "ogName": "模型4",
                  "parentId": 7,
                  "ogId": "1001010102",
                  'icon': 'el-icon-mobile',
                  "status": 1,
                  "level": 5,
                  "modelType": 1
                }, {
                  "id": 994,
                  "ogName": "模型4",
                  "parentId": 7,
                  "ogId": "1001010102",
                  'icon': 'el-icon-mobile',
                  "status": 1,
                  "level": 5,
                  "modelType": 1
                }, {
                  "id": 993,
                  "ogName": "模型4",
                  "parentId": 7,
                  "ogId": "1001010102",
                  'icon': 'el-icon-mobile',
                  "status": 1,
                  "level": 5,
                  "modelType": 1
                }, {
                  "id": 992,
                  "ogName": "模型4",
                  "parentId": 7,
                  "ogId": "1001010102",
                  'icon': 'el-icon-mobile',
                  "status": 1,
                  "level": 5,
                  "modelType": 1
                }, {
                  "id": 991,
                  "ogName": "模型4",
                  "parentId": 7,
                  "ogId": "1001010102",
                  'icon': 'el-icon-mobile',
                  "status": 1,
                  "level": 5,
                  "modelType": 1
                }, {
                  "id": 990,
                  "ogName": "模型4",
                  "parentId": 7,
                  "ogId": "1001010102",
                  'icon': 'el-icon-mobile',
                  "status": 1,
                  "level": 5,
                  "modelType": 1
                }]
              }]
            }, {
              "id": 4,
              'icon': 'el-icon-mobile',
              "ogName": "车间2",
              "parentId": 1,
              "ogId": "100102",
              "status": 1,
              "level": 3,
              "childList": [{
                "id": 8,
                "ogName": "系统2",
                'icon': 'el-icon-mobile',
                "parentId": 4,
                "ogId": "10010201",
                "status": 1,
                "level": 4,
                "childList": [{
                  "id": 6,
                  "ogName": "模型2模型2模型2模型2模型2模型2模型2模型2模型2模型2模型2模型2模型2模型2模型2模型2模型2模型2模型2模型2模型2",
                  'icon': 'el-icon-mobile',
                  "parentId": 8,
                  "ogId": "1001020101",
                  "status": 1,
                  "level": 5,
                  "modelType": 1,
                  "modelGroupId": 999,
                  "modelGroupName": "组1"
                }]
              }]
            }]
          }]
        }],
        defaultProps: {
          children: 'childList',
          label: 'ogName'
        }
      }
    },
    methods: {
      handleNodeClick(data) {
        this.$emit('_handleOnClickOrg', data.id, data.ogId);
      },
      _getUserRoleOrgTree() {
        this.$http({
          url: "/api/api/user/getUserRoleOrgTree",
          "content-type": "application/json",
          method: 'get',
          data: ''
        }).then(res => {
          if (res.data.status == 1) {
            console.log(res);
          } else {
            console.log(res);
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
    background-color: #FF9933 !important;
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
