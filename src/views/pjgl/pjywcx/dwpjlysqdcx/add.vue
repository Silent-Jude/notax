<template>
  <div>
    <el-dialog :visible.sync="dialogTableVisible" :close-on-click-modal="false" title="票据领用申请" width="80%">
      <!-- 筛选表单 -->
      <h1 class="title">财政票据领用申请</h1>
      <el-form ref="form" disabled size="mini" label-width="80px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="业务日期">
              <el-date-picker v-model="getdata.agencyPurchase.requestdate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd hh:mm:ss"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单据编码">
              <el-input v-model="getdata.agencyPurchase.receipNo" disabled clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="执收单位">
              <el-input v-model="getdata.agencyPurchase.xxx" placeholder="请输入执收单位">
                <el-button slot="append" icon="el-icon-caret-bottom" />
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="5">
            <el-form-item label="制单人">
              <el-input v-model="getdata.agencyPurchase.operator" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="送审人">
              <el-input v-model="getdata.agencyPurchase.delivered" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="审核人">
              <el-input v-model="getdata.agencyPurchase.reviewer" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="经手人">
              <el-input v-model="getdata.agencyPurchase.attn"/>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <!-- 显示表格 -->
      <div class="wrap-add">
        <el-scrollbar class="wrap"  style="height:100%;width:100%;">
          <el-table ref="clearDetail" :data="getdata.bilAgencyPurchaseDetails.bilAgencyPurchaseDetail" highlight-current-row border style="width: 100%">
            <el-table-column width="80" type="index"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="billcode"
              label="票据编码" />
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="billname"
              label="票据名称" />
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="specification"
              label="票据规格"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="portions"
              label="每本份数"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="140"
              prop="num"
              label="单位申请数份数"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="140"
              prop="counts"
              label="单位申请本数"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="140"
              prop="checknumber"
              label="财政核定数份数"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="140"
              prop="checkcount"
              label="财政核定数本数"/>
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
        agencyPurchase: {},
        bilAgencyPurchaseDetails: {
          bilAgencyPurchaseDetail: []
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

