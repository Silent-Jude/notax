<template>
  <el-dialog :modal="modal" :visible.sync="dialogTableVisible" :title="title" class="layer" width="90%" @close="close" @open="open">
    <!-- 筛选表单 -->
    <el-form ref="form" :model="form" size="mini" label-width="80px">
      <el-row>
        <el-col :span="3">
          <el-form-item label-width="10px" label="">
            <el-checkbox-group v-model="filter">
              <el-checkbox label="筛选" name="filter" @change="isfilterChange"/>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="" label-width="0px">
            <el-select :disabled="!filter" v-model="form.coding" placeholder="">
              <el-option v-for="item in form.codingoption" :key="item.val" :label="item.val" :value="item.key"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="等于" label-width="50px">
            <el-input :disabled="!filter" v-model="form.equal" clearable @input="search"/>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="" label-width="20px">
            <el-button :disabled="!filter" type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 显示表格 -->
    <div class="wrap">
      <el-scrollbar style="height:100%;width:100%;">
        <el-table
          ref="layerTable"
          :data="tableDatafl"
          highlight-current-row
          border
          style="width: 100%"
          @row-click="showDetail"
          @row-dblclick="confirm"
          @current-change="handleCurrentChange">
          <el-table-column
            show-overflow-tooltip
            sortable
            type="index"/>
          <el-table-column
            v-for="value in tbHead"
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
    <!-- 底部按钮 -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import Bus from '@/utils/Bus'

export default {
  props: {
    modal: {
      type: Boolean,
      default() {
        return true
      }
    },
    // 标题
    title: {
      type: String,
      default: '标题'
    },
    // 表单数据
    form: {
      type: Object,
      default: null
    },
    // 表头数据
    tbHead: {
      type: Array,
      default: null
    },
    // 表格数据
    tableData: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      // 是否筛选
      filter: false,
      // 当前表格选择项
      currentRow: null,
      // 组件是否显示
      dialogTableVisible: false,
      // 过滤后表格数据
      tableDatafl: this.tableData
    }
  },
  created() {
    Bus.$off('setSelectedRow')
    Bus.$on('setSelectedRow', () => {
      this.setCurrent()
    })
  },
  mounted() {
  },
  methods: {
    showDetail(row) {
      console.log('当前行信息为：', row)
    },
    // 设置首行高亮暂时未实现。
    setCurrent() {
      // this.$refs.layerTable.setCurrentRow(this.tableDatafl[0])
    },
    // 过滤搜索
    search() {
      // 是否输入完整
      if (this.form.coding && this.form.equal) {
        this.tableDatafl = this.tableData.filter(item => {
          // return (item[this.form.coding] + '') === this.form.equal
          // console.log(item)
          return (item[this.form.coding] + '').indexOf(this.form.equal.trim()) >= 0
        })
      } else {
        this.tableDatafl = this.tableData
      }
    },
    // 表格行选择设置
    handleCurrentChange(val) {
      this.currentRow = val
    },
    // 确定对话框
    confirm() {
      if (!this.currentRow) {
        this.$message.error('请您先选择')
        return
      }
      // 取出选择项。。。。带上title标识
      var { ...data } = { title: this.title, currentRow: this.currentRow }
      this.$emit('select', data)
      // console.log('选择的数据为：', data)
      this.dialogTableVisible = false
    },
    // 取消对话框
    cancel() {
      this.$emit('cancelUpdate', true)
      this.dialogTableVisible = false
    },
    // 筛选框改变
    isfilterChange(val) {
      if (val) {
        // 选择默认第一项
        this.form.coding = this.form.codingoption[0].key
      } else {
        this.form.coding = ''
      }
    },
    // 对话框打开 渲染表格数据
    open() {
      this.search()
    },
    // 对话框关闭 清除表单项
    close() {
      this.$emit('cancelUpdate', true)
      this.filter = false
      this.form.coding = ''
      this.form.equal = ''
    }
  }
}
</script>

<style lang="scss">
.wrap{
  // height: 300px;
  .el-table{
    overflow:initial;
    }
    .el-table__body-wrapper{
      overflow: initial!important;
    }
    .el-scrollbar__view{
      width: fit-content;
    }
}
// .layer{
//   .wrap{
//     height: 300px;
//   }
// }

</style>

