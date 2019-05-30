<!-- 银行资金日报 -->
<template>
  <el-scrollbar style="height:100%;width:100%;">
    <div class="yxzjrb">
      <toolBar :client-butns-array="clientButnsArray" />
      <h1>银行资金日报</h1>
      <!-- 上表 -->
      <el-form ref="form" size="mini" label-width="80px">
        <el-row>
          <el-col :span="2">
            <el-form-item label-width="20px" label="">
              <el-checkbox-group v-model="isdate1" @change="isdateChange1">
                <el-checkbox label="收款日期" name="type"/>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="" label-width="0px">
              <el-date-picker
                :disabled="!isdate1"
                v-model="form.chargeStartDate"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"/>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <el-form-item label="至" label-width="40px"/>
          </el-col>
          <el-col :span="3">
            <el-form-item label="" label-width="0px">
              <el-date-picker
                :disabled="!isdate1"
                v-model="form.chargeEndDate"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"/>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label-width="20px" label="">
              <el-checkbox-group v-model="isdate2" @change="isdateChange2">
                <el-checkbox label="开票日期" name="type"/>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="" label-width="0px">
              <el-date-picker
                :disabled="!isdate2"
                v-model="form.tradeStartDate"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"/>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <el-form-item label="至" label-width="40px"/>
          </el-col>
          <el-col :span="3">
            <el-form-item label="" label-width="0px">
              <el-date-picker
                :disabled="!isdate2"
                v-model="form.tradeEndDate"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9">
            <el-form-item label-width="110px" label="银行名称">
              <el-input
                v-model="bankname"
                clearable
                placeholder="请输入银行名称" >
                <el-button slot="append" icon="el-icon-caret-bottom" @click="showbank"/>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="2">
            <el-form-item label-width="20px" label="">
              <el-checkbox-group v-model="isfilter">
                <el-checkbox label="筛选" @change="isfilterChange"/>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="" label-width="0px">
              <el-select :disabled="!isfilter" v-model="form.filter" placeholder="">
                <el-option label="对账标志" value="t.approved"/>
                <el-option label="待查收入标志" value="t.dcsrmark"/>
                <el-option label="待查确认标志" value="t.confirm"/>
                <el-option label="银行流水号" value="t.banksn"/>
                <el-option label="收款日期" value="t.chargedate"/>
                <el-option label="对方账号" value="t.peerbankacctno"/>
                <el-option label="对方开户行" value="t.peeracctbank"/>
                <el-option label="网点编码" value="t.bankbranchcode"/>
                <el-option label="银行网点名称" value="t.bankbranchname"/>
                <el-option label="备注" value="remark"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="等于" label-width="50px">
              <el-input :disabled="!isfilter" v-model="form.selectedValue" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="" label-width="20px">
              <el-radio-group v-model="order">
                <el-radio :label="0">正序</el-radio>
                <el-radio :label="1">倒序</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="" label-width="20px">
            <el-radio-group v-model="tab" @change="tabfn">
              <el-radio :label="0">全部</el-radio>
              <el-radio :label="1">按银行汇总</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <!-- 分页 -->
        <el-row>
          <el-pagination
            :current-page="form.pageIndex"
            :page-sizes="[10, 15, 20, 25, 30]"
            :page-size="form.pageSize"
            :total="totalCount"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"/>
        </el-row>
      </el-form>

      <!-- 下表格 -->
      <!-- 0全部 -->
      <div v-show="tab === 0" class="wrap-box wrap">
        <el-scrollbar style="height:100%;width:100%;">
          <el-table
            ref="singleTable"
            :data="tableData"
            border
            style="width: 100%"
            highlight-current-row
            @row-dblclick = "dbRow"
            @current-change="handleCurrentChangeIndex">
            <el-table-column
              type="index"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="100"
              prop="approved"
              show-overflow-tooltip
              label="对账标志"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="100"
              prop="dcsrmark"
              show-overflow-tooltip
              label="待查收入标志"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="100"
              prop="confirm"
              show-overflow-tooltip
              label="待查确认标志"/>
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
              width="120"
              prop="chargedate"
              show-overflow-tooltip
              label="收款日期"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="170"
              prop="summary"
              show-overflow-tooltip
              label="概要"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="100"
              prop="income"
              show-overflow-tooltip
              label="收入"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="100"
              prop="expenditure"
              show-overflow-tooltip
              label="支出"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="100"
              prop="balance"
              show-overflow-tooltip
              label="账单结余"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="100"
              prop="formbalance"
              show-overflow-tooltip
              label="表单结余"/>
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
              prop="agencycode"
              show-overflow-tooltip
              label="凭证号"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="paybillno"
              show-overflow-tooltip
              label="缴款书编号"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="bankcode"
              show-overflow-tooltip
              label="银行编码"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="bankname"
              show-overflow-tooltip
              label="银行名称"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="peerbankacctname"
              show-overflow-tooltip
              label="对方开户名"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="peerbankacctno"
              show-overflow-tooltip
              label="对方账号"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="peeracctbank"
              show-overflow-tooltip
              label="对方开户行"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="bankbranchcode"
              show-overflow-tooltip
              label="网点编码"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="bankbranchname"
              show-overflow-tooltip
              label="网点名称"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="remark"
              show-overflow-tooltip
              label="备注"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="tradedate"
              show-overflow-tooltip
              label="开票日期"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="70"
              prop="chargedate1"
              show-overflow-tooltip
              label="确认日期"/>
          </el-table>
        </el-scrollbar>
      </div>
      <!-- 1按银行汇总 -->
      <div v-show="tab === 1" class="wrap-box wrap">
        <el-scrollbar style="height:100%;width:100%;">
          <el-table
            ref="singleTable1"
            :data="tableData1"
            border
            style="width: 100%"
            @row-dblclick = "dbRowbank">
            <el-table-column
              type="index"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="170"
              prop="bankname"
              show-overflow-tooltip
              label="银行名称"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="qcye"
              show-overflow-tooltip
              label="初期余额"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="zcsr"
              show-overflow-tooltip
              label="正常收入"/>
            <el-table-column
              prop="dcsr"
              sortable
              header-align="center"
              align="center"
              width="120"
              show-overflow-tooltip
              label="待查收入"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="yqrdcsr"
              show-overflow-tooltip
              label="已确认待查收入"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="wqrdcsr"
              show-overflow-tooltip
              label="未确认待查收入"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="bqhj"
              show-overflow-tooltip
              label="本期划缴"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="qmye"
              show-overflow-tooltip
              label="期末余额"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="dczjye"
              show-overflow-tooltip
              label="查看资金余额"/>
          </el-table>
        </el-scrollbar>
      </div>
      <!-- 银行名称层 -->
      <layer ref="layer" :tb-head="bankHead" :form="bankForm" :table-data="bankData" title="请选择所需项目" @select="selectbank" />
      <!-- 指派层 -->
      <layer ref="layer1" :tb-head="assignedHead" :form="assignedForm" :table-data="assignedData" title="请选择所属项目" @select="selectassigned" />
      <!-- 手工对账 -->
      <layers ref="layer2" :bank-guid="form.bankId"/>
      <!-- 修改层 -->
      <layermodification ref="layer3" @update="onSubmit"/>
    </div>
  </el-scrollbar>
