<template>
  <div>
    <el-tree :data="orgData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
  </div>
</template>

<script>
  export default {
    name: "viewOrg",
    data() {
      return {
        orgData :[{
          label: '一级 1',
          children: [{
            label: '二级 1-1',
            children: [{
              label: '三级 1-1-1'
            }]
          }]
        }, {
          label: '一级 2',
          children: [{
            label: '二级 2-1',
            children: [{
              label: '三级 2-1-1'
            }]
          }, {
            label: '二级 2-2',
            children: [{
              label: '三级 2-2-1'
            }]
          }]
        }, {
          label: '一级 3',
          children: [{
            label: '二级 3-1',
            children: [{
              label: '三级 3-1-1'
            }]
          }, {
            label: '二级 3-2',
            children: [{
              label: '三级 3-2-1'
            }]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    methods: {
      handleNodeClick(){

      },
      _getUserRoleOrgTree(){
        console.log('开始查询');
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
        console.log("结束查询");
      }
    },
    mounted(){
      this._getUserRoleOrgTree();
    }

  }
</script>

<style scoped>

</style>
