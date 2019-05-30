<template>
  <div>
    <el-dialog :visible.sync="dialogTableVisible" :close-on-click-modal="false" title="票据入库" width="80%">
      <!-- 筛选表单 -->
      <h1 class="title">财政票据入库单</h1>
      <el-form ref="form" disabled size="mini" label-width="80px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="业务日期">
              <el-date-picker v-model="getdata.storage.storagedate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd hh:mm:ss"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单据编码">
              <el-input v-model="getdata.storage.receipNo" disabled clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入库类型">
              <el-radio-group v-model="getdata.storage.type">
                <el-radio label="0">领用入库</el-radio>
                <el-radio label="1">印制入库</el-radio>
                <el-radio label="2">历史入库</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="承印单位">
              <el-input
                v-model="getdata.storage.xxx"
                clearable
                placeholder="请输入承印单位">
                <el-button slot="append" icon="el-icon-caret-bottom"/>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入库仓库">
              <el-input
                v-model="getdata.storage.xxx"
                clearable
                placeholder="请输入入库仓库">
                <el-button slot="append" icon="el-icon-caret-bottom"/>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="getdata.storage.remark" type="textarea"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="制单人">
              <el-input
                v-model="getdata.storage.operator"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="审核人">
              <el-input
                v-model="getdata.storage.reviewer"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="经手人">
              <el-input
                v-model="getdata.storage.attn"/>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <!-- 显示表格 -->
      <div class="wrap-add">
        <el-scrollbar class="wrap" style="height:100%;width:100%;">
          <el-table ref="clearDetail" :data="getdata.bilStorageDetails.bilStorageDetail" highlight-current-row border style="width: 100%">
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="80"
              type="index"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="billcode"
              show-overflow-tooltip
              label="票据编码"/>
            <el-table-column
              prop="billname"
              sortable
              header-align="center"
              align="center"
              width="170"
              show-overflow-tooltip
              label="票据名称"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="70"
              prop="track"
              show-overflow-tooltip
              label="字轨"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="startnumber"
              show-overflow-tooltip
              label="起始号码"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="endnumber"
              show-overflow-tooltip
              label="终止号码"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="70"
              prop="num"
              show-overflow-tooltip
              label="份数"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="70"
              prop="counts"
              show-overflow-tooltip
              label="本数"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="70"
              prop="price"
              show-overflow-tooltip
              label="单价"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="70"
              prop="amount"
              show-overflow-tooltip
              label="金额"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="remark"
              show-overflow-tooltip
              label="备注"/>
          </el-table>
        </el-scrollbar>
      </div>
    </el-dialog>

  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogTableVisible: false,
      // 查看的所有数据
      getdata: {
        storage: {},
        bilStorageDetails: {
          bilStorageDetail: []
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  text-align: center;
  font-size: 28px;
  padding-top: 10px;
  padding-bottom: 10px;
}
.wrap-add {
  height: 200px;
  .el-table {
    overflow: initial;
  }
  .el-table__body-wrapper {
    overflow: initial !important;
  }
  .el-scrollbar__view {
    width: fit-content;
  }
}
</style>

