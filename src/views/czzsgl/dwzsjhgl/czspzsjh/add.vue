<template>
  <div class="czspzsjh">
    <el-dialog :visible.sync="dialogTableVisible" :close-on-click-modal="false" :before-close="returnDefault" title="单位征收计划录入" width="90%">
      <toolBar :isedit="state" :get-current-row="Object.assign({audited:currentRow.auditmark},currentRow)" :client-butns-array="clientButnsArray" />
      <!-- 筛选表单 -->
      <!-- <h1 class="title">非税收入减免录入</h1> -->
      <!-- {{ state }}
      {{ state1 }}
      {{ typeof(currentRow.carrydownrequired) }}
      {{ currentRow.imposerequired }} -->
      <el-form ref="form" style="margin-top:5px;" size="mini" label-width="80px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="申请日期">
              <el-date-picker
                v-model="currentRow.applydate"
                disabled
                value-format="yyyy-MM-dd hh:mm:ss"
                type="date"
                placeholder="选择日期"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单据编码">
              <el-input v-model="currentRow.receipno" disabled clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="申请人">
              <el-input v-model="currentRow.applicant" :disabled="!state || state1" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="申请单位" label-width="">
              <el-input
                :disabled="!state || state1"
                v-model="currentRow.agencyname"
                clearable
                placeholder="" >
                <el-button slot="append" :disabled="!state || state1" icon="el-icon-caret-bottom" @click="show()"/>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="计划年度">
              <el-select :disabled="!state || state1" v-model="currentRow.year" placeholder="请选计划年度" @change="selectchange">
                <el-option
                  v-for="item in yearlist"
                  :key="item.year"
                  :label="item.year"
                  :value="item.year"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="金额单位">
              <el-input v-model="currentRow.currency" disabled clearable/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 显示表格 -->
      <div class="wrap-add">
        <el-scrollbar style="height:100%;width:100%;">
          <el-table
            :data="currentRow.details ? currentRow.details:[]"
            :row-class-name="tableRowClassName"
            highlight-current-row
            border
            style="width: 100%">
            <el-table-column
              type="index"/>
            <el-table-column
              v-for="(item) in detailHead"
              :key="item.prop"
              :width="item.width"
              :prop="item.prop"
              :label="(item.prop === 'procode' && `${currentRow.typename}编码`) || (item.prop === 'proname' && `${currentRow.typename}名称`) ||item.label"
              sortable
              header-align="center"
              align="center"
              show-overflow-tooltip>
              <template slot-scope="scope">
                <p v-if="item.prop === 'sum1'"> {{ +scope.row.prevyearnum + +scope.row.planamt }}</p>
                <p v-else-if="item.prop === 'sum2'">{{ +scope.row.ratifyprevyearnum + +scope.row.actamt }}</p>

                <p v-else-if="scope.row.isleaf === '0'">{{ scope.row[item.prop] }}</p>

                <el-input v-else-if="state && (currentRow.carrydownrequired === '1' || currentRow.carrydownrequired === 'true') && item.prop === 'ratifyprevyearnum' && currentRow.reported === '1'" v-model="scope.row.ratifyprevyearnum" size="mini"/>
                <el-input v-else-if="state && (currentRow.imposerequired === '1' || currentRow.imposerequired === 'true') && item.prop === 'actamt' && currentRow.reported === '1'" v-model="scope.row.actamt" size="mini"/>

                <el-input v-else-if="state && (currentRow.carrydownrequired === '1' || currentRow.carrydownrequired === 'true') && item.prop === 'prevyearnum' && currentRow.reported === '0'" v-model="scope.row.prevyearnum" size="mini" @input.native="inputchange(scope)"/>
                <el-input v-else-if="state && (currentRow.imposerequired === '1' || currentRow.imposerequired === 'true') && item.prop === 'planamt' && currentRow.reported === '0'" v-model="scope.row.planamt" size="mini" @input.native="inputchange(scope)"/>

                <p v-else>{{ scope.row[item.prop] }}</p>
              </template>
            </el-table-column>

          </el-table>
        </el-scrollbar>
      </div>
    </el-dialog>
    <layer ref="layer" :tb-head="tbHead" :form="formBasagency" :table-data="BasagencyList" title="选择所属项目" @select="getSelect"/>
  </div>
