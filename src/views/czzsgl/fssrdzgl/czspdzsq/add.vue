<template>
  <div>
    <el-dialog :visible.sync="dialogTableVisible" :close-on-click-modal="false" :before-close="returnDefault" title="非税收入调整录入" width="90%">
      <toolBar :isedit="state" :get-current-row="currentRow" :client-butns-array="clientButnsArray" />
      <!-- 筛选表单 -->
      <!-- <h1 class="title">非税收入调整录入</h1> -->
      <el-form ref="form" style="margin-top:5px;" size="mini" label-width="80px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="开票日期">
              <el-date-picker
                v-model="currentRow.tradedate"
                disabled
                type="date"
                placeholder="选择日期"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单位名称">
              <el-input v-model="currentRow.agencyname" disabled clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单据编号">
              <el-input v-model="currentRow.noticeno" disabled clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="票据编号">
              <el-input
                v-model="currentRow.paybillno"
                :disabled="!state"
                clearable
                placeholder="请输入票据编号" >
                <el-button slot="append" :disabled="!state" icon="el-icon-caret-bottom" @click="show()"/>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <table border="1px" style="text-align: center;border: 1px solid #D0D7E5;line-height: 26px;" width="100%">
          <tr>
            <td rowspan="3" style="width:28px;">付款人</td>
            <td style="width:100px;">全称</td>
            <td>{{ currentRow.payer }}</td>
            <td rowspan="3" style="width:28px;">收款人</td>
            <td style="width:100px;">全称</td>
            <td>{{ currentRow.chgagencybankname }}</td>
          </tr>
          <tr>
            <!-- <td colspan="3">付款人</td> -->
            <td>账号</td>
            <td>{{ currentRow.payerbankacctno }}</td>
            <!-- <td>收款人</td> -->
            <td>账号</td>
            <td>{{ currentRow.chgagencybankaccount }}</td>
          </tr>
          <tr>
            <!-- <td colspan="3">付款人</td> -->
            <td>开户银行</td>
            <td>{{ currentRow.payerbankname }}</td>
            <!-- <td>收款人</td> -->
            <td>开户银行</td>
            <td>{{ currentRow.chgagencybankname }}</td>
          </tr>
          <tr>
            <td colspan="2">金额大写</td>
            <td>{{ formatMoney }}</td>
            <td colspan="2">金额小写</td>
            <td>{{ currentRow.amt }}</td>
          </tr>
        </table>
      </el-form>
      <!-- 显示表格 -->
      <div class="wrap-add">
        <!-- 表1 -->
        <el-scrollbar style="height:100%;width:100%;margin-top:5px;">
          <el-table
            :data="currentRow.olddetails || []"
            highlight-current-row
            border
            style="width: 100%">
            <el-table-column
              width="90"
              show-overflow-tooltip
              sortable
              align="center"
              type="index"/>
            <el-table-column
              align="center"
              prop="nontaxcode"
              width="160"
              show-overflow-tooltip
              sortable
              label="收费项目编码"/>
            <el-table-column
              align="center"
              prop="nontaxname"
              width="200"
              show-overflow-tooltip
              sortable
              label="收费项目名称"/>
            <el-table-column
              align="center"
              prop="chargeunit"
              width="100"
              show-overflow-tooltip
              sortable
              label="计量单位"/>
            <el-table-column
              align="center"
              prop="num"
              width="100"
              show-overflow-tooltip
              sortable
              label="收费数量"/>
            <el-table-column
              align="center"
              prop="chargelower"
              width="100"
              show-overflow-tooltip
              sortable
              label="收费标准"/>
            <el-table-column
              align="center"
              prop="amt"
              width="120"
              show-overflow-tooltip
              sortable
              label="收费金额"/>
          </el-table>
        </el-scrollbar>
        <!-- 表2 -->
        <el-button
          :disabled="!state"
          style="margin:5px 0"
          size="mini"
          type="danger"
          @click="deleteSelected()">删除所选{{ state }}</el-button>
        <el-scrollbar style="height:100%;width:100%;">
          <el-table
            :data="currentRow.newDetails ? currentRow.newDetails.concat({}):[].concat({})"
            highlight-current-row
            border
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
              align="center"
              type="selection"
              width="60"/>
            <el-table-column
              align="center"
              width="90"
              show-overflow-tooltip
              sortable
              type="index">
              <template slot-scope="scope">
                <div v-if="state">
                  <el-button
                    size="mini"
                    type="primary"
                    @click="addModificationTable(scope.$index, scope.row)">{{ scope.$index+1 }}添加</el-button>
                </div>
                <p v-else>{{ scope.$index + 1 }}</p>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="nontaxcode"
              width="160"
              show-overflow-tooltip
              sortable
              label="收费项目编码"/>
            <el-table-column
              align="center"
              prop="nontaxname"
              width="200"
              show-overflow-tooltip
              sortable
              label="收费项目名称"/>
            <el-table-column
              align="center"
              prop="chargeunit"
              width="100"
              show-overflow-tooltip
              sortable
              label="计量单位"/>
            <el-table-column
              align="center"
              prop="num"
              width="100"
              show-overflow-tooltip
              sortable
              label="收费数量">
              <template slot-scope="scope">
                <p v-if="scope.row.num === undefined"/>
                <el-input v-else-if="state" v-model="scope.row.num" size="mini"/>
                <p v-else>{{ scope.row.num }}</p>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="chargelower"
              width="100"
              show-overflow-tooltip
              sortable
              label="收费标准"/>
            <el-table-column
              prop="amt"
              align="center"
              width="120"
              show-overflow-tooltip
              sortable
              label="收费金额">
              <template slot-scope="scope">
                <p v-if="scope.row.amt === undefined"/>
                <el-input v-else-if="state" v-model="scope.row.amt" size="mini"/>
                <p v-else>{{ scope.row.amt }}</p>
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>
      </div>
    </el-dialog>
    <!-- 请选择缴款书信息 -->
    <layer ref="layer1" :tb-head="payHead" :form="payForm" :table-data="pay" title="请选择缴款书信息" @select="paySelect"/>
    <!-- 请选择你所需项目 -->
    <layer ref="layer2" :tb-head="porHead" :form="proForm" :table-data="pro" title="请选择你所需项目" @select="proSelect"/>
  </div>
