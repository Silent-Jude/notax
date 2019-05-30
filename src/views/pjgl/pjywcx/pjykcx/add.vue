<template>
  <div>
    <el-dialog :visible.sync="dialogTableVisible" :close-on-click-modal="false" title="票据移库" width="80%">
      <!-- 筛选表单 -->
      <h1 class="title">财政票据移库</h1>
      <el-form ref="form" disabled size="mini" label-width="80px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="业务日期">
              <el-date-picker v-model="getdata.moveRecord.movedate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd hh:mm:ss"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单据编码">
              <el-input v-model="getdata.moveRecord.receipNo" disabled clearable/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="移出仓库">
              <el-input v-model="getdata.moveRecord.xxx" placeholder="请输入移出仓库">
                <el-button slot="append" icon="el-icon-caret-bottom" @click="showMoveOutBillStorage()" />
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="移入仓库">
              <el-input v-model="getdata.moveRecord.xxx" placeholder="请输入移入仓库">
                <el-button slot="append" icon="el-icon-caret-bottom" @click="showMoveInBillStorage()" />
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="5">
            <el-form-item label="制单人">
              <el-input v-model="getdata.moveRecord.operator" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="送审人">
              <el-input v-model="getdata.moveRecord.delivered" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="审核人">
              <el-input v-model="getdata.moveRecord.reviewer" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="经手人">
              <el-input v-model="getdata.moveRecord.attn"/>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <!-- 显示表格 -->
      <div class="wrap-add">
        <el-scrollbar class='wrap' style="height:100%;width:100%;">
          <el-table ref="clearDetail" :data="getdata.bilMoveRecordDetails.bilMoveRecordDetail" highlight-current-row border style="width: 100%" >
            <el-table-column width="80" type="index"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="billcode"
              label="票据编号" />
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="170"
              prop="billname"
              label="票据名称" />
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="70"
              prop="track"
              label="字轨" />
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="startnumber"
              label="起始号码"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="endnumber"
              label="终止号码"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="70"
              prop="num"
              label="份数"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="70"
              prop="counts"
              label="本数"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="70"
              prop="price"
              label="单价"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="100"
              prop="amount"
              label="金额"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="pricingmet"
              label="计价方式"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="portions"
              label="每本份数" />
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
        moveRecord: {},
        bilMoveRecordDetails: {
          bilMoveRecordDetail: []
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

