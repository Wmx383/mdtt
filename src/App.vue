<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {}
</script>

<style lang="less">
  body{
    margin: 0;
  }

  .el-table__header tr,
  .el-table__header th {
    padding: 0;
    height: 40px;
  }

  .el-form-item{
    margin-bottom: 5px;
  }

  .el-table th{
    background-color: #ffe9e2;
    color: #000033;
    font-weight: bold;
  }

  .table_container .el-table__body tr.current-row > td {
    background-color: #9999FF !important;
    color: #fff;
  }

  .orgTree {
    position: absolute;
    left: 0;
    width: 280px;
    border: 1px solid rgba(0, 21, 41, 0.08);
    background-color: ghostwhite;
    /*box-shadow: 0 10px 10px 0px #aaa, 10px 0 10px 0px #aaa;*/
  }

  .contentDiv {
    position: absolute;
    left: 300px;
    right: 10px;
    min-width: 1050px;
    /*box-shadow: 0 10px 10px 0px #aaa, 10px 0 10px 0px #aaa;*/
  }

  .contentEchartsDiv {
    position: absolute;
    left: 283px;
    right: 10px;
    /*background-color: #F5F5F5;*/
    height: calc(~"100vh - 110px");
    border-bottom: 1px solid rgba(0, 21, 41, 0.08);
    /*box-shadow: 0 10px 10px 0px #aaa, 10px 0 10px 0px #aaa;*/
  }

  .el-cascader_dropdown .el-cascader-panel .el-cascader-menu .el-scrollbar__wrap{
    margin-right: 0px !important;
  }

  .el-scrollbar__wrap{
    margin-right: 0px !important;
    margin-bottom: 0px !important;
  }

  .el-tree{
    background-color: ghostwhite;
  }

  .el-checkbox{
    display: block;
    margin-left: 3px;
    font-size: 15px;
  }

</style>
