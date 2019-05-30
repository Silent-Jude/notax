<!-- 领销记录打印组件 -->
<template>
  <div>
    <div class="record-print-btn" @click="openRecordPrint">票据领销记录打印</div>
    <el-dialog :visible.sync="recordPrintDialog" class="record-print-wrap" width="80%" title="票据领销记录打印" append-to-body>
      <el-row type="flex" justify="space-between">
        <el-col :span="8">
          <h1 class="title">{{ selectedBasChargeAgency.agencycode }} {{ chargeAgencyName }}</h1>
        </el-col>
        <el-col :span="12">
          <div class="right-control">
            <span>已打印：{{ hadPrintedNum }} 行记录，每页只能打印{{ 0 }} 行。 </span>
            <span style="padding-left:30px">指定打印行位置：</span>
            <el-input v-model="printposition" size="mini" style="width:60px" />
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="5">
          <el-button type="danger" size="mini" @click="confirmSetNotPrint(0)">设置为未打印状态</el-button>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" size="mini" @click="confirmSetNotPrint(1)">设置为已打印状态</el-button>
        </el-col>
      </el-row>
      <div class="table-wrap">
        <el-scrollbar style="height:100%;width:100%;">
          <el-table :data="recordPrintList" highlight-current-row border stripe style="width: 100%" @selection-change="setSelectedPrintList" @row-click="checkDetail">
            <el-table-column type="selection" width="30"/>
            <el-table-column type="index" width="50"/>
            <el-table-column v-for="(item,i) of recordPrintHead" :key="i" :label="item.label" :prop="item.prop" :width="item.width" show-overflow-tooltip sortable/>
          </el-table>
        </el-scrollbar>
      </div>
      <el-row type="flex" justify="end">
        <el-button plain size="mini" @click="setUp">设置</el-button>
        <el-button plain size="mini" @click="preview">预览</el-button>
        <el-button plain size="mini" @click="print">打印</el-button>
      </el-row>

    </el-dialog>
  </div>

</template>

<script>
export default {
  components: {},
  data() {
    return {
    }
  },

  computed: {},

  watch: {},

  created() {},

  methods: {}
}

</script>
<style rel='stylesheet/scss' lang='scss' scoped>
</style>
