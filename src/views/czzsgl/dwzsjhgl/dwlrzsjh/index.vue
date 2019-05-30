<template>
  <div class="dwlrdzsq">
    <toolBar :get-current-row="currentRow" :client-butns-array="clientButnsArray" />
    <h1>单位征收计划管理</h1>
    <el-form ref="form" :model="form" size="mini" label-width="80px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="申请单位" label-width="">
            <el-input
              v-model="namen"
              clearable
              placeholder="" >
              <el-button slot="append" icon="el-icon-caret-bottom" @click="show()"/>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="计划年度" label-width="">
            <el-input v-model="form.year" clearable=""/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label-width="10px" label="">
            <el-radio-group v-model="form.state">
              <el-radio :label="1">全部</el-radio>
              <el-radio :label="2">已审核</el-radio>
              <el-radio :label="3">未审核</el-radio>
              <el-radio :label="4">已送审</el-radio>
              <el-radio :label="5">未送审</el-radio>
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
              <span v-if="item.prop === 'reported'|| item.prop === 'auditmark'">
                {{ scope.row[item.prop] | markFilter }}
              </span>
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
            :label="`${currentRow && currentRow.typename || ''}编码`"
            prop="procode"
            show-overflow-tooltip
            sortable
            width="120"
            align="center"/>
          <el-table-column
            :label="`${currentRow && currentRow.typename || ''}名称`"
            prop="proname"
            show-overflow-tooltip
            sortable
            width="200"
            align="center"/>
          <el-table-column
            prop="prevyearnum"
            show-overflow-tooltip
            sortable
            width="160"
            align="center"
            label="上年结转计划数"/>
          <el-table-column
            prop="ratifyprevyearnum"
            show-overflow-tooltip
            sortable
            width="160"
            align="center"
            label="上年结转核定数"/>
          <el-table-column
            prop="planamt"
            show-overflow-tooltip
            sortable
            width="160"
            align="center"
            label="当年征收计划数"/>
          <el-table-column
            prop="actamt"
            show-overflow-tooltip
            sortable
            width="160"
            align="center"
            label="当年征收核定数"/>
          <el-table-column
            prop="sum1"
            show-overflow-tooltip
            sortable
            width="160"
            align="center"
            label="当年小计计划数">
            <template slot-scope="scope">
              {{ scope.row.prevyearnum + scope.row.planamt }}
            </template>
          </el-table-column>
          <el-table-column
            prop="sum2"
            show-overflow-tooltip
            sortable
            width="160"
            align="center"
            label="当年小计核定数">
            <template slot-scope="scope">
              {{ scope.row.ratifyprevyearnum + scope.row.actamt }}
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
    </div>
    <!-- 申请单位 -->
    <layer ref="layer" :tb-head="tbHead" :form="formBasagency" :table-data="BasagencyList" title="选择所属项目" @select="getSelect"/>
    <!-- 添加对话框 -->
    <add ref="layer1"/>

  </div>
</template>

