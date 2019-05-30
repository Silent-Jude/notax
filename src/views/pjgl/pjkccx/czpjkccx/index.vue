<!-- czpjkccx 财政票据库存查询 -->
<template>
  <el-scrollbar class="czpjkccx" style="height:100%;width:100%;">
    <div class="pjyztzs">
      <toolBar :client-butns-array="clientButnsArray" />
      <h1>财政票据库存查询</h1>
      <!-- 上表 -->
      <el-form ref="form" :model="form" size="mini" label-width="80px">
        <el-row>
          <el-col :span="9">
            <el-form-item label="票据名称">
              <el-input
                v-model="billname"
                clearable
                placeholder="请输入票据名称" >
                <el-button slot="append" icon="el-icon-caret-bottom" @click="showpjmc()"/>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="80px" label="字轨">
              <el-input v-model="form.track" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label-width="80px" label="统计类型">
              <el-radio-group v-model="type1">
                <el-radio label="1">全部</el-radio>
                <el-radio label="2">实际库存</el-radio>
                <el-radio label="3">待印制库存</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9">
            <el-form-item label="仓库名称">
              <el-input
                v-model="printingname"
                clearable
                placeholder="请输入仓库名称" >
                <el-button slot="append" icon="el-icon-caret-bottom" @click="showckmc()"/>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="80px" label="票据号码">
              <el-input v-model="form.billNumber" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label-width="80px" label="显示方式">
              <el-radio-group v-model="type2">
                <el-radio label="1">明细</el-radio>
                <el-radio label="2">汇总</el-radio>
                <el-radio label="3">明细及汇总</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- <el-row>
          <el-col :span="4">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="onSubmit">查找</el-button>
            </el-form-item>
          </el-col>
        </el-row> -->
        <!-- 分页 -->
        <!-- <el-row>
          <el-pagination
            :current-page="form.pageIndex"
            :page-sizes="[10, 15, 20, 25, 30]"
            :page-size="form.pageSize"
            :total="form.totalCount"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"/>
        </el-row> -->
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
            @row-dblclick = "dbRow"
            @current-change="handleCurrentChangeIndex">
            <el-table-column
              type="index"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="storagecode"
              show-overflow-tooltip
              label="仓库编码"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="storagename"
              show-overflow-tooltip
              label="仓库名称"/>
            <!-- <el-table-column
              prop="auditmark"
              label="审核状态">
              <template slot-scope="scope">
                {{ scope.row.auditmark | markFilter }}
              </template>
            </el-table-column> -->
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="billcode"
              show-overflow-tooltip
              label="票据编码"/>
            <el-table-column
              prop="billname"
              sortable
              header-align="center"
              align="center"
              width="170"
              show-overflow-tooltip
              label="票据名称"/>
            <el-table-column
              prop="typename"
              sortable
              header-align="center"
              align="center"
              width="70"
              show-overflow-tooltip
              label="类型"/>
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
              prop="startnumber"
              show-overflow-tooltip
              label="起始号码"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="endnumber"
              show-overflow-tooltip
              label="终止号码"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="70"
              prop="inventory"
              show-overflow-tooltip
              label="份数"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="70"
              prop="counts"
              show-overflow-tooltip
              label="本数"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="70"
              prop="price"
              show-overflow-tooltip
              label="单价"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="70"
              prop="amount"
              show-overflow-tooltip
              label="金额"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="120"
              prop="createdate"
              show-overflow-tooltip
              label="业务时间"/>
            <el-table-column
              sortable
              header-align="center"
              align="center"
              width="70"
              prop="overyear"
              show-overflow-tooltip
              label="状态"/>
          </el-table>
        </el-scrollbar>
      </div>

      <!-- 明细 -->
      <el-dialog :visible.sync="dialogTableVisible" :close-on-click-modal="false" title="票据库存明细" width="80%">
        <!-- 显示表格 -->
        <div class="wrap-add" style="height:400px;">
          <el-scrollbar style="height:100%;width:100%;">
            <el-table ref="clearDetail" :data="detail" highlight-current-row border style="width: 100%">
              <el-table-column width="80" type="index"/>
              <el-table-column
                sortable
                header-align="center"
                align="center"
                width="120"
                show-overflow-tooltip
                prop="unitcode"
                label="单位编码" />
              <el-table-column
                sortable
                header-align="center"
                align="center"
                width="170"
                show-overflow-tooltip
                prop="unitname"
                label="单位名称" />
              <el-table-column
                sortable
                header-align="center"
                align="center"
                width="120"
                show-overflow-tooltip
                prop="billcode"
                label="票据编码" />
              <el-table-column
                sortable
                header-align="center"
                align="center"
                width="170"
                show-overflow-tooltip
                prop="billname"
                label="票据名称" />
              <el-table-column
                sortable
                header-align="center"
                align="center"
                width="70"
                show-overflow-tooltip
                prop="track"
                label="字轨"/>
              <el-table-column
                sortable
                header-align="center"
                align="center"
                width="120"
                show-overflow-tooltip
                prop="operate"
                label="操作方式"/>
              <el-table-column
                sortable
                header-align="center"
                align="center"
                width="120"
                show-overflow-tooltip
                prop="receipno"
                label="单据编码"/>
              <el-table-column
                sortable
                header-align="center"
                align="center"
                width="120"
                show-overflow-tooltip
                prop="createdate"
                label="日期"/>
              <el-table-column
                sortable
                header-align="center"
                align="center"
                width="120"
                show-overflow-tooltip
                prop="auditmark"
                label="审核状态">
                <template slot-scope="scope">
                  {{ scope.row.auditmark | markFilter }}
                </template>
              </el-table-column>
              <el-table-column
                sortable
                header-align="center"
                align="center"
                width="120"
                show-overflow-tooltip
                prop="startnumber"
                label="起始编码"/>
              <el-table-column
                sortable
                header-align="center"
                align="center"
                width="120"
                show-overflow-tooltip
                prop="endnumber"
                label="终止编码"/>
              <el-table-column
                sortable
                header-align="center"
                align="center"
                width="70"
                show-overflow-tooltip
                prop="num"
                label="数量"/>
              <el-table-column
                sortable
                header-align="center"
                align="center"
                width="120"
                show-overflow-tooltip
                prop="fromcode"
                label="来源编码"/>
              <el-table-column
                sortable
                header-align="center"
                align="center"
                width="170"
                show-overflow-tooltip
                prop="fromname"
                label="来源名称"/>
            </el-table>
          </el-scrollbar>
        </div>

      </el-dialog>

      <!-- 单位名称层 -->
      <layer ref="layer" @select="selectckmc"/>
      <!-- 票据名称层 -->
      <layer1 ref="layer1" @select="selectpjmc"/>

      <!-- 添加对话框 -->
      <!-- <add ref="layerAdd"/> -->
    </div>
  </el-scrollbar>
