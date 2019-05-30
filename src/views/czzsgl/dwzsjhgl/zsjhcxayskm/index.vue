<template>
  <div class="zsjhcx">
    <toolBar :client-butns-array="clientButnsArray" />
    <h1>非税收入征收目标查询（科目）</h1>
    <!-- 上表 -->
    <el-form ref="form" :model="form" size="mini" label-width="80px">
      <el-row>
        <el-col :span="2">
          <el-form-item label-width="20px" label="">
            <el-checkbox-group v-model="form.isdate" @change="isdateChange">
              <el-checkbox label="申请日期" name="type"/>
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
        <el-col :span="5">
          <el-form-item label="计划年度" label-width="">
            <el-select v-model="form.year" placeholder="">
              <el-option
                v-for="item in yearlist"
                :key="item"
                :label="item"
                :value="item"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="9">
          <el-form-item label="执收单位">
            <el-input
              v-model="namen"
              clearable
              placeholder="请输入执收单位" >
              <el-button slot="append" icon="el-icon-caret-bottom" @click="showzsdw()"/>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="金额单位" label-width="">
            <el-select v-model="form.type" disabled placeholder="元"/>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 分页 -->
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
    <div class="warp-box warp">
      <el-scrollbar style="height:100%;width:100%;">
        <el-table
          ref="singleTable"
          :data="tableData"
          border
          style="width: 100%"
          highlight-current-row>
          <el-table-column
            type="index"/>
          <el-table-column
            v-for="value in tablehd"
            :key="value.label"
            :label="value.label"
            :prop="value.prop"
            :width="value.width || 110"
            show-overflow-tooltip
            sortable
          />
        </el-table>
      </el-scrollbar>
    </div>
    <!-- 执收单位 -->
    <layer ref="layer" :tb-head="tbHead" :form="formzsdw" :table-data="ticket" title="请选择执收（罚）单位" @select="getSelect"/>
  </div>
</template>
<script>
import toolBar from '@/components/toolBar'
import layer from '@/components/layer'
import Bus from '@/utils/Bus'
import dwzsjhgl from '@/api/czzsgl/dwzsjhgl/dwzsjhgl.js'
export default {
  components: {
    toolBar,
    layer
  },
  data() {
    return {
      // 提取的表头数据
      tablehd: [
        {
          width: '140',
          prop: 'incomesortcode',
          label: '单位编码'
        },
        {
          width: '170',
          prop: 'incomesortname',
          label: '单位名称'
        },
        {
          width: '120',
          prop: 'tatol',
          label: '全年小计'
        },
        {
          width: '120',
          prop: 'planamt',
          label: '当年征收'
        },
        {
          width: '120',
          prop: 'prevyearnum',
          label: '上年结转'
        }
      ],
      // 执收单位
      tbHead: [
        {
          width: '140',
          prop: 'incomesortcode',
          label: '收入科目编码'
        },
        {
          width: '200',
          prop: 'incomesortname',
          label: '收入科目名称'
        }
      ],
      formzsdw: {
        coding: '',
        // 下拉框选项
        // codingoption: ['票据编码', '票据名称', '拼音简码', '单价', '计价方式', '每本份数'],
        codingoption: [
          {
            val: '收入科目编码',
            key: 'incomesortcode'
          },
          {
            val: '收入科目名称',
            key: 'incomesortname'
          }
        ],
        equal: ''
      },
      ticket: [],
      // 这里填写那些服务器没有返回，但是却在按钮组中存在的按钮。
      clientButnsArray: ['close', 'clear', 'refresh1', 'print', 'preview', 'set', 'export'],
      // 表单
      form: {
        year: '',
        name: '',
        enddate: '',
        pageIndex: 1,
        pageSize: 10,
        startdate: ''
      },
      // 年度
      yearlist: [],
      // 表格
      tableData: [],
      totalCount: 0,
      isdate: false,
      namen: ''
    }
  },
  watch: {
    // 执收单位变化
    namen(n) {
      if (!n) {
        this.form.name = ''
      }
    }
  },
  created() {
    dwzsjhgl.list('').then(res => {
      console.log('year', res.data)
      this.yearlist = res.data.map(item => {
        return item.year
      })
    })
    // 清除
    Bus.$off('clear')
    Bus.$on('clear', () => {
      this.clear()
    })
    // 刷新
    Bus.$off('refresh1')
    Bus.$on('refresh1', () => {
      this.form.pageIndex = 1
      this.onSubmit()
    })
    dwzsjhgl.basBudgetsubject().then(res => {
      // console.log(res)
      this.ticket = res.data
    })
    // 获取当前表格数据
    // this.getBillInfoList(this.form)
  },
  methods: {
    // 执收单位层
    showzsdw() {
      this.$refs.layer.dialogTableVisible = true
    },
    // 执收选择监听
    getSelect(val) {
      console.log('执收', val)
      // name namen
      this.form.name = val.currentRow.incomesortcode
      this.namen = val.currentRow.incomesortname
    },
    // 日期框是否开启-设置起始和终止时间
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
    clear() {
      this.namen = ''
      this.form.name = ''
    },
    onSubmit() {
      dwzsjhgl.findColPlanProgramSubjectAndCurrency(this.form).then(res => {
        this.tableData = res.data.data
        this.totalCount = res.data.pageInfo.totalCount
        console.log(res)
      })
    },
    // 当前表格 页条数改变
    handleSizeChange(val) {
      this.form.pageSize = val
      this.onSubmit()
    },
    // 当前表格 页码改变 翻页
    handleCurrentChange(val) {
      this.form.pageIndex = val
      this.onSubmit()
    }
  }
}
</script>

<style lang="scss" scoped>
.zsjhcx{
  display: flex;
  flex-direction: column;
  height: 100%;
}
  h1{
    height: 40px;
    line-height: 40px;
    text-decoration: underline;
    font-size: 20px;
    text-align: center;
    font-weight: 700;
    // margin-bottom: 20px;
  }
  .warp-box{
    flex: 1;
    padding: 5px;
    height: 200px;
}
</style>

