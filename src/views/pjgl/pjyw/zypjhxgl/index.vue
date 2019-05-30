<!--   专用票据核销管理    -->
<template>
  <el-scrollbar style="height:100%;width:100%;">
    <div class="pjyztzs">
      <toolBar :client-butns-array="clientButnsArray" />
      <h1>专用票据核销管理</h1>
      <el-form ref="form" :model="form" size="mini" label-width="80px">
        <el-row>
          <el-col :span="2">
            <el-form-item label-width="20px" label="">
              <el-checkbox-group v-model="form.isdate" @change="isdateChange">
                <el-checkbox label="日期" name="type"/>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="" label-width="0px">
              <el-date-picker
                :disabled="!form.isdate"
                v-model="form.startDate"
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
                :disabled="!form.isdate"
                v-model="form.endDate"
                type="date"
                placeholder="选择日期"/>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label="" label-width="20px">
              <el-checkbox-group v-model="form.isfilter" @change="isfilterChange">
                <el-checkbox label="筛选" name="type"/>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="" label-width="0px">
              <el-select :disabled="!form.isfilter" v-model="form.filterName" placeholder="">
                <el-option label="单据编码" value="receipno"/>
                <el-option label="业务日期" value="requestdate"/>
                <el-option label="审核日期" value="auditdate"/>
                <el-option label="单位编码" value="agencycode"/>
                <el-option label="单位名称" value="agencyname"/>
                <el-option label="票据领用证号" value="permitno"/>
                <el-option label="票据领用证名称 " value="billpermitname"/>
                <el-option label="经手人" value="attn"/>
                <el-option label="制单人" value="operator"/>
                <el-option label="送审人" value="delivered"/>
                <el-option label="送审日期" value="approvaldate"/>
                <el-option label="审核人 " value="reviewer"/>
                <el-option label="发票人 " value="personnel"/>
                <el-option label="发票日期 " value="releasedate"/>
                <el-option label="审核信息 " value="reviewerinfo"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="等于" label-width="50px">
              <el-input :disabled="!form.isfilter" v-model="form.filterValue" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9">
            <el-form-item label="票据名称">
              <el-input
                v-model="basChargeagency"
                clearable
                placeholder="请输入票据名称" >
                <el-button slot="append" icon="el-icon-caret-bottom" @click="showBasBillinfo()"/>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="60px" label="字轨">
              <el-input v-model="form.track" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label-width="70px" label="票据号码">
              <el-input v-model="form.billNumber" clearable/>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label-width="10px" label="">
              <el-radio-group v-model="form.flag">
                <el-radio :label="0">全部</el-radio>
                <el-radio :label="1">已审核</el-radio>
                <el-radio :label="2">未审核</el-radio>
                <el-radio :label="3">集中汇缴未审核</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="onSubmit">查找</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-pagination
            :current-page="form.pageIndex"
            :page-sizes="[10, 15, 20, 25, 30]"
            :page-size="form.pageSize"
            :total="form.totalCount"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"/>
        </el-row>
      </el-form>
      <!-- 表1 -->
      <div class="wrap-box wrap">
        <el-scrollbar style="height:100%;width:100%;">
          <el-table
            ref="singleTable"
            :data="tableData"
            border
            style="width: 100%"
            highlight-current-row
            @row-dblclick = "dbRow"
            @current-change="handleCurrentChangedetails">
            <el-table-column
              type="index"/>
            <el-table-column
              prop="receipno"
              show-overflow-tooltip
              sortable
              width="180"
              align="center"
              label="单据编码"/>
            <el-table-column
              prop="agencycode"
              show-overflow-tooltip
              sortable
              width="180"
              align="center"
              label="执收单位"/>
            <el-table-column
              prop="agencycode"
              show-overflow-tooltip
              sortable
              width="180"
              align="center"
              label="单位编码"/>
            <el-table-column
              prop="attn"
              show-overflow-tooltip
              sortable
              width="100"
              align="center"
              label="经手人"/>
            <el-table-column
              prop="tradeid"
              show-overflow-tooltip
              sortable
              width="100"
              align="center"
              label="汇缴标记">
              <template slot-scope="scope">
                {{ scope.row.tradeid | markFilter }}
              </template>
            </el-table-column>
            <el-table-column
              prop="approvalmark"
              show-overflow-tooltip
              sortable
              width="180"
              align="center"
              label="送审标记">
              <template slot-scope="scope">
                {{ scope.row.approvalmark | markFilter }}
              </template>
            </el-table-column>
            <el-table-column
              prop="approvaldate"
              show-overflow-tooltip
              sortable
              width="180"
              align="center"
              label="送审日期"/>
            <el-table-column
              prop="year"
              show-overflow-tooltip
              sortable
              width="80"
              align="center"
              label="年度"/>
            <el-table-column
              prop="auditmark"
              show-overflow-tooltip
              sortable
              width="100"
              align="center"
              label="审核标记">
              <template slot-scope="scope">
                {{ scope.row.auditmark | markFilter }}
              </template>
            </el-table-column>
            <el-table-column
              prop="delivered"
              show-overflow-tooltip
              sortable
              width="80"
              align="center"
              label="送审人"/>
            <el-table-column
              prop="reviewer"
              show-overflow-tooltip
              sortable
              width="80"
              align="center"
              label="审核人"/>
            <el-table-column
              prop="auditdate"
              show-overflow-tooltip
              sortable
              width="180"
              align="center"
              label="审核日期"/>
            <el-table-column
              prop="verificdate"
              show-overflow-tooltip
              sortable
              width="180"
              align="center"
              label="核销日期"/>
            <el-table-column
              prop="operator"
              show-overflow-tooltip
              sortable
              width="80"
              align="center"
              label="操作员"/>
          </el-table>
        </el-scrollbar>
      </div>
      <!-- 表2 -->
      <el-scrollbar class="wrap" style="width:100%;">
        <el-table
          :data="details"
          border
          style="width: 100%"
          @row-click="handleCurrentChangedetailsIndex">
          <el-table-column
            type="index"/>
          <el-table-column
            prop="billcode"
            show-overflow-tooltip
            sortable
            width="110"
            align="center"
            label="票据编码"/>
          <el-table-column
            prop="billname"
            show-overflow-tooltip
            sortable
            width="250"
            align="center"
            label="票据名称"/>
          <el-table-column
            prop="track"
            show-overflow-tooltip
            sortable
            width="80"
            align="center"
            label="字轨"/>
          <el-table-column
            prop="startnumber"
            show-overflow-tooltip
            sortable
            width="110"
            align="center"
            label="起始号码"/>
          <el-table-column
            prop="endnumber"
            show-overflow-tooltip
            sortable
            width="110"
            align="center"
            label="终止号码"/>
          <el-table-column
            prop="num"
            show-overflow-tooltip
            sortable
            width="70"
            align="center"
            label="数量"/>
          <el-table-column
            prop="counts"
            show-overflow-tooltip
            sortable
            width="70"
            align="center"
            label="本数"/>
          <el-table-column
            prop="price"
            show-overflow-tooltip
            sortable
            width="70"
            align="center"
            label="单价"/>
          <el-table-column
            prop="amount"
            show-overflow-tooltip
            sortable
            width="110"
            align="center"
            label="金额"/>
        </el-table>
      </el-scrollbar>
      <!-- 表3表4 -->
      <div class="table-foot34">
        <div class="table3" >
          <el-scrollbar class="wrap" style="height:100%;width:100%;">
            <el-table
              :data="detailsRow.charges"
              border
              style="width: 100%">
              <el-table-column
                type="index"/>
              <el-table-column
                prop="nontaxcode"
                show-overflow-tooltip
                sortable
                width="110"
                align="center"
                label="项目编码"/>
              <el-table-column
                prop="nontaxname"
                show-overflow-tooltip
                sortable
                width="200"
                align="center"
                label="项目名称"/>
              <el-table-column
                prop="amount"
                show-overflow-tooltip
                sortable
                width="100"
                align="center"
                label="票面金额"/>
              <el-table-column
                prop="accountspay"
                show-overflow-tooltip
                sortable
                width="100"
                align="center"
                label="应缴专户"/>
              <el-table-column
                prop="accounts"
                show-overflow-tooltip
                sortable
                width="100"
                align="center"
                label="实缴专户"/>
              <el-table-column
                prop="inconvenient"
                show-overflow-tooltip
                sortable
                width="100"
                align="center"
                label="不便进专户"/>
              <el-table-column
                prop="unpaidacc"
                show-overflow-tooltip
                sortable
                width="100"
                align="center"
                label="未缴专户"/>
            </el-table>
          </el-scrollbar>
        </div>
        <div class="table4" >
          <el-scrollbar class="wrap" style="height:100%;width:100%;">
            <el-table
              :data="detailsRow.invalids"
              border
              style="width: 100%">
              <el-table-column
                type="index"/>
              <el-table-column
                prop="startnumber"
                show-overflow-tooltip
                sortable
                width="110"
                align="center"
                label="起始号码"/>
              <el-table-column
                prop="endnumber"
                show-overflow-tooltip
                sortable
                width="110"
                align="center"
                label="终止号码"/>
              <el-table-column
                prop="num"
                show-overflow-tooltip
                sortable
                width="80"
                align="center"
                label="份数"/>
              <el-table-column
                prop="reason"
                show-overflow-tooltip
                sortable
                width="80"
                align="center"
                label="作废原因"/>
            </el-table>
          </el-scrollbar>
        </div>
      </div>

      <!-- 添加对话框 -->
      <add ref="layer1" :form="currentRowState" title="核销记录明细"/>
      <!-- 请选择票据种类 -->
      <layer ref="layer" :tb-head="tbHead" :form="formBasBillinfo" :table-data="BasBillinfoList" title="请选择票据种类" @select="getSelect"/>

      <!-- 审核 -->
      <el-dialog :close-on-click-modal="false" :visible.sync="dialogFormVisible" title="票据审核信息">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="审核日期">
            <el-input v-model="currentRow.auditdate" disabled/>
          </el-form-item>
          <el-form-item label="审核人">
            <el-input v-model="currentRow.reviewer" disabled/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
        <el-input
          :autosize="{ minRows: 8, maxRows: 20}"
          v-model="auditOpinion"
          type="textarea"
          placeholder="请输入内容"/>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="billAuditType(0)">通过</el-button>
          <el-button type="primary" @click="billAuditType(2)">退回</el-button>
          <el-button @click="dialogFormVisible = false">取 消</el-button>
        </div>
      </el-dialog>
      <tablePrintSet :print-data="listPrintData" :template-data="templateDataList" :form-print-data="formPrintData"/>

    </div>
  </el-scrollbar>