</template>

<script>
import toolBar from '@/components/toolBar'
import Bus from '@/utils/Bus'
import layer from '@/components/pjglLayer/ckmcLayer'
import layer1 from '@/components/pjglLayer/pjmcLayer'
import pjkccx from '@/api/pjgl/pjkccx/pjkccx.js'
// import add from './add'
export default {
  components: {
    toolBar, // 上方工具条栏
    layer,
    layer1
    // add
  },
  data() {
    return {
      // 明细层
      dialogTableVisible: false,
      // 明细信息
      detail: [],
      // 这里填写那些服务器没有返回，但是却在按钮组中存在的按钮。
      clientButnsArray: ['close', 'clear', 'refresh1', 'print', 'tablePrintPreview', 'set', 'export'],
      //  仓库名称   关联id
      printingname: '',
      // 票据名称名称  关联id
      billname: '',
      // 类型拼接type = type1+type2
      type1: '1',
      type2: '1',
      // 表单数据
      form: {
        // 提交数据
        billId: '',
        billNumber: '',
        track: '',
        storageId: '',
        type: '1,1'
      },
      // 当前表格数据
      tableData: [],
      // 当前表格选择项
      currentRow: {}
    }
  },

  computed: {

  },

  watch: {
    // 类型拼接type
    type1(n) {
      this.form.type = `${n},${this.type2}`
    },
    type2(n) {
      this.form.type = `${this.type1},${n}`
    },
    //  仓库名称 关联id printingname为空printingId也清空
    printingname(n) {
      if (!n) {
        this.form.storageId = ''
      }
    },
    // 票据名称 关联id billname为空billId也清空
    billname(n) {
      if (!n) {
        this.form.billId = ''
      }
    }
  },

  created() {
    // 清除
    Bus.$off('clear')
    Bus.$on('clear', () => {
      this.clear()
    })
    // 刷新
    Bus.$off('refresh1')
    Bus.$on('refresh1', () => {
      this.onSubmit()
    })
    // 初次进入设置第一行为选中行
    this.$store.dispatch('SetCurrentRowIndex', 0)
    // 获取当前表格数据
    this.queryFinanceBillStore(this.form)
  },

  methods: {
    //  仓库名称选择后监听
    selectckmc(val) {
      console.log('单位名称选择数据', val)
      this.form.storageId = val.currentRow.guid
      this.printingname = val.currentRow.storagename
    },
    // 票据名称选择后监听
    selectpjmc(val) {
      console.log(' 票据名称选择数据', val)
      this.form.billId = val.currentRow.guid
      this.billname = val.currentRow.billname
    },
    // 显示仓库名称层
    showckmc() {
      this.$refs.layer.dialogTableVisible = true
    },
    // 显示票据名称层
    showpjmc() {
      this.$refs.layer1.dialogTableVisible = true
    },
    // 双击参看
    dbRow() {
      console.log(this.currentRow)
      if (this.currentRow.guid === null) {
        return
      }
      this.queryFinanceBillStoreDetail(this.currentRow)
      // .then(res => {
      //   console.log(JSON.stringify(res.data))
      //   this.$refs.layerAdd.getdata = res.data
      //   this.$refs.layerAdd.dialogTableVisible = true
      // })
    },
    // 表格行选择设置
    handleCurrentChangeIndex(val) {
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
    // 清除重置
    clear() {
      // 印刷厂名称   关联id
      this.printingname = ''
      // 票据名称名称  关联id
      this.billname = ''
      // 表单数据
      this.form.billId = ''
      this.form.storageId = ''
      this.form.billNumber = ''
      this.form.track = ''
    },
    // 获取表格数据方法
    queryFinanceBillStore: pjkccx.queryFinanceBillStore,
    // 明细数据方法
    queryFinanceBillStoreDetail: pjkccx.queryFinanceBillStoreDetail,
    // 查看表格一行对应数据方法
    // getBillInfoguid: pjkccx.getBillInfoguid,
    // 日期框是否开启-设置起始和终止时间
    isdateChange(val) {
      if (val) {
        var time = new Date()
        this.form.startBackDate = `${time.getFullYear()}-${time.getMonth() + 1}-1`
        // 设置当前时间
        this.form.endBackDate = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`
      } else {
        this.form.startBackDate = ''
        this.form.endBackDate = ''
      }
    },
    // 当前表格查找 ==> 筛选按钮
    onSubmit() {
      this.queryFinanceBillStore(this.form)
    },
    // 当前表格 页条数改变
    handleSizeChange(val) {
      this.form.pageSize = val
      this.queryFinanceBillStore(this.form)
    },
    // 当前表格 页码改变 翻页
    handleCurrentChange(val) {
      this.form.pageIndex = val
      this.queryFinanceBillStore(this.form)
    }
  }
}

</script>
<style lang="scss">
.czpjkccx{

  .wrap-add {
    height: 200px;
    .el-table {
      overflow: initial;
    }
    .el-table__body-wrapper {
      overflow: initial !important;
    }
    .el-scrollbar__view {
      width: fit-content;
    }
  }
.el-scrollbar__view{
  height: 100%;
}
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

