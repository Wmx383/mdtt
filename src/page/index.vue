<template>
  <div v-loading.fullscreen.lock="fullscreenLoading">
    <header class="indexDiv">
      <div class="headerTitle">
        <span class="indexH1">
          <b>数 据 魔 镜</b>
        </span>
        <h5 class="indexSubTitle">
          Qlang D.perspcire
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
              <el-menu-item index="/org/viewOrg">测试树</el-menu-item>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title"><i class="el-icon-cpu"></i>系统管理</template>
              <el-menu-item index="/user/manageUser"><i class="el-icon-menu"></i>用户管理</el-menu-item>
              <el-menu-item index="/systemManage/manageData"><i class="el-icon-menu"></i>数据配置</el-menu-item>
              <el-menu-item index="/role/manageRole"><i class="el-icon-menu"></i>角色管理</el-menu-item>
              <el-menu-item index="/org/manageOrg"><i class="el-icon-menu"></i>组织机构管理</el-menu-item>
              <el-menu-item index="/modelGroup/manageModelGroup"><i class="el-icon-menu"></i>模型组管理</el-menu-item>
              <el-menu-item index="/samplePoint/manageSamplePoint"><i class="el-icon-menu"></i>采样点管理</el-menu-item>
              <el-menu-item index="/norm/manageNorm"><i class="el-icon-menu"></i>指标管理</el-menu-item>
              <el-menu-item index="/systemManage/manageCharacteristicGrade"><i class="el-icon-menu"></i>特征牌号管理
              </el-menu-item>
            </el-submenu>
            <el-menu-item index="/systemManage/manageOptimization"><i class="el-icon-platform-eleme"></i>优化管理
            </el-menu-item>
            <el-submenu index="5">
              <template slot="title"><i class="el-icon-s-promotion"></i>收率</template>
              <el-menu-item index="/rate/manageExpression"><i class="el-icon-menu"></i>收率公式管理</el-menu-item>
              <el-menu-item index="/rate/viewExpression"><i class="el-icon-menu"></i>收率展示</el-menu-item>
            </el-submenu>
            <el-submenu index="6">
              <template slot="title"><i class="el-icon-s-data"></i>三率统计</template>
              <el-menu-item index="/rate/viewQualityRate"><i class="el-icon-menu"></i>质量合格率</el-menu-item>
              <el-menu-item index="/rate/viewOperationRate"><i class="el-icon-menu"></i>操作合格率</el-menu-item>
              <el-menu-item index="/rate/viewOperationStableRate"><i class="el-icon-menu"></i>操作平稳率</el-menu-item>
            </el-submenu>
            <el-menu-item index="/"><i class="el-icon-switch-button"></i>退出登录</el-menu-item>
          </el-menu>
        </div>
      </div>
    </header>
    <div class="content">
      <router-view></router-view>
    </div>
    <footer>
      <p class="bottomPage">
        Copyright©2019北京淇朗科技有限公司
      </p>
    </footer>
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
  .indexH1 {
    position: absolute;
    left: 42px;
    top: 0px;
    color: #FF6600;
    font-size: 30px;
    font-family: 宋体;

  }

  .indexSubTitle {
    position: absolute;
    color: #a679b9;
    font-size: 16px;
    left: 48px;
    top: 9px;

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
    width: 280px;
    /*background-color: white;*/
    height: 62px;
    border: 1px solid rgba(0, 21, 41, 0.08);
    border-radius: 3px;
    /*background: url("../images/logo4.png") no-repeat center;*/
  }

  .headerNavigation {
    position: absolute;
    left: 283px;
    top: 0;
    right: 0;
    background-color: white;
    min-width: 1050px;
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


  .bottomPage {
    color: #2f4f4f;
    font-size: 15px;
    text-align: center;
    position: absolute; bottom: -4px; left: 43%;
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
