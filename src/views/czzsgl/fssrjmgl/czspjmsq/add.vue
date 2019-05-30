<template>
  <div>
    <el-dialog :visible.sync="dialogTableVisible" :close-on-click-modal="false" :before-close="returnDefault" title="非税收入减免录入" width="90%">
      <toolBar :isedit="state" :get-current-row="currentRow" :client-butns-array="clientButnsArray" />
      <!-- 筛选表单 -->
      <!-- <h1 class="title">非税收入减免录入</h1> -->
      <el-form ref="form" style="margin-top:5px;" size="mini" label-width="100px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="申请日期">
              <el-date-picker
                v-model="currentRow.writedate"
                :disabled="!state"
                value-format="yyyy-MM-dd hh:mm:ss"
                type="date"
                placeholder="选择日期"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单据编码">
              <el-input v-model="currentRow.receipno" disabled clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="申请人">
              <el-input v-model="currentRow.writer" :disabled="!state" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="申请单位">
              <el-input
                v-model="currentRow.agencyname"
                disabled
                clearable>
                <el-button slot="append" :disabled="!state" icon="el-icon-caret-bottom" @click="show()"/>
              </el-input>
            </el-form-item>
          </el-col>
          <!-- </el-row>
        <el-row> -->
          <el-col :span="12">
            <el-form-item label="原缴款书编号">
              <el-input
                v-model="currentRow.coltrade.paybillno"
                :disabled="!state"
                clearable>
                <el-button slot="append" :disabled="!state" icon="el-icon-caret-bottom" @click="show2()"/>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="减免事项">
              <el-input v-model="currentRow.deridx" :disabled="!state" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="减免类型">
              <el-radio-group :disabled="!state" v-model="currentRow.dertype">
                <el-radio label="减征">减征</el-radio>
                <el-radio label="免征">免征</el-radio>
                <el-radio label="缓征">缓征</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="减免原因">
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
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="index"/>
            <el-table-column
              align="center"
              type="selection"
              width="60"/>
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
                <el-input v-if="state && item.prop === 'deramt'" v-model="scope.row.deramt" size="mini" @change="deramtchange(scope)"/>
                <p v-else>{{ scope.row[item.prop] }}</p>
              </template>
            </el-table-column>

          </el-table>
        </el-scrollbar>
      </div>
    </el-dialog>
    <!-- 请选择缴款书信息 -->
    <!-- <layer ref="layer1" :tb-head="tbHead" :form="formBasagency" :table-data="BasagencyList" title="选择所属项目" @select="getSelect"/> -->
    <!-- 单位名称 -->
    <layer ref="layer1" :tb-head="tbHead" :form="formBasagency" :table-data="BasagencyList" title="选择所属项目" @select="getSelect" />
    <!-- 请选择缴款书信息 -->
    <layer ref="layer2" :tb-head="payHead" :form="payForm" :table-data="pay" title="请选择缴款书信息" @select="paySelect"/>
  </div>
</template>
<script>
import fssrjmgl from '@/api/czzsgl/fssrjmgl/fssrjmgl.js'
import layer from '@/components/layer'
import Bus from '@/utils/Bus'
import toolBar from '@/components/toolBar'
// import formatMoney from '@/utils/formatMoney'
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
          prop: 'deramt',
          label: '减免金额',
          width: '200px'
        },
        {
          prop: 'actamt',
          label: '实收金额',
          width: '200px'
        }
      ],
      // 单位名称
      BasagencyList: [],
      tbHead: [
        {
          prop: 'agencycode',
          label: '指收单位编码',
          width: '120px'
        },
        {
          prop: 'agencyname',
          label: '执收单位名称',
          width: '200px'
        },
        {
          prop: 'pinyinshortcode',
          label: '拼音简码'
        },
        {
          prop: 'orgcode',
          label: '机构代码',
          width: '170px'
        },
        {
          prop: 'isleaf',
          label: '末级标志'
        }
      ],
      formBasagency: {
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
            val: '拼音简码',
            key: 'pinyinshortcode'
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
      // 勾选项
      // select: [],
      // 编辑状态
      state: true,
      // 数据
      currentRow: {
        dertype: '',
        writedate: '',
        coltrade: {
          paybillno: ''
        },
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
    // 金额转大写
    // formatMoney() {
    //   return this.currentRow.amt ? formatMoney.Arabia_To_Chinese(this.currentRow.amt) : ''
    // }
  },
  created() {
    // this.currentRow.coltrade = {}
    // 项目
    fssrjmgl.basChargeagencyfind().then(res => {
      console.log('res1', res)
      this.BasagencyList = res.data
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
      fssrjmgl.get(this.currentRow.guid).then(res => {
        console.log(res)
        console.log(JSON.stringify(res.data))
        this.currentRow = res.data
        this.state = true
      })
    },
    // 保存
    save() {
      fssrjmgl.save(JSON.stringify(this.currentRow)).then(res => {
        console.log('保存成功', res)
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        // 重新获取
        fssrjmgl.get(res.data.guid).then(res => {
          // console.log(res)
          // console.log(JSON.stringify(res.data))
          // this.$refs.layer1.dialogTableVisible = true
          this.currentRow = res.data
          this.state = false
        })
      })
    },
    // 添加
    addModificationTable() {
      // if (!this.currentRow.agencyid) {
      //   return
      // }
      // fssrjmgl.agency2Project(this.currentRow.agencyid).then(res => {
      //   this.pay = res.data
      //   this.$refs.layer2.dialogTableVisible = true
      // })
    },
    // 项目
    paySelect(val) {
      this.currentRow.coltrade.paybillno = val.currentRow.paybillno
      this.currentRow.remark = val.currentRow.guid
      fssrjmgl.findColTradeDetailById(val.currentRow.guid).then(res => {
        console.log(res.data)
        // amt/deramt/actamt
        this.currentRow.details = res.data.map(item => {
          item.deramt = 0
          item.actamt = item.amt
          return item
        })

        // this.currentRow.details = res.data
      })
    },
    // 缴款书
    getSelect(val) {
      // Object.assign
      // guid-----agencyid

      // this.currentRow = JSON.parse(JSON.stringify(val.currentRow))
      this.currentRow = Object.assign(this.currentRow, val.currentRow)
      this.currentRow.agencyid = this.currentRow.guid
      this.currentRow.guid = null
      // this.currentRow.coltrade = {}
      this.currentRow.coltrade.paybillno = ''
      this.currentRow.details = []
      // var time = new Date()
      // this.currentRow.writedate = `${time.getFullYear()}-${(time.getMonth() + 1) > 9 ? (time.getMonth() + 1) : ('0' + (time.getMonth() + 1))}-${time.getDate()}`
    },
    // 请选择缴款书信息
    show() {
      this.$refs.layer1.dialogTableVisible = true
    },
    show2() {
      if (!this.currentRow.agencyid) {
        return
      }
      fssrjmgl.findTradeOfSelect(this.currentRow.agencyid, 3).then(res => {
        this.pay = res.data
        this.$refs.layer2.dialogTableVisible = true
      })
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

