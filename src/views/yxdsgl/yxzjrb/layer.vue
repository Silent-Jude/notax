<template>
  <el-dialog :visible.sync="dialogTableVisible" title="手工对账" width="70%" @open="open">
    <div class="content">
      <div class="content-wrap">
        <p>资金列表
          <span style="float:right;font-size:12px;font-weight: normal;">合计: {{ total1 }}</span>
        </p>
        <!-- 筛选表单 -->
        <el-form ref="form" size="mini" label-width="80px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="查询条件筛选" label-width="90px">
                <el-select v-model="form.selectedValue" clearable>
                  <el-option label="入账金额" value="Income"/>
                  <el-option label="银行流水号" value="Banksn"/>
                  <el-option label="摘要" value="Summary"/>
                  <el-option label="备注" value="remark"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="" label-width="10px">
                <el-input v-model="form.value" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="" label-width="20px">
                <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="5">
              <el-form-item label-width="0px" label="">
                <el-checkbox-group v-model="isdate" @change="isdateChange">
                  <el-checkbox label="收款日期从" name="type"/>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="" label-width="0px">
                <el-date-picker
                  :disabled="!isdate"
                  v-model="form.sdate"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择日期"/>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item label="至" label-width="40px"/>
            </el-col>
            <el-col :span="7">
              <el-form-item label="" label-width="0px">
                <el-date-picker
                  :disabled="!isdate"
                  v-model="form.edate"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择日期"/>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 分页 -->
          <el-row>
            <el-pagination
              :current-page="form.pageIndex"
              :page-sizes="[10, 15, 20, 25, 30]"
              :page-size="form.pageSize"
              :total="totalCount"
              layout="total, sizes, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"/>
          </el-row>
        </el-form>
        <!-- 显示表格 -->
        <div class="wrap">
          <el-scrollbar style="height:100%;width:100%;">
            <el-table
              ref="layerTable"
              :data="tableData"
              highlight-current-row
              border
              style="width: 100%"
              @selection-change="handleSelectionChangel">
              <el-table-column
                type="index"/>
              <el-table-column
                type="selection"
                width="40"/>
              <el-table-column
                sortable
                header-align="center"
                align="center"
                width="100"
                prop="income"
                show-overflow-tooltip
                label="入账金额"/>
              <el-table-column
                sortable
                header-align="center"
                align="center"
                width="100"
                prop="chargedate"
                show-overflow-tooltip
                label="交易日期"/>
              <el-table-column
                sortable
                header-align="center"
                align="center"
                width="100"
                prop="banksn"
                show-overflow-tooltip
                label="银行流水"/>
              <el-table-column
                sortable
                header-align="center"
                align="center"
                width="100"
                prop="bankname"
                show-overflow-tooltip
                label="银行名称"/>
              <el-table-column
                sortable
                header-align="center"
                align="center"
                width="100"
                prop="summary"
                show-overflow-tooltip
                label="摘要"/>
              <el-table-column
                sortable
                header-align="center"
                align="center"
                width="100"
                prop="remark"
                show-overflow-tooltip
                label="备注"/>
              <el-table-column
                sortable
                header-align="center"
                align="center"
                width="100"
                prop="peerbankacctname"
                show-overflow-tooltip
                label="对方账号名"/>
              <el-table-column
                sortable
                header-align="center"
                align="center"
                width="100"
                prop="peerbankacctno"
                show-overflow-tooltip
                label="对方账号"/>
              <el-table-column
                sortable
                header-align="center"
                align="center"
                width="100"
                prop="approved"
                show-overflow-tooltip
                label="标志"/>
            </el-table>
          </el-scrollbar>
        </div>
      </div>
      <div class="content-wrap">
        <p>收入列表
          <span style="float:right;font-size:12px;font-weight: normal;">合计: {{ total2 }}</span>
        </p>
        <!-- 筛选表单 -->
        <el-form ref="form1" size="mini" label-width="80px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="查询条件筛选" label-width="90px">
                <el-select v-model="form1.selectedValue" clearable>
                  <el-option label="缴款书编号" value="paybillno"/>
                  <el-option label="资金入账" value="totamt"/>
                  <el-option label="执收单位编码" value="agencycode"/>
                  <el-option label="执收单位名称" value="agencyname"/>
                  <el-option label="缴款人全称" value="payer"/>
                  <el-option label="备注" value="remark"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="" label-width="10px">
                <el-input v-model="form1.value" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="" label-width="20px">
                <el-button type="primary" icon="el-icon-search" @click="search1()">搜索</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="21" style="visibility: hidden;">
              <el-form-item label-width="0px" label="">
                <el-checkbox-group>
                  <el-checkbox/>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 分页 -->
          <el-row>
            <el-pagination
              :current-page="form1.pageIndex"
              :page-sizes="[10, 15, 20, 25, 30]"
              :page-size="form1.pageSize"
              :total="totalCount1"
              layout="total, sizes, jumper"
              @size-change="handleSizeChanger"
              @current-change="handleCurrentChanger"/>
          </el-row>
        </el-form>
        <!-- 显示表格 -->
        <div class="wrap">
          <el-scrollbar style="height:100%;width:100%;">
            <el-table
              ref="layerTable1"
              :data="tableData1"
              highlight-current-row
              border
              style="width: 100%"
              @selection-change="handleSelectionChanger">
              <el-table-column
                type="index"/>
              <el-table-column
                type="selection"
                width="40"/>
              <el-table-column
                sortable
                header-align="center"
                align="center"
                width="100"
                prop="totamt"
                show-overflow-tooltip
                label="收费金额"/>
              <el-table-column
                sortable
                header-align="center"
                align="center"
                width="100"
                prop="chargedate"
                show-overflow-tooltip
                label="交易日期"/>
              <el-table-column
                sortable
                header-align="center"
                align="center"
                width="100"
                prop="banksn"
                show-overflow-tooltip
                label="银行流水号"/>
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
                width="170"
                prop="paybillno"
                show-overflow-tooltip
                label="缴款单编号"/>
              <el-table-column
                sortable
                header-align="center"
                align="center"
                width="170"
                prop="agencycode"
                show-overflow-tooltip
                label="执行单位编号"/>
              <el-table-column
                sortable
                header-align="center"
                align="center"
                width="170"
                prop="agencyname"
                show-overflow-tooltip
                label="执收单位名称"/>
              <el-table-column
                sortable
                header-align="center"
                align="center"
                width="100"
                prop="payer"
                show-overflow-tooltip
                label="缴款人全称"/>
              <el-table-column
                sortable
                header-align="center"
                align="center"
                width="100"
                prop="payee"
                show-overflow-tooltip
                label="收款人"/>
            </el-table>
          </el-scrollbar>
        </div>
      </div>
    </div>
    <!-- 底部按钮 -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import yhdsgl from '@/api/yhdsgl/yhdsgl.js'
