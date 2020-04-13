<template>
  <div>
    <div>
      <el-form
        ref="permissionRoleForm"
        :model="permissionRoleForm"
        style="margin:10px;width:auto;"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item prop='ogName' label="">
              <el-input v-model="permissionRoleForm.ogName" style="width: 81%" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label-width="67%">
          <el-button type="primary" size="small" @click='_permissionRole("permissionRoleForm")'>确 定</el-button>
          <el-button size="small" @click="_close()">取 消</el-button>
        </el-form-item>

      </el-form>

    </div>
  </div>
</template>

<script>
    export default {
        name: "prePermissionRole",
      data(){
          return{
            permissionRoleForm:{
              status: '',
              id: '',
              roleId: '',
              orgId: '',
              permissionCode: ''
            }
          }
      },
      methods: {
        _permissionRole(permissionRoleForm){

        },
        _close(){
          this.$emit('permissionRoleListeners');
        },
      }
    }
</script>

<style scoped>

</style>