<script>
import toolBar from '@/components/toolBar'
import dwzsjhgl from '@/api/czzsgl/dwzsjhgl/dwzsjhgl.js'
import layer from '@/components/layer'
import Bus from '@/utils/Bus'
import add from './add'
export default {
  components: {
    layer,
    toolBar, // 上方工具条栏
    add
  },
  data() {
    return {
      // 申请单位名称
      namen: '',
      // 表一选择行标数据
      currentRow: {
        typename:""
      },
      // 工具条按钮组
      clientButnsArray: ['close', 'czclear', 'czbillAdd', 'czbillUpdate', 'czbillDelete', 'czbillRefresh',
        'czbillSendAudit', 'tablePrintPreview', 'print', 'export', 'tablePrintSet'],
      form: {
        totalCount: 0,
        pageSize: 10,
        pageIndex: 1,
        agencyid: '',
        year: '',
        state: 1
      },
      tableData: [],
      // 提取的表头数据
      tablehd: [
        {
          width: '120',
          prop: 'agencycode',
          label: '执收单位编码'
        },
        {
          width: '200',
          prop: 'agencyname',
          label: '执收单位名称'
        },
        {
          width: '100',
          prop: 'year',
          label: '计划年度'
        },
        {
          width: '100',
          prop: 'typename',
          label: '填报口径'
        },
        {
          width: '100',
          prop: 'currency',
          label: '金额单位'
        },
        {
          width: '100',
          prop: 'applicant',
          label: '申请人'
        },
        {
          width: '120',
          prop: 'applydate',
          label: '申请日期'
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
          width: '120',
          prop: 'reportdate',
          label: '送审日期'
        },
        {
          width: '100',
          prop: 'auditmark',
          label: '审核标志'
        },
        {
          width: '100',
          prop: 'reviewer',
          label: '审核人'
        },
        {
          width: '120',
          prop: 'auditdate',
          label: '审核日期'
        }
      ],
      BasagencyList: [],
      tbHead: [
        {
          prop: 'agencycode',
          label: '执收单位编码',
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
            key: 'agencyname',
            width: '200px'
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
      }
    }
  },
  watch: {
    // namen,agencyid
    namen(n) {
      if (!n) {
        this.form.agencyid = ''
      }
    }
  },
  created() {
    // 获取当前表格数据
    this.pageIndex = 1
    this.onSubmit()
    // 申请单位
    dwzsjhgl.find().then(res => {
      this.BasagencyList = res.data
    })
    // 清除
    Bus.$off('clear')
    Bus.$on('clear', () => {
      this.clear()
    })
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
  },
  methods: {
    // 删除
    billDelete() {
      this.$confirm('您确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除
        dwzsjhgl.planRemove(this.currentRow.guid).then(res => {
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
    // 修改
    billUpdate() {
      // get数据
      dwzsjhgl.get(this.currentRow.guid).then(res => {
        console.log(res)
        console.log(JSON.stringify(res.data))
        this.$refs.layer1.dialogTableVisible = true
        // 设置数据
        this.$refs.layer1.currentRow = res.data
        // 设置编辑状态
        this.$refs.layer1.state = true
        this.$refs.layer1.state1 = true
      })
    },
    add() {
      // 显示add组件
      this.$refs.layer1.dialogTableVisible = true
      // 清空设置数据
      for (const key in this.$refs.layer1.currentRow) {
        this.$refs.layer1.currentRow[key] = ''
      }
      var time = new Date()
      this.$refs.layer1.currentRow.applydate = `${time.getFullYear()}-${(time.getMonth() + 1) > 9 ? (time.getMonth() + 1) : ('0' + (time.getMonth() + 1))}-${time.getDate()} 00:00:00`,
      // 设置编辑状态
      this.$refs.layer1.state = true
      this.$refs.layer1.state1 = false
    },
    clear() {
      this.namen = ''
      this.form.year = ''
      this.form.pageSize = 10
      this.form.pageIndex = 1
      this.form.agencyid = ''
    },
    getSelect(val) {
      console.log(val)
      this.namen = val.currentRow.agencyname
      this.form.agencyid = val.currentRow.guid
    },
    // 双击表格行
    dbRow(row) {
      console.log('row', row)
      dwzsjhgl.get(row.guid).then(res => {
        console.log(res)
        console.log(JSON.stringify(res.data))
        // 显示add组件
        this.$refs.layer1.dialogTableVisible = true
        this.$refs.layer1.currentRow = res.data
        // 编辑状态
        this.$refs.layer1.state = false
        // this.$refs.layer1.state1 = true
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
    // 送审
    billSendAudit() {
      this.$confirm('您确定要送审吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        dwzsjhgl.sendAudited(this.currentRow.guid).then(res => {
          // 在add组件内时
          dwzsjhgl.get(this.currentRow.guid).then(res => {
            console.log(res)
            console.log(JSON.stringify(res.data))
            this.$refs.layer1.currentRow = res.data
            // 编辑状态
            this.$refs.layer1.state = false
            this.$refs.layer1.state1 = false
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
    },
    // 查找
    onSubmit() {
      // planList数据
      dwzsjhgl.planList(this.form).then(res => {
        this.tableData = res.data.data
        // 设置总条数
        this.form.totalCount = res.data.pageInfo.totalCount
        // 设置表中数据
        this.$refs.singleTable.setCurrentRow(this.tableData[0])
        console.log(JSON.stringify(res.data.data))
      })
    },
    show() {
      this.$refs.layer.dialogTableVisible = true
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
    height: 100px;
  }
  .wrap-box{
    flex: 1;
    padding: 5px;
    height: 200px;
}
}
</style>