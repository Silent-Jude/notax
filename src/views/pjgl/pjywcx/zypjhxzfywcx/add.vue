<template>
  <div>
    <el-dialog :visible.sync="dialogTableVisible" :close-on-click-modal="false" title="核销记录明细" width="80%">
      <!-- 筛选表单 -->
      <!-- <h1 class="title">核销记录明细</h1> -->
      <el-form ref="form" disabled size="mini" label-width="80px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="业务日期">
              <el-date-picker
                v-model="getdata.requestdate"
                type="date"
                placeholder="选择日期"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单据编码">
              <el-input v-model="getdata.receipNo" disabled clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="操作人">
              <el-input v-model="getdata.operator" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="" label-width="40px">
              <el-button>票据领销记录打印</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="销票单位">
              <el-input
                v-model="getdata.xxx"
                clearable
                placeholder="请输入销票单位">
                <el-button slot="append" icon="el-icon-caret-bottom"/>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="经手人">
              <el-input v-model="getdata.attn" clearable/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="5">
            <el-form-item label="制单人">
              <el-input
                v-model="getdata.operator"
                disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="送审人">
              <el-input
                v-model="getdata.delivered"
                disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="审核人">
              <el-input
                v-model="getdata.reviewer"
                disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="经手人">
              <el-input
                v-model="getdata.attn"
                clearable/>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <!-- 显示表格 -->
      <div class="wrap-add">
        <!-- 表1 -->
        <el-scrollbar class="wrap" style="height:50%;width:100%;">
          <el-table
            ref="clearDetail"
            :data="getdata.bilVerificationDetails.bilVerificationDetail"
            show-summary
            highlight-current-row
            border
            style="width: 100%"
            @row-click="handleCurrentChangedetailsIndex">
            <el-table-column
              width="80"
              type="index"/>
            <el-table-column
              prop="billcode"
              sortable
              header-align="center"
              align="center"
              width="120"
              label="票据编码"/>
            <el-table-column
              prop="billname"
              sortable
              header-align="center"
              align="center"
              width="170"
              label="票据名称"/>
            <el-table-column
              prop="track"
              sortable
              header-align="center"
              align="center"
              width="70"
              label="字轨"/>
            <el-table-column
              prop="startnumber"
              sortable
              header-align="center"
              align="center"
              width="120"
              label="起始号码"/>
            <el-table-column
              prop="endnumber"
              sortable
              header-align="center"
              align="center"
              width="120"
              label="终止号码"/>
            <el-table-column
              prop="num"
              sortable
              header-align="center"
              align="center"
              width="70"
              label="份数"/>
            <el-table-column
              prop="counts"
              sortable
              header-align="center"
              align="center"
              width="70"
              label="本数"/>
            <el-table-column
              prop="price"
              sortable
              header-align="center"
              align="center"
              width="70"
              label="单价"/>
            <el-table-column
              prop="amount"
              sortable
              header-align="center"
              align="center"
              width="70"
              label="金额"/>
            <el-table-column
              prop="pricingmet"
              label="计价方式"/>
            <el-table-column
              prop="portions"
              sortable
              header-align="center"
              align="center"
              width="120"
              label="每本份数"/>
            <el-table-column
              prop=""
              label="累计核销份数"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop=""
              label="作废份数"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop=""
              label="结存份数"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop=""
              label="结存本数"/>
          </el-table>
        </el-scrollbar>
        <!-- 表2 表3 -->
        <div style="height:50%;width:100%;display:flex;">
          <el-scrollbar class="wrap" style="height:100%;width:60%;">
            <el-table
              ref="clearDetail2"
              :data="table2data"
              show-summary
              highlight-current-row
              border
              style="width: 100%">
              <el-table-column
                width="80"
                type="index"/>
              <el-table-column
                prop="nontaxcode"
                sortable
                header-align="center"
                align="center"
                width="120"
                label="收费项目编码"/>
              <el-table-column
                prop="nontaxname"
                sortable
                header-align="center"
                align="center"
                width="170"
                label="收费项目名称"/>
              <el-table-column
                sortable
                header-align="center"
                align="center"
                width="120"
                prop="amount"
                label="票面金额"/>
              <el-table-column
                prop="accountspay"
                sortable
                header-align="center"
                align="center"
                width="120"
                label="应缴专户"/>
              <el-table-column
                prop="accounts"
                label="实缴专户"/>
              <el-table-column
                prop="inconvenient"
                sortable
                header-align="center"
                align="center"
                width="120"
                label="不便进专户"/>
              <el-table-column
                prop="unpaidacc"
                sortable
                header-align="center"
                align="center"
                width="120"
                label="未缴专户"/>
            </el-table>
          </el-scrollbar>

          <el-scrollbar class="wrap" style="height:100%;width:40%;padding-left:10px;">
            <el-table
              ref="clearDetail3"
              :data="table3data"
              highlight-current-row
              border
              style="width: 100%">
              <el-table-column
                type="index"/>
              <el-table-column
                prop="startnumber"
                sortable
                header-align="center"
                align="center"
                width="120"
                label="起始号码"/>
              <el-table-column
                prop="endnumber"
                sortable
                header-align="center"
                align="center"
                width="120"
                label="终止号码"/>
              <el-table-column
                prop="num"
                sortable
                header-align="center"
                align="center"
                width="70"
                label="份数"/>
              <el-table-column
                prop="reason"
                sortable
                header-align="center"
                align="center"
                width="120"
                label="作废原因"/>
            </el-table>
          </el-scrollbar>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogTableVisible: false,
      // 主表行
      index: -1,
      // 查看的所有数据
      getdata: {
        bilVerificationDetails: {
          bilVerificationDetail: []
        }
      }
    }
  },
  computed: {
    table2data() {
      if (this.getdata.bilVerificationDetails.bilVerificationDetail[this.index]) {
        return this.getdata.bilVerificationDetails.bilVerificationDetail[this.index].bilVerificationCharges.bilVerificationCharge
      }
    },
    table3data() {
      if (this.getdata.bilVerificationDetails.bilVerificationDetail[this.index]) {
        return this.getdata.bilVerificationDetails.bilVerificationDetail[this.index].bilVerificationInvalids.bilVerificationInvalid
      }
    }

  },
  methods: {
    // 点击表1详情行 更改表2表3
    handleCurrentChangedetailsIndex(row) {
      var i = this.getdata.bilVerificationDetails.bilVerificationDetail.findIndex(item => {
        return item === row
      })
      // console.log(i)
      if (i >= 0) { // 拿到行标 修改表2表3
        this.index = i
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap-add{
  height: 200px;
  .el-table{
    overflow:initial;
    }
    .el-table__body-wrapper{
      overflow: initial!important;
    }
    .el-scrollbar__view{
      width: fit-content;
    }
}

</style>

