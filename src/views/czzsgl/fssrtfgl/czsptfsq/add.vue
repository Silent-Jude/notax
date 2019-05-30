<template>
  <div>
    <el-dialog :visible.sync="dialogTableVisible" :close-on-click-modal="false" :before-close="returnDefault" title="非税收入减免录入" width="90%">
      <toolBar :isedit="state" :get-current-row="currentRow" :client-butns-array="clientButnsArray" />
      <!-- 筛选表单 -->
      <!-- <h1 class="title">非税收入减免录入</h1> -->
      <el-form ref="form" style="margin-top:5px;" size="mini" label-width="100px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="资金退付书编号">
              <el-input v-model="currentRow.rfdbillno" disabled clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="开具日期">
              <el-date-picker
                v-model="currentRow.rfdbilldate"
                :disabled="!state"
                value-format="yyyy-MM-dd hh:mm:ss"
                type="date"
                placeholder="选择日期"/>
            </el-form-item>
          </el-col>
          <!-- </el-row>
        <el-row> -->
          <el-col :span="6">
            <el-form-item label="原缴款书编号">
              <el-input
                v-model="currentRow.paybillno"
                :disabled="!state"
                clearable>
                <el-button slot="append" :disabled="!state" icon="el-icon-caret-bottom" @click="show2()"/>
              </el-input>
            </el-form-item>
          </el-col>
          <!-- </el-row>
        <el-row> -->
          <el-col :span="6">
            <el-form-item label="执收单位">
              <el-input v-model="currentRow.agencyname" disabled clearable/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="缴款人名称">
              <el-input v-model="currentRow.payer" disabled clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="缴款人账号">
              <el-input v-model="currentRow.payerbankacctno" disabled clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="缴款人开户行">
              <el-input v-model="currentRow.payeracctbank" disabled clearable/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="收款人名称">
              <el-input v-model="currentRow.bankname" disabled clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="收款人账号">
              <el-input v-model="currentRow.chgagencybankaccount" disabled clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="收款人开户行">
              <el-input v-model="currentRow.chgagencybankname" disabled clearable/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="退付原因">
              <el-input :disabled="!state" v-model="currentRow.causa" type="textarea"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 显示表格 -->
      <div class="wrap-add">
        <el-scrollbar style="height:100%;width:100%;">
          <el-table
            :data="currentRow.details ? currentRow.details:[]"
            highlight-current-row
            border
            style="width: 100%">
            <el-table-column
              type="index"/>
            <!-- <el-table-column
              align="center"
              type="selection"
              width="60"/> -->
            <el-table-column
              v-for="(item) in detailHead"
              :key="item.prop"
              :width="item.width"
              :prop="item.prop"
              :label="item.label"
              sortable
              header-align="center"
              align="center"
              show-overflow-tooltip>
              <template slot-scope="scope">
                <el-checkbox v-if="item.prop === 'st'" :disabled="!state" v-model="scope.row.st" size="mini"/>
                <el-input v-else-if="state && item.prop === 'rfdamt'" v-model="scope.row.rfdamt" size="mini"/>
                <p v-else>{{ scope.row[item.prop] }}</p>
              </template>
            </el-table-column>

          </el-table>
        </el-scrollbar>
      </div>
    </el-dialog>
    <!-- 请选择缴款书信息 -->
    <layer ref="layer2" :tb-head="payHead" :form="payForm" :table-data="pay" title="请选择缴款书信息" @select="paySelect"/>
  </div>
</template>
<script>
import fssrtfgl from '@/api/czzsgl/fssrtfgl/fssrtfgl.js'
import layer from '@/components/layer'
import Bus from '@/utils/Bus'
import toolBar from '@/components/toolBar'
export default {
  components: {
    toolBar,
    layer
  },
  data() {
    return {
      // 提取表头
      detailHead: [
        {
          prop: 'st',
          label: '选择',
          width: '80px'
        },
        {
          prop: 'nontaxcode',
          label: '收费项目编码',
          width: '160px'
        },
        {
          prop: 'nontaxname',
          label: '收费项目名称',
          width: '200px'
        },
        {
          prop: 'amt',
          label: '收费金额',
          width: '200px'
        },
        {
          prop: 'rfdamt',
          label: '退付金额',
          width: '200px'
        }
      ],
      // 编辑状态
      state: true,
      // 数据
      currentRow: {
        rfdbilldate: '',
        details: []
      },
      // 工具条
      clientButnsArray: ['close', 'czbillAddAudit', 'czbillUnaudit', 'tablePrintPreview', 'print', 'export', 'tablePrintSet'],
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
      pay: []
    }
  },
  computed: {
  },
  created() {
    //
    fssrtfgl.findTradeOfSelect(2).then(res => {
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
    // 减免计算
    deramtchange(scope) {
      scope.row.actamt = scope.row.amt - (+scope.row.deramt)
    },
    // 修改
    billUpdate2() {
      fssrtfgl.get(this.currentRow.guid).then(res => {
        console.log(res)
        console.log(JSON.stringify(res.data))
        res.data.rfdDetails.forEach((item, index) => {
          // res.data.details[index].proid1 = res.data.details[index].proid
          // res.data.details[index].proid = ''
          res.data.details[index].st = true
          res.data.details[index] = Object.assign(res.data.details[index], item)
        })
        this.currentRow = res.data
        this.state = true
      })
    },
    // 保存
    save() {
      if (!this.currentRow.causa) {
        this.$message.error('退付原因为空')
        return
      }
      if (this.currentRow.details.filter(item => item.st === true).length === 0) {
        this.$message.error('退付信息为空')
        return
      } else {
        if (!this.currentRow.details.filter(item => item.st === true)[0].rfdamt) {
          this.$message.error('退付金额为空')
          return
        }
      }
      fssrtfgl.save(JSON.stringify(this.currentRow)).then(res => {
        console.log('保存成功', res)
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        // 重新获取
        fssrtfgl.get(res.data.guid).then(res => {
          // console.log(res)
          // console.log(JSON.stringify(res.data))
          // this.$refs.layer1.dialogTableVisible = true
          res.data.rfdDetails.forEach((item, index) => {
          // res.data.details[index].proid1 = res.data.details[index].proid
          // res.data.details[index].proid = ''
            res.data.details[index].st = true
            res.data.details[index] = Object.assign(res.data.details[index], item)
          })
          this.currentRow = res.data
          this.state = false
        })
      })
    },
    //
    paySelect(val) {
      var time = new Date()
      fssrtfgl.findColTradeDetailById(val.currentRow.guid).then(res => {
        console.log(res.data)
        this.currentRow = JSON.parse(JSON.stringify(val.currentRow))
        this.currentRow.tradeid = this.currentRow.guid
        this.currentRow.guid = null
        this.currentRow.admdivcode = this.$store.getters.userInfo.admdivcode
        this.currentRow.year = this.$store.getters.userInfo.year
        this.currentRow.bankcode = val.currentRow.bankid
        this.currentRow.rfdbilldate = `${time.getFullYear()}-${(time.getMonth() + 1) > 9 ? (time.getMonth() + 1) : ('0' + (time.getMonth() + 1))}-${time.getDate()} 00:00:00`
        this.currentRow.details = res.data
      })
    },
    show2() {
      this.$refs.layer2.dialogTableVisible = true
    },
    returnDefault(done) {
      // 关闭刷新主表数据。
      Bus.$emit('onSubmit')
      done()
    }
  }
}
</script>

