<template>
  <div class="dwlrdzsq">
    <toolBar :get-current-row="currentRow" :client-butns-array="clientButnsArray" />
    <h1>非税收入退付管理</h1>
    <el-form ref="form" :model="form" size="mini" label-width="80px">
      <el-row>
        <el-col :span="2">
          <el-form-item label-width="20px" label="">
            <el-checkbox-group v-model="form.isdate" @change="isdateChange">
              <el-checkbox label="退付日期" name="type"/>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="" label-width="0px">
            <el-date-picker
              :disabled="!form.isdate"
              v-model="form.startdate"
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
              :disabled="!form.isdate"
              v-model="form.enddate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"/>
          </el-form-item>
        </el-col>
        <!-- </el-row>
      <el-row> -->
        <el-col :span="2">
          <el-form-item label-width="20px" label="">
            <label class="el-form-item__label" style="width: 60px;">刷新条件</label>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="" label-width="0px">
            <el-select v-model="form.selFilter" placeholder="">
              <el-option label="执收单位编码" value="agencycode"/>
              <el-option label="执收单位名称" value="agencyname"/>
              <el-option label="缴款人" value="payer"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <el-form-item label="等于" label-width="40px"/>
        </el-col>
        <el-col :span="3">
          <el-form-item label="" label-width="0px">
            <el-input v-model="form.selValue" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label-width="10px" label="">
            <el-radio-group v-model="form.state">
              <el-radio :label="1">全部</el-radio>
              <el-radio :label="2">已审核</el-radio>
              <el-radio :label="3">未审核</el-radio>
              <el-radio :label="4">已送审</el-radio>
              <el-radio :label="5">未送审</el-radio>
              <el-radio :label="6">已退付</el-radio>
              <el-radio :label="7">未退付</el-radio>
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
            v-for="(item) in tablehd"
            :key="item.prop"
            :width="item.width"
            :prop="item.prop"
            :label="item.label"
            sortable
            header-align="center"
            align="center"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="item.prop === 'reported'|| item.prop === 'audited'">
                {{ scope.row[item.prop] | markFilter }}
              </span>
              <!-- <span v-else-if="item.prop === 'audited'">
                {{ scope.row[item.prop] | markFilter }}
              </span> -->
              <span v-else>
                {{ scope.row[item.prop] }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
    </div>
    <!-- 表2 -->
    <div class="wrap">
      <el-scrollbar style="height:100%;width:100%;">
        <el-table
          :data="currentRow ? currentRow.details :[]"
          border
          style="width: 100%">
          <el-table-column
            type="index"/>
          <el-table-column
            prop="nontaxcode"
            show-overflow-tooltip
            sortable
            width="160"
            align="center"
            label="收费项目编码"/>
          <el-table-column
            prop="nontaxname"
            show-overflow-tooltip
            sortable
            width="160"
            align="center"
            label="收费项目名称"/>
          <el-table-column
            prop="chargeunit"
            show-overflow-tooltip
            sortable
            width="100"
            align="center"
            label="计量单位"/>
          <el-table-column
            prop="num"
            show-overflow-tooltip
            sortable
            width="110"
            align="center"
            label="收费数量"/>
          <el-table-column
            prop="amt"
            show-overflow-tooltip
            sortable
            width="110"
            align="center"
            label="收费金额"/>
          <el-table-column
            prop="rfdamt"
            show-overflow-tooltip
            sortable
            width="110"
            align="center"
            label="退付金额"/>
          <el-table-column
            prop="chargelower"
            show-overflow-tooltip
            sortable
            width="110"
            align="center"
            label="收费下限"/>
          <el-table-column
            prop="chargelimit"
            show-overflow-tooltip
            sortable
            width="110"
            align="center"
            label="收费上限"/>
        </el-table>
      </el-scrollbar>
    </div>
    <!-- 添加对话框 -->
    <add ref="layer1"/>
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
</template>

<script>
import toolBar from '@/components/toolBar'
import fssrtfgl from '@/api/czzsgl/fssrtfgl/fssrtfgl.js'
import Bus from '@/utils/Bus'
import add from './add'
export default {
  components: {
    toolBar, // 上方工具条栏
    add
  },
  data() {
    return {
      // 审核
      dialogFormVisible: false,
      // 审核信息
      auditOpinion: '通过',
      // 工具条按钮组
      clientButnsArray: ['close', 'czbillAddAudit', 'czbillUnaudit', 'czbillRefresh', 'tablePrintPreview', 'print', 'export', 'tablePrintSet'],
      // 当前表单数据
      form: {
        // 页码
        pageIndex: 1, // pageIndex
        // 页条数
        pageSize: 10, // pageSize
        // 审核状态
        state: 1, // state
        // 开始时间
        startdate: '', // startdate
        // 结束时间
        enddate: '', // enddate
        // 筛选条件k
        selFilter: '', // selFilter
        // 筛选条件v
        selValue: '', // selValue
        // 总条数数
        totalCount: 0,
        // 是否开启日期
        isdate: false
      },
      // 表一选择行标数据
      currentRow: {},
      // 表1数据
      tableData: [],
      // 提取的表头数据
      tablehd: [
        {
          width: '160',
          prop: 'rfdbillno',
          label: '单据编号'
        },
        {
          width: '180',
          prop: 'agencycode',
          label: '执收单位编码'
        },
        {
          width: '180',
          prop: 'agencyname',
          label: '执收单位名称'
        },
        {
          width: '120',
          prop: 'billcode',
          label: '票据编码'
        },
        {
          width: '160',
          prop: 'remark',
          label: '凭证号'
        },
        {
          width: '200',
          prop: 'billname',
          label: '票据名称'
        },
        {
          width: '200',
          prop: 'rfdbilldate',
          label: '填制日期'
        },
        {
          width: '80',
          prop: 'track',
          label: '字轨'
        },
        {
          width: '160',
          prop: 'paybillno',
          label: '原缴款书编号'
        },
        {
          width: '160',
          prop: 'payer',
          label: '缴款人全称'
        },
        {
          width: '120',
          prop: 'payerbankacctno',
          label: '缴款人账号'
        },
        {
          width: '160',
          prop: 'payerbankname',
          label: '缴款人开户行'
        },
        {
          width: '100',
          prop: 'reported',
          label: '送审标志'
        },
        {
          width: '100',
          prop: 'reporter',
          label: '送审人'
        },
        {
          width: '160',
          prop: 'reportdate',
          label: '送审日期'
        },
        {
          width: '100',
          prop: 'audited',
          label: '审核标志'
        },
        {
          width: '100',
          prop: 'auditor',
          label: '审核人'
        },
        {
          width: '160',
          prop: 'auditdate',
          label: '审核日期'
        }
      ]
    }
  },
  created() {
    // 获取当前表格数据
    this.pageIndex = 1
    this.onSubmit()
    // 添加
    Bus.$off('add')
    Bus.$on('add', () => {
      this.add()
    })
    // 修改
    Bus.$off('billUpdate')
    Bus.$on('billUpdate', () => {
      this.billUpdate()
    })
    // 删除
    Bus.$off('billDelete')
    Bus.$on('billDelete', () => {
      this.billDelete()
    })
    // 刷新
    Bus.$off('onSubmit')
    Bus.$on('onSubmit', () => {
      this.form.pageIndex = 1
      this.onSubmit()
    })
    // 送审
    Bus.$off('billSendAudit')
    Bus.$on('billSendAudit', () => {
      this.billSendAudit()
    })
    // 审核
    Bus.$off('billAddAudit')
    Bus.$on('billAddAudit', () => {
      this.billAudit()
    })
    // 反审
    Bus.$off('billUnaudit')
    Bus.$on('billUnaudit', () => {
      this.billUnaudit()
    })
  },
  methods: {
    postBillAudit: fssrtfgl.billAudit,
    // 审核 对话框
    billAudit() {
      this.dialogFormVisible = true
    },
    // 反审
    billUnaudit() {
      this.auditOpinion = ''
      this.billAuditType(1)
    },
    // 通过0 反审1 退回2
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
        if (this.$refs.layer1.dialogTableVisible === false) {
          // 获取最新数据
          this.form.pageIndex = 1
          this.onSubmit()
        }
        // get数据
        fssrtfgl.get(this.currentRow.guid).then(res => {
          console.log(res)
          console.log(JSON.stringify(res.data))
          // 显示add组件
          // this.$refs.layer1.dialogTableVisible = true
          // 设置数据
          this.$refs.layer1.currentRow = res.data
          // 设置编辑状态
          // this.$refs.layer1.state = true
        })
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
    },
    // 双击表格行
    dbRow(row) {
      console.log('row', row)
      fssrtfgl.get(row.guid).then(res => {
        console.log(res)
        console.log(JSON.stringify(res.data))
        // 显示add组件
        this.$refs.layer1.dialogTableVisible = true
        // 数据
        res.data.rfdDetails.forEach((item, index) => {
          // res.data.details[index].proid1 = res.data.details[index].proid
          // res.data.details[index].proid = ''
          // 是否选中
          res.data.details[index].st = true
          res.data.details[index] = Object.assign(res.data.details[index], item)
        })
        this.$refs.layer1.currentRow = res.data
        // 编辑状态
        this.$refs.layer1.state = false
      })
    },
    // 单击表格行
    handleCurrentChangedetails(currentRow) {
      // 记录选择行数据
      this.currentRow = currentRow
    },
    // 当前表格 页码改变 翻页
    handleCurrentChange(val) {
      this.form.pageIndex = val
      this.onSubmit(this.form)
    },
    // 当前表格 页条数改变
    handleSizeChange(val) {
      this.form.pageSize = val
      this.onSubmit(this.form)
    },
    // 日期框改变
    isdateChange(val) {
      if (val) {
        var time = new Date()
        this.form.startdate = `${time.getFullYear()}-${time.getMonth() + 1}-1`
        // 设置当前时间
        this.form.enddate = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`
      } else {
        this.form.startdate = ''
        this.form.enddate = ''
      }
    },
    // 添加
    add() {
      var time = new Date()
      // 显示add组件
      this.$refs.layer1.dialogTableVisible = true
      // 清空设置数据
      this.$refs.layer1.currentRow = {
        rfdbilldate: `${time.getFullYear()}-${(time.getMonth() + 1) > 9 ? (time.getMonth() + 1) : ('0' + (time.getMonth() + 1))}-${time.getDate()} 00:00:00`,
        details: []
      }
      // 设置编辑状态
      this.$refs.layer1.state = true
    },
    // 修改
    billUpdate() {
      // get数据
      fssrtfgl.get(this.currentRow.guid).then(res => {
        console.log(res)
        console.log(JSON.stringify(res.data))
        // 显示add组件
        res.data.rfdDetails.forEach((item, index) => {
          // res.data.details[index].proid1 = res.data.details[index].proid
          // res.data.details[index].proid = ''
          res.data.details[index].st = true
          res.data.details[index] = Object.assign(res.data.details[index], item)
        })
        this.$refs.layer1.dialogTableVisible = true
        // 设置数据
        this.$refs.layer1.currentRow = res.data
        // 设置编辑状态
        this.$refs.layer1.state = true
      })
    },
    // 删除
    billDelete() {
      this.$confirm('您确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除
        fssrtfgl.remove(this.currentRow.guid).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // 在add组件内时
          // 隐藏add组件
          this.$refs.layer1.dialogTableVisible = false
          // 更新数据
          this.form.pageIndex = 1
          this.onSubmit()
        })
      }).catch(() => { console.log('取消了') })
    },
    // 查找
    onSubmit() {
      // list数据
      fssrtfgl.list(this.form).then(res => {
        this.tableData = res.data.data
        // 设置总条数
        this.form.totalCount = res.data.pageInfo.totalCount
        // 设置表中数据
        this.$refs.singleTable.setCurrentRow(this.tableData[0])
        console.log(JSON.stringify(res.data.data))
      })
    },
    // 送审
    billSendAudit() {
      this.$confirm('您确定要送审吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        fssrtfgl.sendReported(this.currentRow.guid).then(res => {
          // 在add组件内时
          fssrtfgl.get(this.currentRow.guid).then(res => {
            console.log(res)
            console.log(JSON.stringify(res.data))
            // 设置数据
            res.data.rfdDetails.forEach((item, index) => {
              // res.data.details[index].proid1 = res.data.details[index].proid
              // res.data.details[index].proid = ''
              res.data.details[index].st = true
              res.data.details[index] = Object.assign(res.data.details[index], item)
            })
            this.$refs.layer1.currentRow = res.data
            // 编辑状态
            this.$refs.layer1.state = false
          })
          this.$message({
            type: 'success',
            message: '送审成功!'
          })
          // 更新数据
          this.form.pageIndex = 1
          this.onSubmit()
        })
      }).catch(() => { console.log('取消了') })
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
.dwlrdzsq{
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
  .wrap{
    height: 200px;
  }
  .wrap-box{
    flex: 1;
    padding: 5px;
    height: 200px;
}
}
</style>
