<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {}
</script>

<style>
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

  .el-scrollbar__wrap{
    margin-right: 0px !important;
  }

</style>
