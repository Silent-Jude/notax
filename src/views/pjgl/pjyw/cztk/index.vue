<!-- cztk  财政退库    -->
<template>
  <el-scrollbar class="cztk" style="height:100%;width:100%;">
    <div class="pjyztzs">
      <toolBar :client-butns-array="clientButnsArray" />
      <h1>财政退库</h1>
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
                <el-option label="退库日期" value="backdate"/>
                <el-option label="制单人" value="delivered"/>
                <el-option label="审核人" value="reviewer"/>
                <el-option label="审核日期" value="auditdate"/>
                <el-option label="送审日期" value="approvaldate"/>
                <el-option label="送审人 " value="delivered"/>
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
                v-model="billname"
                clearable
                placeholder="请输入票据名称" >
                <el-button slot="append" icon="el-icon-caret-bottom" @click="show()"/>
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
          <el-col :span="10">
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
            @current-change="handleCurrentChangedetails">
            <el-table-column
              type="index"/>
            <el-table-column
              prop="receipno"
              label="单据编码"/>
            <el-table-column
              prop="backdate"
              label="退库日期"/>
            <el-table-column
              prop="operator"
              label="制单人"/>
            <el-table-column
              prop="auditmark"
              label="审核标志"
              align="center">
              <template slot-scope="scope"><el-checkbox :checked=" scope.row.auditmark != 0 " disabled/></template>
            </el-table-column>
            <el-table-column
              prop="reviewer"
              label="审核人"/>
            <el-table-column
              prop="auditdate"
              label="审核日期"/>
            <el-table-column
              prop="approvalmark"
              label="送审标志">
              <template slot-scope="scope"><el-checkbox :checked=" scope.row.approvalmark != 0 " disabled/></template>
            </el-table-column>
            <el-table-column
              prop="approvaldate"
              label="送审日期"/>
            <el-table-column
              prop="delivered"
              label="送审人"/>
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
        </el-table>
      </el-scrollbar>

      <!-- 添加对话框 -->
      <add ref="layer1" :form="currentRow" title="财政退库"/>
      <!-- 票据名称对话框 -->
      <layer ref="layer" :tb-head="tbHead" :form="formTicket" :table-data="ticket" title="请选择票据种类" @select="getSelect"/>
    </div>
  </el-scrollbar>
</template>

<script>
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
      clientButnsArray: ['close', 'billAdd', 'billUpdate', 'billDelete', 'billRefresh', 'billSendAudit', 'billAudit', 'tablePrintPreview', 'print', 'set', 'export'], // 这里填写那些服务器没有返回，但是却在按钮组中存在的按钮。
      // 详情
      details: [],
      // 当前表格选择项
      currentRow: {},
      // dialogTableVisible: false,
      // 票据名称关联id
      billname: '',
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
        billId: '',
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
      // 票据种类表格数据
      ticket: [],
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
      formTicket: {
        coding: '',
        // 下拉框选项
        // codingoption: ['票据编码', '票据名称', '拼音简码', '单价', '计价方式', '每本份数'],
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
      }
    }
  },
  computed: {
    btnsavestate() {
      return this.$store.getters.savestate === 0
    }
  },
  watch: {
    // 票据名称关联id billname为空billId也清空
    billname(n) {
      if (!n) {
        this.form.billId = ''
      }
    }
  },
  created() {
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
      this.ticket = res.data
    })
  },
  methods: {
    billSendAudit() {},
    // 双击修改或参看
    dbRow() {
      this.$refs.layer1.tableData = [].concat(this.currentRow.details)
      this.$refs.layer1.dialogTableVisible = true
      if (this.currentRow.approvalmark === '1') {
      // this.$store.dispatch('SetToolBarState', 1)
      } else {
        // this.$store.dispatch('SetToolBarState', 1)
      }
    },
    // 修改
    billUpdate() {
      if (this.currentRow.approvalmark === '1') {
        this.$message.error('业务记录已送审不能进行修改')
      } else {
        this.$refs.layer1.tableData = [].concat(this.currentRow.details)
        this.$refs.layer1.dialogTableVisible = true
        // this.$store.dispatch('SetToolBarState', 1)
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
            }
          })
        })
      }
    },
    // 表格行选择设置
    handleCurrentChangedetails(val) {
      if (val === null) {
        this.details = []
      } else {
        this.details = val.details ? val.details : []
      }
      this.currentRow = val
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
      this.$refs.layer1.storageWarehouse = ''
      this.$refs.layer1.storageCurrent = []
      this.$refs.layer1.tableData = []
      this.$refs.layer1.dialogTableVisible = true
      this.$store.dispatch('SetToolBarState', 1)
    },
    // 添加测试
    // showadd() {
    //   this.$refs.layer1.dialogTableVisible = true
    // },
    // 获取票据种类
    getBasBillinfo: pjyw.getBasBillinfo,
    // 获取表格数据方法
    getList: pjyw.getList,
    // 删除
    delete: pjyw.delete,
    // 获取选择名称
    getSelect(datas) {
      // 设置。。。。。。。。billname
      this.billname = datas.currentRow.billname
      this.form.billId = datas.currentRow.guid
    },
    // 票据名称对话框显示
    show() {
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
    }
  }
}

</script>
<style lang="scss">
.cztk{

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