</template>

<script>
import toolBar from '@/components/toolBar'
import Bus from '@/utils/Bus'
import layer from '@/components/layer.vue'
import layers from './layer.vue'
import layermodification from './modification.vue'
import yhdsgl from '@/api/yhdsgl/yhdsgl.js'
export default {
  components: {
    toolBar, // 上方工具条栏
    layer,
    layers,
    layermodification
  },
  data() {
    return {
      // 银行数据
      bankData: [],
      // 指派单位
      assignedData: [],
      // 银行表头
      bankHead: [
        {
          prop: 'bankcode',
          label: '银行编码'
        },
        {
          prop: 'bankname',
          label: '银行名称'
        },
        {
          label: 'CHGAGENCYACCTNAME',
          prop: 'chgagencyacctname'
        },
        {
          label: 'CHGAGENCYBANKACCOUNT',
          prop: 'chgagencybankaccount'
        },
        {
          label: 'CHGAGENCYBANKNAME',
          prop: 'chgagencybankname'
        }
      ],
      // 银行表单
      bankForm: {
        coding: '',
        // 下拉框选项
        codingoption: [
          {
            val: '银行编码',
            key: 'bankcode'
          },
          {
            val: '银行名称',
            key: 'bankname'
          },
          {
            val: 'CHGAGENCYACCTNAME',
            key: 'chgagencyacctname'
          },
          {
            val: 'CHGAGENCYBANKACCOUNT',
            key: 'chgagencybankaccount'
          },
          {
            val: 'CHGAGENCYBANKNAME',
            key: 'chgagencybankname'
          }
        ],
        equal: ''
      },
      // 指派单位表头
      assignedHead: [
        {
          prop: 'agencycode',
          label: '指收单位编码',
          width: '120px'
        },
        {
          prop: 'agencyname',
          label: '执收单位名称',
          width: '170px'
        },
        {
          prop: 'pinyinshortcode',
          label: '拼音简码'
        },
        {
          prop: 'orgcode',
          label: '机构代码'
        },
        {
          prop: 'isleaf',
          label: '末级标志'
        }
      ],
      // 指派单位表单
      assignedForm: {
        coding: '',
        // 下拉框选项
        codingoption: [
          {
            val: '指收单位编码',
            key: 'agencycode'
          },
          {
            val: '执收单位名称',
            key: 'agencyname'
          },
          {
            val: 'pinyinshortcode',
            key: '拼音简码'
          },
          {
            val: '机构代码',
            key: 'orgcode'
          },
          {
            val: '末级标志',
            key: 'isleaf'
          }
        ],
        equal: ''
      },

      // 这里填写那些服务器没有返回，但是却在按钮组中存在的按钮。
      clientButnsArray: ['close', 'automatic', 'reconciliation', 'assigned', 'clear', 'refresh1', 'print', 'tablePrintPreview', 'set', 'export'],
      // 表单数据
      form: {
        bankId: '',
        chargeEndDate: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
        chargeStartDate: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-1`,
        filter: '',
        pageIndex: 1,
        pageSize: 10,
        selectedValue: '',
        tradeEndDate: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
        tradeStartDate: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-1`
      },
      // 全部或者银行
      tab: 1,
      // 银行名称
      bankname: '',
      // 是否开启日期
      isdate1: true,
      isdate2: true,
      // 是否筛选
      isfilter: false,
      // 顺序
      order: 0,
      // 总条数
      totalCount: 0,
      // 当前表格数据
      tableData: [],
      tableData1: [],
      // 当前表格选择项
      currentRow: {}
    }
  },
  computed: {
  },
  watch: {
    // 银行名称 关联id bankname为空bankId也清空
    bankname(n) {
      if (!n) {
        this.form.bankId = ''
      }
    }
  },
  created() {
    // 指派单位数据
    yhdsgl.basChargeagency().then(res => {
      this.assignedData = res.data
    })
    // 银行数据
    yhdsgl.basRemittedbank().then(res => {
      console.log('银行数据', JSON.stringify(res.data))
      this.bankData = res.data
    })
    // 自动对账
    // automatic
    Bus.$off('automatic')
    Bus.$on('automatic', () => {
      this.automatic()
    })
    // 手工对账
    // reconciliation
    Bus.$off('reconciliation')
    Bus.$on('reconciliation', () => {
      if (!this.form.bankId) {
        this.$message.error('请选择银行')
        return
      }
      this.$refs.layer2.dialogTableVisible = true
      this.$refs.layer2.form = {
        edate: '',
        sdate: '',
        pageIndex: 1,
        pageSize: 10,
        selectedValue: '',
        value: ''
      }
      this.$refs.layer2.form1 = {
        pageIndex: 1,
        pageSize: 10,
        selectedValue: '',
        value: ''
      }
      this.$refs.layer2.selection1 = []
      this.$refs.layer2.selection2 = []
      this.$refs.layer2.totalCount = 0
      this.$refs.layer2.totalCount1 = 0
      this.$refs.layer2.isdate = false
      this.$refs.layer2.filter = false
    })
    // 指派
    // assigned
    Bus.$off('assigned')
    Bus.$on('assigned', () => {
      if (!this.currentRow.guid) {
        this.$message.error('请先选择')
        return
      }
      this.$refs.layer1.dialogTableVisible = true
    })
    // 清除
    // clear
    Bus.$off('clear')
    Bus.$on('clear', () => {
      this.clear()
    })
    // 刷新
    // refresh1
    Bus.$off('refresh1')
    Bus.$on('refresh1', () => {
      this.form.pageIndex = 1
      this.onSubmit()
    })
    // 初次进入设置第一行为选中行
    this.$store.dispatch('SetCurrentRowIndex', 0)
  },

  methods: {
    // 自动对账
    automatic() {
      console.log(this.form)
      this.checkFounds(this.form).then(res => {
        this.form.pageIndex = 1
        this.onSubmit()
        this.$message({
          message: '自动对账完成',
          type: 'success'
        })
      })
    },
    // 切换tab
    tabfn(val) {
      if (val === 0) {
        if (!this.form.bankId) {
          this.$message.error('请先选择银行')
          this.tab = 1
          return
        }
      }
      this.form.pageIndex = 1
      this.onSubmit()
    },
    // 双击银行表
    dbRowbank(val) {
      console.log('bank', val)
      if (!val.bankid) {
        return
      }
      this.form.bankId = val.bankid
      this.bankname = val.bankname
      this.tab = 0
      this.form.pageIndex = 1
      this.onSubmit()
    },
    // 按银行汇总
    findBankSummary: yhdsgl.findBankSummary,
    // 全部
    findBankFundsDaily: yhdsgl.findBankFundsDaily,
    // 指派
    changeAgencyID: yhdsgl.changeAgencyID,
    // 自动对账
    checkFounds: yhdsgl.checkFounds,
    // 修改前查询
    getColFund: yhdsgl.getColFund,
    // 银行名称选择后监听
    selectbank(val) {
      console.log('单位名称选择数据', val)
      this.form.bankId = val.currentRow.guid
      this.bankname = val.currentRow.bankname
    },
    // 指派单位选择后监听
    selectassigned(val) {
      console.log('指派单位选择数据', val)
      console.log('指派单位选择数据id', val.currentRow.guid)
      this.changeAgencyID(this.currentRow.guid, val.currentRow.guid).then(res => {
        this.form.pageIndex = 1
        this.onSubmit()
        this.$message({
          message: '指派成功',
          type: 'success'
        })
      })
    },
    // 显示银行名称层
    showbank() {
      this.$refs.layer.dialogTableVisible = true
    },
    // 双击参看
    dbRow(val) {
      if (val.guid) {
        this.getColFund(val.guid).then(res => {
          this.$refs.layer3.dialogTableVisible = true
          this.$refs.layer3.btnsavestate = true
          this.$refs.layer3.form = Object.assign({}, val, res.data)
        })
      } else {
        return
      }
    },
    // 表格行选择设置
    handleCurrentChangeIndex(val) {
      // 记录选中行数。
      var i = this.tableData.findIndex(item => {
        return item === val
      })
      i = i >= 0 ? i : 0
      this.$store.dispatch('SetCurrentRowIndex', i)

      this.currentRow = val === null ? {} : val
    },
    // 关闭返回首页
    close() {
      var status = this.$store.getters.savestate
      if (status === 0) {
        this.$router.push('/')
        this.$message({
          showClose: true,
          message: '回到首页',
          type: 'success'
        })
      } else {
        return
      }
    },
    // 清除重置
    clear() {
      this.form.bankId = ''
      this.bankname = ''
      this.isfilter = false
      this.form.selectedValue = ''
      this.form.filter = ''
    },
    // 日期框是否开启-设置起始和终止时间
    isdateChange1(val) {
      if (val) {
        var time = new Date()
        this.form.chargeStartDate = `${time.getFullYear()}-${time.getMonth() + 1}-1`
        // 设置当前时间
        this.form.chargeEndDate = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`
      } else {
        this.form.chargeStartDate = ''
        this.form.chargeEndDate = ''
      }
    },
    isdateChange2(val) {
      if (val) {
        var time = new Date()
        this.form.tradeStartDate = `${time.getFullYear()}-${time.getMonth() + 1}-1`
        // 设置当前时间
        this.form.tradeEndDate = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`
      } else {
        this.form.tradeStartDate = ''
        this.form.tradeEndDate = ''
      }
    },
    // 筛选框改变
    isfilterChange(val) {
      if (val) {
        // 设置默认选中项
        this.form.filter = ''
        this.form.selectedValue = ''
      } else {
        this.form.filter = ''
        this.form.selectedValue = ''
      }
    },
    // 当前表格查找 ==> 筛选按钮
    onSubmit() {
      console.log('查询', this.form)
      if (this.tab === 1) {
        this.findBankSummary(this.form).then(res => {
          // 按银行汇总
          console.log('按银行汇总', res)
          this.totalCount = res.data.pageInfo.totalCount
          if (this.order === 0) {
            this.tableData1 = []
            this.tableData1 = res.data.data
          } else if (this.order === 1) {
            this.tableData1 = res.data.data.reverse()
          }
          if (this.tableData1.length === 0) {
            return
          }
          // 合计
          var top = [this.tableData1.reduce((a, b) => {
            return {
              bankname: '合计',
              qcye: (Number(a.qcye) + Number(b.qcye)).toFixed(2),
              zcsr: (Number(a.zcsr) + Number(b.zcsr)).toFixed(2),
              dcsr: (Number(a.dcsr) + Number(b.dcsr)).toFixed(2),
              yqrdcsr: (Number(a.yqrdcsr) + Number(b.yqrdcsr)).toFixed(2),
              wqrdcsr: (Number(a.wqrdcsr) + Number(b.wqrdcsr)).toFixed(2),
              bqhj: (Number(a.bqhj) + Number(b.bqhj)).toFixed(2),
              qmye: (Number(a.qmye) + Number(b.qmye)).toFixed(2),
              dczjye: (Number(a.dczjye) + Number(b.dczjye)).toFixed(2)
            }
          }, {
            qcye: 0,
            zcsr: 0,
            dcsr: 0,
            yqrdcsr: 0,
            wqrdcsr: 0,
            bqhj: 0,
            qmye: 0,
            dczjye: 0
          })]
          this.tableData1 = top.concat(this.tableData1)
        })
      } else if (this.tab === 0) {
        // 全部
        // 是否选择银行
        if (!this.form.bankId) {
          this.$message.error('请选择银行')
          return
        }
        this.findBankFundsDaily(this.form).then(res => {
          console.log('全部', res)
          this.totalCount = res.data.pageInfo.totalCount
          if (this.order === 0) {
            this.tableData = res.data.data
          } else if (this.order === 1) {
            this.tableData = res.data.data.reverse()
          }
          if (this.tableData.length === 0) {
            return
          }
          console.log('this.tableData', this.tableData)
          // 合计
          var top = [this.tableData.reduce((a, b) => {
            return {
              banksn: '合计',
              income: (Number(a.income) + Number(b.income)).toFixed(2),
              expenditure: (Number(a.expenditure) + Number(b.expenditure)).toFixed(2)
            }
          }, {
            income: 0,
            expenditure: 0
          })]
          this.tableData = top.concat(this.tableData)
        })
      }
    },
    // 当前表格 页条数改变
    handleSizeChange(val) {
      this.form.pageSize = val
      this.onSubmit(this.form)
    },
    // 当前表格 页码改变 翻页
    handleCurrentChange(val) {
      this.form.pageIndex = val
      this.onSubmit(this.form)
    }
  }
}

</script>
<style lang="scss" scoped>
.el-scrollbar__view{
  height: 100%;
}
.view{
  height: 100%;
}
</style>

<style rel='stylesheet/scss' lang='scss' scoped>
.yxzjrb{
  display: flex;
  flex-direction: column;
  height: 100%;
  h1{
    height: 40px;
    line-height: 40px;
    text-decoration: underline;
    font-size: 20px;
    text-align: center;
    font-weight: 700;
    // margin-bottom: 20px;
  }
  .wrap-box{
    flex: 1;
    padding: 5px;
    height: 200px;
}
}
</style>
