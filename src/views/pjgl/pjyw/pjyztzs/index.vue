<!--   票据印制通知书    -->
<template>
  <el-scrollbar style="height:100%;width:100%;">
    <div class="pjyztzs">
      <toolBar :client-butns-array="clientButnsArray" />
      <h1>票据印制通知书</h1>
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
                <el-option label="业务日期" value="storagedate"/>
                <el-option label="审核人 " value="reviewer"/>
                <el-option label="审核日期" value="auditdate"/>
                <el-option label="印刷厂编码" value="printingcode"/>
                <el-option label="印刷厂名称" value="printingname"/>
                <el-option label="经手人" value="attn"/>
                <el-option label="制单人" value="operator"/>
                <el-option label="合同号" value="agreement"/>
                <el-option label="交货日期" value="deliverydate"/>
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
                v-model="billName"
                clearable
                placeholder="请输入票据名称" >
                <el-button slot="append" icon="el-icon-caret-bottom" @click="showbasChargeagency()"/>
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
            @row-dblclick = "dbRow"
            @row-click="showDetail"
            @current-change="handleCurrentChangedetails">
            <el-table-column
              type="index"/>
            <el-table-column
              prop="receipno"
              sortable
              width="173"
              label="单据编码"/>
            <el-table-column
              prop="storagedate"
              width="170"
              label="业务日期"/>
            <el-table-column
              prop="auditmark"
              label="审核状态">
              <template slot-scope="scope">
                <!-- <el-checkbox :checked=" scope.row.auditmark != 0 " disabled/> -->
                {{ scope.row.auditmark | markFilter }}
              </template>
            </el-table-column>
            <el-table-column
              prop="reviewer"
              label="审核人"/>
            <el-table-column
              prop="auditdate"
              label="审核日期"/>
            <el-table-column
              prop="printingcode"
              label="印刷厂编码"/>
            <el-table-column
              prop="printingname"
              label="印刷厂名称"/>
            <el-table-column
              prop="attn"
              label="经手人"/>
            <el-table-column
              prop="operator"
              label="制单人"/>
            <el-table-column
              prop="agreement"
              label="合同号"/>
            <el-table-column
              prop="deliverydate"
              label="交货日期"/>

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
            label="票据编码"/>
          <el-table-column
            prop="billname"
            label="票据名称"/>
          <el-table-column
            prop="track"
            label="字轨"/>
          <el-table-column
            prop="startnumber"
            label="起始号码"/>
          <el-table-column
            prop="endnumber"
            label="终止号码"/>
          <el-table-column
            prop="num"
            label="份数"/>
          <el-table-column
            prop="counts"
            label="本数"/>
          <el-table-column
            prop="price"
            label="单价"/>
          <el-table-column
            prop="amount"
            label="金额"/>
          <el-table-column
            prop=""
            label="票据规格"/>
        </el-table>
      </el-scrollbar>

      <!-- 添加对话框 -->
      <add ref="layer1" :form="currentRowState" title="票据印制通知书"/>
      <!-- 票据名称对话框 -->
      <layer ref="layer" :tb-head="basBillinfoHead" :form="basBillinfoForm" :table-data="basBillInfoTableList" title="请选择票证种类信息" @select="basBillInfoSelect"/>

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
      clientButnsArray: ['close', 'billAdd', 'billUpdate', 'billDelete', 'billRefresh', 'billAudit', 'billUnaudit', 'tablePrintPreview', 'print', 'set', 'export'], // 这里填写那些服务器没有返回，但是却在按钮组中存在的按钮。
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
      billName: '',
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
      basBillInfoTableList: [],
      // 票据名称对话框表头
      basBillinfoHead: [
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
          prop: 'price',
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
      basBillinfoForm: {
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
            key: 'price'
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
        storagedate: formatDate(new Date()), // 业务日期
        deliverydate: formatDate(new Date()), // 交货日期
        receipno: '', // 单据编码
        operator: '', // 制单人
        reviewer: '', // 审核人
        attn: '', // 经手人
        agreement: '', // 合同号
        remark: '' // 备注
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
    // 票据名称关联id billname为空billId也清空
    billName(n) {
      if (!n) {
        this.form.agencyId = ''
      }
    }
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
    this.getBasBillinfo().then(res => {
      console.log(res)
      this.basBillInfoTableList = res.data
    })
  },
  methods: {
    showDetail(row) {
      console.log(row)
    },
    // 获取票据种类
    getBasBillinfo: pjyw.getBasBillinfo,
    // 双击修改或参看
    dbRow() {
      this.addState = false
      this.$refs.layer1.tableData = [].concat(this.currentRow.details)
      this.$refs.layer1.submitData.adviceNote = this.currentRow
      this.$refs.layer1.submitData.bilAdviceNoteDetails.bilAdviceNoteDetail = this.currentRow.details
      // this.$refs.layer1.submitData.adviceNote.guid = this.currentRow.guid
      this.$refs.layer1.selectedBasBillPrintingList = []

      this.$refs.layer1.printUnit = this.currentRow.printingname

      this.$refs.layer1.selectedBasBillPrintingList.guid = this.currentRow.printingid
      // this.$refs.layer1.selectedBasBillPrintingList.perimitguid = this.currentRow.billpermitid

      this.$refs.layer1.dialogTableVisible = true
      // 设置修改标记为真
      this.$store.dispatch('SetUpdateMark', true)

      if (this.currentRow.auditmark === '1') {
        // 说明已经审核
        this.$store.dispatch('SetToolBarState', 4)
      } else if (this.currentRow.approvalmark === '1') {
        this.$store.dispatch('SetToolBarState', 3)
      } else {
        // 说明未送审，处于已保存，待送审状态。这里没有送审
        this.$store.dispatch('SetToolBarState', 3)
      }
    },
    // 修改
    billUpdate() {
      if (this.currentRow.auditmark === '1') {
        this.$message.error('已审核业务不能进行修改')
      } else {
        this.addState = false
        this.$refs.layer1.tableData = [].concat(this.currentRow.details)
        this.$refs.layer1.submitData.adviceNote = this.currentRow
        this.$refs.layer1.submitData.bilAdviceNoteDetails.bilAdviceNoteDetail = this.currentRow.details
        delete this.$refs.layer1.submitData.details
        // this.$refs.layer1.submitData.adviceNote.guid = this.currentRow.guid

        this.$refs.layer1.selectedBasBillPrintingList = []

        this.$refs.layer1.agreement = this.currentRow.agreement
        this.$refs.layer1.printUnit = this.currentRow.printingname
        this.$refs.layer1.remark = this.currentRow.remark

        this.$refs.layer1.selectedBasBillPrintingList.guid = this.currentRow.printingid

        // this.$refs.layer1.selectedBasBillPrintingList.agencyid = this.currentRow.payinagencyid
        // this.$refs.layer1.selectedBasBillPrintingList.perimitguid = this.currentRow.billpermitid
        this.$refs.layer1.dialogTableVisible = true
        // 设置修改标记为真
        this.$store.dispatch('SetUpdateMark', true)
        if (this.currentRow.approvalmark === '1') {
          // 说明已经送审
          this.$store.dispatch('SetToolBarState', 3)
        } else {
          // 说明未送审，处于已保存，待送审状态。
          this.$store.dispatch('SetToolBarState', 3)
        }
      }
    },
    // 删除
    billDelete() {
      // console.log(this.currentRow.approvalmark)
      console.log(this.currentRow.auditmark)
      console.log(this.currentRow.guid)
      if (this.currentRow.auditmark === '1') {
        this.$message.error('您所选择的单据编码为【' + this.currentRow.receipno + '】的业务单据已经审核，不能进行删除操作！')
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
        if (val.auditmark === '0') {
        // 已送审，待审核
          this.$store.dispatch('SetToolBarState', 3)
        } else if (val.auditmark === '1') {
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
      this.$refs.layer1.selectedBasBillPrintingList = []
      this.$refs.layer1.printUnit = ''
      var operator = this.userInfo.name
      this.addLayerForm = {
        storagedate: formatDate(new Date()), // 业务日期
        deliverydate: formatDate(new Date()), // 交货日期
        receipno: '', // 单据编码
        operator, // 制单人
        reviewer: '', // 审核人
        attn: '', // 经手人
        agreement: '', // 合同号
        remark: ''
      }
      // this.$refs.layer1.form.requestdate = formatDate(new Date())
      // this.$refs.layer1.form.receipno = ''
      // this.$refs.layer1.form.operator = this.userInfo.name
      // this.$refs.layer1.form.delivered = ''
      // this.$refs.layer1.form.reviewer = ''
      // this.$refs.layer1.form.attn = ''

      // console.log(formatDate(new Date()))
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
    // getBasBillinfo: pjyw.getBasBillinfo,
    // 获取表格数据方法
    getList: pjyw.getList,
    // 删除
    delete: pjyw.delete,
    // 审核
    postBillAudit: pjyw.billAudit,

    // 获取选择名称
    basBillInfoSelect(datas) {
      // 设置。。。。。。。。billname
      // this.billname = datas.currentRow.billname
      // this.form.billId = datas.currentRow.guid
      console.log(datas.currentRow.billname)
      console.log(datas.currentRow)
      console.log(datas.currentRow.guid)

      this.billName = datas.currentRow.billname
      // this.selectedBasBillPrintingList = datas.currentRow
      this.form.agencyId = datas.currentRow.guid
      console.log(this.form.agencyId)
    },
    // 票据名称对话框显示
    showbasChargeagency() {
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
    // 审核 对话框
    billAudit() {
      this.billAuditType(0)
    },
    // 反审
    billUnaudit() {
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
        this.dialogFormVisible = false
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