export default {
  props: {
    // 表格数据1
    bankGuid: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {
        edate: '',
        sdate: '',
        pageIndex: 1,
        pageSize: 10,
        selectedValue: '',
        value: ''
      },
      form1: {
        pageIndex: 1,
        pageSize: 10,
        selectedValue: '',
        value: ''
      },
      // 勾选项
      selection1: [],
      selection2: [],
      // 表格数据1
      tableData: [],
      tableData1: [],
      // 总数
      totalCount: 0,
      totalCount1: 0,
      // 是否日期
      isdate: false,
      // 是否筛选
      filter: false,
      // 组件是否显示
      dialogTableVisible: false
    }
  },
  computed: {
    // 合计
    total1() {
      if (this.selection1.length === 0) {
        return 0
      }
      return (this.selection1.reduce((a, b) => {
        return { income: (Number(a.income) + Number(b.income)).toFixed(2) }
      }, {
        income: 0
      })).income
    },
    total2() {
      if (this.selection2.length === 0) {
        return 0
      }
      return (this.selection2.reduce((a, b) => {
        return { totamt: (Number(a.totamt) + Number(b.totamt)).toFixed(2) }
      }, {
        totamt: 0
      })).totamt
    }
  },
  created() {

  },
  mounted() {
  },
  methods: {
    // 勾选
    handleSelectionChangel(val) {
      this.selection1 = val
      console.log('selection1', this.selection1)
    },
    handleSelectionChanger(val) {
      this.selection2 = val
      console.log('selection2', this.selection2)
    },
    // 资金
    findBankFundsDailyGridZZ: yhdsgl.findBankFundsDailyGridZZ,
    // 收入
    findBankFundsDailyGridSR: yhdsgl.findBankFundsDailyGridSR,
    // 手工对账
    manualFound: yhdsgl.manualFound,
    // 打开
    open() {
      this.tableData = []
      this.tableData1 = []
      this.findBankFundsDailyGridZZ(this.bankGuid, this.form).then(res => {
        console.log('资金', res.data.data)
        console.log('资金', res)
        this.tableData = res.data.data
        this.totalCount = res.data.pageInfo.totalCount
      })
      this.findBankFundsDailyGridSR(this.bankGuid, this.form1).then(res => {
        console.log('收入', res.data.data)
        console.log('收入', res)
        this.tableData1 = res.data.data
        this.totalCount1 = res.data.pageInfo.totalCount
      })
    },
    // 当前表格 页条数改变
    handleSizeChange(val) {
      this.form.pageSize = val
      this.search(this.form)
    },
    // 当前表格 页码改变 翻页
    handleCurrentChange(val) {
      this.form.pageIndex = val
      this.search(this.form)
    },
    // 当前表格 页条数改变
    handleSizeChanger(val) {
      this.form1.pageSize = val
      this.search1(this.form1)
    },
    // 当前表格 页码改变 翻页
    handleCurrentChanger(val) {
      this.form1.pageIndex = val
      this.search1(this.form1)
    },
    // 日期
    isdateChange(val) {
      if (val) {
        var time = new Date()
        this.form.sdate = `${time.getFullYear()}-${time.getMonth() + 1}-1`
        // 设置当前时间
        this.form.edate = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`
      } else {
        this.form.sdate = ''
        this.form.edate = ''
      }
    },
    // 资金列表
    search() {
      // this.form.pageIndex = 1
      this.tableData = []
      this.findBankFundsDailyGridZZ(this.bankGuid, this.form).then(res => {
        console.log('资金', res.data.data)
        console.log('资金', res)
        this.tableData = res.data.data
        this.totalCount = res.data.pageInfo.totalCount
      })
    },
    // 收入列表
    search1() {
      this.tableData1 = []
      this.findBankFundsDailyGridSR(this.bankGuid, this.form1).then(res => {
        console.log('收入', res.data.data)
        this.tableData1 = res.data.data
        this.totalCount1 = res.data.pageInfo.totalCount
      })
    },
    // 确定对话框
    confirm() {
      var foundGUID
      if (this.selection1.length > 1) {
        foundGUID = this.selection1.reduce((a, b) => {
          return { guid: a.guid + ',' + b.guid }
        }).guid
      } else if (this.selection1.length === 1) {
        foundGUID = this.selection1[0].guid
      } else {
        foundGUID = ''
      }
      var tradeGUID
      if (this.selection2.length > 1) {
        tradeGUID = this.selection2.reduce((a, b) => {
          return { guid: a.guid + ',' + b.guid }
        }).guid
      } else if (this.selection2.length === 1) {
        tradeGUID = this.selection2[0].guid
      } else {
        tradeGUID = ''
      }
      this.manualFound(foundGUID, tradeGUID).then(res => {
        this.search()
        this.search1()
        // this.dialogTableVisible = false
        this.$message({
          message: '手工对账完成',
          type: 'success'
        })
      })
    },
    // 取消对话框
    cancel() {
      this.dialogTableVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.content{
  display: flex;
  .content-wrap{
    width: 50%;
    padding: 0 6px;
    .wrap{
      height: 300px;
    }
  }
}

</style>