</template>
<script>
import fssrtzgl from '@/api/czzsgl/fssrtzgl/fssrtzgl.js'
import layer from '@/components/layer'
import Bus from '@/utils/Bus'
import toolBar from '@/components/toolBar'
import formatMoney from '@/utils/formatMoney'
export default {
  components: {
    toolBar,
    layer
  },
  props: {

  },
  data() {
    return {
      // 勾选项
      select: [],
      // 编辑状态
      state: true,
      // 数据
      currentRow: {},
      // 工具条
      clientButnsArray: ['czbillClose', 'czbillAddAudit', 'czbillUnaudit'],
      // 是否显示
      dialogTableVisible: false,
      payHead: [
        {
          prop: 'paybillno',
          label: '缴款书编号'
        },
        {
          prop: 'track',
          label: '字轨'
        },
        {
          prop: 'payer',
          label: '缴款人全称'
        },
        {
          prop: 'payerbankacctno',
          label: '缴款人账号'
        },
        {
          prop: 'payerbankname',
          label: '缴款人开户行'
        },
        {
          prop: 'chgagencybankname',
          label: '收款人全称'
        },
        {
          prop: 'chgagencybankaccount',
          label: '收款人账号'
        },
        {
          prop: 'chgagencybankname',
          label: '收款人开户行'
        },
        {
          prop: 'billcode',
          label: '票据编号'
        },
        {
          prop: 'billname',
          label: '票据名称'
        },
        {
          prop: 'safecode',
          label: '校验码'
        },
        {
          prop: 'drawer',
          label: '开票人'
        },
        {
          prop: 'audited',
          label: '审核标志'
        },
        {
          prop: 'auditor',
          label: '审核人'
        },
        {
          prop: 'auditdate',
          label: '审核日期'
        },
        {
          prop: 'cancelled',
          label: '作废标志'
        },
        {
          prop: 'canceller',
          label: '作废人'
        },
        {
          prop: 'canceldate',
          label: '作废日期'
        },
        {
          prop: 'receipted',
          label: '回单标志'
        },
        {
          prop: 'confirm',
          label: '待查确认标志'
        },
        {
          prop: 'tradedate',
          label: '开票日期'
        },
        {
          prop: 'totamt',
          label: '金额'
        }
      ],
      payForm: {
        coding: '',
        // 下拉框选项
        codingoption: [
          {
            val: '缴款书编号',
            key: 'paybillno'
          }
        ],
        equal: ''
      },
      pay: [],
      porHead: [
        {
          prop: 'nontaxcode',
          label: '项目编码'
        },
        {
          prop: 'nontaxname',
          label: '项目名称'
        },
        {
          prop: 'chargeunit',
          label: '计量单位'
        },
        {
          prop: 'chargelimit',
          label: '收费上限'
        },
        {
          prop: 'chargelower',
          label: '收费下限'
        }
      ],
      proForm: {
        coding: '',
        // 下拉框选项
        codingoption: [
          {}
        ],
        equal: ''
      },
      pro: []
    }
  },
  computed: {
    // 金额转大写
    formatMoney() {
      return this.currentRow.amt ? formatMoney.Arabia_To_Chinese(this.currentRow.amt) : ''
    }
  },
  created() {
    // 缴款书数据
    fssrtzgl.findTradeOfSelect(1).then(res => {
      this.pay = res.data
    })
    // 关闭
    Bus.$off('billClose')
    Bus.$on('billClose', () => {
      this.dialogTableVisible = false
    })
    // 保存
    Bus.$off('billSave')
    Bus.$on('billSave', () => {
      this.save()
    })
    // 修改
    Bus.$off('billUpdate2')
    Bus.$on('billUpdate2', () => {
      this.billUpdate2()
    })
    // 取消
    Bus.$off('billAbolish')
    Bus.$on('billAbolish', () => {
      this.dialogTableVisible = false
    })
  },
  methods: {
    // 修改
    billUpdate2() {
      fssrtzgl.get(this.currentRow.guid).then(res => {
        console.log(res)
        console.log(JSON.stringify(res.data))
        this.currentRow = res.data[0]
        this.state = true
      })
    },
    // 保存
    save() {
      fssrtzgl.save(JSON.stringify(this.currentRow)).then(res => {
        console.log('保存成功', res)
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        // 重新获取
        fssrtzgl.get(res.data.guid).then(res => {
          // console.log(res)
          // console.log(JSON.stringify(res.data))
          // this.$refs.layer1.dialogTableVisible = true
          this.currentRow = res.data[0]
          this.state = false
        })
      })
    },
    // 添加
    addModificationTable() {
      if (!this.currentRow.agencyid) {
        return
      }
      fssrtzgl.agency2Project(this.currentRow.agencyid).then(res => {
        this.pro = res.data
        this.$refs.layer2.dialogTableVisible = true
      })
    },
    // 项目
    proSelect(val) {
      console.log('xz', val.currentRow)
      console.log('xz', val.currentRow.guid)
      var findex = this.currentRow.newDetails.findIndex((item) => {
        return item.pguid === val.currentRow.guid
      })
      if (findex !== -1) {
        this.$message.error('不能重复添加')
        return
      } else {
        var data = JSON.parse(JSON.stringify(val.currentRow))
        data.amt = 0
        data.num = 1
        data.pguid = data.guid
        data.guid = null
        this.currentRow.newDetails.push(data)
      }
    },
    // 缴款书
    paySelect(val) {
      console.log('s', val.currentRow)
      var data = JSON.parse(JSON.stringify(val.currentRow))
      data.olddetails = []
      data.newDetails = []
      fssrtzgl.findColTradeDetailById(val.currentRow.guid).then(res => {
        console.log('old', res)
        data.olddetails = res.data
        data.admdivcode = this.$store.getters.userInfo.admdivcode
        data.year = this.$store.getters.userInfo.year
        data.tradeid = data.guid
        data.guid = null
        data.amt = 0
        data.olddetails = res.data
        data.olddetails.forEach(item => {
          data.amt += +item.amt
        })
        this.currentRow = data
      })
    },
    // 请选择缴款书信息
    show() {
      this.$refs.layer1.dialogTableVisible = true
    },
    // 勾选
    handleSelectionChange(val) {
      // console.log(val)
      this.select = val
    },
    // 删除所选
    deleteSelected() {
      this.select.forEach(item => {
        var findex = this.currentRow.newDetails.findIndex(i => {
          return i === item
        })
        this.currentRow.newDetails.splice(findex, 1)
      })
    },
    returnDefault(done) {
      // 关闭刷新主表数据。
      Bus.$emit('onSubmit')
      done()
    }
  }
}
</script>

