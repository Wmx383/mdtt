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
    background-color: #663333;
    color: #fff;
  }

</style>
