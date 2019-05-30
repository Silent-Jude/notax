<!-- 年检信息组件 -->
<template>
  <div>
    <el-scrollbar class="right-scrollbar" style="height:400px">
      <el-table :data="tableListData" max-height="360" border style="width: 100%" highlight-current-row>
        <el-table-column type="index" width="50" />
        <el-table-column prop="year" label="年检年度" sortable center width="65" />
        <el-table-column prop="anninspdate" label="年检日期" sortable center width="200" />
        <el-table-column prop="attn" label="经办人" sortable center width="70" />
        <el-table-column prop="yearmark" label="年检标志" sortable center width="70" />
        <el-table-column prop="remark" label="备注" sortable center width="100" />
      </el-table>
    </el-scrollbar>
  </div>
</template>

<script>
import Bus from '@/utils/Bus'
import { findYearCheck } from '@/api/jczl'

export default {
  components: {},
  data() {
    return {
      tableListData: []
    }
  },

  computed: {},

  watch: {},

  created() {
    Bus.$off('getYearCheck')
    Bus.$on('getYearCheck', (params) => {
      this.getYearCheck(params)
    })
  },

  methods: {
    getYearCheck(params) {
      findYearCheck(params.guid).then(res => {
        this.tableListData = res.data
        console.log('收到的年检信息是：', res.data)
      })
    }
  }
}

</script>
<style rel='stylesheet/scss' lang='scss' scoped>
</style>
