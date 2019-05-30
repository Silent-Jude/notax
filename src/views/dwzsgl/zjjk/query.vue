<template>
  <el-dialog :visible.sync="dialogTableVisible" class="query zjjk" title="查询" width="90%" @open="open">
    <!-- 工具条 -->
    <toolBar :client-butns-array="clientButnsArray" />
    <h1 class="title">非税收入一般缴款书查询</h1>
    <!-- 上表 -->
    <el-form ref="form" size="mini" label-width="80px">
      <el-row>
        <el-col :span="2">
          <el-form-item label-width="20px" style="margin-bottom:0px" label="">
            <el-checkbox-group v-model="isdate1" @change="isdateChange1">
              <el-checkbox label="收款日期" name="type"/>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item style="margin-bottom:0px" label="" label-width="0px">
            <el-date-picker
              :disabled="!isdate1"
              v-model="form.chargeStartDate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"/>
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <el-form-item style="margin-bottom:0px" label="至" label-width="40px"/>
        </el-col>
        <el-col :span="3">
          <el-form-item style="margin-bottom:0px" label="" label-width="0px">
            <el-date-picker
              :disabled="!isdate1"
              v-model="form.chargeEndDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"/>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item style="margin-bottom:0px" label-width="90px" label="缴款书编号">
            <el-input v-model="payBillNo1" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item style="margin-bottom:0px" label-width="90px" label="缴款人全称">
            <el-input v-model="payer1" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="2">
          <el-form-item style="margin-bottom:0px" label-width="20px" label="">
            <el-checkbox-group v-model="isdate2" @change="isdateChange2">
              <el-checkbox label="开票日期" name="type"/>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item style="margin-bottom:0px" label="" label-width="0px">
            <el-date-picker
              :disabled="!isdate2"
              v-model="form.billStartDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"/>
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <el-form-item style="margin-bottom:0px" label="至" label-width="40px"/>
        </el-col>
        <el-col :span="3">
          <el-form-item style="margin-bottom:0px" label="" label-width="0px">
            <el-date-picker
              :disabled="!isdate2"
              v-model="form.billEndDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"/>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item style="margin-bottom:0px" label-width="90px" label="决定书号">
            <el-input v-model="payBillNo2" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item style="margin-bottom:0px" label-width="90px" label="收款人全称">
            <el-input v-model="payer2" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item style="margin-bottom:0px" label-width="10px" label="">
            <el-radio-group v-model="form.flag">
              <el-radio :label="0">全部</el-radio>
              <el-radio :label="3">已审核</el-radio>
              <el-radio :label="4">未审核</el-radio>
              <el-radio :label="2">已作废</el-radio>
              <el-radio :label="9">未作废</el-radio>
              <el-radio :label="5">已收款</el-radio>
              <el-radio :label="6">未收款</el-radio>
              <el-radio :label="7">已回单</el-radio>
              <el-radio :label="8">未回单</el-radio>
              <el-radio :label="9">已到期</el-radio>
              <el-radio :label="10">处罚决定书</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
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
    <div class="wrap-box wrap">
      <el-scrollbar style="height:100%;width:100%;">
        <el-table
          ref="singleTable"
          :data="tableData"
          border
          style="width: 100%"
          highlight-current-row
          @row-dblclick = "dbRow">
          <el-table-column
            type="index"/>
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
            prop="paybillno"
            show-overflow-tooltip
            label="缴款书编号"/>
          <el-table-column
            sortable
            header-align="center"
            align="center"
            width="120"
            prop="billdate"
            show-overflow-tooltip
            label="开票日期"/>
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
            prop="payer"
            show-overflow-tooltip
            label="缴款人全称"/>
          <el-table-column
            sortable
            header-align="center"
            align="center"
            width="120"
            prop="oldamt"
            show-overflow-tooltip
            label="收费金额"/>
          <el-table-column
            sortable
            header-align="center"
            align="center"
            width="170"
            prop="agencycode"
            show-overflow-tooltip
            label="执收单位编码"/>
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
            width="170"
            prop="nontaxcode"
            show-overflow-tooltip
            label="收费项目编码"/>
          <el-table-column
            sortable
            header-align="center"
            align="center"
            width="170"
            prop="nontaxname"
            show-overflow-tooltip
            label="收费项目名称"/>
          <el-table-column
            sortable
            header-align="center"
            align="center"
            width="100"
            prop="safecode"
            show-overflow-tooltip
            label="校验码"/>
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
            prop="drawer"
            show-overflow-tooltip
            label="开票人"/>
          <el-table-column
            sortable
            header-align="center"
            align="center"
            width="100"
            prop="audited"
            show-overflow-tooltip
            label="审核标志"/>
          <el-table-column
            sortable
            header-align="center"
            align="center"
            width="120"
            prop="jdsh"
            show-overflow-tooltip
            label="决定书号"/>
          <el-table-column
            sortable
            header-align="center"
            align="center"
            width="100"
            prop="auditor"
            show-overflow-tooltip
            label="审核人"/>
          <el-table-column
            sortable
            header-align="center"
            align="center"
            width="120"
            prop="auditdate"
            show-overflow-tooltip
            label="审核日期"/>
          <el-table-column
            sortable
            header-align="center"
            align="center"
            width="100"
            prop="charged"
            show-overflow-tooltip
            label="收款标志"/>
          <el-table-column
            sortable
            header-align="center"
            align="center"
            width="100"
            prop="payee"
            show-overflow-tooltip
            label="收款人"/>
          <el-table-column
            sortable
            header-align="center"
            align="center"
            width="100"
            prop="cancelled"
            show-overflow-tooltip
            label="作废标志"/>
          <el-table-column
            sortable
            header-align="center"
            align="center"
            width="100"
            prop="canceller"
            show-overflow-tooltip
            label="作废人"/>
          <el-table-column
            sortable
            header-align="center"
            align="center"
            width="120"
            prop="canceldate"
            show-overflow-tooltip
            label="作废日期"/>
          <el-table-column
            sortable
            header-align="center"
            align="center"
            width="120"
            prop="receipted"
            show-overflow-tooltip
            label="回单标志"/>
          <el-table-column
            sortable
            header-align="center"
            align="center"
            width="120"
            prop="regcanceller"
            show-overflow-tooltip
            label="回单登记人"/>
          <el-table-column
            sortable
            header-align="center"
            align="center"
            width="120"
            prop="regcanceldate"
            show-overflow-tooltip
            label="回单登记日期"/>

        </el-table>
      </el-scrollbar>
    </div>
    <tablePrintSet :print-data="listPrintData" :template-data="templateDataList" :form-print-data="formPrintData"/>
  </el-dialog>
