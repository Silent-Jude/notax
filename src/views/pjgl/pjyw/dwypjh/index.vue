<!--dwypjh 单位用票计划 -->
<template>
  <el-scrollbar class="dwypjh" style="height:100%;width:100%;">
    <div class="dwypjh">
      <toolBar :client-butns-array="clientButnsArray" />
      <h1>单位用票计划</h1>
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
                <el-option label="年度" value="year"/>
                <el-option label="单据编码" value="receipno"/>
                <el-option label="申请日期" value="requestdate"/>
                <el-option label="申请人" value="operator"/>
                <el-option label="经手人" value="attn"/>
                <el-option label="审核日期" value="auditdate"/>
                <el-option label="审核人" value="reviewer"/>
                <el-option label="发票人 " value="personnel"/>
                <el-option label="单位编码" value="agencycode"/>
                <el-option label="单位名称" value="agencyname"/>
                <el-option label="票据领用证号" value="billpermitid"/>
                <el-option label="票据领用证名称" value="billpermitname"/>
                <el-option label="送审人 " value="delivered"/>
                <el-option label="送审日期 " value="approvaldate"/>
                <el-option label="发票日期 " value="releasedate"/>
                <el-option label="审核信息 " value="auditopinion"/>
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
            <el-form-item label="执收单位">
              <el-input
                v-model="basChargeAgency"
                clearable
                placeholder="请选择执收单位" >
                <el-button slot="append" icon="el-icon-caret-bottom" @click="showBasChargeAgency()"/>
              </el-input>
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
                <el-radio :label="3">已送审</el-radio>
                <el-radio :label="4">未送审</el-radio>
                <el-radio :label="5">已发票</el-radio>
                <el-radio :label="6">未发票</el-radio>
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
      <div class="wrap-box wrap">
        <el-scrollbar style="height:100%;width:100%;">
          <el-table
            ref="singleTable"
            :data="tableData"
            border
            style="width: 100%"
            highlight-current-row
            @row-click="check"
            @row-dblclick = "dbRow"
            @current-change="handleCurrentChangedetails">
            <el-table-column
              type="index"/>
            <el-table-column
              prop="year"
              show-overflow-tooltip
              sortable
              width="90"
              align="center"
              label="年度"/>
            <el-table-column
              prop="receipno"
              show-overflow-tooltip
              sortable
              width="180"
              align="center"
              label="单据编码"/>
            <el-table-column
              prop="requestdate"
              show-overflow-tooltip
              sortable
              width="180"
              align="center"
              label="申请日期"/>
            <el-table-column
              prop="operator"
              show-overflow-tooltip
              sortable
              width="90"
              align="center"
              label="申请人"/>
            <el-table-column
              prop="attn"
              show-overflow-tooltip
              sortable
              width="90"
              align="center"
              label="经手人"/>
            <el-table-column
              prop="auditmark"
              show-overflow-tooltip
              sortable
              width="90"
              align="center"
              label="审核标记">
              <template slot-scope="scope">
                {{ scope.row.auditmark | markFilter }}
              </template>
            </el-table-column>
            <el-table-column
              prop="auditdate"
              show-overflow-tooltip
              sortable
              width="180"
              align="center"
              label="审核日期"/>
            <el-table-column
              prop="reviewer"
              show-overflow-tooltip
              sortable
              width="90"
              align="center"
              label="审核人"/>
            <el-table-column
              prop="personnel"
              show-overflow-tooltip
              sortable
              width="90"
              align="center"
              label="发票人"/>
            <el-table-column
              prop="agencycode"
              show-overflow-tooltip
              sortable
              width="120"
              align="center"
              label="单位编码"/>
            <el-table-column
              prop="agencyname"
              show-overflow-tooltip
              sortable
              width="180"
              align="center"
              label="单位名称"/>
            <el-table-column
              prop="billpermitid"
              show-overflow-tooltip
              sortable
              width="120"
              align="center"
              label="票据领用证号"/>
            <el-table-column
              prop="billpermitname"
              show-overflow-tooltip
              sortable
              width="180"
              align="center"
              label="票据领用名称"/>
            <el-table-column
              prop="approvalmark"
              show-overflow-tooltip
              sortable
              width="90"
              align="center"
              label="送审标记">
              <template slot-scope="scope">
                <!-- <el-checkbox :checked=" scope.row.approvalmark != 0 " disabled/> -->
                {{ scope.row.approvalmark | markFilter }}
              </template>
            </el-table-column>
            <el-table-column
              prop="delivered"
              show-overflow-tooltip
              sortable
              width="90"
              align="center"
              label="送审人"/>
            <el-table-column
              prop="approvaldate"
              show-overflow-tooltip
              sortable
              width="200"
              align="center"
              label="送审日期"/>

            <el-table-column
              prop="mark"
              show-overflow-tooltip
              sortable
              width="90"
              align="center"
              label="发票标记">
              <template slot-scope="scope">
                {{ scope.row.mark | markFilter }}
              </template>
            </el-table-column>
            <el-table-column
              prop="releasedate"
              show-overflow-tooltip
              sortable
              width="180"
              align="center"
              label="发票日期"/>
            <el-table-column
              prop="reviewerinfo"
              show-overflow-tooltip
              sortable
              width="90"
              align="center"
              label="审核信息"/>
          </el-table>
        </el-scrollbar>
      </div>

      <el-scrollbar class="wrap" style="height:100%;width:100%;">
        <el-table
          :data="details"
          border
          style="width: 100%">
          <el-table-column
            type="index"/>
          <el-table-column
            prop="billcode"
            show-overflow-tooltip
            sortable
            width="110"
            align="center"
            label="票据编号"/>
          <el-table-column
            prop="billname"
            show-overflow-tooltip
            sortable
            width="250"
            align="center"
            label="票据名称"/>

          <el-table-column
            prop="preyearnum"
            show-overflow-tooltip
            sortable
            width="80"
            align="center"
            label="上年结转份数"/>
          <el-table-column
            prop="preyearcounts"
            show-overflow-tooltip
            sortable
            width="80"
            align="center"
            label="上年结转本数"/>
          <el-table-column
            prop="quarter1num"
            show-overflow-tooltip
            sortable
            width="80"
            align="center"
            label="上半年计划份数"/>
          <el-table-column
            prop="quarter1counts"
            show-overflow-tooltip
            sortable
            width="80"
            align="center"
            label="上半年计划本数"/>
          <el-table-column
            prop="quarter3num"
            show-overflow-tooltip
            sortable
            width="80"
            align="center"
            label="下半年计划份数"/>
          <el-table-column
            show-overflow-tooltip
            sortable
            width="80"
            align="center"
            prop="quarter3counts"
            label="下半年计划本数"/>
          <el-table-column
            prop="num"
            show-overflow-tooltip
            sortable
            width="80"
            align="center"
            label="计划份数"/>
          <el-table-column
            prop="counts"
            show-overflow-tooltip
            sortable
            width="80"
            align="center"
            label="计划本数"/>
          <el-table-column
            prop="checknumber"
            show-overflow-tooltip
            sortable
            width="80"
            align="center"
            label="审定份数"/>
          <el-table-column
            prop="checkcount"
            show-overflow-tooltip
            sortable
            width="80"
            align="center"
            label="审定本数"/>
        </el-table>
      </el-scrollbar>

      <!-- 添加的对话框 -->
      <add ref="layer1" :form="currentRowState" title="单位用票计划"/>
      <!-- 请选择执收单位 -->
      <layer ref="layer" :tb-head="basChargeAgencyHead" :form="basChargeAgencyForm" :table-data="basChargeAgencyTableList" title="请选择执收单位" @select="basChargeAgencySelect"/>

      <!-- 审核 -->
      <el-dialog :visible.sync="dialogFormVisible" title="票据审核信息">
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
export default {
  components: {
    toolBar, // 上方工具条栏
    layer,
    add
  },
  data() {
    return {
      // 审核
      dialogFormVisible: false,
      // 审核信息
      auditOpinion: '通过',
      clientButnsArray: ['close', 'billAdd', 'billUpdate', 'billDelete', 'billRefresh', 'billSendAudit', 'billAudit', 'billUnaudit', 'tablePrintPreview', 'print', 'set', 'export'], // 这里填写那些服务器没有返回，但是却在按钮组中存在的按钮。
      // 是否添加状态,是-添加 ，否-修改查看
      addState: true,
      // 详情
      details: [],
      // 当前表格选择项
      currentRow: {},
      // 当前表格选中行索引
      // currentRowIndex: 0,
      // dialogTableVisible: false,
      // 票据名称关联id
      basChargeAgency: '',
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
      // 当前表格数据
      tableData: [],
      // 执收单位列表中的表格数据
      basChargeAgencyTableList: [],
      // 执收单位对话框表头
      basChargeAgencyHead: [
        {
          prop: 'agencycode',
          label: '执收单位编码'
        },
        {
          prop: 'agencyname',
          label: '执收单位名称'
        },
        {
          prop: 'pinyincode',
          label: '拼音简码'
        },
        {
          prop: 'permitno',
          label: '领用证编码'
        },
        {
          prop: 'billpermitname',
          label: '领用证名称'
        },
        {
          prop: 'attn',
          label: '经办人'
        },
        {
          prop: 'transactdate',
          label: '办理日期'
        }
      ],
      // 执收单位对话框表单数据
      basChargeAgencyForm: {
        coding: '',
        // 下拉框选项
        codingoption: [
          {
            val: '执收单位编码',
            key: 'agencycode'
          },
          {
            val: '执收单位名称',
            key: 'agencyname'
          },
          {
            val: '拼音简码',
            key: 'pinyincode'
          },
          {
            val: '领用证编码',
            key: 'permitno'
          },
          {
            val: '领用证名称',
            key: 'billpermitname'
          },
          {
            val: '经办人',
            key: 'attn'
          },
          {
            val: '办理日期',
            key: 'transactdate'
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
    // 传递给add对话框组件的表格数据
    currentRowState() {
      if (this.addState) {
        return this.addLayerForm
      } else {
        return this.currentRow
      }
    }
  },
  watch: {
  },
  created() {
    // 重新设置回第一行
    this.$store.dispatch('SetCurrentRowIndex', 0)
    this.addLayerForm.operator = this.userInfo.name
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
    // 获取执收单位列表
    this.getBasChargeagency().then(res => {
      this.basChargeAgencyTableList = res.data
    })
  },
  methods: {
    // 获取执收单位列表函数
    getBasChargeagency: pjyw.getBasChargeagency,
    check() {
    },
    // 双击修改或参看
    dbRow() {
      if (this.toolBarState === 3) {
        this.$store.dispatch('SetSendAuditUpdateMark', true)
      } else {
        this.$store.dispatch('SetSendAuditUpdateMark', false)
      }
      this.addState = false
      this.$refs.layer1.tableData = [].concat(this.currentRow.details)
      this.$refs.layer1.submitData = this.currentRow
      this.$refs.layer1.submitData.billUsePlanDetails = {}
      // this.$refs.layer1.submitData.billUsePlanDetails.bilUsePlanDetail = this.currentRow.details
      // this.$refs.layer1.submitData.guid = this.currentRow.guid
      this.$refs.layer1.selectedBasChargeAgency = []

      this.$refs.layer1.submitData.billUsePlanDetails.bilUsePlanDetail = JSON.parse(JSON.stringify(this.$refs.layer1.submitData.details))

      // this.$refs.layer1.agencyname = this.currentRow.agencyname
      // this.$refs.layer1.selectedBasChargeAgency.agencyid = this.currentRow.payinagencyid
      // this.$refs.layer1.selectedBasChargeAgency.perimitguid = this.currentRow.billpermitid
      this.$refs.layer1.dialogTableVisible = true
      // 设置修改标记为真
      this.$store.dispatch('SetUpdateMark', true)
      if (this.currentRow.approvalmark === '1') {
        // 说明已经送审
        this.$store.dispatch('SetToolBarState', 3)
      } else {
        // 说明未送审，处于已保存，待送审状态。
        this.$store.dispatch('SetToolBarState', 2)
      }
    },

    // 修改
    billUpdate() {
      if (this.toolBarState === 3) {
        this.$store.dispatch('SetSendAuditUpdateMark', true)
      } else {
        this.$store.dispatch('SetSendAuditUpdateMark', false)
      }
      if (this.currentRow.auditmark === '1') {
        this.$message.error('已审核业务不能进行修改')
      } else {
        this.addState = false
        this.$refs.layer1.tableData = [].concat(this.currentRow.details)
        this.$refs.layer1.submitData = JSON.parse(JSON.stringify(this.currentRow))
        this.$refs.layer1.submitData.billUsePlanDetails = {}
        this.$refs.layer1.submitData.billUsePlanDetails.bilUsePlanDetail = JSON.parse(JSON.stringify(this.$refs.layer1.submitData.details))
        delete this.$refs.layer1.submitData.details

        this.$refs.layer1.selectedBasChargeAgency = {}

        this.$refs.layer1.basChargeAgencyName = this.currentRow.agencyname

        this.$refs.layer1.selectedBasChargeAgency.agencyid = this.currentRow.payinagencyid
        this.$refs.layer1.selectedBasChargeAgency.perimitguid = this.currentRow.billpermitid

        this.$refs.layer1.tableData.forEach((item, i, array) => {
          item.quarter1Num = item.quarter1num
          item.quarter1Counts = item.quarter1counts
          item.quarter1Checknumber = item.quarter1checknumber
          item.quarter1Checkcount = item.quarter1checkcount
          item.quarter2Num = item.quarter2num
          item.quarter2Counts = item.quarter2counts
          item.quarter2Checknumber = item.quarter2checknumber
          item.quarter2Checkcount = item.quarter2checkcount
          item.quarter3Num = item.quarter3num
          item.quarter3Counts = item.quarter3counts
          item.quarter3Checknumber = item.quarter3checknumber
          item.quarter3Checkcount = item.quarter3checkcount
          item.quarter4Num = item.quarter4num
          item.quarter4Counts = item.quarter4counts
          item.quarter4Checknumber = item.quarter4checknumber
          item.quarter4Checkcount = item.quarter4checkcount
        })
        delete this.$refs.layer1.submitData.details

        this.$refs.layer1.selectedBasChargeAgency = []
        this.$refs.layer1.agencyname = this.currentRow.agencyname
        this.$refs.layer1.selectedBasChargeAgency.agencyid = this.currentRow.payinagencyid
        this.$refs.layer1.selectedBasChargeAgency.perimitguid = this.currentRow.billpermitid
        this.$refs.layer1.dialogTableVisible = true
        // 设置修改标记为真
        this.$store.dispatch('SetUpdateMark', true)
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
    // 表格行选择设置
    handleCurrentChangedetails(val) {
      if (val === null) {
        this.details = []
      } else {
        // 设置副表内容。
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
    add() {
      this.addState = true
      // 点击添加的时候清空数据。
      this.$refs.layer1.tableData = []
      this.$refs.layer1.selectedBasChargeAgency = []
      this.$refs.layer1.agencyname = ''
      this.$refs.layer1.submitData.approvalmark = 0

      var operator = this.userInfo.name
      this.addLayerForm = {
        requestdate: formatDate(new Date()), // 业务日期
        receipno: '', // 单据编码
        operator, // 制单人
        delivered: '', // 送审人
        reviewer: '', // 审核人
        attn: ''// 经手人
      }
      this.$refs.layer1.dialogTableVisible = true
      // 进入待保存状态。
      this.$store.dispatch('SetToolBarState', 1)
      // 每次新增，都将修改标记置为false
      this.$store.dispatch('SetUpdateMark', false)
    },
    // 获取票据种类
    getBasBillinfo: pjyw.getBasBillinfo,
    // 获取表格数据方法
    getList: pjyw.getList,
    // 删除
    delete: pjyw.delete,
    // 送审
    sendAudit: pjyw.sendAudit,
    // 审核
    postBillAudit: pjyw.billAudit,

    // 获取选择名称
    basChargeAgencySelect(datas) {
      this.basChargeAgency = datas.currentRow.agencyname
      this.form.agencyId = datas.currentRow.guid
      console.log(this.form.agencyId)
    },
    // 票据名称对话框显示
    showBasChargeAgency() {
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
    // 当前表格 页码改变 翻页
    handleCurrentChange(val) {
      this.form.pageIndex = val
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
      console.log(params)
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
<style lang="scss">
.dwypjh{

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
}
</style>

<style rel='stylesheet/scss' lang='scss' scoped>
.dwypjh{
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