</template>

<script>
import { mapState } from 'vuex'
import { formatDate } from '@/utils/Common'
import Bus from '@/utils/Bus'
import toolBar from '@/components/toolBar'
import layer from '@/components/layer'
import add from './add'
import pjyw from '@/api/pjgl/pjyw/pjyw.js'
import tablePrintSet from '@/components/tablePrintSet' // add
import { getPrintTemplateData, savePrintTemplateData } from '@/api/webPrint' // add

export default {
  components: {
    tablePrintSet, // 表格打印设置组件。add
    toolBar, // 上方工具条栏
    layer,
    add
  },
  data() {
    return {
      optionObjectList:{
        receipno:'单据编码',
        requestdate:'业务日期',
        auditdate:'审核日期',
        agencycode:'单位编码',
        agencyname:'单位名称',
        permitno:'票据领用证号',
        billpermitname:'票据领用证名称',
        attn:'经手人',
        operator:'制单人',
        delivered:'送审人',
        approvaldate:'送审日期',
        reviewer:'审核人',
        personnel:'发票人',
        releasedate:'发票日期',
        reviewerinfo:'审核信息',
      },
      templateInitData: { //  准备找数据。
        // return {
        guid: '',
        userid: null,
        templatecontent: {
          title: `${this.$route.meta.title}`,
          direction: 1, //  1竖，2横
          printHeadHeight: 50, // 打印头部区域的高度，单位mm
          printHead: [
            { text: '票据号码', value: '', checked: true },
            { text: '制表人', value: '', checked: true },
            { text: '筛选条件值', value: '', checked: false },
            { text: '终止日期', value: '', checked: true },
            { text: '字轨', value: '', checked: false },
            { text: '筛选条件', value: '', checked: true },
            { text: '起始日期', value: '', checked: true }
          ],
          tableHead: [
            { text :'单据编码',key: 'receipno',width:'180', checked: true},
            { text :'执收单位',key: 'agencycode',width:'180', checked: true},
            { text :'单位编码',key: 'agencycode',width:'180', checked: true},
            { text :'经手人',key: 'attn',width:'100', checked: true},
            { text :'汇缴标记',key: 'tradeid',width:'100', checked: true},
            { text :'送审标记',key: 'approvalmark',width:'180', checked: true},
            { text :'送审日期',key: 'approvaldate',width:'180', checked: true},
            { text :'年度',key: 'year',width:'80', checked: true},
            { text :'行政区划',key: 'admdivcode',width:'80', checked: true},
            { text :'审核标记',key: 'auditmark',width:'100', checked: true},
            { text :'送审人',key: 'delivered',width:'80', checked: true},
            { text :'审核人',key: 'reviewer',width:'80', checked: true},
            { text :'审核日期',key: 'auditdate',width:'180', checked: true},
            { text :'核销日期',key: 'verificdate',width:'180', checked: true},
            { text :'操作员',key: 'operator',width:'80', checked: true},
            { text :'票据编码',key: 'billcode',width:'110', checked: true},
            { text :'票据名称',key: 'billname',width:'250', checked: true},
            { text :'字轨',key: 'track',width:'80', checked: true},
            { text :'起始号码',key: 'startnumber',width:'110', checked: true},
            { text :'终止号码',key: 'endnumber',width:'110', checked: true},
            { text :'数量',key: 'num',width:'70', checked: true},
            { text :'本数',key: 'counts',width:'70', checked: true},
            { text :'单价',key: 'price',width:'70', checked: true},
            { text :'金额',key: 'amount',width:'110', checked: true},
            { text :'项目编码',key: 'nontaxcode',width:'110', checked: true},
            { text :'项目名称',key: 'nontaxname',width:'200', checked: true},
            { text :'票面金额',key: 'amount',width:'100', checked: true},
            { text :'应缴专户',key: 'accountspay',width:'100', checked: true},
            { text :'实缴专户',key: 'accounts',width:'100', checked: true},
            { text :'不便进专户',key: 'inconvenient',width:'100', checked: true},
            { text :'未缴专户',key: 'unpaidacc',width:'100', checked: true},
            { text :'起始号码',key: 'startnumber',width:'110', checked: true},
            { text :'终止号码',key: 'endnumber',width:'110', checked: true},
            { text :'份数',key: 'num',width:'80', checked: true},
            { text :'审核人',key: 'reason',width:'80', checked: true}
          ],
          printFoot: [
            { text: '票据号码', value: '', checked: true },
            { text: '制表人', value: '', checked: true },
            { text: '筛选条件值', value: '', checked: false },
            { text: '终止日期', value: '', checked: true },
            { text: '字轨', value: '', checked: false },
            { text: '筛选条件', value: '', checked: true },
            { text: '起始日期', value: '', checked: true }
          ]
        },
        isdefault: 1, // 是否现在使用的模板
        templatecode: this.$route.path,
        templatename: `标准模板（${this.$route.meta.title}）`,
        isstandardtemplage: 1 // 是否标准模板
        // }
      },
      templateDataList: [], //  add
      listPrintData: [], //  add 打印数据列表，只有在点击打印，预览，导出，设置时才加载。

      // 审核
      dialogFormVisible: false,
      // 审核信息
      auditOpinion: '通过',
      clientButnsArray: ['close', 'billAdd', 'billUpdate', 'billDelete', 'billRefresh', 'billAudit', 'billUnaudit', 'listPreview', 'listPrint', 'listSet', 'listExport'], // 这里填写那些服务器没有返回，但是却在按钮组中存在的按钮。
      // 是否添加状态,是-添加 ，否-修改查看
      addState: true,
      // 详情-表2数据
      details: [],
      // 详情行 表2选中行索引
      detailsIndex: 0,
      // 当前表格选择项 表1选中行数据
      currentRow: {},
      // dialogTableVisible: false,
      // 票据名称关联id
      basChargeagency: '',
      // 当前表单数据
      form: {
        // 总条数数
        totalCount: 0,
        // 页码
        pageIndex: 1,
        // 页条数
        pageSize: 10,
        // 审核状态
        flag: 0,
        // 票据ID---billid
        agencyId: '',
        // 字轨
        track: '',
        // 起始日期
        startDate: '',
        // 终止日期
        endDate: '',
        // 条件名称
        filterName: '',
        // 条件值
        filterValue: '',
        // 是否日期查找
        isdate: false,
        // 是否筛选
        isfilter: false,
        // 票号 -----startnumber
        billNumber: ''
      },
      // 当前表格数据 表1数据
      tableData: [],
      // 票据种类表格数据
      BasBillinfoList: [],
      // 票据名称对话框表头
      tbHead: [
        {
          prop: 'billcode',
          label: '票据编码'
        },
        {
          prop: 'billname',
          label: '票据名称'
        },
        {
          prop: 'pinyincode',
          label: '拼音简码'
        },
        {
          prop: 'unitprice',
          label: '单价'
        },
        {
          prop: 'pricingmet',
          label: '计价方式'
        },
        {
          prop: 'portions',
          label: '每本份数'
        }
      ],
      // 票据名称对话框表单数据
      formBasBillinfo: {
        coding: '',
        // 下拉框选项
        codingoption: [
          {
            val: '票据编码',
            key: 'billcode'
          },
          {
            val: '票据名称',
            key: 'billname'
          },
          {
            val: '拼音简码',
            key: 'pinyincode'
          },
          {
            val: '单价',
            key: 'unitprice'
          },
          {
            val: '计价方式',
            key: 'pricingmet'
          },
          {
            val: '每本份数',
            key: 'portions'
          }
        ],
        equal: ''
      },
      addLayerForm: {
        requestdate: formatDate(new Date()), // 业务日期
        receipno: '', // 单据编码
        operator: '', // 制单人
        delivered: '', // 送审人
        reviewer: '', // 审核人
        attn: ''// 经手人
      }
    }
  },
  computed: {
    ...mapState({
      toolBarState: state => state.pjyw.toolBarState,
      userInfo: state => state.user.userInfo,
      updateMark: state => state.pjyw.updateMark,
      currentRowIndex: state => state.pjyw.currentRowIndex
    }),
    // 详情行数据 表2选中行数据
    detailsRow() {
      return (this.details[this.detailsIndex]) ? (this.details[this.detailsIndex]) : {}
    },
    btnsavestate() {
      return this.$store.getters.savestate === 0
    },
    // 传递给add对话框组件的表表单数据 添加为空，修改查看传递数据
    currentRowState() {
      if (this.addState) { // 添加
        return this.addLayerForm
      } else { // 修改或查看
        return this.currentRow
      }
    },
    formPrintData() { //  准备找数据。
      return [
        { text: '票据号码', value: this.form.billNumber, checked: true },
        { text: '制表人', value: this.$store.state.user.name, checked: true },
        { text: '筛选条件值', value: this.form.filterValue, checked: false },
        { text: '终止日期', value: this.form.endDate, checked: true },
        { text: '字轨', value: this.form.track, checked: false },
        { text: '筛选条件', value:this.optionObjectList[this.form.filterName], checked: true },
        { text: '起始日期', value: this.form.startDate, checked: true }
      ]
    }
  },
  watch: {
    // 票据名称关联id billname为空billId也清空
    basChargeagency(n) {
      if (!n) {
        this.form.agencyId = ''
      }
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

    this.addLayerForm.operator = this.userInfo.name
    this.addLayerForm.attn = this.userInfo.name
    
    Bus.$off('billAudit')
    Bus.$on('billAudit', () => {
      this.billAudit()
    })
    Bus.$off('billUnaudit')
    Bus.$on('billUnaudit', () => {
      this.billUnaudit()
    })
    Bus.$off('billSendAudit')
    Bus.$on('billSendAudit', () => {
      this.billSendAudit()
    })

    Bus.$off('onSubmit')
    Bus.$on('onSubmit', () => {
      this.form.pageIndex = 1
      this.onSubmit()
    })
    Bus.$off('add')
    Bus.$on('add', () => {
      this.add()
    })
    Bus.$off('billUpdate')
    Bus.$on('billUpdate', () => {
      this.billUpdate()
    })
    Bus.$off('billDelete')
    Bus.$on('billDelete', () => {
      this.billDelete()
    })
    // 获取当前表格数据
    this.getList(this.form)
    // 获取名称对话框票据种类
    this.getBasBillinfo().then(res => {
      // console.log(res)
      this.BasBillinfoList = res.data
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
    getListPrintData: pjyw.getListPrintData,

    // 库存票据
    // getBasChargeagency: pjyw.getBasChargeagency,

    // 双击  修改或参看 调添加对话框
    dbRow() {
      if (this.toolBarState === 3) {
        this.$store.dispatch('SetSendAuditUpdateMark', true)
      } else {
        this.$store.dispatch('SetSendAuditUpdateMark', false)
      }
      this.addState = false
      this.$refs.layer1.currentRowIndex = ''
      this.$refs.layer1.tableDataTable2 = []
      this.$refs.layer1.tableDataTable3 = {
        tableArray: [],
        checkInfo: {
          checkmark: '',
          codelength: '',
          minNumber: '',
          maxNumber: ''
        }}
      this.$refs.layer1.tableData = [].concat(this.currentRow.details)
      this.$refs.layer1.submitData = this.currentRow
      this.$refs.layer1.submitData.bilVerificationDetails = {}
      this.$refs.layer1.submitData.bilVerificationDetails.bilVerificationDetail = this.currentRow.details
      // this.$refs.layer1.submitData.guid = this.currentRow.guid
      this.$refs.layer1.agency2billInfoCurrent = []
      this.$refs.layer1.agencyname = this.currentRow.agencyname
      this.$refs.layer1.agency2billInfoCurrent.agencyid = this.currentRow.payinagencyid
      this.$refs.layer1.agency2billInfoCurrent.perimitguid = this.currentRow.billpermitid
      this.$refs.layer1.dialogTableVisible = true
      // 设置修改标记为真
      this.$store.dispatch('SetUpdateMark', true)
      if (this.currentRow.auditmark === '1') {
        // 说明已经审核
        this.$store.dispatch('SetToolBarState', 4)
      } else if (this.currentRow.approvalmark === '1') {
        this.$store.dispatch('SetToolBarState', 3)
      } else {
        // 说明未送审，处于已保存，待送审状态。
        this.$store.dispatch('SetToolBarState', 2)
      }
    },
    // 修改
    billUpdate() {
      console.log(this.$refs.layer1.submitData)
      console.log(this.currentRow.details)

      console.log('当前状态码为：', this.toolBarState)
      if (this.toolBarState === 3) {
        // 已经送审，再点击修改，就处于送审修改状态。
        this.$store.dispatch('SetSendAuditUpdateMark', true)
      } else {
        this.$store.dispatch('SetSendAuditUpdateMark', false)
      }
      if (this.currentRow.auditmark === '1') {
        this.$message.error('已审核业务不能进行修改')
      } else if (this.currentRow.approvalmark === '1') {
        this.$message.error('业务记录已送审不能进行修改')
      } else {
        this.addState = false
        this.$refs.layer1.currentRowIndex = ''
        this.$refs.layer1.tableDataTable2 = []
        this.$refs.layer1.tableDataTable3 = {
          tableArray: [],
          checkInfo: {
            checkmark: '',
            codelength: '',
            minNumber: '',
            maxNumber: ''
          }}

        this.$refs.layer1.tableData = [].concat(this.currentRow.details)
        this.$refs.layer1.submitData = this.currentRow
        this.$refs.layer1.submitData.bilVerificationDetails = {}
        this.$refs.layer1.submitData.bilVerificationDetails.bilVerificationDetail = this.currentRow.details
        // this.$refs.layer1.submitData.guid = this.currentRow.guid
        this.$refs.layer1.agency2billInfoCurrent = []
        this.$refs.layer1.agencyname = this.currentRow.agencyname
        this.$refs.layer1.agency2billInfoCurrent.agencyid = this.currentRow.payinagencyid
        this.$refs.layer1.agency2billInfoCurrent.perimitguid = this.currentRow.billpermitid
        this.$refs.layer1.dialogTableVisible = true
        // 设置修改标记为真
        this.$store.dispatch('SetUpdateMark', true)
        delete this.$refs.layer1.submitData.details

        if (this.currentRow.approvalmark === '1') {
          // 说明已经送审
          this.$store.dispatch('SetToolBarState', 3)
        } else {
          // 说明未送审，处于已保存，待送审状态。
          this.$store.dispatch('SetToolBarState', 2)
        }
      }
    },
    // 删除
    billDelete() {
      if (this.currentRow.approvalmark === '1') {
        this.$message.error('您所选择的单据编码为【' + this.currentRow.receipno + '】的业务单据已经送审，不能进行删除操作！')
      } else {
        this.$confirm('您确定要删除单据编码为【' + this.currentRow.receipno + '】的业务单据吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delete(this.currentRow.guid).then(res => {
            if (res.code === '200') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.form.pageIndex = 1
              this.onSubmit()
            }
          })
        }).catch(() => { console.log('取消了') })
      }
    },
    // 详情行 表2选中行索引修改
    handleCurrentChangedetailsIndex(row) {
      this.detailsIndex = this.details.findIndex(item => {
        return item === row
      })
    },
    // 表格行选择设置 表1选中 设置表2
    handleCurrentChangedetails(val) {
      if (val === null) {
        this.details = []
      } else {
        this.details = val.details ? val.details : []

        if (val.approvalmark === '0' && val.auditmark === '0') {
        // 默认状态
          this.$store.dispatch('SetToolBarState', 0)
        } else if (val.approvalmark === '1' && val.auditmark === '0') {
        // 已送审，待审核
          this.$store.dispatch('SetToolBarState', 3)
        } else if (val.approvalmark === '1' && val.auditmark === '1') {
        // 已审核，待反审。
          this.$store.dispatch('SetToolBarState', 4)
        }
      }
      // 记录选中行数。
      var i = this.tableData.findIndex(item => {
        return item === val
      })
      i = i >= 0 ? i : 0
      this.$store.dispatch('SetCurrentRowIndex', i)

      this.currentRow = val === null ? {} : val
      console.log(this.currentRow)
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
    // 添加
    add() {
      this.addState = true
      // 点击添加的时候清空数据。
      this.$refs.layer1.currentRowIndex = ''
      this.$refs.layer1.tableDataTable2 = []
      this.$refs.layer1.tableDataTable3 = {
        tableArray: [],
        checkInfo: {
          checkmark: '',
          codelength: '',
          minNumber: '',
          maxNumber: ''
        }}
      this.$refs.layer1.tableData = []
      this.$refs.layer1.agency2billInfoCurrent = []
      this.$refs.layer1.agencyname = ''
      this.$refs.layer1.submitData.approvalmark = 0

      var operator = this.userInfo.name
      var attn = this.userInfo.name

      this.addLayerForm = {
        requestdate: formatDate(new Date()), // 业务日期
        receipno: '', // 单据编码
        operator, // 制单人
        delivered: '', // 送审人
        reviewer: '', // 审核人
        attn// 经手人
      }
      // this.$refs.layer1.form.requestdate = formatDate(new Date())
      // this.$refs.layer1.form.receipno = ''
      // this.$refs.layer1.form.operator = this.userInfo.name
      // this.$refs.layer1.form.delivered = ''
      // this.$refs.layer1.form.reviewer = ''
      // this.$refs.layer1.form.attn = ''

      console.log(formatDate(new Date()))
      this.$refs.layer1.dialogTableVisible = true
      // 进入待保存状态。
      this.$store.dispatch('SetToolBarState', 1)
      // 每次新增，都将修改标记置为false
      this.$store.dispatch('SetUpdateMark', false)
    },
    // 添加测试
    // showadd() {
    //   this.$refs.layer1.dialogTableVisible = true
    // },
    // 获取票据种类
    getBasBillinfo: pjyw.getBasBillinfo,
    // 获取表格数据方法 表1
    getList: pjyw.getList,
    // 删除
    delete: pjyw.delete,
    // 送审
    sendAudit: pjyw.sendAudit,
    // 审核
    postBillAudit: pjyw.billAudit,
    // 获取选择名称
    getSelect(datas) {
      // 设置。。。。。。。。billname
      // this.billname = datas.currentRow.billname
      // this.form.billId = datas.currentRow.guid

      this.basChargeagency = datas.currentRow.agencyname
      // this.agency2billInfoCurrent = datas.currentRow
      this.form.agencyId = datas.currentRow.guid
      // console.log(this.form.agencyId)
    },
    // 票据名称对话框显示
    showBasBillinfo() {
      this.$refs.layer.dialogTableVisible = true
    },
    // 日期框改变
    isdateChange(val) {
      if (val) {
        var time = new Date()
        this.form.startDate = `${time.getFullYear()}-${time.getMonth() + 1}-1`
        // 设置当前时间
        this.form.endDate = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`
      } else {
        this.form.startDate = ''
        this.form.endDate = ''
      }
    },
    // 筛选框改变
    isfilterChange(val) {
      if (val) {
        // 设置默认选中项
        this.form.filterName = 'receipno'
        this.form.filterValue = ''
      } else {
        this.form.filterName = ''
        this.form.filterValue = ''
      }
    },
    // 当前表格查找
    onSubmit() {
      this.details = []
      this.getList(this.form)
    },
    // 当前表格 页条数改变
    handleSizeChange(val) {
      this.form.pageSize = val
      this.getList(this.form)
    },
    // 送审
    billSendAudit() {
      var guid = this.currentRow.guid
      console.log('发送的guid是', guid)
      this.sendAudit({ guid: guid }).then(res => {
        this.$alert('送审成功！', {
          type: 'success',
          center: true,
          closeOnClickModal: true,
          closeOnPressEscape: true,
          callback: action => {
          }
        })
        // 获取最新数据
        this.form.pageIndex = 1
        this.onSubmit()
      }).catch(err => { console.log(err) })
    },
    // 当前表格 页码改变 翻页
    handleCurrentChange(val) {
      this.form.pageIndex = val
      this.getList(this.form)
    },
    // 审核 对话框
    billAudit() {
      this.dialogFormVisible = true
    },
    // 反审
    billUnaudit() {
      this.auditOpinion = ''
      this.billAuditType(1)
    },
    // 通过 反审 退回
    billAuditType(type) {
      var params = {
        auditOpinion: this.auditOpinion,
        guid: this.currentRow.guid,
        type: type
      }
      this.postBillAudit(params).then(res => {
        // console.log(res)
        this.auditOpinion = '通过'
        // 获取最新数据
        this.form.pageIndex = 1
        this.onSubmit()
        var msg = ''
        switch (type) {
          case 0:
            msg = '审核通过！'
            break
          case 1:
            msg = '反审成功！'
            break
          default:
            msg = '退回成功！'
        }
        this.$alert(msg, {
          type: 'success',
          center: true,
          closeOnClickModal: true,
          closeOnPressEscape: true,
          callback: action => {
          }
        })
        this.dialogFormVisible = false
      })
    }
  }
}

</script>
<style lang="scss" scoped>
.toolbar {
  font-size: 12px;
  $toolba-bg: #fff;
  height: 50px;
  background: $toolba-bg;
  border-bottom: 1px solid #9bbce8;
  ul {
    display: flex;
    height: 100%;
    li {
      background: $toolba-bg;
      cursor: pointer;
      display: flex;
      min-width: 70px;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      border-right: 1px solid #f2f2f2;
      span {
        width: 30px;
        height: 30px;
        line-height: 30px;
        font-size: 16px;
        text-align: center;
        margin-top: 2px;
      }
    }
    .no-border {
      border: 0 none;
    }
    .dis-tap {
      color: #8b8588;
      cursor: not-allowed;
    }
  }
}
.view{
  height: 100%;
}
.table-foot34{
  display: flex;
  width: 100%;
  .table3{
    // margin: 10px 10px 10px 0;
    padding: 5px 5px 5px 0;
    width: 50%;
  }
  .table4{
    // margin: 10px 0 10px 10px;
    padding: 5px 0px 5px 5px;
    width: 50%;
  }
  .el-scrollbar__view{
    width: fit-content;
  }
}
</style>

<style rel='stylesheet/scss' lang='scss' scoped>
.pjyztzs{
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