</template>
<script>
import dwzsgl from '@/api/dwzsgl/dwzsgl.js'
import toolBar from '@/components/toolBar'
import Bus from '@/utils/Bus'
import tablePrintSet from '@/components/tablePrintSet' // add
import { getPrintTemplateData, savePrintTemplateData } from '@/api/webPrint' // add

export default {
  components: {
    tablePrintSet, // 表格打印设置组件。add
    toolBar
  },
  data() {
    return {
      templateInitData: {
        guid: '',
        userid: null,
        templatecontent: {
          title: `${this.$route.meta.title}`,
          direction: 1,
          printHeadHeight: 50, // 打印头部区域的高度，单位mm
          printHead: [
            { text: '制表人', value: this.$store.state.user.name, checked: true }
          ],
          tableHead: [
            // tableData
            { text: '字轨', key: 'track', width: 100, checked: false },
            { text: '缴款书编号', key: 'paybillno', width: 100, checked: false },
            { text: '开票日期', key: 'billdate', width: 100, checked: false },
            { text: '收款日期', key: 'chargedate', width: 100, checked: false },
            { text: '缴款人全称', key: 'payer', width: 100, checked: false },
            { text: '收费金额', key: 'oldamt', width: 100, checked: false },
            { text: '执收单位编码', key: 'agencycode', width: 100, checked: false },
            { text: '执收单位名称', key: 'agencyname', width: 100, checked: false },
            { text: '收费项目编码', key: 'nontaxcode', width: 100, checked: false },
            { text: '收费项目名称', key: 'nontaxname', width: 100, checked: false },
            { text: '校验码', key: 'safecode', width: 100, checked: false },
            { text: '备注', key: 'remark', width: 100, checked: false },
            { text: '开票人', key: 'drawer', width: 100, checked: false },
            { text: '审核标志', key: 'audited', width: 100, checked: false },
            { text: '决定书号', key: 'jdsh', width: 100, checked: false },
            { text: '审核人', key: 'auditor', width: 100, checked: false },
            { text: '审核日期', key: 'auditdate', width: 100, checked: false },
            { text: '收款标志', key: 'charged', width: 100, checked: false },
            { text: '收款人', key: 'payee', width: 100, checked: false },
            { text: '作废标志', key: 'cancelled', width: 100, checked: false },
            { text: '作废人', key: 'canceller', width: 100, checked: false },
            { text: '作废日期', key: 'canceldate', width: 100, checked: false },
            { text: '回单标志', key: 'receipted', width: 100, checked: false },
            { text: '回单登记人', key: 'regcanceller', width: 100, checked: false },
            { text: '回单登记日期', key: 'regcanceldate', width: 100, checked: false }
          ],
          printFoot: [
            { text: '制表人', value: this.$store.state.user.name, checked: true }
          ]
        },
        isdefault: 1, // 是否现在使用的模板
        templatecode: this.$route.path + '/query',
        templatename: `标准模板（${this.$route.meta.title}）`,
        isstandardtemplage: 1 // 是否标准模板
      },
      templateDataList: [], //  add
      listPrintData: [], //  add 打印数据列表，只有在点击打印，预览，导出，设置时才加载。

      form: {
        agencyId: '', // 不传
        billEndDate: '',
        billStartDate: '',
        chargeEndDate: '',
        chargeStartDate: '',
        flag: 0,
        pageIndex: 1,
        pageSize: 10,
        payBillNo: '', // 23,21
        payer: '', // 21,12
        totamt: '', // 不传
        tradeType: 1// 1/2
      },
      payBillNo1: '', // 23,21
      payer1: '', // 21,12
      payBillNo2: '', // 23,21
      payer2: '', // 21,12
      // 总数
      totalCount: 0,
      // 收款日期是否开启
      isdate1: true,
      // 开票日期是否开启
      isdate2: true,
      // 工具条
      clientButnsArray: ['queryClose', 'refresh1', 'listPreview', 'listPrint', 'listSet', 'listExport', 'XML'],
      dialogTableVisible: false,
      tableData: []
    }
  },
  computed: {
    formPrintData() {
      return [
        { text: '制表人', value: this.$store.state.user.name, checked: true }
      ]
    }
  },
  created() {
    Bus.$off('listExport')
    Bus.$on('listExport', () => {
      this.getPrintList().then(res => {
        Bus.$emit('tablePrintExport')
      })
    })
    Bus.$off('listPreview')
    Bus.$on('listPreview', () => {
      this.getPrintList().then(res => {
        console.log('收到了要打印的数据，马上调用打印预览。')
        Bus.$emit('tablePrintPreview')
      })
    })
    Bus.$off('listPrint')
    Bus.$on('listPrint', () => {
      this.getPrintList().then(res => {
        Bus.$emit('tablePrint')
      })
    })
    Bus.$off('listSet')
    Bus.$on('listSet', () => {
      console.log('查看当前应用模板', this.templateDataList)
      console.log(this.form)
      console.log(this.templateInitData)
      this.getPrintList().then(res => {
        Bus.$emit('tablePrintSet')
      })
    })

    // Bus.$off('getPrintList')
    // Bus.$on('getPrintList', () => {
    //   this.getPrintList()
    // })
    // 组件创建时，立即获取打印模板数据。
    this.getPrintData()// add

    // 关闭
    Bus.$off('queryClose')
    Bus.$on('queryClose', () => {
      this.dialogTableVisible = false
    })
    // 刷新
    Bus.$off('refresh1')
    Bus.$on('refresh1', () => {
      this.form.pageIndex = 1
      this.query()
    })
  },
  methods: {

    getPrintData() { //  add
      var templateCode = this.$route.path
      getPrintTemplateData(templateCode).then(res => {
        console.log(res.data)
        if (res.data.length > 0) {
          this.templateDataList = res.data
          console.log('获取了服务器数据！')
        } else {
          this.templateDataList.push(JSON.parse(JSON.stringify(this.templateInitData)))
          this.templateDataList[0].templatecontent = JSON.stringify(this.templateInitData.templatecontent)
          savePrintTemplateData(this.templateDataList[0])
          console.log('获取了本地数据，并将本地数据存到了服务器！')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getPrintList() {
      return new Promise((resolve, reject) => {
        this.getListPrintData(this.form).then(res => {
          this.listPrintData = res.data.data
          resolve(res)
        }).catch(err => {
          console.log(err)
          reject(err)
        })
      })
    },
    // 获取打印列表数据
    getListPrintData: dwzsgl.getListPrintData,

    // 双击
    dbRow(row) {
      this.$emit('select', row)
      this.dialogTableVisible = false
    },
    // 查询
    query() {
      // 拼接payBillNo payer
      if (this.payBillNo2) {
        this.form.payBillNo = `${this.payBillNo1},${this.payBillNo2}`
      } else {
        this.form.payBillNo = this.payBillNo1
      }
      if (this.payer2) {
        this.form.payer = `${this.payer1},${this.payer2}`
      } else {
        this.form.payer = this.payer1
      }
      console.log('this.form', this.form)
      dwzsgl.basChargeagency(this.form).then(res => {
        console.log(res)
        this.totalCount = res.data.pageInfo.totalCount
        this.tableData = res.data.data
      })
    },
    // open页面
    open() {
      this.query()
    },
    // 日期框是否开启-设置起始和终止时间
    isdateChange1(val) {
      if (val) {
        var time = new Date()
        // this.form.chargeStartDate = `${time.getFullYear()}-${time.getMonth() + 1}-1`
        this.form.chargeStartDate = `${time.getFullYear()}-${time.getMonth()}-${time.getDate() + 1}`
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
        // this.form.billStartDate = `${time.getFullYear()}-${time.getMonth() + 1}-1`
        this.form.billStartDate = `${time.getFullYear()}-${time.getMonth()}-${time.getDate() + 1}`
        // 设置当前时间
        this.form.billEndDate = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`
      } else {
        this.form.billStartDate = ''
        this.form.billEndDate = ''
      }
    },
    // 当前表格 页条数改变
    handleSizeChange(val) {
      this.form.pageSize = val
      this.query()
    },
    // 当前表格 页码改变 翻页
    handleCurrentChange(val) {
      this.form.pageIndex = val
      this.query()
    }
  }
}
</script>

<style lang="scss">
.zjjk{

.el-scrollbar__view{
  height: 100%;
}
.el-table {
  overflow: initial;
}
.el-table__body-wrapper {
  overflow: initial !important;
}
.el-scrollbar__view {
  width: fit-content;
}
.title{
  height: 35px;
  line-height: 35px;
  text-decoration: underline;
  font-size: 20px;
  text-align: center;
  font-weight: 700;
  // margin-bottom: 20px;
}
  .wrap{
    height: 300px;
  }
}
// .query{

// }

</style>

