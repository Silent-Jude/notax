<!--   财政公告管理 czgggl    -->
<template>
  <!-- <el-scrollbar style="height:100%;width:100%;"> -->
  <div class="czgggl">
    <toolBar :client-butns-array="clientButnsArray" />
    <h1>财政公告管理</h1>
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
              <el-option label="领用日期" value="applydate"/>
              <el-option label="经手人" value="attn"/>
              <el-option label="审核人" value="reviewer"/>
              <el-option label="审核日期" value="auditdate"/>
              <el-option label="单位编码" value="agencycode"/>
              <el-option label="单位名称 " value="agencyname"/>
              <el-option label="领用证编码" value="permitNo"/>
              <el-option label="领用证名称" value="billpermitname"/>
              <el-option label="缴款书单据编码" value="billpermitname"/>
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
        <el-col :span="12">
          <el-form-item label-width="10px" label="">
            <el-radio-group v-model="form.flag">
              <el-radio :label="0">全部</el-radio>
              <el-radio :label="1">已审核</el-radio>
              <el-radio :label="2">未审核</el-radio>
            </el-radio-group>
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
          @row-click="showDetail"
          @row-dblclick = "dbRow"
          @current-change="handleCurrentChangedetails">
          <el-table-column
            type="index"/>
          <el-table-column
            v-for="(item,i) in tableHead"
            :key="i"
            :prop="item.prop"
            :label="item.label"
            :width="item.width || 180"
            show-overflow-tooltip
            sortable
            align="center">
            <template slot-scope="scope" >
              <span v-if="item.prop === 'audited'">
                {{ scope.row[item.prop] | markFilter }}
              </span>
              <span v-else>{{ scope.row[item.prop] }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
    </div>
    <add ref="layer1" :form="currentRowState" title="财政公告查询"/>
  </div>
  <!-- </el-scrollbar> -->
</template>

<script>
import { mapState } from 'vuex'
import { formatDate } from '@/utils/Common'
import Bus from '@/utils/Bus'
import toolBar from '@/components/toolBar'
import layer from '@/components/layer'
import add from './add'
import czgggl from '@/api/xtgl/czgggl.js'
export default {
  components: {
    toolBar, // 上方工具条栏
    layer,
    add
  },
  data() {
    return {
      optionList: [
        { label: '公告标题', prop: 'title', width: '200' },
        { label: '经办人', prop: 'modifier', width: '100' },
        { label: '审核人', prop: 'auditor', width: '120' },
        { label: '年度', prop: 'year', width: '120' }
      ],
      tableHead: [
        { label: '公告标题', prop: 'title', width: '200' },
        { label: '经办人', prop: 'modifier', width: '100' },
        { label: '经办日期', prop: 'modifytime', width: '220' },
        { label: '公告起始日期', prop: 'creattime', width: '220' },
        { label: '公告终止日期', prop: 'enddate', width: '220' },
        { label: '审核标志', prop: 'audited', width: '120' },
        { label: '审核人', prop: 'auditor', width: '120' },
        { label: '审核日期', prop: 'auditdate', width: '220' }
      ],
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
      addLayerForm: {
        applydate: formatDate(new Date()), // 业务日期
        outstoretrack: '', // 出库字轨
        outstoreno: '', // 出库单号
        tradetype: null, // 缴款方式
        tradeid: null, // 缴款书号
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
    Bus.$off('onSubmit')
    Bus.$on('onSubmit', () => {
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
  },
  methods: {
    showDetail(row) {
      console.log(row)
    },
    // 双击修改或参看
    dbRow(row) {
      this.addState = false
      this.$refs.layer1.tableData = [].concat(this.currentRow.details)
      this.$refs.layer1.submitData.apply = this.currentRow
      this.$refs.layer1.submitData.bilApplyDetails.bilApplyDetail = this.currentRow.details

      this.$refs.layer1.selectedBasChargeAgency = []
      this.$refs.layer1.selectedBasBillStorage = []

      this.$refs.layer1.chargeAgencyName = this.currentRow.agencyname
      this.$refs.layer1.receiveBillStorageName = this.currentRow.storagename

      this.$refs.layer1.selectedBasChargeAgency.agencyid = this.currentRow.payinagencyid
      this.$refs.layer1.selectedBasChargeAgency.perimitguid = this.currentRow.permitid
      this.$refs.layer1.selectedBasBillStorage.guid = this.currentRow.storeid

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
        this.$refs.layer1.submitData.apply = this.currentRow
        this.$refs.layer1.submitData.bilApplyDetails.bilApplyDetail = this.currentRow.details
        // this.$refs.layer1.submitData.apply.guid = this.currentRow.guid
        this.$refs.layer1.selectedBasChargeAgency = []
        this.$refs.layer1.selectedBasBillStorage = []

        this.$refs.layer1.chargeAgencyName = this.currentRow.agencyname
        this.$refs.layer1.receiveBillStorageName = this.currentRow.storagename

        this.$refs.layer1.selectedBasChargeAgency.agencyid = this.currentRow.payinagencyid
        this.$refs.layer1.selectedBasChargeAgency.perimitguid = this.currentRow.permitid
        this.$refs.layer1.selectedBasBillStorage.guid = this.currentRow.storeid

        // this.$refs.layer1.selectedBasBillStorage.
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
      this.$refs.layer1.selectedBasChargeAgency = []

      this.$refs.layer1.chargeAgencyName = ''
      this.$refs.layer1.receiveBillStorageName = ''

      var operator = this.userInfo.name
      this.addLayerForm = {
        applydate: formatDate(new Date()), // 业务日期
        outstoretrack: '', // 出库字轨
        outstoreno: '', // 出库单号
        tradetype: null, // 缴款方式
        tradeid: null, // 缴款书号
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
    // 获取表格数据方法
    getList: czgggl.getList,
    // 删除
    // delete: pjyw.delete,
    // 审核
    // postBillAudit: pjyw.billAudit,

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
        this.onSubmit()
      }).catch(err => { console.log(err) })
    },
    // 审核
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
        // auditOpinion: this.auditOpinion,
        guid: this.currentRow.guid,
        type: type
      }
      this.postBillAudit(params).then(res => {
        // console.log(res)
        // this.auditOpinion = '通过'
        // 获取最新数据
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
</style>

<style rel='stylesheet/scss' lang='scss' scoped>
.czgggl{
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
  }
  .wrap-box{
    flex: 1;
    padding: 5px;
    background:#fff
}
}
</style>

