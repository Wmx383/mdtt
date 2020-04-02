<template>
  <div v-loading.fullscreen.lock="fullscreenLoading">
    <header class="indexDiv">
      <div class="headerTitle">
        <span class="indexH1">
          D.Perspcire
        </span>
        <h5 class="indexSubTitle">
          全球领先的工业大数据展示平台
        </h5></div>
      <div class="headerNavigation"><span class="systemDateSpan">系统时间: {{ this.systemDate }}</span>
        <div class="menuNav">
          <el-menu :default-active="$route.path" class="el-menu-demo" mode="horizontal" @select="_handleSelect" router>
            <el-menu-item index="/exception/manageException"><i class="el-icon-message-solid"></i>异常管理</el-menu-item>
            <el-submenu index="2">
              <template slot="title"><i class="el-icon-data-analysis"></i>实时监控</template>
              <el-menu-item index="/realTimeMonitoring/forecastParameter"><i class="el-icon-menu"></i>预测参数
              </el-menu-item>
              <el-menu-item index="/realTimeMonitoring/forecastFeatures"><i class="el-icon-menu"></i>预测特征</el-menu-item>
              <el-menu-item index="/realTimeMonitoring/workShopModel"><i class="el-icon-menu"></i>车间模型</el-menu-item>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title"><i class="el-icon-cpu"></i>系统管理</template>
              <el-menu-item index="/systemManage/manageUser"><i class="el-icon-menu"></i>用户管理</el-menu-item>
              <el-menu-item index="/systemManage/manageData"><i class="el-icon-menu"></i>数据配置</el-menu-item>
              <el-menu-item index="/systemManage/manageRole"><i class="el-icon-menu"></i>角色管理</el-menu-item>
              <el-menu-item index="/systemManage/manageOrg"><i class="el-icon-menu"></i>组织机构管理</el-menu-item>
              <el-menu-item index="/systemManage/manageModel"><i class="el-icon-menu"></i>模型组管理</el-menu-item>
              <el-menu-item index="/systemManage/manageSamplingPoint"><i class="el-icon-menu"></i>采样点管理</el-menu-item>
              <el-menu-item index="/systemManage/manageNorm"><i class="el-icon-menu"></i>指标管理</el-menu-item>
              <el-menu-item index="/systemManage/manageCharacteristicGrade"><i class="el-icon-menu"></i>特征牌号管理
              </el-menu-item>
            </el-submenu>
            <el-menu-item index="/systemManage/manageOptimization"><i class="el-icon-platform-eleme"></i>优化管理
            </el-menu-item>
            <el-submenu index="5">
              <template slot="title"><i class="el-icon-s-promotion"></i>收率</template>
              <el-menu-item index="/rate/manageYieldFormula"><i class="el-icon-menu"></i>收率公式管理</el-menu-item>
              <el-menu-item index="/rate/viewYield"><i class="el-icon-menu"></i>收率展示</el-menu-item>
            </el-submenu>
            <el-submenu index="6">
              <template slot="title"><i class="el-icon-s-data"></i>三率统计</template>
              <el-menu-item index="/rate/viewPassRate"><i class="el-icon-menu"></i>合格率</el-menu-item>
            </el-submenu>
            <el-menu-item index="/"><i class="el-icon-switch-button"></i>退出登录</el-menu-item>
          </el-menu>
        </div>
      </div>
    </header>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>

</template>

<script>
  import dayjs from 'dayjs'

  export default {
    name: "index",
    data() {
      return {
        systemDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        fullscreenLoading: false
      }
    },
    mounted() {
      this._getSystemDate();
    },
    methods: {
      _handleSelect(key, keyPath) {
        this.$router.push(key);
      },
      _getSystemDate() {
        setInterval(() => {
          this.systemDate = dayjs().format('YYYY-MM-DD HH:mm:ss');
        }, 1000);
        /*setTimeout(() => {
          this.fullscreenLoading = false;
        }, 1000);*/
      }
    }


  }
</script>

<style lang="less" scoped>
  .indexH1{
    position: absolute;
    left: 60px;
    top: 5px;
    color: #FF6600;
    font-size: 22px;
  }

  .indexSubTitle{
    position: absolute;
    color: #a679b9;
    font-size: 12px;
    left: 38px;
    top : 15px;

  }

  .indexDiv {
    background-color: rgba(0, 21, 41, 0.08);
    height: 64px;
  }

  .favicon {
    position: absolute;
    left: 30px;
    top: 15px;
    width: 30px;
    height: 30px;
  }

  .headerTitleSpan {
    margin-left: 65px;
    font-size: 15px;
  }

  .headerTitle {
    position: absolute;
    top: 0;
    left: 0;
    width: 245px;
    background-color: #fff;
    height: 62px;
    border: 1px solid rgba(0, 21, 41, 0.08);
    border-radius: 3px;
  }

  .headerNavigation {
    position: absolute;
    left: 248px;
    top: 0;
    right: 0;
    background-color: #fff;
    min-width: 1200px;
    border: 1px solid rgba(0, 21, 41, 0.08);
    height: 62px;
    line-height: 62px;
  }

  .systemDateSpan {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.65);
    margin-left: 15px;
  }

  .menuNav {
    float: right;
  }

  .content {
    height: 100%;
  }

</style>

<style>
  .el-submenu__icon-arrow {
    display: none;
  }

  .el-menu-item {
    margin-bottom: 8px;
  }
</style>