</template>
<script>
import dwzsjhgl from '@/api/czzsgl/dwzsjhgl/dwzsjhgl.js'
import layer from '@/components/layer'
import Bus from '@/utils/Bus'
import toolBar from '@/components/toolBar'
export default {
  components: {
    toolBar,
    layer
  },
  data() {
    return {
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
      },
      // 年度
      yearlist: [],
      // 提取表头
      detailHead: [
        {
          prop: 'procode',
          label: '收费项目编码',
          width: '120px'
        },
        {
          prop: 'proname',
          label: '收费项目名称',
          width: '160px'
        },
        {
          prop: 'prevyearnum',
          label: '上年结转计划数',
          width: '160px'
        },
        {
          prop: 'ratifyprevyearnum',
          label: '上年结转核定数',
          width: '160px'
        },
        {
          prop: 'planamt',
          label: '当年征收计划数',
          width: '160px'
        },
        {
          prop: 'actamt',
          label: '当年征收核定数',
          width: '160px'
        },
        {
          prop: 'sum1',
          label: '当年小计计划数',
          width: '160px'
        },
        {
          prop: 'sum2',
          label: '当年小计核定数',
          width: '160px'
        }
      ],
      // 编辑状态
      state: true,
      state1: true,
      // 数据
      currentRow: {
        typename: '',
        agencyname: '',
        rfdbilldate: '',
        details: []
      },
      // 工具条
      clientButnsArray: ['czbillClose', 'czbillUpdatef2', 'czbillAddAudit', 'czbillUnaudit', 'czbillSave', 'czbillAbolish', 'tablePrintPreview', 'print', 'export', 'tablePrintSet'],
      // 是否显示
      dialogTableVisible: false
    }
  },
  computed: {
  },
  created() {
    // 年度
    dwzsjhgl.list('').then(res => {
      console.log('year', res.data)
      this.yearlist = res.data
      // this.yearlist = res.data.map(item => {
      //   return item.year
      // })
    })
    // 申请单位
    dwzsjhgl.find().then(res => {
      this.BasagencyList = res.data
    })
    // 关闭
    Bus.$off('billClose')
    Bus.$on('billClose', () => {
      this.dialogTableVisible = false
    })
    // 保存
    Bus.$off('billSave')
    Bus.$on('billSave', () => {
      this.save()
    })
    // 修改
    Bus.$off('billUpdate2')
    Bus.$on('billUpdate2', () => {
      this.billUpdate2()
    })
    // 取消
    Bus.$off('billAbolish')
    Bus.$on('billAbolish', () => {
      this.dialogTableVisible = false
    })
  },
  methods: {
    // 明细
    findChargeProjectOrChargeTypeOrBudgetSubjec() {
      dwzsjhgl.findChargeProjectOrChargeTypeOrBudgetSubjec(this.currentRow.agencyid, this.currentRow.typename).then(res => {
        console.log('r', res)
        this.currentRow.details = []
        res.data.forEach((item, index) => {
          this.currentRow.details[index] = {
            proid: item.guid,
            proname: item.nontaxname || item.chargetypename || item.incomesortname,
            procode: item.nontaxcode || item.chargetypecode || item.incomesortcode,
            parentProid: item.parentguid,
            isleaf: item.isleaf,
            leaf: item.isleaf,
            planamt: 0, // 计划金额
            actamt: 0, // 核定金额
            prevyearnum: 0, // 上年结转
            ratifyprevyearnum: 0, // 核定上年结转
            sum1: 0,
            sum2: 0
          }
        })
      })
    },
    // 申请单位
    getSelect(val) {
      console.log(val)
      this.currentRow.agencyname = val.currentRow.agencyname
      this.currentRow.agencyid = val.currentRow.guid
      if (this.currentRow.agencyid && this.currentRow.typename) {
        this.findChargeProjectOrChargeTypeOrBudgetSubjec()
      }
    },
    show() {
      this.$refs.layer.dialogTableVisible = true
    },
    // 年度
    selectchange(val) {
      var item = this.yearlist.find(item => {
        return item.year === val
      })
      this.currentRow.currency = item.unitname
      this.currentRow.typename = item.typename
      this.currentRow.imposerequired = item.imposerequired
      this.currentRow.carrydownrequired = item.carrydownrequired
      if (this.currentRow.agencyid && this.currentRow.typename) {
        this.findChargeProjectOrChargeTypeOrBudgetSubjec()
      }
    },
    // 顶级节点样式
    tableRowClassName(val) {
      return val.row.isleaf === '0' ? 'bg' : ''
    },
    // 遍历
    traverse(pre, num1, num2) {
      if (pre.parentProid === '-1') {
        return
      }
      this.currentRow.details.forEach((item, index) => {
        if (item.proid === pre.parentProid) {
          if (item.isleaf === '0') {
            item.prevyearnum = +item.prevyearnum + num1
            item.ratifyprevyearnum = +item.ratifyprevyearnum + num1
            item.planamt = +item.planamt + num2
            item.actamt = +item.actamt + num2
          }
          this.traverse(item, num1, num2)
        }
      })
    },
    // 输入
    inputchange(scope) {
      // console.log(scope.row.parentProid)
      var num1 = +scope.row.prevyearnum - +scope.row.ratifyprevyearnum
      var num2 = +scope.row.planamt - +scope.row.actamt
      scope.row.ratifyprevyearnum = scope.row.prevyearnum
      scope.row.actamt = scope.row.planamt
      if (scope.row.parentProid) {
        this.traverse(scope.row, num1, num2)
      }
    },
    // 修改
    billUpdate2() {
      dwzsjhgl.get(this.currentRow.guid).then(res => {
        console.log(res)
        console.log(JSON.stringify(res.data))
        this.currentRow = res.data
        this.state = true
        this.state1 = true
      })
    },
    // 保存
    save() {
      if (!this.currentRow.applydate) {
        this.$message.error('申请日期为空')
        return
      }
      if (!this.currentRow.applicant) {
        this.$message.error('申请人为空')
        return
      }
      if (!this.currentRow.details) {
        this.$message.error('明细为空')
        return
      }
      dwzsjhgl.planSave(JSON.stringify(this.currentRow)).then(res => {
        console.log('保存成功', res)
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        // 重新获取
        dwzsjhgl.get(res.data.guid).then(res => {
          if (this.state1 === false) {
            Bus.$emit('onSubmit')
          }
          this.currentRow = res.data
          this.state = false
          this.state1 = false
        })
      })
    },
    returnDefault(done) {
      // 关闭刷新主表数据。
      Bus.$emit('onSubmit')
      done()
    }
  }
}
</script>
<style lang="scss" scoped>
.czspzsjh{
  .el-table .bg {
    background: rgb(144, 147, 153);
  }
.title {
  text-align: center;
  font-size: 28px;
  padding-top: 10px;
  padding-bottom: 10px;
}
.wrap-add {
  height: 350px;
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
}
</style>

