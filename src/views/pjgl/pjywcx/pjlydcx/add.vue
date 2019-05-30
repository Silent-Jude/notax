<template>
  <div>
    <el-dialog :visible.sync="dialogTableVisible" :close-on-click-modal="false" title="票据领用" width="80%">
      <!-- 筛选表单 -->
      <h1 class="title">票据领用单</h1>
      <el-form ref="form" disabled size="mini" label-width="80px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="发售日期">
              <el-date-picker v-model="getdata.apply.applydate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd hh:mm:ss"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单据编码">
              <el-input v-model="getdata.apply.receipNo" disabled clearable/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-row>
              <el-form-item label="执收单位">
                <el-input v-model="getdata.apply.xxx" placeholder="请输入执收单位">
                  <el-button slot="append" icon="el-icon-caret-bottom"/>
                </el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="领用仓库">
                <el-input v-model="getdata.apply.xxx" placeholder="请输入领用仓库">
                  <el-button slot="append" icon="el-icon-caret-bottom"/>
                </el-input>
              </el-form-item>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row>
              <el-col :span="8">
                <el-form-item label="出库字轨">
                  <el-input v-model="getdata.apply.outstoretrack" placeholder="请输入出库字轨" clearable/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="出库单号">
                  <el-input v-model="getdata.apply.outstoreno" placeholder="请输入出库单号" clearable/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label-width="20px">
                  <el-button>票据领销记录打印</el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="缴款方式">
                  <el-select v-model="getdata.apply.tradetype" placeholder="">
                    <el-option label="现金缴款" value="D109_01"/>
                    <el-option label="转账缴款" value="D109_02"/>
                    <el-option label="POS刷卡" value="D109_03"/>
                    <el-option label="支票缴款" value="D109_04"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="缴款书号">
                  <el-input v-model="getdata.apply.tradeid" placeholder="请输入缴款书号" clearable/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item label="制单人">
              <el-input v-model="getdata.apply.operator" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="审核人">
              <el-input v-model="getdata.apply.reviewer" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="经办人">
              <el-input v-model="getdata.apply.attn"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 显示表格 -->
      <div class="wrap-add">
        <el-scrollbar class="wrap" style="height:100%;width:100%;">
          <el-table ref="clearDetail" :data="getdata.bilApplyDetails.bilApplyDetail" highlight-current-row border style="width: 100%" >
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
              width="70"
              prop="track"
              label="字轨"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="startnumber"
              label="起始号码" />
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="endnumber"
              label="终止号码" />
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="70"
              prop="num"
              label="份数" />
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="70"
              prop="counts"
              label="本数" />
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="70"
              prop="price"
              label="单价" />
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="100"
              prop="amount"
              label="金额" />
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="pricingmet"
              label="计价方式" />
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="portions"
              label="每本份数" />
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="balancecount"
              label="结存份数" />
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="copies"
              label="结存本数" />
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
        apply: {},
        bilApplyDetails: {
          bilApplyDetail: []
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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

