<template>
  <div class="dwzsjhpz">
    <toolBar :client-butns-array="clientButnsArray" />
    <h1>单位执收计划配置</h1>
    <el-form ref="form" :inline="true" size="mini" label-width="80px">
      <el-form-item label="年份">
        <el-date-picker
          v-model="year"
          type="year"
          value-format="yyyy"
          placeholder="请选择年份"/>
      </el-form-item>
    </el-form>
    <div class="warp-box warp">
      <el-scrollbar style="height:100%;width:100%;">
        <el-table
          ref="singleTable"
          :data="tableData"
          border
          style="width: 100%"
          highlight-current-row
          @current-change="handleCurrentChangeIndex">
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
              <span v-if="item.prop === 'imposerequired'">
                {{ scope.row[item.prop] | equiredFilter }}
              </span>
              <span v-else-if="item.prop === 'carrydownrequired'">
                {{ scope.row[item.prop] | equiredFilter }}
              </span>
              <span v-else>
                {{ scope.row[item.prop] }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
    </div>
    <el-form ref="form1" :model="form" :disabled="isdisabled" class="form1" size="mini" label-width="80px">
      <el-row>
        <el-col :span="5">
          <el-form-item label="年度">
            <el-date-picker
              :disabled="isyear"
              v-model="form.year"
              type="year"
              value-format="yyyy"
              placeholder="请选择年度"/>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item label-width="20px" label="">
            <el-checkbox-group v-model="form.carrydownrequired">
              <el-checkbox label="上年转结项是否可填" name="type"/>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          <el-form-item label="金额单位" label-width="">
            <el-select v-model="form.unit" placeholder="">
              <el-option label="亿元" value="D115_07"/>
              <el-option label="千万元" value="D115_06"/>
              <el-option label="百万元" value="D115_05"/>
              <el-option label="十万元" value="D115_04"/>
              <el-option label="万元" value="D115_03"/>
              <el-option label="千元" value="D115_02"/>
              <el-option label="元" value="D115_01"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item label-width="20px" label="">
            <el-checkbox-group v-model="form.imposerequired">
              <el-checkbox label="当年征收项是否可填" name="type"/>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          <el-form-item label="类型" label-width="">
            <el-select v-model="form.type" placeholder="">
              <el-option label="预算科目" value="D114_03"/>
              <el-option label="收费类别" value="D114_02"/>
              <el-option label="收费项目" value="D114_01"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label-width="">
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import toolBar from '@/components/toolBar'
import Bus from '@/utils/Bus'
import dwzsjhgl from '@/api/czzsgl/dwzsjhgl/dwzsjhgl.js'
export default {
  components: {
    toolBar
  },
  data() {
    return {
      // 这里填写那些服务器没有返回，但是却在按钮组中存在的按钮。
      clientButnsArray: ['close', 'billAdd', 'billAddUpdate', 'billDelete', 'billRefresh', 'print', 'preview', 'set', 'export'],
      // 刷新年
      year: '',
      // 保存下面表单
      form: {},
      tableData: [],
      // 提取的表头数据
      tablehd: [
        {
          width: '80',
          prop: 'year',
          label: '年份'
        },
        {
          width: '100',
          prop: 'unitname',
          label: '金额单位'
        },
        {
          width: '120',
          prop: 'typename',
          label: '计划类型'
        },
        {
          width: '180',
          prop: 'carrydownrequired',
          label: '上年转结项是否可填'
        },
        {
          width: '180',
          prop: 'imposerequired',
          label: '当年征收项是否可填'
        }
      ],
      // 下表是否能编辑
      isdisabled: true,
      // 年度是否能编辑
      isyear: true,
      // 选中行数据
      current: {}
    }
  },
  computed: {
  },
  created() {
    this.billRefresh()
    Bus.$off('add')
    Bus.$on('add', () => {
      this.add()
    })
    Bus.$off('billAddUpdate')
    Bus.$on('billAddUpdate', () => {
      this.billAddUpdate()
    })
    Bus.$off('billDelete')
    Bus.$on('billDelete', () => {
      this.billDelete()
    })
    Bus.$off('onSubmit')
    Bus.$on('onSubmit', () => {
      this.billRefresh()
    })
  },
  mounted() {
  },
  methods: {
    // 添加
    add() {
      this.form = {}
      this.isdisabled = false
      this.isyear = false
    },
    // 修改
    billAddUpdate() {
      if (this.current === null) {
        return
      }
      this.form = JSON.parse(JSON.stringify(this.current))
      this.form.carrydownrequired = this.form.carrydownrequired === 'true'
      this.form.imposerequired = this.form.imposerequired === 'true'
      this.isdisabled = false
      this.isyear = true
    },
    // 删除
    billDelete() {
      if (!this.form.guid) {
        return
      }
      this.$confirm('确认要删除该配置信息吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        dwzsjhgl.remove(this.form.guid).then(res => {
          console.log(res)
          this.billRefresh()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {
      })
    },
    // 刷新
    billRefresh() {
      dwzsjhgl.list(this.year).then(res => {
        this.tableData = res.data
        if (res.data.length > 0) {
          this.current = this.tableData[0]
          this.form = JSON.parse(JSON.stringify(this.tableData[0]))
          this.form.carrydownrequired = this.form.carrydownrequired === 'true'
          this.form.imposerequired = this.form.imposerequired === 'true'
          this.$refs.singleTable.setCurrentRow(this.tableData[0])
        } else {
          this.current = null
          this.form = {}
        }
        this.isdisabled = true
        this.isyear = true
      })
    },
    // 选中当前行
    handleCurrentChangeIndex(val) {
      if (val === null) {
        this.isdisabled = true
        this.isyear = true
        this.current = null
        this.form = {}
        return
      }
      this.isdisabled = true
      this.isyear = true
      console.log('xz', val)
      this.current = val
      this.form = JSON.parse(JSON.stringify(val))
      this.form.carrydownrequired = this.form.carrydownrequired === 'true'
      this.form.imposerequired = this.form.imposerequired === 'true'
    },
    // 保存
    save() {
      if (!this.form.year || !this.form.type || !this.form.unit) {
        this.$message.error('填写内容不完整')
        return
      }
      if (!this.form.guid) {
        var yearitem = this.tableData.find(item => {
          return item.year === this.form.year
        })
        if (yearitem) {
          this.$message.error(`本区划已生成了${this.form.year}年的征收计划配置信息，不可重复生成`)
          return
        }
      }

      dwzsjhgl.save(Object.assign({}, this.form, { carrydownrequired: this.form.carrydownrequired === true ? 1 : 0 },
        { imposerequired: this.form.imposerequired === true ? 1 : 0 }, { admdivcode: this.$store.getters.userInfo.admdivcode })).then(res => {
        console.log(res)
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.isdisabled = true
        this.isyear = true
        this.billRefresh()
      })
    },
    // 取消
    cancel() {
      this.billRefresh()
    }

  }
}
</script>
<style lang="scss" scoped>
.dwzsjhpz{
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
  .warp-box{
    flex: 1;
    padding: 5px;
    height: 200px;
    background: #fff;
}
  .form1{
    padding-top: 5px;
  }
}
</style>

