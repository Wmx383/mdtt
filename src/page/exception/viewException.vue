<template>
  <div>
    <div class="table_container">
      <el-table
        v-loading="exception.gridLoading"
        :data="exception.exceptionList"
        :style="exception.gridTableStyle"
        :height="exception.gridTableStyle.height"
        align='center'
        ref="exceptionTable"
        highlight-current-row
      >
        <el-table-column
          prop="modelName"
          label="异常模型"
          align='left'
          min-width="200"
        >
        </el-table-column>
        <el-table-column
          prop="alarmType"
          label="异常类型"
          align='left'
          min-width="200"
        >
        </el-table-column>
        <el-table-column
          prop="limit"
          label="参数上下限"
          align='left'
          min-width="200"
        >
        </el-table-column>
        <el-table-column
          prop="alarmVal"
          label="超限值"
          align='left'
          min-width="200"
        >
        </el-table-column>
        <el-table-column
          prop="alarmDate"
          label="时间"
          align='left'
          min-width="200"
        >
        </el-table-column>
        <el-table-column
          prop="confirmTime"
          label="确认时间"
          align='left'
          min-width="200"
        >
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述"
          align='left'
          min-width="200"
        >
        </el-table-column>
        <el-table-column
          prop="reason"
          label="原因"
          align='left'
          min-width="200"
        >
        </el-table-column>
        <el-table-column
          label="异常确认"
          fixed="right"
          align='center'
          width="100px"
        >
          <template slot-scope="scope">
            <div class="operate-groups">
              <el-button
                type="info"
                size="mini"
                :disabled="!scope.row.confirmed"
                @click="_confimException(scope.$index, scope.row)">确认
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <footer class="text_right">
      <el-button type="primary" size="small" @click="_closeExceptionViewDialog">取消</el-button>
    </footer>
  </div>

</template>

<script>
import moment from 'moment';

export default {
  name: "viewException",
  data () {
    return {
      oid : '',
      exception: {
        sortNum: 0,
        gridLoading: false,
        exceptionAllList: [],
        exceptionPageList: [],
        exceptionList: [],
        gridTableStyle: {
          width: '100%',
          height: window.innerHeight - 350 + 'px'
        },
        pagination: {
          page_index: 1,  // 当前位于哪页
          total: 0,        // 总数
          page_size: 5,   // 1页显示多少条
          page_sizes: [5, 10, 15, 20],  //每页显示多少条
          layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
        },
        selectedDate: [],
      },
    }
  },
  mounted () {
  },
  methods: {
    _selectException () {
      this.exception.exceptionList = [];
      this.exception.gridLoading = true;

      this.$http({
        url: '/api/api/alarm/getTodayAlarmInfoListByOrgId?orgId=' + this.oid + '',
        "content-type": "application/json",
        method: 'get',
      }).then(res => {
        if (res.data.status == 1) {
          const exceptionList = res.data.result;
          let dataList = [];
          for (let i = 0; i < exceptionList.length; i++) {
            let tableItem = {
              id: exceptionList[i].id,
              limit: exceptionList[i].lowerLimit + "-" + exceptionList[i].upperLimit,
              alarmVal: exceptionList[i].value,
              modelName: exceptionList[i].modelName,
              alarmType: exceptionList[i].type == 0 ? '参数异常' : '特征异常',
              parent: exceptionList[i].value,
              alarmDate: moment(exceptionList[i].dataTime).format('YYYY-MM-DD HH:mm:ss'),
              status: exceptionList[i].status,
              confirmTime: exceptionList[i].confirmTime == null ? "未确认" : moment(exceptionList[i].confirmTime).format('YYYY-MM-DD HH:mm:ss'),
              confirmed : exceptionList[i].confirmTime == null ? false : true,
              description: exceptionList[i].description,
              reason: exceptionList[i].reason
            };
            dataList.push(tableItem);
          };
          this.exception.exceptionList = dataList;
          this.exception.gridLoading = false;

        } else {
          this.$message({message: res.data.msg, type: 'error'});

          this.exception.gridLoading = false;
        }
      })
    },
    _confimException(index, row){
      this.$http({
        url: '/api/api/alarm/confirmAlarm?description=' + row.description + '&reason= ' + row.reason +'&id='+ row.id +'&confirmBy='+ '' +'&confirmTime=' + parseInt(moment().format('X')+"000") +'',
        "content-type": "application/json",
        method: 'put',
      }).then(res => {
        if (res.data.status == 1) {
          this.$message({message: 'success', type: 'success'});
          this._selectException();

        } else {
          this.$message({message: res.data.msg, type: 'error'});
        }
      })
    },
    _closeExceptionViewDialog () {
      this.$emit('_closeExceptionViewDialog');
    },
  }
}
</script>

<style scoped>
  .text_right {
    text-align: right;
  }
</style>
